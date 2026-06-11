#include <cs50.h>
#include <stdio.h>
#include <math.h>

int lastDigit;

int main(void)
{
    // Prompt user for credit card number.
    long cardNo = get_long("What's your credit card number? ");
    printf("You typed: %li\n", cardNo);

    // Finding length of an card number.
    int length = log10(cardNo) + 1;
    printf("Card length is: %i\n", length);

    // Is card length Even or odd?
    int Even = ((length / 2) * 2 == length) ? 1 : 0;
    printf("Has card even nubmers? %i\n", Even);

    // Find first 2 digits.
    long first2 = cardNo;
    if (Even == 1)
    {
        while (first2 >= 100)
        {
            first2 = first2 / 100;
        }
    }
    else
    {
        while (first2 >= 100)
        {
            first2 = first2 / 10;
        }
    }
    printf("First two numbers are: %li\n", first2);

    // Find first digit.
    int first1 = first2 / 10;
    printf("First digit is: %i\n", first1);

    // Get even positions of numbers from the card number
    long cardNoEven = cardNo / 10;   // Offsetting number by one digit to obtain even numbers
    int sumEven;
    printf("Even\n");
    while (cardNoEven > 0)
    {
        if ((cardNoEven % 10) < 5)
        {
            sumEven = sumEven + (cardNoEven % 10) * 2;
            printf("%li", (cardNoEven % 10) * 2);
        }
        else
        {
            int x = ((cardNoEven % 10) * 2);
            printf("%i", x);
            while (x > 0)
            {
                sumEven = sumEven + (x % 10);
                x = x / 10;
            }
        }
        cardNoEven = cardNoEven / 100;
    }
    printf("\nsum: %i\n", sumEven);

    // Get odd possitions of numbers from the card number
    long cardNoOdd = cardNo;
    int sumOdd;
    printf("Odd\n");
    while (cardNoOdd > 0)
    {
        sumOdd = sumOdd + (cardNoOdd % 10);
        printf("%li", cardNoOdd % 10);
        cardNoOdd = cardNoOdd / 100;
    }
    printf("\nsum: %i\n", sumOdd);

    // Final calculataion and checking
    int finalSum;
    finalSum = sumOdd + sumEven;
    lastDigit = (finalSum % 10);
    printf("Final sum is: %i\n", finalSum);
    printf("Last digit is: %i\n", lastDigit);

    // Check if card is American express, Master Card of Visa.
    if (length == 15 && (first2 == 34 || first2 == 37) && lastDigit == 0)
    {
        printf("AMEX\n");
    }
    else if ((first2 >= 51 && first2 <= 55) && length == 16 && lastDigit == 0)
    {
        printf("MASTERCARD\n");
    }
    else if (first1 == 4 && (length == 13 || length == 16) && lastDigit == 0)
    {
        printf("VISA\n");
    }
    else
    {
        printf("INVALID\n");
    }
}