import csv
import sys

# python dna.py databases/large.csv sequences/1.txt


def main():

    # TODO: Check for command-line usage
    if len(sys.argv) != 3:
        sys.exit("Usage: python dna.py databases sequences")

    # TODO: Read database file into a variable
    with open(sys.argv[1]) as file:
        reader = csv.DictReader(file)
        database = {}
        for row in reader:
            name = row.pop("name")
            database[name] = {key: int(value) for key, value in row.items()}

            # database = [row for row in reader]    -   more better and straight way solution considering the syntax simplicity

    names = list(database.keys())
    # names2 = [key for key in database]  # Alternative way to obtain names
    keys = [key for key in database[next(iter(database))]]
    # keys2 = [key for key in database["Albus"]]  # Alternative way to obtain keys

    # print("\ndatabase:",database)
    # print("\nnames:", names)
    # print("\nkeys:", keys)

    # TODO: Read DNA sequence file into a variable
    with open(sys.argv[2]) as file:
        reader = csv.reader(file)
        dna_sequence = list(next(reader))  # Function next reads the first and only row

        # dna_sequence = file.read()    -> or this approach should be used, simple store as a text, no csv lib. used

    # print("dna_sequence:",dna_sequence)
    # print(len(dna_sequence[0]))

    # TODO: Find longest match of each STR in DNA sequence
    final_values = []
    for i in keys:
        number = longest_match(dna_sequence[0], i)
        final_values.append(number)
    # print("final_values:", final_values)

    # TODO: Check database for matching profiles
    for person, values in database.items():
        if all(values[key] == final_values[i] for i, key in enumerate(keys)):
            print(f"{person}")
            return
    else:
        print(f"No match")


def longest_match(sequence, subsequence):
    """Returns length of longest run of subsequence in sequence."""

    # Initialize variables
    longest_run = 0
    subsequence_length = len(subsequence)
    sequence_length = len(sequence)

    # Check each character in sequence for most consecutive runs of subsequence
    for i in range(sequence_length):

        # Initialize count of consecutive runs
        count = 0

        # Check for a subsequence match in a "substring" (a subset of characters) within sequence
        # If a match, move substring to next potential match in sequence
        # Continue moving substring and checking for matches until out of consecutive matches
        while True:

            # Adjust substring start and end
            start = i + count * subsequence_length
            end = start + subsequence_length

            # If there is a match in the substring
            if sequence[start:end] == subsequence:
                count += 1

            # If there is no match in the substring
            else:
                break

        # Update most consecutive matches found
        longest_run = max(longest_run, count)

    # After checking for runs at each character in seqeuence, return longest run found
    return longest_run


main()
