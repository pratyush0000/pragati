from flask import Flask
from flask_cors import CORS
from extensions import db, login_manager
from routes import register_routes
import os

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///progress.db'
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'supersecretkey')

    # ✅ Allow React frontend + production domain to access
    CORS(
        app,
        supports_credentials=True,
        origins=[
            "http://localhost:5173",          # local dev
            "https://your-frontend-name.onrender.com"  # Render frontend URL
        ]
    )

    # ✅ Cookie/session setup
    app.config.update(
        SESSION_COOKIE_SAMESITE="None",
        SESSION_COOKIE_SECURE=True,   # ⚠️ Set True since Render uses HTTPS
        SESSION_COOKIE_HTTPONLY=True,
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
    # ⚠️ Render assigns a dynamic port (available as env var PORT)
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
