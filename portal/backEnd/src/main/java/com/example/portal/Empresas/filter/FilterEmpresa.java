package com.example.portal.Empresas.filter;

import lombok.*;
import org.springframework.stereotype.Component;

import javax.validation.constraints.Positive;
import javax.validation.constraints.PositiveOrZero;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Component
public class FilterEmpresa {

    private String columnOrder;
    private boolean desc;
    @Positive
    private Integer tamanhoPagina = 10;
    @PositiveOrZero
    private Integer pagina = 0;
    private String razaoSocial;
    private String nomeFantasia;
    private String cnpj;
    private Integer ativo;
    private String estado;
    private String cidade;

}
