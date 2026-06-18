# TODO

from cs50 import get_float


def main():

    # Ask how many cents the customer is owed
    dollars = get_dollars()

    # Calculate the number of quarters to give the customer
    quarters = calculate_quarters(dollars)
    dollars = round(dollars - quarters * 0.25, 2)

    # Calculate the number of dimes to give the customer
    dimes = calculate_dimes(dollars)
    dollars = round(dollars - dimes * 0.10, 2)

    # Calculate the number of nickels to give the customer
    nickels = calculate_nickels(dollars)
    dollars = round(dollars - nickels * 0.05, 2)

    # Calculate the number of pennies to give the customer
    pennies = calculate_pennies(dollars)
    dollars = round(dollars - pennies * 0.01, 2)

    # Sum number of coins
    number_of_coins = quarters + dimes + nickels + pennies

    print(number_of_coins)
    # print("quarters to give: ", quarters)
    # print("dimes to give:    ", dimes)
    # print("nickles to give:  ", nickels)
    # print("pennies  to give: ", pennies)


def get_dollars():
    while True:
        dollars = get_float("Change owed: ")
        if dollars > 0:
            return dollars


def calculate_quarters(dollars):
    return int(dollars / 0.25)


def calculate_dimes(dollars):
    return int(dollars / 0.10)


def calculate_nickels(dollars):
    return int(dollars / 0.05)


def calculate_pennies(dollars):
    return int(dollars / 0.01)


if __name__ == "__main__":
    main()
