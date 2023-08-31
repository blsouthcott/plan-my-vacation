import os
import logging

from flask import Flask
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

logging.basicConfig(level=logging.INFO)

limiter = Limiter(get_remote_address, storage_uri=os.environ["MONGO_CONNECTION_STRING"], strategy="fixed-window")

def create_app():
    app = Flask(__name__)
    allowed_origins = os.getenv("ALLOWED_ORIGINS")
    if allowed_origins:
        CORS(app, origins=allowed_origins)
    app.config["SECRET_KEY"] = os.environ["SECRET_KEY"]
    limiter.init_app(app)
    return app
