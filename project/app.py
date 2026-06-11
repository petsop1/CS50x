import os
import re
import datetime

import ssl
import smtplib
from email.message import EmailMessage
from cs50 import SQL
from flask import Flask, flash, get_flashed_messages, redirect, render_template, request, session, url_for, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from email_validator import validate_email, EmailNotValidError
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature
from flask_session import Session


from helpers import (
    apology,
    login_required,
    usd,
    get_random_color,
    is_valid_password,
    derive_full_name_and_initials,
    css_colors
)


# Configure application
app = Flask(__name__)
# app.config['SERVER_NAME'] = 'b002-4-234-112-175.ngrok-free.app'    only for email testing, hence no hosting so far
app.config['PREFERRED_URL_SCHEME'] = 'https'


# Set the secret key
app.secret_key = "72cf492a4b0433e58e414f63d5ecc1c400a6336cce4dcfd4c798536fe503f115"
serializer = URLSafeTimedSerializer(app.secret_key)
# 1 vulnerability - hardcoded-credentials Embedding credentials in source code risks unauthorized access
# TOTO ZAPRACOVAT potom, je to len trochu inac syntaxovo, vyuziva to "os" library, generally a good practice to use a configuration file or environment variables for your secret key and other configuration, especially in a production application. This allows you to change the configuration without modifying the code and keeps sensitive information like your secret key out of your codebase.

# Custom filter
app.jinja_env.filters["usd"] = usd

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///flowstate.db")


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
    """Show main page"""
    return render_template("index.html",)


