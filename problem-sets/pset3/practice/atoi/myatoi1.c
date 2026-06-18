#include <cs50.h>
#include <ctype.h>
#include <math.h>
#include <stdio.h>
#include <string.h>

// My itterational atoi function throug out power function

int convert(string input);

int main(void)
{
    string input = get_string("Enter a positive integer: ");
    printf("you entered number with %lu characters\n", strlen(input));

    for (int i = 0, n = strlen(input); i < n; i++)
    {
        if (!isdigit(input[i]))
        {
            printf("Invalid Input!\n");
            return 1;
        }
    }

    // Convert string to int
    printf("%i\n", convert(input));
}

int convert(string input)
{
    // TODO
    // In the recursive version of convert, start with the last char and convert it into an integer value.
    // Then shorten the string, removing the last char, and then recursively call convert using the shortened
    // string as input, where the next char will be processed.

    int x = 0;
    int n = strlen(input);
    for (int i = 0; i < strlen(input); i++)
    {
        int z = input[i] - 48;
        n--;
        x = x + z * pow(10, n);
        printf("input[%i] = %i, n = %i, x = %i\n", i, z, n, x);
    }

    return x;
}