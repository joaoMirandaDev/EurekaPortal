package com.example.portal.Empresas.DTO;

import com.example.portal.Documentos.DTO.DocumentosDTO;
import com.example.portal.Documentos.model.FileKey;
import com.example.portal.Endereco.Dto.EnderecoDTO;
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
    private EnderecoDTO endereco;
    private String cpfResponsavel;
    private String telefone;
    private String email;
    private Integer ativo;
    private DocumentosDTO documentos;
    private FileKey file;
    private List<Integer> idModulos;
}
