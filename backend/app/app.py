import os
import logging

from flask import Flask
from flask_cors import CORS
from flask_restful import Api

from dotenv import load_dotenv

from .api import Recommendations, Itinerary

load_dotenv()

logging.basicConfig(level=logging.DEBUG)

def create_app():
    app = Flask(__name__)
    CORS(app, origins=os.environ["ALLOWED_HOSTS"])
    app.config["SECRET_KEY"] = os.environ["SECRET_KEY"]
    return app


app = create_app()
api = Api(app)
api.add_resource(Recommendations, "/recommendations")
api.add_resource(Itinerary, "/itinerary")
