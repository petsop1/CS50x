#include <string.h>
#include <cs50.h>
#include <stdio.h>

// Summing recursivelly of given continuous integer input

int f(int x)
{
    // This if conditions is a base conditions = so here the recursive loop will stop.
    if (x == 0)
    {
        return 0;
    }
    // If number % 10 will give remainder after division of integers so 123/10 = 12 and REMAINDER is 3
    else
    {
        printf("Hello from f with x = %i\n", x % 10);
        return x % 10 + f(x / 10);
    }
}

int main(void)
{
    int input = get_int("Enter a positive integer: ");
    printf("Result is: %i\n", f(input));
    return 0;
}