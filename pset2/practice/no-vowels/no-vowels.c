// Get practice with strings, command line and switch.

#include <cs50.h>
#include <stdio.h>
#include <string.h>

// Declaration of function.
string replace(string argv[1]);

// Main program.
int main(int argc, string argv[1])
{
    // Error message if no two inputs.
    if (argc != 2)
    {
        printf("no-vowels word\n");
        return 1;    // Value 1 tends to signify an error.
    }
    // If input is ok, calling function and printing new word.
    printf("%s\n", replace(argv));
    return 0;
}

// This function will change specific vowels to numbers.
string replace(string argv[1])
{
    int stringlength = strlen(argv[1]);
    for (int i = 0; i < stringlength; i++)
    {
        switch (argv[1][i])
        {
            case 'a':
                argv[1][i] = '6';
                break;
            case 'e':
                argv[1][i] = '3';
                break;
            case 'i':
                argv[1][i] = '1';
                break;
            case 'o':
                argv[1][i] = '0';
                break;
        }
    }
    // Function is returning new word
    return argv[1];
}