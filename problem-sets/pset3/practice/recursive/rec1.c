#include <string.h>
#include <cs50.h>
#include <stdio.h>

// Summing recursivelly

int f(int x)
{
    // this if conditions is a base conditions = so here the recursive loop will stop.
    if (x == 0)
    {
        return 0;
    }
    printf("Hello from f with x = %d\n", x);
    return x + f(x - 1);
}

// Explanation for x = 4
// x + f(x - 1) = 4 + f(4 - 1) = 4 + f(3) so f(3) is a new input to the function
// Generally it will like this = 4 + 3 + 2 + 1 + 0 = 10

int main(void)
{
    int input = get_int("Enter a positive integer: ");
    printf("Result is: %i\n", f(input));
    return 0;
}