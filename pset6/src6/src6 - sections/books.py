books = []

# Add three books to your shelf
for i in range(3):
    book = dict()
    book["title"] = input("Title: ")
    book["author"] = input("Author: ")

    books.append(book)

# Print book titles
for book in books:
    print(book["title"])