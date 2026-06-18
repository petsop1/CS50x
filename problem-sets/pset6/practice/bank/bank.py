# Bank, from CS50’s Introduction to Programming with Python, for practice with strs

# Standardizing the input
greeting = input("Greeting: ").strip().lower()

# Conditioanals
if greeting[0:5] == "hello":
    print("$0")
elif greeting[0] == "h" and greeting[:5] != "hello":
    print("$20")
else:
    print("$100")

