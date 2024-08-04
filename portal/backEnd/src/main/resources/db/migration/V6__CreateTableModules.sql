CREATE TABLE modulos (
  id INTEGER NOT NULL AUTO_INCREMENT,
  nome TEXT NOT NULL,
  url TEXT NOT NULL,
  status INTEGER,
  id_photo_documento INTEGER,
  FOREIGN KEY (id_photo_documento) REFERENCES documentos(id),
  PRIMARY KEY (id)
);

CREATE TABLE rel_modulos_empresa(
    id INTEGER NOT NULL AUTO_INCREMENT,
    id_empresa INT NOT NULL,
    id_modulo INT NOT NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresas(id),
    FOREIGN KEY (id_modulo) REFERENCES modulos(id),
    PRIMARY KEY (id)
);

