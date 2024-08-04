CREATE TABLE empresas (
  id INTEGER NOT NULL AUTO_INCREMENT,
  razao_social TEXT NOT NULL,
  nome_fantasia TEXT,
  cnpj TEXT NOT NULL,
  inscricao_estadual TEXT NOT NULL,
  data_abertura DATE,
  email VARCHAR(100),
  telefone VARCHAR(100),
  ativo INTEGER,
  id_endereco INTEGER,
  cpf_responsavel TEXT NOT NULL,
  id_photo_documento INTEGER,
  PRIMARY KEY (id),
  FOREIGN KEY (id_photo_documento) REFERENCES documentos(id),
  FOREIGN KEY (id_endereco) REFERENCES endereco(id)
);

CREATE TABLE usuario (
  id INTEGER NOT NULL AUTO_INCREMENT,
  senha VARCHAR(255) NOT NULL,
  login VARCHAR(11) UNIQUE NOT NULL,
  data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_empresa INTEGER,
  FOREIGN KEY (id_empresa) REFERENCES empresas(id) ON UPDATE CASCADE ON DELETE CASCADE,
  PRIMARY KEY (id)
);



