#include <cs50.h>
#include <stdio.h>
#include <ctype.h>
#include <string.h>
#include <math.h>

// Function prototypes or declarations
int count_letters(string text);
int count_words(string text);
int count_sentences(string text);

int main(void)
{
    // Getting user input
    string text = get_string("Text: ");
    printf("%s\n", text);
    // Calling functions
    int letters = count_letters(text);
    int words = count_words(text);
    int sentences = count_sentences(text);
    // Index calculation
    float L = (letters * 100 / (float) words);
    float S = (sentences * 100 / (float) words);
    float index = 0.0588 * L - 0.296 * S - 15.8;
    printf("L: %f\n", L);
    printf("S: %f\n", S);
    printf("Grade %f\n", index);
    if (round(index) < 1)
    {
        printf("Before Grade 1\n");
    }
    else if (round(index) > 16)
    {
        printf("Grade 16+\n");
    }
    else
    {
        printf("Grade %0.f\n", round(index));
    }
}

int count_letters(string text)
{
    // Definition of local counters
    int length = strlen(text);
    int letters = 0;
    // Checking if character is alphabetical
    for (int i = 0; i < length; i++)
    {
        char c = text[i];
        isalpha(c) ? letters++ : letters;
    }
    printf("%i letters\n", letters);
    return letters;
}

int count_words(string text)
{
    // Definition of local counters
    int length = strlen(text);
    int words = 1;
    // Checking if character is alphabetical
    for (int i = 0; i < length; i++)
    {
        char c = text[i];
        c == ' ' ? words++ : words;
    }
    printf("%i words\n", words);
    return words;
}

int count_sentences(string text)
{
    // Definition of local counters
    int length = strlen(text);
    int sentences = 0;
    // Checking if character is alphabetical
    for (int i = 0; i < length; i++)
    {
        char c = text[i];
        c == '!' ? sentences++ : sentences;
        c == '?' ? sentences++ : sentences;
        c == '.' ? sentences++ : sentences;
    }
    printf("%i sentences\n", sentences);
    return sentences;
}