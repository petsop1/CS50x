import csv
from cs50 import SQL


def main():
    # print(houses())
    assignments()


# Iterate over CSV file and fill houses table
def houses():
    # Open database
    db = SQL("sqlite:///roster.db") 
    with open("students.csv", "r") as file:
        reader = csv.DictReader(file)
        houses = []
        for row in reader:
            house = {"house": row["house"], "head": row["head"]}
            if house not in houses:
                houses.append(house)
                db.execute("INSERT INTO houses (house, head) VALUES (?, ?)", row["house"], row["head"])
    return houses


def assignments():
    db = SQL("sqlite:///roster.db")
    students_id = db.execute("SELECT id, house FROM students")
    house_id = db.execute("SELECT id, house FROM houses")
    for student in students_id:
        for house in house_id:
            if student["house"] == house["house"]:
                house_id_value = house["id"]
                break
        db.execute("INSERT INTO assignments (student_id, house_id) VALUES (?, ?)", student["id"], house_id_value)

# print function for debugging
    # print(students_id)
    # print("\n")
    # print(house_id)


if __name__ == "__main__":
    main()
