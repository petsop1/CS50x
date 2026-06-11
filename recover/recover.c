#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <stdbool.h>
#include <stddef.h>

#define BLOCK_SIZE 512

int main(int argc, char *argv[])
{
    // Ensure proper usage
    if (argc != 2)
    {
        printf("Usage: ./recover IMAGE\n");
        return 1;
    }

    // Open input file
    FILE *infile = fopen(argv[1], "r");
    if (infile == NULL)
    {
        printf("Could not open %s.\n", argv[1]);
        return 1;
    }

    // Basic variables and allocations
    typedef uint8_t BYTE;
    BYTE buffer[BLOCK_SIZE];
    int count = 0;
    bool file_end = false;
    char *filename = malloc(8 * sizeof(char));

    // Firs starting loop, rest beeing done in nested do-while loop
    while (fread(buffer, sizeof(BYTE), BLOCK_SIZE, infile))
    {
        // Find where jpg file startes or start is passed by the inner loop
        if (buffer[0] == 0xff && buffer[1] == 0xd8 && buffer[2] == 0xff && (buffer[3] & 0xf0) == 0xe0)
        {
            // Create a new block of memory to store filename starting at 000.jpg
            sprintf(filename, "%03i.jpg", count);

            // Open new file under the name stored at filename
            FILE *outfile = fopen(filename, "w");
            if (outfile == NULL)
            {
                printf("Could not open the file %s for writing.\n", filename);
                return 2;
            }

            // Primary loop for adding rest of the jpg file
            do
            {
                fwrite(buffer, sizeof(BYTE), BLOCK_SIZE, outfile);
                size_t bytes_read = fread(buffer, sizeof(BYTE), BLOCK_SIZE, infile);

                if (bytes_read)
                {
                    if (buffer[0] == 0xff && buffer[1] == 0xd8 && buffer[2] == 0xff && (buffer[3] & 0xf0) == 0xe0)
                    {
                        file_end = true;
                        fseek(infile, -BLOCK_SIZE, SEEK_CUR);
                    }
                    else
                    {
                        file_end = false;
                    }
                }

                // Used only for last picture
                else
                {
                    file_end = true;
                    fseek(infile, -BLOCK_SIZE, SEEK_CUR);
                    if (feof(infile))
                    {
                        fwrite(buffer, sizeof(BYTE), BLOCK_SIZE, outfile);
                        fseek(infile, -BLOCK_SIZE, SEEK_CUR);
                    }
                }
            }
            while (file_end == false);
            fclose(outfile);
            count ++;
        }
    }
    // Close and free memorey
    free(filename);
    fclose(infile);
    return 0;
}
