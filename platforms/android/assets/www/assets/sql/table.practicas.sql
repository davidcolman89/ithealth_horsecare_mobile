CREATE TABLE IF NOT EXISTS practicas (
id INTEGER PRIMARY KEY
, id_evolucion integer
, id_practica_tipo integer
, offline INTEGER DEFAULT 0
, fecha_creacion TEXT
)