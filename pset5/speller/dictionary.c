// Implements a dictionary's functionality

#include <ctype.h>
#include <stdbool.h>
#include <stdio.h>
#include <string.h>
#include <strings.h>
#include <stdlib.h>

#include "dictionary.h"

// Represents a node in a hash table
typedef struct node
{
    char word[LENGTH + 1];
    struct node *next;
}
node;

// Buffer to read words from table into, one by one
char new_word[LENGTH + 1];

// TODO: Choose number of buckets in hash table
// one letter N = 26, two letters N = 676, three letters N = 17576
const unsigned int N = 26;

// Hash table
node *table[N];

// Counter for words in dictionary
int counter = 0;

// Returns true if word is in dictionary, else false
bool check(const char *word)
{
    // TODO
    node *cursor = table[hash(word)];
    while (cursor != NULL)
    {
        if (strcasecmp(word, cursor->word) == 0)
        {
            return true;
        }
        cursor = cursor->next;
    }
    return false;
}

// Hashes word to a number
unsigned int hash(const char *word)
{
    // TODO: Improve this hash function
    // int sum = 0;
    // for (int i = 0; i < strlen(word); i++)
    // {
    //     sum += word[i];
    // }
    // return (sum % N);

    return (toupper(word[0]) - 'A');
}

// Loads dictionary into memory, returning true if successful, else false
bool load(const char *dictionary)
{
    // Set default pointers in hash table to NULL
    for (int i = 0; i < N; i++)
    {
        table[i] = NULL;
    }

    // Try to open dictionary
    FILE *file = fopen(dictionary, "r");
    if (file == NULL)
    {
        printf("Could not open file.\n");
        unload();
        return 1;
    }

    while (fscanf(file, "%s", new_word) != EOF)
    {
        // Keep track of the number of words beeing added to the dictionary
        counter++;

        // Allocate a new node
        node *new = malloc(sizeof(node));
        if (new == NULL)
        {
            printf("Could not allocate memory for node");
            unload();
            return 1;
        }

        // Copy new word to node and set next to null
        strcpy(new->word, new_word);
        new->next = NULL;

        unsigned int hash_number = hash(new->word);

        // Prepend node to list
        if (table[hash_number] == NULL)
        {
            table[hash_number] = new;
        }
        else
        {
            new->next = table[hash_number];
            table[hash_number] = new;
        }
    }

    // Close dictionary after use
    fclose(file);
    return true;
}

// Returns number of words in dictionary if loaded, else 0 if not yet loaded
unsigned int size(void)
{
    // TODO
    return counter;
}

// Unloads dictionary from memory, returning true if successful, else false
bool unload(void)
{
    // TODO
    // Free memory
    for (int i = 0; i < N; i++)
    {
        node *cursor = table[i];
        while (cursor != NULL)
        {
            node *tmp = cursor->next;
            free(cursor);
            cursor = tmp;
        }
    }
    return true;
}
