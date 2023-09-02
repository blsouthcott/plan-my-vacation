import os
import logging

from flask_restful import Api

from app.app import create_app
from app.api import Recommendations, Itinerary

logging.basicConfig(level=logging.INFO)

app = create_app()

api = Api(app)
api.add_resource(Recommendations, "/api/recommendations")
api.add_resource(Itinerary, "/api/itinerary")

# these routes serve the frontend React application
@app.route("/", methods=["GET"])
def serve():
    logging.info("Serving React frontend...")
    return app.send_static_file("index.html")


@app.route("/<path:path>", methods=["GET"])
def serve_static_file(path):
    logging.info(f"Handling request for static file: {path}")
    if os.path.exists(os.path.join(app.static_folder, path)):
        return app.send_static_file(path)
    else:
        return serve()
    

if __name__ == "__main__":
    app.run()
