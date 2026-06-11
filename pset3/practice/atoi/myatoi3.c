#include <cs50.h>
#include <ctype.h>
#include <math.h>
#include <stdio.h>
#include <string.h>

// Recursiv approach but just simple solution found on internet...

int atoi(char *str, int n);

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
    printf("%i\n", atoi(input));
}

// Recursive function to implement `atoi()` function in C
int atoi(char *str, int n)
{
    // printf("*str = %c, n = %i, str = %s, str[n - 1] = %c\n", *str, n, str, str[n - 1]);
    if (n == 1)
    {
        return *str - '0';
    }

    return (10 * atoi(str, n - 1) + str[n - 1] - '0');
}
