#include <cs50.h>
#include <stdio.h>

int main(void)
{
    // TODO: Prompt for start size
    int n;
    do
    {
        n = get_int("Start size: ");
    }
    while (n < 9 || n > 1000000000);

    // TODO: Prompt for end size
    int m;
    do
    {
        m = get_int("End size: ");
    }
    while (m < n || n > 1500000000);

    // TODO: Calculate number of years until we reach threshold
    int born;
    int pass;
    int year = 0;
    if (n == m)
    {
        printf("Years: 0\n");
    }
    else
    {
        do
        {
            born = n / 3;
            pass = n / 4;
            n = n + born - pass;
            year++;
        }
        while (n < m);
        printf("Years: %i\n", year);
    }
}