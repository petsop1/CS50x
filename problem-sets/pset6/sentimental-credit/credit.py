# TODO

from cs50 import get_int
# import re


def main():
    # Prompt user for credit card number.
    card_number = get_int("What's your credit card number? ")
    print("You typed: ", card_number)

    # Finding the length of an card number.
    card_length = len(str(card_number))
    print("Card length is: ", card_length)

    # Is card length Even or odd?
    is_even = True if card_length % 2 == 0 else False
    print("Is card length even?", is_even)

    # Get the first digit
    first_digit = int(str(card_number)[:1])
    print(first_digit)

    # Get the first two digits
    first_two_digits = int(str(card_number)[:2])
    print(first_two_digits)

    # Get even positions of numbers from the card number
    even_digits = str(card_number)[card_length - 2::-2]
    print("even: ", even_digits)

    even_digits_multiplied = ""
    for number in even_digits:
        number = int(number) * 2
        even_digits_multiplied += str(number)

    sum_of_even_digits = 0
    for number in even_digits_multiplied:
        sum_of_even_digits += int(number)
    print("even_digits_multiplied: ", even_digits_multiplied)
    print("sum_of_even_digits: ", sum_of_even_digits)

    # Get odd possitions of numbers from the card number
    odd_digits = str(card_number)[card_length - 1::-2]
    print("odd:", odd_digits)
    sum_of_odd_digits = 0
    for number in odd_digits:
        sum_of_odd_digits += int(number)

    # Final calculataion and check
    final_sum = sum_of_even_digits + sum_of_odd_digits
    last_digit = final_sum % 10
    print("Final sum of even digits:", sum_of_even_digits)
    print("Final sum of odd digits:", sum_of_odd_digits)
    print("Final sum is: ", final_sum)
    print("Final digit is:", last_digit)

    # Check if card is American express, Master Card of Visa.
    if (card_length == 15 and first_two_digits in (34, 37) and last_digit == 0):
        print("AMEX")
    elif (card_length == 16 and first_two_digits in range(51, 56) and last_digit == 0):
        print("MASTERCARD")
    elif (card_length in (13, 16) and first_digit == 4 and last_digit == 0):
        print("VISA")
    else:
        print("INVALID")


if __name__ == "__main__":
    main()
