import os

from flask import Flask
from flask_cors import CORS
from flask_limiter import Limiter

from .limiter import get_forwarded_for


limiter = Limiter(get_forwarded_for, storage_uri=os.environ["MONGO_CONNECTION_STRING"], strategy="fixed-window")

def create_app():
    app = Flask(__name__, static_folder=os.path.abspath(os.path.join(__file__, "../../../ui/build")))
    allowed_origins = os.getenv("ALLOWED_ORIGINS")
    if allowed_origins:
        CORS(app, origins=allowed_origins)
    app.config["SECRET_KEY"] = os.environ["SECRET_KEY"]
    limiter.init_app(app)
    return app
