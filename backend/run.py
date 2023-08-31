import os

from flask_restful import Api

from app.app import create_app
from app.api import Recommendations, Itinerary

app = create_app()

# put the routes that will serve the frontend here

api = Api(app)
api.add_resource(Recommendations, "/api/recommendations")
api.add_resource(Itinerary, "/api/itinerary")


if __name__ == "__main__":
    app.run()
