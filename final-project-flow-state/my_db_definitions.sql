
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    user_email TEXT NOT NULL UNIQUE,
    derived_name TEXT NOT NULL,
    initials TEXT NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,
    user_role TEXT NOT NULL DEFAULT 'user',
    color TEXT NOT NULL,
    last_activity TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    theme TEXT NOT NULL DEFAULT 'light',
    verified INTEGER NOT NULL DEFAULT 0
);


-- NOTE that last_activity is stored in UTC time, so best practice is to convert it to local time when displaying it to the user!!!!!!!!!
-- If you're using a database system that doesn't support a boolean data type (like SQLite), you can use an integer and store 
    -- 1 for true and 
    -- 0 for false.


CREATE UNIQUE INDEX index_users_on_username ON users (user_email);
