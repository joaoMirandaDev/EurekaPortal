package com.example.comercialize.empresas.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class EmpresaCreateDto {


    private Integer id;
    private String razaoSocial;
    private String nomeFantasia;
    private String inscricaoEstadual;
    private String cnpj;
    private Date dataAbertura;
    private String cpfResponsavel;
    private String telefone;
    private String email;
    private Integer ativo;
    private List<Integer> idModulos;
}
