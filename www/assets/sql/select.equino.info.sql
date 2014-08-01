SELECT equinos.id AS 'equino_id'
, equinos.nombre AS 'equino_nombre'
, clientes.nombre AS 'duenio_nombre'
FROM equinos
INNER JOIN  clientes ON equinos.id_duenio = clientes.id
WHERE equinos.id = ?
ORDER BY equinos.nombre ASC