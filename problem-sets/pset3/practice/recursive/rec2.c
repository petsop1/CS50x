#include <string.h>
#include <cs50.h>
#include <stdio.h>

// Summing recursivelly - adaptation of the example1.c but summing up only even numbers

int f(int x)
{
    // this if conditions is a base conditions = so here the recursive loop will stop.
    if (x == 0)
    {
        return 0;
    }
    // If number%2 == 0 the number is divisible by 2 without any remainder so it is even number
    else if (x % 2 == 0)
    {
        printf("Hello from f with x = %d\n", x);
        return x + f(x - 1);
    }
    else
    {
        return f(x - 1);
    }
}

// Explanation for x = 4
// x + f(x - 1) = 4 + f(4 - 1) = 4 + f(3) so f(3) is a new input to the function
// Generally it will like this = 4 + 2 + 0 = 6

int main(void)
{
    int input = get_int("Enter a positive integer: ");
    printf("Result is: %i\n", f(input));
    return 0;
}