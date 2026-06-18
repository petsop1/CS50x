#include <cs50.h>
#include <stdio.h>

int main(void)
{
    // TODO
    // int a = get_string("Text: ");

    int a = get_int("a: ");
    int b = get_int("b: ");

    int result = a % b;
    int division = a / b;
    printf("(%i)%i\n", division, result);

}
