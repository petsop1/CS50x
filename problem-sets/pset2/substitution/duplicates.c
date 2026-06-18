#include <cs50.h>
#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include <stdlib.h>

int main(int argc, string argv[])
{
    int stringlength = strlen(argv[1]);
    for(int i = 0; i < stringlength; i++)
    {
        for(int j = i; j < stringlength - 1; j++)
        {
            // printf("%i %i", i, j);
            if(argv[1][i] == argv[1][j+1])
            {
                printf("Number %d has duplicate values\n",argv[1][i]);
            }
        }
    }
    return 0;
}