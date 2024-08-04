package com.example.portal.Empresas.DTO;

import com.example.portal.Documentos.model.FileKey;
import com.example.portal.Empresas.model.Empresa;
import com.example.portal.Endereco.Dto.EnderecoDTO;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Objects;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class EmpresaDto {

    private Integer id;
    private String razaoSocial;
    private String nomeFantasia;
    private String cnpj;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy", timezone="GMT-3")
    private Date dataAbertura;
    private String telefone;
    private String inscricaoEstadual;
    private String email;
    private String ativo;
    private FileKey file;
    private EnderecoDTO endereco;

    public EmpresaDto(Empresa empresa) {
        this.id = empresa.getId();
        this.razaoSocial = empresa.getRazaoSocial();
        this.nomeFantasia = empresa.getNomeFantasia();
        this.cnpj = empresa.getCnpj().replaceFirst("(\\d{2})(\\d{3})(\\d{3})(\\d{4})(\\d{2})", "$1.$2.$3/$4-$5");
        this.dataAbertura = empresa.getDataAbertura();
        this.inscricaoEstadual = empresa.getInscricaoEstadual();
        this.telefone = empresa.getTelefone();
        this.email = empresa.getEmail();
        this.ativo = empresa.getAtivo() == 0 ? "Ativo" : "Inativo";
        if (Objects.nonNull(empresa.getDocumentos())) {
            FileKey fileKey = new FileKey(empresa.getDocumentos().getNome(), empresa.getDocumentos().getRoute());
            this.file = fileKey;
        }
        this.endereco = new EnderecoDTO(empresa.getEndereco());
    }
}
