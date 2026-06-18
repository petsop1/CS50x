#include <cs50.h>
#include <stdio.h>

int main(void)
{
    // prompting user for input
    int n;
    do
    {
        n = get_int("Height: ");
    }
    while (n < 1 || n > 8);

    // main row loop generator
    for (int i = 0; i < n; i++)
    {
        // creating of empty spaces
        for (int j = i; j < n - 1; j++)
        {
            printf(" ");
        }
        // creating hashes
        for (int k = 0; k < i + 1; k++)
        {
            printf("#");
        }
        // creating empty spaces between pyramids
        for (int l = 0; l < 1; l++)
        {
            printf("  ");
        }
        // creating right side of the pyramid
        for (int k = 0; k < i + 1; k++)
        {
            printf("#");
        }
        printf("\n");
    }
}