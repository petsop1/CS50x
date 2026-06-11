import csv
import requests


def main():
    # Read NYTimes Covid Database
    download = requests.get(
        "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv"
    )
    decoded_content = download.content.decode("utf-8")
    file = decoded_content.splitlines()
    reader = csv.DictReader(file)

    # Construct 14 day lists of new cases for each states
    new_cases = calculate(reader)

    # Create a list to store selected states
    states = []
    print("Choose one or more states to view average COVID cases.")
    print("Press enter when done.\n")

    while True:
        state = input("State: ")
        if state in new_cases:
            states.append(state)
        if len(state) == 0:
            break

    print(f"\nSeven-Day Averages")

    # Print out 7-day averages for this week vs last week
    comparative_averages(new_cases, states)


# TODO: Create a dictionary to store 14 most recent days of new cases by state
def calculate(reader):
    rows = list(reader)
    # list_of_states = []
    cumulative_cases = {}
    new_cases = {}
    for row in reversed(rows):
        actual_state = row["state"]
        actual_cases = int(row["cases"])
        if actual_state not in cumulative_cases:
            # list_of_states.append(actual_state)
            cumulative_cases[actual_state] = [actual_cases]
            new_cases[actual_state] = []
        elif len(new_cases[actual_state]) < 14:
            x = cumulative_cases[actual_state][0] - actual_cases
            cumulative_cases[actual_state] = [actual_cases]
            new_cases[actual_state].append(x)
    return new_cases


# TODO: Calculate and print out seven day average for given state
def comparative_averages(new_cases, states):
    for state in states:
        actual_list = new_cases[state]
        avg_first_half = round(sum(actual_list[:7]) / 7)
        avg_second_half = round(sum(actual_list[7:]) / 7)

        try:
            avg_second_half / avg_first_half
        except ZeroDivisionError:
            print(f"Error: Cannot divide by zero.")

        percentage = abs(round((1 - avg_second_half / avg_first_half) * 100))

        if percentage < 0:
            sign = "decrease of"
        elif percentage > 0:
            sign = "increase of"
        else:
            sign = "increase/decrease remained unchanged compared to previous week of"

        print(f"{state} had a 7-day average of {avg_first_half} and a {sign} {percentage}%.")

    # print(list_of_states)
    # print("cumulative_cases\n\n", cumulative_cases)
    # print("new_cases\n\n", new_cases)


main()
