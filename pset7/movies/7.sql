-- In 7.sql, write a SQL query to list all movies released in 2010 and their ratings, in descending order by rating.
-- For movies with the same rating, order them alphabetically by title.

SELECT movies.title, ratings.rating
FROM movies
JOIN ratings ON movies.id = ratings.movie_id
WHERE movies.year = 2010
ORDER BY ratings.rating DESC, movies.title ASC;

-- Or better succinct version can be written like:
-- SELECT m.title, r.rating
-- FROM movies m
-- JOIN ratings r ON m.id = r.movie_id
-- WHERE m.year = 2010
-- ORDER BY r.rating DESC, m.title ASC;