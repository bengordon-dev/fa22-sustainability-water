from flask import Flask

app = Flask("Launder")

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"