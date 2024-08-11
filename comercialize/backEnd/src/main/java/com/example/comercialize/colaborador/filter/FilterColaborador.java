package com.example.comercialize.colaborador.filter;

import lombok.*;
import org.springframework.stereotype.Component;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.PositiveOrZero;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Component
public class FilterColaborador {
    @NotEmpty
    private String id;
    private boolean desc;
    @Positive
    private Integer tamanhoPagina = 10;
    @PositiveOrZero
    private Integer pagina = 0;
    private String nome;
    private String sobrenome;
    @NotEmpty
    @NotNull
    private String cnpj;
    private String estado;
    private String cidade;
    private String cpf;
    private Integer ativo;
    private String cargo;


    public FilterColaborador(String id, boolean desc, int tamanhoPagina, int pagina) {
        this.id = id;
        this.desc = desc;
        this.tamanhoPagina = tamanhoPagina;
        this.pagina = pagina;
    }

    public FilterColaborador(String id, boolean desc, int tamanhoPagina, int pagina, String nome) {
        this.id = id;
        this.desc = desc;
        this.tamanhoPagina = tamanhoPagina;
        this.pagina = pagina;
        this.nome = nome;
    }

}
