CREATE TABLE IF NOT EXISTS estudios (
id INTEGER PRIMARY KEY
, id_evolucion integer
, id_estudio_tipo integer
, offline INTEGER DEFAULT 0
, fecha_creacion TEXT
)