from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# ── Restaurant Data (Updated & Simplified) ───────────────────────
restaurant_info = {
    "name": "Urban Spice Kitchen",
    "tagline": "Modern Flavors, Timeless Taste",
    "address": "88 Market Avenue, Chicago, IL 60601",
    "phone": "+1 (312) 555-7842",
    "email": "contact@urbanspice.com",
    "website": "www.urbanspice.com",
    "hours": {
        "Mon - Thu": "12:00 PM - 10:00 PM",
        "Fri": "12:00 PM - 11:00 PM",
        "Sat": "11:00 AM - 11:00 PM",
        "Sun": "11:00 AM - 9:00 PM",
    },
    "menu": {
        "Appetizers": [
            {"name": "Garlic Shrimp", "price": "$14", "desc": "Shrimp sautéed with garlic butter sauce"},
            {"name": "Stuffed Mushrooms", "price": "$12", "desc": "Mushrooms filled with cheese and herbs", "veg": True},
        ],
        "Main Course": [
            {"name": "Grilled Salmon", "price": "$28", "desc": "Fresh salmon served with lemon butter"},
            {"name": "Vegetable Stir Fry", "price": "$20", "desc": "Seasonal vegetables in soy glaze", "veg": True},
        ],
        "Desserts": [
            {"name": "Chocolate Lava Cake", "price": "$10", "desc": "Warm cake with molten chocolate center"},
            {"name": "Fruit Parfait", "price": "$9", "desc": "Fresh fruits layered with cream", "veg": True},
        ]
    },
    "features": [
        "Indoor and outdoor seating",
        "Private dining available",
        "Wheelchair accessible",
        "Free Wi-Fi"
    ],
    "reservation": {
        "phone": "+1 (312) 555-7842",
        "online": "www.urbanspice.com/book",
        "note": "Reservations are advised during weekends."
    }
}

# ── Intent Detection (Refactored) ────────────────────────────────
def get_intent(message):
    text = message.lower()

    keywords = {
        "hours": ["hour", "open", "close", "time"],
        "menu": ["menu", "food", "dish", "price"],
        "vegetarian": ["veg", "vegetarian"],
        "location": ["address", "where", "location"],
        "reservation": ["book", "reserve", "table"],
        "contact": ["phone", "email", "contact"],
        "features": ["facility", "feature", "service"],
        "greeting": ["hello", "hi", "hey"],
        "help": ["help", "assist"],
    }

    for intent, words in keywords.items():
        if any(word in text for word in words):
            return intent

    return "unknown"

# ── Response Builder (Cleaner Logic) ─────────────────────────────
def generate_response(intent, message):
    r = restaurant_info

    if intent == "greeting":
        return f"Welcome to {r['name']}. {r['tagline']}. How can I assist you?"

    if intent == "help":
        return (
            "You can ask about:\n"
            "- Opening hours\n"
            "- Menu items\n"
            "- Location\n"
            "- Reservations\n"
            "- Contact details"
        )

    if intent == "hours":
        return "\n".join([f"{day}: {time}" for day, time in r["hours"].items()])

    if intent == "location":
        return f"Our address is {r['address']}."

    if intent == "contact":
        return f"Phone: {r['phone']}\nEmail: {r['email']}\nWebsite: {r['website']}"

    if intent == "reservation":
        res = r["reservation"]
        return f"Call {res['phone']} or visit {res['online']}. {res['note']}"

    if intent == "vegetarian":
        veg_items = []
        for category, items in r["menu"].items():
            for item in items:
                if item.get("veg"):
                    veg_items.append(f"{item['name']} ({category}) - {item['price']}")
        return "\n".join(veg_items) if veg_items else "No vegetarian items found."

    if intent == "menu":
        output = ""
        for category, items in r["menu"].items():
            output += f"\n{category}:\n"
            for item in items:
                output += f"- {item['name']} ({item['price']})\n"
        return output

    if intent == "features":
        return "\n".join(r["features"])

    return "Sorry, I did not understand. Please ask about menu, hours, or reservations."

# ── Routes ──────────────────────────────────────────────────────
@app.route("/")
def home():
    return render_template("index.html", restaurant=restaurant_info)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({"reply": "Please enter a message."})

    intent = get_intent(user_message)
    reply = generate_response(intent, user_message)

    return jsonify({"reply": reply})

# ── Run App ─────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True)