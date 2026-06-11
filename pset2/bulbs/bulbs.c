#include <cs50.h>
#include <stdio.h>
#include <string.h>

const int BITS_IN_BYTE = 8;

void print_bulb(int bit);

int main(void)
{
    // TODO
    string text = get_string("Text: ");
    int length = strlen(text);

    for (int i = 0; i < length; i++)
    {
        int c = text[i];
        // printf("%i\n", c);
        // General vaiables
        int j = 0;
        int modulo;
        int arr[BITS_IN_BYTE];
        // Calculating zeroes and ones
        do
        {
            modulo = c % 2;
            c = c / 2;
            // printf("%i %i\n", j, modulo);
            j++;
            arr[BITS_IN_BYTE - j] = modulo;
        }
        while (j < BITS_IN_BYTE);
        // Printing reversed array made above
        for (int k = 0; k < BITS_IN_BYTE; k++)
        {
            print_bulb(arr[k]);
        }
        printf("\n");
    }
}

void print_bulb(int bit)
{
    if (bit == 0)
    {
        // Dark emoji
        printf("\U000026AB");
    }
    else if (bit == 1)
    {
        // Light emoji
        printf("\U0001F7E1");
    }
}
