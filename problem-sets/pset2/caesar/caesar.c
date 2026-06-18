#include <cs50.h>
#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include <stdlib.h>

int const no_of_characters = 26;

// Declaration or prototypes of function
bool valid_input(string argv[1]);
char rotate(char c, int key);

int main(int argc, string argv[1])
{
    // Checking correctness of the input
    if (argc != 2 || valid_input(argv) != true)
    {
        printf("Usage: ./caesar key\n");
        return 1;    // Value 1 tends to signify an error and terminates the program
    }
    // Rotation of the alphabetical characters
    string plaintext = get_string("plaintext:  ");
    int text_length = strlen(plaintext);
    printf("ciphertext: ");
    for (int i = 0; i < text_length; i++)
    {
        char c = plaintext[i];
        int key = atoi(argv[1]);
        if (isupper(c))
        {
            c = c - 65;
            c = rotate(c, key) + 65;
            printf("%c", c);
        }
        else if (islower(c))
        {
            c = c - 97;
            c = rotate(c, key) + 97;
            printf("%c", c);
        }
        else
        {
            printf("%c", c);
        }
    }
    printf("\n");
}

// Rotation of the characters
char rotate(char c, int key)
{
    char new_char = (c + key) % no_of_characters;
    // printf("%c, %i, %c\n", c, key, new_char);
    return new_char;
}

// Validation of digit input
bool valid_input(string argv[1])
{
    int stringlength = strlen(argv[1]);
    int  no_of_digits = 0;
    for (int i = 0; i < stringlength; i++)
    {
        int c = argv[1][i];
        isdigit(c) ? no_of_digits++ :  no_of_digits;
    }
    // Printf for correctness checking
    // printf("%i %i\n", no_of_digits, stringlength);
    if (no_of_digits == stringlength)
    {
        return true;
    }
    else
    {
        return false; // Value 1 tends to signify an error
    }
}
