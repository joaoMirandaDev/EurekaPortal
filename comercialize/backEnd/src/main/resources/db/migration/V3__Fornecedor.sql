CREATE TABLE fornecedor (
  id BIGINT NOT NULL AUTO_INCREMENT,
  nome_razao_social VARCHAR(100),
  sobrenome VARCHAR(100),
  nome_fantasia VARCHAR(100),
  numero VARCHAR(100),
  data_nascimento DATE,
  cpf_cnpj VARCHAR(14) UNIQUE NOT NULL,
  rg VARCHAR(20),
  estado VARCHAR(2),
  cidade VARCHAR(100),
  cep VARCHAR(8),
  bairro VARCHAR(500),
  rua VARCHAR(200),
  email VARCHAR(100),
  telefone VARCHAR(100),
  status INTEGER NOT NULL,
  PRIMARY KEY (id)
);