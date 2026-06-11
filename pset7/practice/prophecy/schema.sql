sqlite3 roster.db
.schema
SELECT * FROM students;

CREATE TABLE students (
    id INTEGER,
    student_name TEXT,
    house TEXT,
    head TEXT,
    PRIMARY KEY(id)
);
CREATE TABLE houses (
    id INTEGER NOT NULL,
    house TEXT NOT NULL,
    head TEXT NOT NULL,
    PRIMARY KEY(id)
);
CREATE TABLE assignments (
    id INTEGER,
    student_id INTEGER,
    house_id INTEGER,
    PRIMARY KEY(id)
    -- not necessary to do it with foreign keys, hence it is actually
    --  not necessary, used as well it is causing DROP TABLE issues
    -- FOREIGN KEY(student_id) REFERENCES students(id),
    -- FOREIGN KEY(house_id) REFERENCES houses(id)
);

houses = {"Gryffindor": "Minerva McGonagall",
          "Slytherin": "Severus Snape",
          "Hufflepuff": "Pomona Sprout",
          "Ravenclaw": "Filius Flitwick",
}

-- Some creapy syntax
DELETE FROM houses
WHERE id =  (
    SELECT id
    FROM houses
    ORDER BY id DESC
    LIMIT 1
);

SELECT * FROM houses ORDER BY id DESC;
SELECT * FROM students;
SELECT * FROM houses;
SELECT * FROM assignments;

DELETE FROM assignments;

-- Deletes delete only one row instead of five.
-- This behavior occurs because the subquery
-- (SELECT id FROM houses ORDER BY id DESC LIMIT 5)
-- is selecting the IDs of the five rows but is used
-- with the equality operator (=), which expects a single value.
DELETE FROM houses WHERE id = (SELECT id FROM houses ORDER BY id DESC LIMIT 5);
-- This works as expected because of the IN keyword
DELETE FROM houses WHERE id IN (SELECT id FROM houses ORDER BY id DESC LIMIT 4);


-- CREATE a new table of studentsbut without column house and head
CREATE TABLE new_students (
    id INTEGER,
    student_name TEXT,
    PRIMARY KEY(id)
);

INSERT INTO new_students (id, student_name)
SELECT id, student_name
FROM students;

DROP TABLE students;
ALTER TABLE new_students RENAME TO students;

