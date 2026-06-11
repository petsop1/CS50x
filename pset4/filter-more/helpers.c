#include "helpers.h"
#include "math.h"

// Convert image to grayscale
void grayscale(int height, int width, RGBTRIPLE image[height][width])
{
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            // 3.0 was necessary because of dividing integers leaves residual
            int avg_color = round((image[i][j].rgbtBlue + image[i][j].rgbtGreen + image[i][j].rgbtRed) / 3.0);
            image[i][j].rgbtBlue = avg_color;
            image[i][j].rgbtGreen = avg_color;
            image[i][j].rgbtRed = avg_color;
        }
    }
    return;
}

// Reflect image horizontally
void reflect(int height, int width, RGBTRIPLE image[height][width])
{
    for (int i = 0; i < height; i++)
    {
        for (int j = 0, k = width - 1; j < width / 2; j++)
        {
            // Temporary value used when swaping columns
            RGBTRIPLE temp = image[i][j];
            image[i][j] = image[i][k - j];
            image[i][k - j] = temp;
        }
    }
    return;
}

// Blur image
void blur(int height, int width, RGBTRIPLE image[height][width])
{
// Definition of pixel spread for bluring
#define BLUR_RADIUS 1

    // Necessary temporary RGBTRIPLE image holder so it doesnt overwrite pixels on the fly
    RGBTRIPLE imageTemp[height][width];

    for (int y = 0; y < height; y++)
    {
        for (int x = 0; x < width; x++)
        {
            int total_red = 0;
            int total_green = 0;
            int total_blue = 0;
            int count = 0;

            for (int i = -BLUR_RADIUS; i <= BLUR_RADIUS; i++)
            {
                for (int j = -BLUR_RADIUS; j <= BLUR_RADIUS; j++)
                {
                    int xtest = x + j;
                    int ytest = y + i;

                    if (ytest >= 0 && ytest < height && xtest >= 0 && xtest < width)
                    {
                        total_blue += image[ytest][xtest].rgbtBlue;
                        total_green += image[ytest][xtest].rgbtGreen;
                        total_red += image[ytest][xtest].rgbtRed;
                        count++;
                    }
                }
            }
            // Calculating color of pixel using casting of count to get correct values not affected with dividing with integers
            imageTemp[y][x].rgbtBlue = round(total_blue / (float)count);
            imageTemp[y][x].rgbtGreen = round(total_green / (float)count);
            imageTemp[y][x].rgbtRed = round(total_red / (float)count);
        }
    }

    // Transfering pixels from temporary to final bmp file
    for (int y = 0; y < height; y++)
    {
        for (int x = 0; x < width; x++)
        {
            image[y][x] = imageTemp[y][x];
        }
    }
    return;
}

// Detect edges
void edges(int height, int width, RGBTRIPLE image[height][width])
{
// Definition of pixel spread for edges, it is a constant, cosidering limited gx and gy
#define EDGES 1

    int gx [3][3] =
    {
        {-1, 0, 1},
        {-2, 0, 2},
        {-1, 0, 1}
    };

    int gy [3][3] =
    {
        {-1, -2, -1},
        {0, 0, 0},
        {1, 2, 1}
    };
// Alternative definition of matrix
// int gx [3][3] = { {-1, 0, 1}, {-2, 0, 2}, {-1, 0, 1} };

    // Necessary temporary RGBTRIPLE image holder so it doesnt overwrite pixels on the fly
    RGBTRIPLE imageTemp[height][width];

    for (int y = 0; y < height; y++)
    {
        for (int x = 0; x < width; x++)
        {
            int gx_red = 0;
            int gx_green = 0;
            int gx_blue = 0;
            int gy_red = 0;
            int gy_green = 0;
            int gy_blue = 0;

            for (int i = -EDGES; i <= EDGES; i++)
            {
                for (int j = -EDGES; j <= EDGES; j++)
                {
                    int xtest = x + j;
                    int ytest = y + i;

                    // If in range of pixels
                    if (ytest >= 0 && ytest < height && xtest >= 0 && xtest < width)
                    {
                        gx_blue += image[ytest][xtest].rgbtBlue * gx[i + 1][j + 1];
                        gx_green += image[ytest][xtest].rgbtGreen * gx[i + 1][j + 1];
                        gx_red += image[ytest][xtest].rgbtRed * gx[i + 1][j + 1];

                        gy_blue += image[ytest][xtest].rgbtBlue * gy[i + 1][j + 1];
                        gy_green += image[ytest][xtest].rgbtGreen * gy[i + 1][j + 1];
                        gy_red += image[ytest][xtest].rgbtRed * gy[i + 1][j + 1];
                    }
                }
            }
            
            // Calculating color of pixel using casting of count to get correct values not affected with dividing with integers
            imageTemp[y][x].rgbtBlue = fmin(255, round(sqrt(pow(gx_blue, 2) + pow(gy_blue, 2))));
            imageTemp[y][x].rgbtGreen = fmin(255, round(sqrt(pow(gx_green, 2) + pow(gy_green, 2))));
            imageTemp[y][x].rgbtRed = fmin(255, round(sqrt(pow(gx_red, 2) + pow(gy_red, 2))));
        }
    }

    // Transfering pixels from temporary to final bmp file
    for (int y = 0; y < height; y++)
    {
        for (int x = 0; x < width; x++)
        {
            image[y][x] = imageTemp[y][x];
        }
    }
    return;
}
