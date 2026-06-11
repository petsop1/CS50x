# TODO Mario less - sentimental :)
from cs50 import get_int

# Get the integer in range 1 - 8, both included
height = get_int("Height: ")
while (height not in range(1, 9)):
    height = get_int("Height: ")

# 1. Approach one - with print function!
# for i in range(height):
#     print(" " * (height -1 - i), end = "")
#     print("#" * (i + 1), end = "")
#     print("  ", end = "")
#     print("#" * (i + 1), end = "")
#     print("")


# 2. Approach with nested loops
# for i in range(height):
#     for j in range(height - i - 1):
#         print(" ", end="")
#     for k in range(i + 1):
#         print("#", end="")
#     print("  ", end="")
#     for l in range(i + 1):
#         print("#", end="")
#     print("")

# 3. Approach with string concatenation
for i in range(height):
    print(" " * (height - i - 1) + "#" * (i + 1) + "  " + "#" * (i + 1))
