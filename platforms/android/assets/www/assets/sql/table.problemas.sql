CREATE TABLE IF NOT EXISTS problemas (
id INTEGER PRIMARY KEY
, id_equino INTEGER
, id_dolencia INTEGER
, id_estado INTEGER
, offline INTEGER DEFAULT 0
, fecha_creacion TEXT
)