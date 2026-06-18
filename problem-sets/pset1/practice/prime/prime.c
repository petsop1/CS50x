#include <cs50.h>
#include <stdio.h>
#include <time.h>

int main(void)
{
    int minimum;
    int maximum;

    minimum = get_int("Minimum: ");

    do
    {
        maximum = get_int("Maximum: ");
    }
    while (maximum < 3 || minimum > maximum);

    time_t start, end;
    double dif;

    time(&start);

    int i;
    int j;

    if (minimum == 1)
    {
        printf("2\n");
        printf("3\n");
    }
    else if (minimum == 2)
    {
        printf("2\n");
        printf("3\n");
    }
    else if (minimum == 3)
    {
        printf("3\n");
    }

    if (minimum >= 1 && minimum <= 4)
    {
        minimum = 5;
    }

    for (i = minimum; i <= maximum; i = i + 1)
    {
        int k = 0;
        do
        {
            // printf("k: %i\n", k);
            j = (i % (k + 3));
            k++;
            // printf("i: %i\n", i);
            // printf("x: %i\n", x);
            // printf("j: %i\n", j);
        }
        while ((k + 3) < i && j != 0);
        if (k + 3 == i)
        {
            // printf("I'm k: %i\n", k);
            printf("%i\n", i);
        }
    }
    time(&end);
    dif = difftime(end, start);
    printf ("Your calculations took %.lf seconds to run.\n", dif);
}
