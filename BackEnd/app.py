from flask import Flask, request
from datetime import datetime
import json
from urllib.request import urlopen
app = Flask("Launder")
# https://www.ercot.com/api/1/services/read/dashboards/systemWidePrices.json

@app.route("/getSystemWidePrices/<region>", methods = ["GET"])
def getSystemWidePrices(region):
    if request.method == "GET":
        url = "https://www.ercot.com/api/1/services/read/dashboards/systemWidePrices.json"
        response = urlopen(url)
        data_json = json.loads(response.read())
        points = []
        if "rtSppData" in data_json and "damSppData" in data_json:
            for point in data_json["rtSppData"]:
                point_time = datetime.fromtimestamp(point["interval"]/1000)
                hours = point_time.hour + (point_time.minute / 60) + (point_time.second / 3600)
                points.append({"hoursElapsed": hours, "price": point[region]})
            max_time = max([point["hoursElapsed"] for point in points])
            for point in data_json["damSppData"]:
                point_time = datetime.fromtimestamp(point["interval"]/1000)
                hours = point_time.hour + (point_time.minute / 60) + (point_time.second / 3600)
                if hours > max_time:
                    points.append({"hoursElapsed": hours, "price": point[region]})
        return {"points": points}

#https://www.ercot.com/api/1/services/read/dashboards/combine-wind-solar.json
@app.route("/getCombinedWindandSolar", methods = ["GET"])
def getCombinedWindandSolar():
    if request.method == "GET":
        url = "https://www.ercot.com/api/1/services/read/dashboards/combine-wind-solar.json"
        response = urlopen(url)
        data_json = json.loads(response.read())
        today_pts = []
        tomorrow_pts = []
        for hour_entry in data_json["currentDay"]["data"].values():
            entry = {"hour": hour_entry["hourEnding"] - 0.5}
            if "actualWind" in hour_entry and "actualSolar" in hour_entry and hour_entry["actualWind"] != None and hour_entry["actualSolar"] != None:
                entry["combined"] = hour_entry["actualWind"] + hour_entry["actualSolar"]
            else:
                entry["combined"] = hour_entry["copHslWind"] + hour_entry["copHslSolar"]
            today_pts.append(entry)
        for hour_entry in data_json["nextDay"]["data"].values():
            entry = {"hour": hour_entry["hourEnding"] - 0.5,
                    "combined": hour_entry["copHslWind"] + hour_entry["copHslSolar"]}
            tomorrow_pts.append(entry)
        return {"today": today_pts, "tomorrow": tomorrow_pts}