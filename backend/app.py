from flask import Flask
from flask_cors import CORS
from extensions import db, login_manager
from routes import register_routes
from werkzeug.middleware.proxy_fix import ProxyFix
import os


def create_app():
    app = Flask(__name__)

    # --------------------------
    # Base Configurations
    # --------------------------
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///progress.db'
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'supersecretkey')

    # Determine environment
    is_prod = os.environ.get("FLASK_ENV") == "production"
    frontend_url = os.environ.get("FRONTEND_URL", "https://pragati-9q2l.onrender.com")

    # --------------------------
    # CORS Setup (Allow React frontend)
    # --------------------------
    CORS(
        app,
        supports_credentials=True,
        origins=[frontend_url, "http://localhost:5173"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"]
    )

    # --------------------------
    # Session and Cookie Settings
    # --------------------------
    app.config.update(
        SESSION_COOKIE_SAMESITE="None" if is_prod else "Lax",  # Cross-site cookies allowed in prod
        SESSION_COOKIE_SECURE=is_prod,                         # Only over HTTPS in prod
        SESSION_COOKIE_HTTPONLY=True,
        # ❌ Removed SESSION_COOKIE_DOMAIN (caused invalid domain on Render)
    )

    # ✅ Fix remember_token missing attributes
    app.config.update(
        REMEMBER_COOKIE_SAMESITE="None" if is_prod else "Lax",
        REMEMBER_COOKIE_SECURE=is_prod,
        REMEMBER_COOKIE_HTTPONLY=True,
    )

    # --------------------------
    # Proxy Fix (for Render / HTTPS)
    # --------------------------
    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

    # --------------------------
    # Flask-Login Setup
    # --------------------------
    login_manager.init_app(app)
    login_manager.login_view = "login"

    # --------------------------
    # Database + Routes
    # --------------------------
    db.init_app(app)
    register_routes(app)

    @app.cli.command("create-db")
    def create_db():
        db.create_all()
        print("✅ Database created successfully!")

    return app


if __name__ == "__main__":
    app = create_app()
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=not os.environ.get("FLASK_ENV") == "production")
