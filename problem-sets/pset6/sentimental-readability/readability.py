# TODO

from cs50 import get_string


def main():
    # Get user input
    text = get_string("Text: ")

    # Get a calls
    letters = count_letters(text)
    words = count_words(text)
    sentences = count_sentences(text)

    # Index calculation
    L = (letters * 100.0 / words)
    S = (sentences * 100.0 / words)
    index = round(0.0588 * L - 0.296 * S - 15.8)

    # Sort
    if index < 1:
        print("Before Grade 1")
    elif index > 16:
        print("Grade 16+")
    else:
        print(f"Grade {index:.0f}")


def count_letters(text):
    # Check if character is alphabetical
    return sum(1 for char in text if char.isalpha())


def count_words(text):
    # Checks for spaces
    return len(text.split())


def count_sentences(text):
    return sum(1 for char in text if char in ".!?")


if __name__ == "__main__":
    main()
