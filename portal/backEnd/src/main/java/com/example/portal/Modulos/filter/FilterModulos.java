package com.example.portal.Modulos.filter;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

import javax.validation.constraints.Positive;
import javax.validation.constraints.PositiveOrZero;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Component
public class FilterModulos {

    private String columnOrder;
    private boolean desc;
    @Positive
    private Integer tamanhoPagina = 10;
    @PositiveOrZero
    private Integer pagina = 0;
    private String nome;
    private String url;
    private Integer status;


}
