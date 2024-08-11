package com.example.comercialize.colaborador.DTO;

import com.example.comercialize.Documentos.DTO.DocumentosDTO;
import com.example.comercialize.Documentos.model.FileKey;
import com.example.comercialize.Endereco.Dto.EnderecoDTO;
import com.example.comercialize.cargo.DTO.CargoDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotEmpty;
import java.util.Date;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class ColaboradorCreateDto {

    private Long id;
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
    @NotEmpty
    private String cnpjEmpresa;
    private CargoDto cargo;
    private String email;
    private Double salario;
    private FileKey file;
    private Integer status;
    private EnderecoDTO endereco;
    private DocumentosDTO documentos;
}
