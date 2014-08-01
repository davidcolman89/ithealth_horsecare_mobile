CREATE TABLE IF NOT EXISTS equinos (
id INTEGER PRIMARY KEY
, nombre TEXT
, id_duenio INTEGER
, nacimiento TEXT
, obs TEXT
, offline INTEGER DEFAULT 0
, fecha_creacion TEXT
)