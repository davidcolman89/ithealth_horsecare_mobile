CREATE TABLE IF NOT EXISTS medicaciones (
id INTEGER PRIMARY KEY
, id_evolucion integer
, id_medicacion_tipo integer
, offline INTEGER DEFAULT 0
, fecha_creacion TEXT
)