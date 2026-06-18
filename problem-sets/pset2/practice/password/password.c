// Check that a password has at least one lowercase letter, uppercase letter, number and symbol.
// Practice iterating through a string and using the ctype library.

#include <cs50.h>
#include <stdio.h>
#include <ctype.h>
#include <string.h>

// Declaration of function.
bool valid(string password);

int main(void)
{
    // Getting password from user.
    string password = get_string("Enter your password: ");
    if (valid(password))
    {
        printf("Your password is valid!\n");
    }
    else
    {
        printf("Your password needs at least one uppercase letter, lowercase letter, number and symbol\n");
    }
}

// TODO: Complete the Boolean function below.
bool valid(string password)
{
    // Definition of counters
    int upper = 0;
    int lower = 0;
    int digit = 0;
    int punct = 0;
    // Looping throughout the given password.
    for (int i = 0; i < strlen(password); i++)
    {
        int c = password[i];
        islower(c) ? lower += 1 : lower;
        isupper(c) ? upper += 1 : upper;
        isdigit(c) ? digit += 1 : digit;
        ispunct(c) ? punct += 1 : punct;
    }
    // Checking if counts are working correctly.
    printf("No of uppers: %i\n", upper);
    printf("No of lowers: %i\n", lower);
    printf("No of digits: %i\n", digit);
    printf("No of puncts: %i\n", punct);
    // Final condition.
    if (upper > 0 && lower > 0 && digit > 0 && punct > 0)
    {
        return true;
    }
    else
    {
        return false;
    }
}