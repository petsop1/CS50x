# FIGlet, named after Frank, Ian, and Glen’s letters,is a program from the early 1990s
# for making large letters out of ordinary text, a form of ASCII art.
# Frank, Ian and Glen’s Letters, from CS50’s Introduction to Programming with Python,
# for practice with libraries and command-line arguments


# FIGLET modification for python - installed through terminal command: pip install pyfiglet
from pyfiglet import Figlet

# Exits with explicit value, importing sys
import sys

# Handls the random values
import random

figlet = Figlet()

if len(sys.argv) == 1:
    f = random.choice(figlet.getFonts())
    figlet.setFont(font=f)
    print(f"{f}")
    s = input("Input: ")
    print("Output: ")
    print(figlet.renderText(s))
    sys.exit(0)

if sys.argv[1] in ["-f", "--font"] and sys.argv[2] in figlet.getFonts():
    figlet.setFont(font = sys.argv[2])
    s = input("Input: ")
    print("Output: ")
    print(figlet.renderText(s))
    sys.exit(0)

else:
    print("Invalid font")
    sys.exit(1)
