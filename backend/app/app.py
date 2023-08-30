import os
import logging

from flask import Flask
from flask_cors import CORS
from flask_restful import Api

from .api import Recommendations, Itinerary


logging.basicConfig(level=logging.INFO)

def create_app():
    app = Flask(__name__)
    allowed_origins = os.getenv("ALLOWED_ORIGINS")
    if allowed_origins:
        CORS(app, origins=allowed_origins)
    app.config["SECRET_KEY"] = os.environ["SECRET_KEY"]
    return app


app = create_app()


# put the routes that will serve the frontend here

api = Api(app)
api.add_resource(Recommendations, "/api/recommendations")
api.add_resource(Itinerary, "/api/itinerary")
