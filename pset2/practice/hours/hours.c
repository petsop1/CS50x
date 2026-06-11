#include <cs50.h>
#include <ctype.h>
#include <stdio.h>

// Declaration of the funcition that is listed below the main function.
float calc_hours(int hours[], int weeks, char output);

// Main program that is calling function "calc_hours".
int main(void)
{
    int weeks = get_int("Number of weeks taking CS50: ");
    int hours[weeks];

    for (int i = 0; i < weeks; i++)
    {
        hours[i] = get_int("Week %i HW Hours: ", i);
    }

    char output;
    do
    {
        output = toupper(get_char("Enter T for total hours, A for average hours per week: "));
    }
    while (output != 'T' && output != 'A');

    printf("%.1f hours\n", calc_hours(hours, weeks, output));
}

// TODO: complete the calc_hours function
float calc_hours(int hours[], int weeks, char output)
{
    // Calculations
    int sum = 0;
    float avg = 0;
    for (int i = 0; i < weeks; i++)
    {
        sum = sum + hours[i];
    }

    avg = sum / (float) weeks;

    // Returning the result based on the given request from user.
    if (output == 'T')
    {
        return sum;
    }
    else
    {
        return avg;
    }
}