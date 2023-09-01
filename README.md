# Plan My Vacation
Plan My Vacation is a web application designed to simplify your vacation planning. Utilizing the OpenAI API, the application provides personalized recommendations and itineraries to make your next getaway unforgettable.

# Demo
Click [here](https://youtu.be/QNDQf34etvo) to see a demo of this project!

## Features
- Personalized Vacation Recommendations
- Automated Itinerary Generation
- User-friendly Interface

## Installation

### Prerequisites
- Node.js
- Python 3.11
- [Poetry](https://python-poetry.org)

### Steps
1. Clone the repository: `git clone https://github.com/blsouthcott/plan-my-vacation.git`
2. Navigate to the project directory: `cd plan-my-vacation`
3. Navigate to the backend directory with `cd backend`
4. Run `poetry env use 3.11.x`
5. Install the dependencies with `poetry install --no-root`
6. The following environment variables should be saved in a `.flaskenv` file in the backend directory:
   - FLASK_APP=run.py
   - FLASK_ENV=development (optional)
   - FLASK_DEBUG=1 (optional)
   - OPENAI_API_KEY={your OpenAI API key}
   - SECRET_KEY={something super secret}
   - MONGO_CONNECTION_STRING={your MongoDB connectino string}
8. Navigate to the frontend directory with `cd ../ui`
9. Install frontend dependencies: `npm install`
10. Start the backend from the backend directory with `poetry shell && flask run --port=5001`
11. Start the frontend from the frontend directory with `npm start`

## Usage

1. Open the application in your web browser at `http://localhost:3000`
2. Follow the on-screen instructions to input your vacation preferences.
3. Receive personalized recommendations and itineraries.
4. Enjoy your vacation!

## APIs Used
- OpenAI API for generating recommendations and itineraries.
