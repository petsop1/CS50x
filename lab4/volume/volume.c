// Modifies the volume of an audio file

#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

// Number of bytes in .wav header
const int HEADER_SIZE = 44;

int main(int argc, char *argv[])
{
    // Check command-line arguments
    if (argc != 4)
    {
        printf("Usage: ./volume input.wav output.wav factor\n");
        return 1;
    }

    // Create variables
    uint8_t header[HEADER_SIZE];
    int16_t buffer[2];
    float factor = atof(argv[3]);

    // Open files and determine scaling factor
    FILE *input = fopen(argv[1], "r");
    if (input == NULL)
    {
        printf("Could not open file.\n");
        return 1;
    }

    FILE *output = fopen(argv[2], "w");
    if (output == NULL)
    {
        fclose(input);
        printf("Could not open file.\n");
        return 1;
    }

    // TODO: Copy header from input file to output file
    fread(header, sizeof(uint8_t), HEADER_SIZE, input);
    fwrite(header, sizeof(uint8_t), HEADER_SIZE, output);

    fseek(input, 44, SEEK_SET);
    fseek(output, 44, SEEK_SET);

    // TODO: Read samples from input file and write updated data to output file
    while (fread(buffer, sizeof(int16_t), 2, input) == 2)
    {
        buffer[0] = buffer[0] * factor;
        buffer[1] *= factor;
        fwrite(buffer, sizeof(int16_t), 2, output);
    }

    // Close files
    fclose(input);
    fclose(output);

    return 0;
}
