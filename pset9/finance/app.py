import os

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session, url_for
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required, lookup, usd

# my imports
import re
import datetime


# Configure application
app = Flask(__name__)
# app.secret_key = b'\xf2\xe8\x0f\xeeo\xa1j\x00\xfd;+~\x8c\xd7\xcb\x0c\x0e\xce\xc1@z\xe8\xd0\xbc'
# app.secret_key = os.urandom(24)  # Generates a random 24-byte (or 24-character) key - asi netreba lebo app.config použivam


# Custom filter
app.jinja_env.filters["usd"] = usd

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///finance.db")


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
@login_required
def index():
    """Show portfolio of stocks"""
    overview = db.execute(
        "SELECT symbol, SUM(shares) as total_shares FROM purchases WHERE user_id = ? GROUP BY symbol",
        session["user_id"],
    )
    total_shares = {item["symbol"].upper(): item["total_shares"] for item in overview}
    print("total_shares:", total_shares)

    data = {}
    names = []

    print("data:", data)

    for symbol in total_shares:
        print("symbol:", symbol)
        symbol_data = lookup(symbol)
        print("symbol_data:", symbol_data)
        data[symbol_data["symbol"]] = symbol_data["price"]
        names.append(symbol_data["name"])
        print("names:", names)
        print("data:", data)

    print("total_shares:", total_shares)
    print("data:", data)

    sum_of_cash_in_shares = sum(
        data[symbol] * total_shares[symbol.upper()] for symbol in data
    )

    user_id = session["user_id"]
    user_info = db.execute("SELECT * FROM users WHERE id = ?", user_id)
    actual_balance = user_info[0]["cash"]

    total = actual_balance + sum_of_cash_in_shares
    print("actual_balance:", actual_balance, " and TOTAL:", total)

    return render_template(
        "index.html",
        total_shares=total_shares,
        data=data,
        names=names,
        actual_balance=actual_balance,
        total=total,
    )


@app.route("/buy", methods=["GET", "POST"])
@login_required
def buy():
    """Buy shares of stock"""
    if request.method == "GET":
        return render_template("buy.html")

    # Define the pattern
    symbol_pattern = re.compile(r"[A-Za-z]{4}")
    symbol = request.form.get("symbol").strip()
    try:
        shares = int(request.form.get("shares").strip())
    except ValueError:
        return apology("Enter positive integer", 400)

    if symbol_pattern.fullmatch(symbol) and lookup(symbol) is not None and shares >= 1:
        print("symbol is valid")

        data = lookup(symbol)
        price = data["price"]

        user_id = session["user_id"]
        user_info = db.execute("SELECT * FROM users WHERE id = ?", user_id)
        actual_balance = user_info[0]["cash"]
        new_balance = actual_balance - (shares * price)

        current_datetime = datetime.datetime.now()
        f_datetime = current_datetime.strftime("%Y-%m-%d %H:%M:%S")

        if new_balance >= 0:
            db.execute("UPDATE users SET cash=? WHERE id=?", new_balance, user_id)
            db.execute(
                "INSERT INTO purchases (user_id, symbol, shares, price, timestamp) VALUES(?, ?, ?, ?, ?)",
                user_id,
                symbol,
                shares,
                price,
                f_datetime,
            )
            return redirect("/")
        else:
            return apology("There is not enough cash on your account", 400)

    else:
        print("symbol is NOT valid")
        return apology("Don't try, must provide correct stock symbol", 400)


