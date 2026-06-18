import csv
import sys

# python test.py databases/small.csv sequences/1.txt

# TODO: Check for command-line usage
if len(sys.argv) != 3:
    sys.exit("Usage: python dna.py databases sequences")

# TODO: Read database file into a variable
with open(sys.argv[1]) as file:
    reader = csv.DictReader(file)
    # database = {}
    # for row in reader:
    #     name = row.pop("name")
    #     database[name] = {key: int(value) for key, value in row.items()}
    database = [row for row in reader]
print(database)


with open(sys.argv[2]) as file:
    # reader = csv.reader(file)
    # dna_sequence = list(next(reader))
    dna_sequence = file.read()
print(f"\nDNA: {dna_sequence}")
