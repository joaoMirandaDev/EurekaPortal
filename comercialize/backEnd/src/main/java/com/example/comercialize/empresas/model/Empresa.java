package com.example.comercialize.empresas.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Empresa {


    private Integer id;
    private String razaoSocial;
    private String nomeFantasia;
    private String cnpj;
    private Date dataAbertura;
    private String inscricaoEstadual;
    private String telefone;
    private String email;
    private Integer ativo;
    private String cpfResponsavel;

}