@app.route("/history")
@login_required
def history():
    """Show history of transactions"""
    transactions = db.execute(
        "SELECT * FROM purchases WHERE user_id = ?", session["user_id"]
    )
    print(transactions)

    return render_template("history.html", transactions=transactions)


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 403)

        # Query database for username
        rows = db.execute(
            "SELECT * FROM users WHERE username = ?", request.form.get("username")
        )

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(
            rows[0]["hash"], request.form.get("password")
        ):
            return apology("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@app.route("/quote", methods=["GET", "POST"])
@login_required
def quote():
    """Get stock quote."""
    if request.method == "GET":
        return render_template("quote.html")

    data = lookup(request.form.get("symbol").strip())

    if data:
        return render_template("quoted.html", data=data)
    else:
        return apology("No data available for this stock symbol :(", 400)


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""
    if request.method == "POST":
        # Ensure username was submitted
        username = request.form.get("username").strip()
        password = request.form.get("password").strip()
        confirmation = request.form.get("confirmation").strip()

        if not password or not confirmation:
            return apology("Password cannot be empty", 400)
        if password != confirmation:
            return apology("Passwords doesn't match", 400)

        # Query the database to check if the username already exists
        duplicity = db.execute("SELECT * FROM users WHERE username = ?", username)
        if not username:
            return apology("Username can't be empty", 400)
        if duplicity:
            return apology("Username already taken", 400)

        hashed_password = generate_password_hash(password)
        print(username, "\n", password, "\n", confirmation, "\n", hashed_password)
        db.execute(
            "INSERT INTO users (username, hash) VALUES (?, ?)",
            username,
            hashed_password,
        )
        return render_template("login.html")

    else:
        return render_template("register.html")


@app.route("/sell", methods=["GET", "POST"])
@login_required
def sell():
    """Sell shares of stock"""
    user_id = session["user_id"]
    unique_symbols_mix = db.execute(
        "SELECT DISTINCT symbol FROM purchases WHERE user_id = ? AND SHARES >=1",
        user_id,
    )
    unique_symbols = [
        {"symbol": symbol["symbol"].upper()} for symbol in unique_symbols_mix
    ]
    print("unique_symbols:", unique_symbols)
    if request.method == "GET":
        return render_template("sell.html", unique_symbols=unique_symbols)
    else:
        # Validate inputs
        symbol = request.form.get("symbol").strip().upper()
        print("symbol:", symbol)
        if symbol not in [item["symbol"] for item in unique_symbols]:
            return apology("Don't try, You have no such a share")

        try:
            shares_to_sell = int(request.form.get("shares").strip())
        except ValueError:
            return apology("Value is not an integer", 400)
        if shares_to_sell < 1:
            return apology("Shares must be a positive integer", 400)

        overview = db.execute(
            "SELECT symbol, SUM(shares) as total_shares FROM purchases WHERE user_id = ? GROUP BY symbol",
            session["user_id"],
        )
        total_shares = {item["symbol"]: item["total_shares"] for item in overview}
        print("total_shares:", total_shares)

        shares_available = total_shares[symbol]
        print("shares_available:", shares_available)

        if shares_to_sell > shares_available:
            return apology("You can't sell more than you have", 400)

        current_datetime = datetime.datetime.now()
        f_datetime = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
        print("f_datetime:", f_datetime)

        data = lookup(symbol)
        price_for_share = data["price"]
        transaction_amount = price_for_share * shares_to_sell
        cash = db.execute("SELECT cash FROM users WHERE id=?", user_id)
        actual_balance = cash[0]["cash"]
        print("actual_balance", actual_balance)
        print("transaction_amount", transaction_amount)

        new_balance = actual_balance + transaction_amount
        db.execute("UPDATE users SET cash=? WHERE id=?", new_balance, user_id)

        db.execute(
            "INSERT INTO purchases (user_id, symbol, shares, price, timestamp) VALUES(?, ?, ?, ?, ?)",
            user_id,
            symbol,
            -shares_to_sell,
            price_for_share,
            f_datetime,
        )

        return redirect("/")


@app.route("/password", methods=["GET", "POST"])
def password():
    """Change user password"""
    if request.method == "POST":
        # Query database for user details
        user_id = session["user_id"]
        rows = db.execute("SELECT * FROM users WHERE id = ?", user_id)
        print("user_id:", user_id, "rows:", rows)

        password_old = request.form.get("password_old").strip()
        print("password_old:", password_old)
        password_new1 = request.form.get("password_new1").strip()
        print("password_new1:", password_new1)
        password_new2 = request.form.get("password_new2").strip()
        print("password_new2:", password_new2)

        if not password_old or not password_new1 or not password_new2:
            return apology("Password fields cannot be empty", 400)
        if password_new1 != password_new2:
            return apology("New passwords doesn't match", 400)
        if not check_password_hash(rows[0]["hash"], request.form.get("password_old")):
            return apology("invalid password", 400)
        print("check_password_hash:", check_password_hash)

        new_hashed_password = generate_password_hash(password_new1)
        print(
            "\n",
            password_old,
            password_new1,
            password_new2,
            "\n",
            new_hashed_password,
            "\n",
        )
        db.execute(
            "UPDATE users SET hash = ? WHERE id = ?", new_hashed_password, user_id
        )
        return redirect("/")

    else:
        return render_template("password.html")
