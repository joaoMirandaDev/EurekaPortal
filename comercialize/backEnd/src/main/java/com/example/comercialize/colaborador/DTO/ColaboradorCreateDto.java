package com.example.comercialize.colaborador.DTO;

import com.example.comercialize.Documentos.model.FileKey;
import com.example.comercialize.Endereco.Dto.EnderecoDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotEmpty;
import java.util.Date;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class ColaboradorCreateDto {

    private Integer id;
    @NotEmpty
    private String nome;
    @NotEmpty
    private String sobrenome;
    private Date dataNascimento;
    private Date dataContratoInicial;
    @NotEmpty
    private String sexo;
    @NotEmpty
    private String cpf;
    @NotEmpty
    private String rg;
    @NotEmpty
    private String telefone;
    private String cargo;
    private String email;
    private Double salario;
    private FileKey file;
    private Integer ativo;
    private EnderecoDTO endereco;
}
