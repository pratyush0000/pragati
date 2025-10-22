from flask import Flask
from flask_cors import CORS
from extensions import db, login_manager
from routes import register_routes
from werkzeug.middleware.proxy_fix import ProxyFix
import os

def create_app():
    app = Flask(__name__)

    # --------------------------
    # Configurations
    # --------------------------
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///progress.db'
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'supersecretkey')

    # Environment
    is_prod = os.environ.get("FLASK_ENV") == "production"

    # Frontend URL (your actual deployed site)
    frontend_url = os.environ.get("FRONTEND_URL", "https://pragati-9q2l.onrender.com")

    # --------------------------
    # CORS setup — allow React to send cookies
    # --------------------------
    CORS(
        app,
        supports_credentials=True,
        origins=[frontend_url, "http://localhost:5173"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"]
    )

    # --------------------------
    # Cookie & Session Settings
    # --------------------------
    app.config.update(
        SESSION_COOKIE_SAMESITE="None" if is_prod else "Lax",   # allow cross-site cookies in prod
        SESSION_COOKIE_SECURE=True,                             # only over HTTPS
        SESSION_COOKIE_HTTPONLY=True,
        # 👇 Important: domain of backend, NOT frontend
        SESSION_COOKIE_DOMAIN=".onrender.com",                   # both share the same base domain
    )

    # --------------------------
    # Proxy fix (needed for Render)
    # --------------------------
    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

    # --------------------------
    # Flask-Login setup
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
