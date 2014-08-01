CREATE TABLE IF NOT EXISTS evoluciones (
id INTEGER PRIMARY KEY
, id_problema INTEGER
, fecha TEXT
, id_lugar INTEGER
, obs TEXT
, offline INTEGER DEFAULT 0
, fecha_creacion TEXT
)