package com.example.comercialize.Endereco.Dto;

import com.example.comercialize.Endereco.model.Endereco;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EnderecoDTO{
    private Long id;
    private String estado;
    private String cidade;
    private String cep;
    private String numero;
    private String bairro;
    private String rua;

    public EnderecoDTO(Endereco endereco) {
        this.estado = endereco.getEstado();
        this.cidade = endereco.getCidade();
        this.cep = endereco.getCep();
        this.numero = endereco.getNumero();
        this.bairro = endereco.getBairro();
        this.rua = endereco.getRua();
    }
}
