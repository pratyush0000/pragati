# backend/app.py
from flask import Flask
from extensions import db, login_manager, cors
from routes import register_routes

def create_app():
    app = Flask(__name__)
    cors.init_app(app, supports_credentials=True)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///progress.db'
    app.config['SECRET_KEY'] = 'supersecretkey'

    db.init_app(app)
    login_manager.init_app(app)

    register_routes(app)

    @app.cli.command("create-db")
    def create_db():
        db.create_all()
        print("Database created successfully!")

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
