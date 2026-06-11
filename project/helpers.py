import csv
import datetime
import urllib
import uuid
import re
from functools import wraps
import pytz
import requests
import subprocess
import random

from flask import redirect, render_template, url_for, session


def apology(error_message="Error occurred",
            additional_message="Yikes, it seems we could not show you this page.",
            error_code=400):
    """Store error details in session and redirect to error page."""
    session['error_message'] = error_message
    session['additional_message'] = additional_message
    session['error_code'] = error_code
    return redirect(url_for('apology_route'))


def login_required(f):
    """
    Decorate routes to require login.

    http://flask.pocoo.org/docs/0.12/patterns/viewdecorators/
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function


def lookup(symbol):
    """Look up quote for symbol."""

    # if (symbol == "AAAA"):
    #     return {"name": "Stock A", "price": 28.00, "symbol": "AAAA"}

    # Prepare API request
    symbol = symbol.upper()
    end = datetime.datetime.now(pytz.timezone("US/Eastern"))
    start = end - datetime.timedelta(days=7)

    # Yahoo Finance API
    url = (
        f"https://query1.finance.yahoo.com/v7/finance/download/{urllib.parse.quote_plus(symbol)}"
        f"?period1={int(start.timestamp())}"
        f"&period2={int(end.timestamp())}"
        f"&interval=1d&events=history&includeAdjustedClose=true"
    )

    print("URL:",url)
    # Query API
    try:
        response = requests.get(url, cookies={"session": str(uuid.uuid4())}, headers={"User-Agent": "python-requests", "Accept": "*/*"})
        response.raise_for_status()

        # CSV header: Date,Open,High,Low,Close,Adj Close,Volume
        quotes = list(csv.DictReader(response.content.decode("utf-8").splitlines()))
        quotes.reverse()
        price = round(float(quotes[0]["Adj Close"]), 2)
        return {
            "name": symbol,
            "price": price,
            "symbol": symbol
        }
    except (requests.RequestException, ValueError, KeyError, IndexError):
        return None


def usd(value):
    """Format value as USD."""
    return f"${value:,.2f}"


def is_valid_password(password):
    """
    Check if the given password meets the password policy.

    The password policy is:
    - At least 8 characters
    - Contains at least one lowercase letter
    - Contains at least one uppercase letter
    - Contains at least one digit
    - Contains at least one special character

    Args:
    password (str): The password to check.

    Returns:
    bool: True if the password meets the policy, False otherwise.
    """
    if len(password) < 8:
        return False
    if not re.search("[a-z]", password):
        return False
    if not re.search("[A-Z]", password):
        return False
    if not re.search("[0-9]", password):
        return False
    return True


def derive_full_name_and_initials(normalized_email, db):
    """
    Creates an user initials and derive the full name from the given email address. 
    It expects mostly the email in form name.surname@domain.xxx,
        but it can handle different formats.
    """

    # Split the email at the @ symbol and get the first part
    local_part = normalized_email.split('@')[0]

    # Split the local part at the "." symbol
    parts = local_part.split('.')

    # Capitalize each part to generate the full name
    full_name = ' '.join(part.capitalize() for part in parts if part)

    if len(parts) == 2:
        # If there are exactly two parts, take two characters from each part
        initials = ''.join(part[:2] for part in parts if part)
    else:
        # If there is one part or more than two parts, take the first four characters
        initials = local_part[:4]

    # Convert initials to uppercase
    initials = initials.upper()

    # Check if the initials exist in the database
    user = db.execute("SELECT * FROM users WHERE initials = ?", (initials,))

    # If the initials exist, append a number to make them unique
    if user:
        user = user[0]
        i = 1
        while True:
            new_initials = initials + str(i)
            user = db.execute("SELECT * FROM users WHERE initials = ?", (new_initials,))
            if user:
                user = user[0]
            if not user:
                initials = new_initials
                break
            i += 1

    return full_name, initials

css_colors = [
    "red", "green", "blue", "purple", "orange", "pink", "brown",
    "maroon", "fuchsia", "lime", "olive", "teal", "aqua",
    "orange", "aquamarine", "blueviolet", "burlywood", "cadetblue", "chartreuse", "chocolate",
    "coral", "cornflowerblue", "crimson", "cyan", "darkcyan",
    "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen",
    "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue",
    "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dodgerblue",
    "firebrick", "forestgreen", "gainsboro", "gold",
    "goldenrod", "greenyellow", "hotpink", "indianred", 
    "khaki", "lawngreen", "lightblue",
    "lightcoral", "lightgreen", "lightpink",
    "lightsalmon", "lightseagreen", "lightskyblue", "lightsteelblue",
    "limegreen", "magenta", "mediumaquamarine", "mediumorchid",
    "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen",
    "mediumturquoise", "mediumvioletred", 
    "moccasin", "navajowhite", "olivedrab", "orangered", "orchid",
    "palegoldenrod", "palegreen", "paleturquoise", "palevioletred",
    "peachpuff", "peru", "pink", "plum", "powderblue", "rosybrown", "royalblue",
    "saddlebrown", "salmon", "sandybrown", "seagreen", "sienna", "skyblue",
    "slateblue", "springgreen", "steelblue", "tan", "thistle", "tomato", "turquoise",
    "violet", "wheat", "yellowgreen", "rebeccapurple"
]

def get_random_color():
    """Return a random color from the css_colors list."""
    return random.choice(css_colors)