#include <cs50.h>
#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include <stdlib.h>

// Declaration of constant or function prototypes
int const no_of_characters = 26;
bool valid_input(string argv[1]);

int main(int argc, string argv[])
{
    // Checking correctness of the input
    if (argc != 2 || valid_input(argv) != true)
    {
        printf("Usage: ./caesar key\n");
        return 1;    // Value 1 tends to signify an error and terminates the program
    }
    // Get string from user
    string plaintext = get_string("plaintext:  ");
    int length = strlen(plaintext);
    printf("ciphertext: ");
    // Substitution of the characters
    for (int i = 0; i < length; i++)
    {
        char c = plaintext[i];
        if (isupper(c))
        {
            int d = c - 65;
            printf("%c", toupper(argv[1][d]));
        }
        else if (islower(c))
        {
            int d = c - 97;
            printf("%c", tolower(argv[1][d]));
        }
        else
        {
            printf("%c", c);
        }
    }
    printf("\n");
}


// Validation of digit input
bool valid_input(string argv[1])
{
    int stringlength = strlen(argv[1]);
    int no_of_abc = 0;
    bool validation;
    int error;
    if (stringlength == no_of_characters)
    {
        for (int i = 0; i < stringlength; i++)
        {
            int c = argv[1][i];
            isalpha(c) ? no_of_abc++ :  no_of_abc;
        }
        validation = (no_of_abc == stringlength);
    }
    else
    {
        return false;
    }

    if (validation == true)
    {
        for (int i = 0; i < stringlength; i++)
        {
            for (int j = i; j < stringlength - 1; j++)
            {
                if (argv[1][i] == argv[1][j + 1])
                {
                    // printf("Number %d has duplicate values\n",argv[1][i]);
                    error = error + 1;
                }
            }
        }
    }
    else
    {
        return false;
    }

    // Printf for correctness checking
    if (validation == true & error == 0)
    {
        return true;
    }
    else
    {
        return false; // Value 1 tends to signify an error
    }
}
