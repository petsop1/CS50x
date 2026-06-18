#include "helpers.h"
#include <math.h>

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


// Convert image to sepia
void sepia(int height, int width, RGBTRIPLE image[height][width])
{
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            int sepia_red = (int)round(image[i][j].rgbtBlue * 0.189 + image[i][j].rgbtGreen * 0.769 + image[i][j].rgbtRed * 0.393);
            int sepia_green = (int)round(image[i][j].rgbtBlue * 0.168 + image[i][j].rgbtGreen * 0.686 + image[i][j].rgbtRed * 0.349);
            int sepia_blue = (int)round(image[i][j].rgbtBlue * 0.131 + image[i][j].rgbtGreen * 0.534 + image[i][j].rgbtRed * 0.272);

            // If any of colors higher in value than 255, cap applyied
            sepia_red > 255 ? sepia_red = 255 : sepia_red;
            sepia_green > 255 ? sepia_green = 255 : sepia_green;
            sepia_blue > 255 ? sepia_blue = 255 : sepia_blue;

            // Printing picture with calculated values
            image[i][j].rgbtBlue = sepia_blue;
            image[i][j].rgbtGreen = sepia_green;
            image[i][j].rgbtRed = sepia_red;
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
