import logging
import os

from flask import request, jsonify
from flask_restful import Resource
import openai

from .app import limiter

openai.api_key = os.environ["OPENAI_API_KEY"]
MODEL = "gpt-3.5-turbo"
TEMPERATURE = 0.5
TOP_P = 1.0


class RecTypes:
    thingsToDo = "things to do"
    restaurants = "places to eat"


def get_openai_completion(prompt):
    resp = openai.ChatCompletion.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=TEMPERATURE,
        top_p=TOP_P,
        max_tokens=500
    )
    return resp.choices[0].message.content


class Recommendations(Resource):

    @limiter.limit("30 per hour; 50 per day")
    def post(self):
        body = request.get_json()
        if not (location := body.get("location")):
            return "location is a required field", 400
        if not (rec_type := body.get("rec_type")):
            return "rec_type is a required field", 400
        
        prompt = f"Give three recomendations for {getattr(RecTypes, rec_type)} while on vacation in {location}."
        
        if exclusions := body.get("exclusions"):
            if type(exclusions) is not list:
                return "exclusions must be an array", 400
            prompt += f" Do not include any recommendations that would be virtually identical to the following recommendations: {', '.join(exclusions)}."
        
        prompt += " The recommendations should each be given on a new line with no commas and no text should be included other than the recommendations."

        recs_text = get_openai_completion(prompt)
        logging.debug(f"OpenAI recs response: {recs_text}")
        recs = [rec for rec in recs_text.split("\n") if rec]

        return jsonify(recs=recs)


class Itinerary(Resource):

    @limiter.limit("10 per hour; 15 per day")
    def post(self):
        body = request.get_json()
        things_to_do = body.get("things_to_do")
        restaurants = body.get("restaurants")
        if not things_to_do and not restaurants:
            return "at least one of things_to_do or restaurants fields must be present", 400

        if not (num_days := body.get("num_days")):
            return "num_days field is required", 400

        prompt = f"Give a vacation itinerary for {num_days} including "
        if things_to_do:
            prompt += f"the following things to do: {', '.join(things_to_do)}"
            prompt += " and " if restaurants else "."
        if restaurants:
            prompt += f"the following places to eat: {', '.join(restaurants)}. "

        prompt += "Give the plan in the following format: Day 1\n[itinerary...]\n\nDay 2\n[itinerary...] etc."

        itinerary_text = get_openai_completion(prompt).strip()
        return jsonify(itinerary=itinerary_text)
