from flask import Flask
from flask_cors import CORS
from extensions import db, login_manager
from routes import register_routes

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///progress.db'
    app.config['SECRET_KEY'] = 'supersecretkey'

    # ✅ Allow React frontend to communicate with Flask using cookies
    CORS(
        app,
        supports_credentials=True,
        origins=["http://localhost:5173"]
    )

    # ✅ Important cookie + session config
    app.config.update(
        SESSION_COOKIE_SAMESITE="None",   # allow cookies across localhost:5173 <-> localhost:5000
        SESSION_COOKIE_SECURE=False,      # True only if using HTTPS
        SESSION_COOKIE_HTTPONLY=True,     # prevent JS access
    )

    # ✅ Flask-Login setup
    login_manager.init_app(app)
    login_manager.login_view = "login"

    # ✅ Database setup
    db.init_app(app)
    register_routes(app)

    @app.cli.command("create-db")
    def create_db():
        db.create_all()
        print("Database created successfully!")

    return app


if __name__ == "__main__":
    app = create_app()
    # run with localhost not 127.0.0.1 (they count as different origins)
    app.run(host="localhost", port=5000, debug=True)
