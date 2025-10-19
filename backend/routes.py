# backend/routes.py
from flask import Flask, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from models import User, Log
from extensions import db, login_manager

def register_routes(app):
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    @app.route('/')
    def home():
        return "📘 Progress Tracker API is running!"

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

    @app.route('/logs', methods=['GET'])
    @login_required
    def get_logs():
        logs = Log.query.filter_by(user_id=current_user.id).all()
        return jsonify([{'id': l.id, 'filename': l.filename, 'content': l.content} for l in logs])

    @app.route('/delete/<int:id>', methods=['DELETE'])
    @login_required
    def delete_log(id):
        log = Log.query.filter_by(id=id, user_id=current_user.id).first()
        if not log:
            return jsonify({'error': 'Not found or not your log'}), 404
        db.session.delete(log)
        db.session.commit()
        return jsonify({'message': 'Log deleted successfully'})

    @app.route('/logout', methods=['POST'])
    @login_required
    def logout():
        logout_user()
        return jsonify({'message': 'Logged out successfully'})
