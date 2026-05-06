from flask import Flask, render_template, request
import os
from detect import detect_animals

app = Flask(__name__)

UPLOAD_FOLDER = os.path.join("static", "uploads")
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route("/", methods=["GET", "POST"])
def index():

    animal_count = None
    herd = False
    latitude = 31.5204
    longitude = 74.3587

    if request.method == "POST":

        file = request.files["image"]

        if file:
            filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
            file.save(filepath)

            animal_count, herd = detect_animals(filepath)

    return render_template(
        "index.html",
        animal_count=animal_count,
        herd=herd,
        lat=latitude,
        lon=longitude,
    )


if __name__ == "__main__":
    app.run(debug=True)