CREATE TABLE cargo (
  id BIGINT NOT NULL AUTO_INCREMENT,
  nome TEXT NOT NULL,
  status INTEGER NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE colaborador (
  id BIGINT NOT NULL AUTO_INCREMENT,
  nome TEXT NOT NULL,
  sexo VARCHAR(50),
  sobrenome VARCHAR(100),
  data_nascimento DATE,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  data_contrato_inicial DATE,
  data_contrato_final DATE,
  rg VARCHAR(20),
  documento_id_photo BIGINT,
  salario DOUBLE,
  email VARCHAR(100),
  telefone VARCHAR(100),
  status INTEGER NOT NULL,
  id_endereco BIGINT NOT NULL,
  id_cargo BIGINT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_endereco) REFERENCES endereco(id),
  FOREIGN KEY (id_cargo) REFERENCES cargo(id),
  FOREIGN KEY (documento_id_photo) REFERENCES documentos(id)
);



