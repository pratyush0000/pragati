from flask import Flask, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from models import User, Log
from extensions import db, login_manager

def register_routes(app):
    # --------------------------
    # User loader for Flask-Login
    # --------------------------
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # --------------------------
    # Unauthorized handler (for API)
    # --------------------------
    @login_manager.unauthorized_handler
    def unauthorized_callback():
        return jsonify({'error': 'Unauthorized', 'logged_in': False}), 401

    # --------------------------
    # Home route
    # --------------------------
    @app.route('/')
    def home():
        return "📘 Progress Tracker API is running!"

    # --------------------------
    # Register new user
    # --------------------------
    @app.route('/register', methods=['POST'])
    def register():
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({'error': 'Missing username or password'}), 400

        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already exists'}), 400

        hashed_pw = generate_password_hash(password)
        user = User(username=username, password_hash=hashed_pw)
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully'}), 201

    # --------------------------
    # Login user
    # --------------------------
    @app.route('/login', methods=['POST'])
    def login():
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        user = User.query.filter_by(username=username).first()

        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({'error': 'Invalid credentials'}), 401

        login_user(user, remember=True)
        return jsonify({'message': f'Welcome {user.username}!'}), 200

    # --------------------------
    # Logout user
    # --------------------------
    @app.route('/logout', methods=['POST'])
    @login_required
    def logout():
        logout_user()
        return jsonify({'message': 'Logged out successfully'})

    # --------------------------
    # Add a log/note
    # --------------------------
    @app.route('/add', methods=['POST'])
    @login_required
    def add_log():
        data = request.get_json()
        filename = data.get('filename')
        content = data.get('content')
        if not filename or not content:
            return jsonify({'error': 'Missing content or filename'}), 400
        log = Log(filename=filename, content=content, user_id=current_user.id)
        db.session.add(log)
        db.session.commit()
        return jsonify({'message': 'Log added successfully'}), 201

    # --------------------------
    # Get all logs for current user
    # --------------------------
    @app.route('/logs', methods=['GET'])
    @login_required
    def get_logs():
        logs = Log.query.filter_by(user_id=current_user.id).all()
        # newest first
        logs_sorted = sorted(logs, key=lambda l: l.id, reverse=True)
        return jsonify([
            {'id': l.id, 'filename': l.filename, 'content': l.content}
            for l in logs_sorted
        ])

    # --------------------------
    # Get a single log by ID
    # --------------------------
    @app.route('/logs/<int:id>', methods=['GET'])
    @login_required
    def get_single_log(id):
        log = Log.query.filter_by(id=id, user_id=current_user.id).first()
        if not log:
            return jsonify({'error': 'Note not found'}), 404
        return jsonify({'id': log.id, 'filename': log.filename, 'content': log.content})

    # --------------------------
    # Update a log by ID
    # --------------------------
    @app.route('/logs/<int:id>', methods=['PUT'])
    @login_required
    def update_log(id):
        log = Log.query.filter_by(id=id, user_id=current_user.id).first()
        if not log:
            return jsonify({'error': 'Note not found'}), 404

        data = request.get_json()
        filename = data.get('filename')
        content = data.get('content')

        if filename:
            log.filename = filename
        if content:
            log.content = content

        db.session.commit()

        return jsonify({
            'message': 'Note updated successfully',
            'id': log.id,
            'filename': log.filename,
            'content': log.content
        })

    # --------------------------
    # Delete a log
    # --------------------------
    @app.route('/delete/<int:id>', methods=['DELETE'])
    @login_required
    def delete_log(id):
        log = Log.query.filter_by(id=id, user_id=current_user.id).first()
        if not log:
            return jsonify({'error': 'Not found or not your log'}), 404
        db.session.delete(log)
        db.session.commit()
        return jsonify({'message': 'Log deleted successfully'})

    # --------------------------
    # Check login status
    # --------------------------
    @app.route('/check', methods=['GET'])
    def check_status():
        if current_user.is_authenticated:
            return jsonify({'logged_in': True, 'username': current_user.username})
        return jsonify({'logged_in': False})
