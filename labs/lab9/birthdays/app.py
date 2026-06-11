import os

from cs50 import SQL
from flask import Flask, flash, jsonify, redirect, render_template, request, session

# Configure application
app = Flask(__name__)
app.secret_key = 'ASDF'  # Replace with a strong secret key


# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True


# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///birthdays.db")

MONTHS = list(range(1, 13))
DAYS = list(range(1, 32))


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        # TODO: Add the user's entry into the database
        action = request.form.get("action")

        if action == "delete":
            id = request.form.get("id")
            db.execute("DELETE FROM birthdays WHERE id = ?", id)
            flash("Entry removed successfully!", "success")
            return redirect("/")

        elif action == "edit":
            id = request.form.get("id")
            new_name = request.form.get("new_name")
            try:
                new_day = int(request.form.get("new_day"))
                new_month = int(request.form.get("new_month"))
            except:
                flash("Invalid input. Please try again.", "danger")
                return redirect("/")

            if not new_name or new_day not in DAYS or new_month not in MONTHS:
                flash("Invalid input. Please try again.", "danger")
                return redirect("/")

            db.execute("UPDATE birthdays SET name=?, month=?, day=? WHERE id=?", new_name, new_month, new_day, id)
            flash("Entry edited successfully!", "success")
            print(id)
            return redirect("/")

        else:
            name = request.form.get("name")
            try:
                day = int(request.form.get("day"))
                month = int(request.form.get("month"))
            except:
                flash("Invalid input. Please try again.", "danger")
                return redirect("/")

            if not name or day not in DAYS or month not in MONTHS:
                flash("Invalid input. Please try again.", "danger")
                return redirect("/")

            # Remember registrant
            db.execute("INSERT INTO birthdays (name, month, day) VALUES(?, ?, ?)", name, month, day)
            flash("New entry added successfully!", "success")
            return redirect("/")
    else:
        # TODO: Display the entries in the database on index.html
        birthdays = db.execute("SELECT * FROM birthdays")
        return render_template("index.html", birthdays=birthdays)


