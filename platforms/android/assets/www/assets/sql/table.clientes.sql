CREATE TABLE IF NOT EXISTS clientes (
id INTEGER PRIMARY KEY
,nombre TEXT
, id_lugar INTEGER
, offline INTEGER DEFAULT 0
, fecha_creacion TEXT
)