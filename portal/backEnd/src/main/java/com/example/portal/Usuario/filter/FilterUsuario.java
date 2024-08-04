package com.example.portal.Usuario.filter;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.PositiveOrZero;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Component
public class FilterUsuario {

    @Positive
    @NotNull
    private Integer empresa;
    private String login;
    private String userName;
    private String role;
    private Integer ativo;
    private String columnOrder;
    private boolean desc;
    @Positive
    private Integer tamanhoPagina = 10;
    @PositiveOrZero
    private Integer pagina = 0;

}
