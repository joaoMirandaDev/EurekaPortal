CREATE TABLE documentos (
  id BIGINT NOT NULL AUTO_INCREMENT,
  usuario_id INTEGER,
  nome TEXT,
  route TEXT NOT NULL,
  status INTEGER NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE hibernate_sequence (
    next_val BIGINT
);
INSERT INTO hibernate_sequence VALUES(1);

CREATE TABLE endereco (
    id BIGINT NOT NULL AUTO_INCREMENT,
    estado VARCHAR(2),
    cidade TEXT,
    cep TEXT,
    numero TEXT,
    bairro TEXT,
    rua TEXT,
    PRIMARY KEY (id)
);

