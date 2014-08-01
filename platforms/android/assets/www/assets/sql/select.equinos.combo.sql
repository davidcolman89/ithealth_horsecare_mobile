SELECT id AS 'value'
, nombre AS 'text'
FROM equinos
WHERE id_duenio = ?
ORDER BY nombre ASC