# Menu of the Felipes Taqueria
menu = {
    "Baja Taco": 4.00,
    "Burrito": 7.50,
    "Bowl": 8.50,
    "Nachos": 11.00,
    "Quesadilla": 8.50,
    "Super Burrito": 8.50,
    "Super Quesadilla": 9.50,
    "Taco": 3.00,
    "Tortilla Salad": 8.00
}


def main():
    """Takes customer orders and calculates the total cost of their orders."""

    total_orders = 0
    while True:
        try:
            item = input("Item: ").title().strip()
        except (KeyboardInterrupt, EOFError):
            print(f"\nThank you for your visit!")
            quit()
        if item in menu:
            total_orders += menu[item]
            print(f"Total: ${total_orders:.2f}")


main()