@app.route("/apology")
def apology_route():
    """Render error page with message and code from session."""
    error_message = session.get('error_message', "Error occurred")
    additional_message = session.get('additional_message', "Yikes, it seems we could not show you this page.")
    error_code = session.get('error_code', 400)
    return render_template("apology.html",
                           error_message=error_message,
                           error_code=error_code,
                           additional_message=additional_message), error_code


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""
    print(get_flashed_messages())
    if "user_id" in session:
        return redirect(url_for('index'))

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        user_email = request.form.get("useremail").strip()

        # Ensure email was submitted, is valid and is not none
        try:
            emailinfo = validate_email(user_email)
            normalized_email = emailinfo.normalized

        except EmailNotValidError as e:
            return apology("Hmmm, error occurred", e, 400)
        
        # Ensure password was submitted
        if not request.form.get("password"):
            return apology("Error occurd", "Must provide password", 403)

        # Query database for username
        rows = db.execute(
            "SELECT * FROM users WHERE user_email = ?", normalized_email
        )

        # Ensure username exists
        if len(rows) != 1:
            return apology("Invalid email", "Try to remember your email, or maybe register first.", 403)        

        verified = rows[0]["verified"]
        # Ensure user is verified
        if not verified:
            return apology("Almost there!", "Please verify your email before logging in.", 400)


        # Ensure password is correct
        if not check_password_hash(
            rows[0]["hashed_password"], request.form.get("password")
        ):
            return apology("Invalid password", "Maybe give it to another chance", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        first_name = rows[0]["derived_name"].split(" ")[0]
        session['first_name'] = first_name
        initials = rows[0]["initials"]
        session['initials'] = initials
        color = rows[0]["color"]
        session['color'] = color
        theme = rows[0]["theme"]
        session['theme'] = theme
        session['full_name'] = rows[0]["derived_name"]
        session['user_email'] = normalized_email

        # Redirect user to home page
        flash(f"Welcome back, {first_name}! You've successfully loged in.", "success")
        return redirect(url_for('index'))

    # User reached route via GET (as by clicking a link or via redirect)
    return render_template("login.html")


@app.route("/terms", methods=['GET'])
def terms():
    """Some terms testing"""
    return render_template("terms.html")


@app.route("/privacy", methods=['GET'])
def privacy():
    """Some privacy policy testing"""
    return render_template("privacy.html")


@app.route("/forgot-password", methods=['GET'])
def forgot_password():
    """Should be implemented in the future."""
    return apology("Sorry!", "This feature is not yet implemented.", 418)


@app.route("/logout", methods=['GET'])
def logout():
    """Log user out"""
    # Redirect user to login form
    first_name = session.get('first_name')

    # Forget any user_id
    session.clear()

    flash(f"{first_name}, you've successfully logged out of the system!", "success")
    return redirect("/")


@app.route("/join", methods=["GET", "POST"])
def join():
    """Register user"""
    if "user_id" in session:
        return redirect(url_for('index'))   

    if request.method == "POST":
        # Ensure username was submitted
        user_email = request.form.get("useremail").strip()

        try:
            # Check that the email address is valid. Turn on check_deliverability
            # for first-time validations like on account creation pages (but not
            # login pages).
            emailinfo = validate_email(user_email, check_deliverability=True)

            # After this point, use only the normalized form of the email address,
            # especially before going to a database query.
            normalized_email = emailinfo.normalized

        except EmailNotValidError as e:
            # The exception message is human-readable explanation of why it's
            # not a valid (or deliverable) email address.
            return apology("Hmmm, error occurred", e, 400)

        # Query the database to check if the username already exists
        duplicity = db.execute("SELECT * FROM users WHERE user_email = ?", normalized_email)
        if duplicity:
            return apology("Username is already taken", "Did you perhaps forget about us?", 400)

        # Ensure password was submitted
        password = request.form.get("password").strip()
        if not is_valid_password(password):
            return apology("Please try again", "Password doesn't meet the requirements", 400)

        confirmation = request.form.get("passwordConfirmation").strip()
        if password != confirmation:
            return apology("Passwords doesn't match", "Hmmm, maybe a typo?", 400)

        hashed_password = generate_password_hash(password)
        full_name, initials = derive_full_name_and_initials(normalized_email, db)
        random_color = get_random_color()
        first_name = full_name.split(" ")[0]

        db.execute(
            "INSERT INTO users (user_email, derived_name, initials, hashed_password, color) VALUES (?, ?, ?, ?, ?)",
            normalized_email,
            full_name,
            initials,
            hashed_password,
            random_color
        )

        # Generate a token with the user's email
        token = serializer.dumps(normalized_email, salt='email-confirm')
        print("token generated:", token)
        # Create the confirmation url
        confirm_url = url_for('verify_email', token=token, _external=True, _scheme='https')

        flash(f"Hooray, {first_name}! You've successfully registered. Welcome aboard. Please confirm your email within 1 hour before starting.", "success")

        email_sender = "info@flwstatelab.com"
        email_password = "vmsfqyjebetvbrej"
        # email_password = os.environ.get('EMAIL_PASSWORD')   This is the way to go in production!!!
        email_recipient = str(normalized_email)

        subject = "Please verify your email!"
        # add name like Hej Peter, please verify your email...
        body = "Hej, " + first_name + "! Please click the link to verify your email: " + confirm_url

        em = EmailMessage()
        em["From"] = email_sender
        em["To"] = normalized_email
        em["Subject"] = subject
        em.set_content(body)

        context = ssl.create_default_context()

        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as smtp:
            smtp.login(email_sender, email_password)
            smtp.sendmail(email_sender, email_recipient, em.as_string())

        return redirect(url_for('login'))

    return render_template("join.html")


@app.route("/password", methods=["GET", "POST"])
@login_required
def password_change():
    """Change user password"""
    
    if request.method == "POST":
        # Query database for user details
        user_id = session["user_id"]
        rows = db.execute("SELECT * FROM users WHERE id = ?", user_id)

        password_old = request.form.get("password_old").strip()
        password_new1 = request.form.get("password_new1").strip()
        password_new2 = request.form.get("password_new2").strip()

        if not is_valid_password(password_old) or not is_valid_password(password_new1) or not is_valid_password(password_new2):
            return apology("Ayyy an error occured.", "Password field(s) don't meet the criteria", 400)
        if password_new1 != password_new2:
            return apology("Hmmmm", "New passwords doesn't match", 400)
        if not check_password_hash(rows[0]["hashed_password"], request.form.get("password_old")):
            return apology("Will not give many clues","Better stay discreee. Invalid password", 400)

        new_hashed_password = generate_password_hash(password_new1)
        db.execute(
            "UPDATE users SET hashed_password = ? WHERE id = ?", new_hashed_password, user_id
        )
        flash(f"Hooray, {session['first_name']}! You've successfully changed your password.", "success")
        return redirect("/")

    return render_template("password.html")


@app.route('/color-picker', methods=['GET', 'POST'])
def color_picker():
    """Change user color"""
    if request.method == 'POST':
        # Update the session color and redirect back to the previous page
        session['color'] = request.form['color']
        db.execute(
           "UPDATE users SET color = ? WHERE id = ?", session['color'], session['user_id']
        )

        flash(f"Good job {session['first_name']}, your color was changed successfully!", "success")
        return redirect("/")

    # Render the color picker page
    flash(f"Hej {session['first_name']}! You know what to do...", "info")
    return render_template('color-picker.html', css_colors=css_colors)



# toto doriesit a integrovat do app.py
@app.route('/save-theme', methods=['POST'])
def save_theme():
    """Save user theme preference"""
    data = request.get_json()
    theme = data.get('theme')

    db.execute(
        "UPDATE users SET theme = ? WHERE id = ?", theme, session['user_id']
    )
    session['theme'] = theme

    return jsonify({'message': f"Hej {session['first_name']}! Your preferred theme has been saved!"})


@app.route('/verify/<token>')
def verify_email(token):
    """Verify user email"""
    try:
        email = serializer.loads(token, salt='email-confirm', max_age=3600)
    except (SignatureExpired, BadTimeSignature):
        return apology("Ups, error occurred", "The verification link is invalid or has expired.", 400)

    user = db.execute(
        "SELECT * FROM users WHERE user_email = ?", email
    )

    if not user:
        return apology("Ups, error occurred", "User not found.", 400)

    if user[0]["verified"] == 1:
        return apology("Ups, actually", "Account already verified.", 400)

    # If the token is valid, mark the user as verified in the database
    db.execute(
        "UPDATE users SET verified = 1 WHERE user_email = ?", email
    )

    flash("Your account has been verified. Now you can finally login!", "info")
    return redirect(url_for('login'))
