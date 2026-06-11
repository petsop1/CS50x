-- Keep a log of any SQL queries you execute as you solve the mystery.

 
 
SELECT * FROM crime_scene_reports WHERE id = 295;

SELECT * FROM interviews WHERE year = 2021 AND month = 7 AND day = 28 AND transcript LIKE "%bakery%";

SELECT * FROM bakery_security_logs WHERE year = 2021 AND month = 7 AND day = 28 AND hour BETWEEN 8 AND 10 AND minute BETWEEN 0 AND 35;

SELECT * FROM atm_transactions WHERE year = 2021 AND month = 7 AND day = 28 AND atm_location = "Leggett Street" AND transaction_type = "withdraw";

SELECT * FROM people WHERE id IN (
    SELECT person_id FROM bank_accounts WHERE account_number IN (
        SELECT account_number FROM atm_transactions WHERE (
            year = 2021 AND month = 7 AND day = 28 AND atm_location = "Leggett Street" AND transaction_type = "withdraw"
        )
    )
);


SELECT * FROM people WHERE id IN (
    SELECT person_id FROM bank_accounts WHERE account_number IN (
        SELECT account_number FROM atm_transactions WHERE (
            year = 2021 AND month = 7 AND day = 28 AND atm_location = "Leggett Street" AND transaction_type = "withdraw"
        )
    )
);

SELECT * FROM phone_calls WHERE year = 2021 AND month = 7 AND day = 28 AND duration < 60;

SELECT * FROM flights WHERE origin_airport_id IN (
    SELECT id FROM airports WHERE city = "Fiftyville"
)
ORDER BY day, hour, minute;

SELECT * FROM airports WHERE id = 4;

SELECT * FROM passengers WHERE flight_id = 36;

SELECT * FROM people WHERE