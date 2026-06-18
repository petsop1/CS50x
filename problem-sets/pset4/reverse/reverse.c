#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

#include "wav.h"

int check_format(WAVHEADER header);
int get_block_size(WAVHEADER header);

int main(int argc, char *argv[])
{
    // Ensure proper usage
    // TODO #1
    if (argc != 3)
    {
        printf("Usage: ./reverse input.wav output.wav\n");
        return 1;
    }

    // Open input file for reading
    // TODO #2
    FILE *infile = fopen(argv[1], "r");
    if (infile == NULL)
    {
        printf("Could not open %s.\n", argv[1]);
        return 1;
    }

    // Read header
    // TODO #3
    // Read infile's WAVHEADER
    WAVHEADER header;
    fread(&header, sizeof(WAVHEADER), 1, infile);

    // Use check_format to ensure WAV format
    // TODO #4
    check_format(header);

    // Open output file for writing
    // TODO #5
    FILE *outfile = fopen(argv[2], "w");
    if (outfile == NULL)
    {
        fclose(infile);
        printf("Could not open file.\n");
        return 1;
    }

    // Write header to file
    // TODO #6
    fwrite(&header, sizeof(WAVHEADER), 1, outfile);

    // Use get_block_size to calculate size of block
    // TODO #7
    get_block_size(header);

    // Write reversed audio to file
    // TODO #8
    int block_size = get_block_size(header);
    BYTE buffer[block_size];

    fseek(infile, -block_size, SEEK_END);
    int position = ftell(infile);

    while (position >= 44)
    {
        fread(buffer, sizeof(block_size), 1, infile);
        fwrite(buffer, sizeof(block_size), 1, outfile);
        fseek(infile, -2 * block_size, SEEK_CUR);
        position = ftell(infile);
    }
    fclose(infile);
    fclose(outfile);
}

int check_format(WAVHEADER header)
{
    // TODO #4
    if (header.format[0] == 'W' &&
        header.format[1] == 'A' &&
        header.format[2] == 'V' &&
        header.format[3] == 'E')
    {
        return 0;
    }
    else
    {
        printf("Unsupported file format.\n");
        return 2;
    }
}

int get_block_size(WAVHEADER header)
{
    // TODO #7
    return (int)(header.bitsPerSample / 8) * header.numChannels;
}