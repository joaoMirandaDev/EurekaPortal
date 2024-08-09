INSERT INTO portal.roles
(name)
VALUES ('CEO'), ('VENDEDOR'), ('ASSISTENCIA');

DELETE FROM portal.roles
WHERE name = 'PROPRIETARIO';
