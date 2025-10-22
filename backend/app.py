from flask import Flask
from flask_cors import CORS
from extensions import db, login_manager
from routes import register_routes
import os
from werkzeug.middleware.proxy_fix import ProxyFix

def create_app():
    app = Flask(__name__)

    # --------------------------
    # Configurations
    # --------------------------
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///progress.db'
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'supersecretkey')

    # Determine environment
    is_prod = os.environ.get("FLASK_ENV") == "production"
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")

    # --------------------------
    # CORS setup
    # --------------------------
    CORS(
        app,
        supports_credentials=True,
        origins=[
            frontend_url,       # deployed frontend
            "http://localhost:5173"  # local dev
        ]
    )

    # --------------------------
    # Cookie / session setup
    # --------------------------
    app.config.update(
        SESSION_COOKIE_SAMESITE="None" if is_prod else "Lax",  # cross-site in prod
        SESSION_COOKIE_SECURE=is_prod,                         # only secure in prod
        SESSION_COOKIE_HTTPONLY=True,
    )

    # --------------------------
    # Proxy fix (important for Render / other HTTPS proxies)
    # --------------------------
    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

    # --------------------------
    # Flask-Login setup
    # --------------------------
    login_manager.init_app(app)
    login_manager.login_view = "login"

    # --------------------------
    # Database setup
    # --------------------------
    db.init_app(app)
    register_routes(app)

    @app.cli.command("create-db")
    def create_db():
        db.create_all()
        print("Database created successfully!")

    return app


if __name__ == "__main__":
    app = create_app()
    port = int(os.environ.get("PORT", 5000))
    # Debug True is fine for dev
    app.run(host="0.0.0.0", port=port, debug=not os.environ.get("FLASK_ENV") == "production")
