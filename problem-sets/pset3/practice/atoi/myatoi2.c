#include <cs50.h>
#include <ctype.h>
#include <math.h>
#include <stdio.h>
#include <string.h>

// Still interational concept but with "*10" approach

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
    int res;
    for (int i = 0; i < strlen(input); i++)
    {
        res = res * 10 + input[i] - '0';
    }
    return res;
}