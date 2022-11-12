from flask import Flask, request
import json
from urllib.request import urlopen
app = Flask("Launder")
# https://www.ercot.com/api/1/services/read/dashboards/systemWidePrices.json

@app.route("/getSystemWidePrices", methods = ["GET"])
def getSystemWidePrices():
    if(request.method == "GET"):
        url = "https://www.ercot.com/api/1/services/read/dashboards/systemWidePrices.json"
        response = urlopen(url)
        data_json = json.loads(response.read())
        return data_json

#https://www.ercot.com/api/1/services/read/dashboards/combine-wind-solar.json
@app.route("/getCombinedWindandSolar", methods = ["GET"])
def getCombinedWindandSolar():
    if(request.method == "GET"):
        url = "https://www.ercot.com/api/1/services/read/dashboards/combine-wind-solar.json"
        response = urlopen(url)
        data_json = json.loads(response.read())
        return data_json