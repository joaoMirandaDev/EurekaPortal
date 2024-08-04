package com.example.portal.Modulos.DTO;

import com.example.portal.Documentos.DTO.DocumentosDTO;
import com.example.portal.Documentos.model.FileKey;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.PositiveOrZero;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ModulosCreateDto {

    private Integer id;
    @NotEmpty
    private String nome;
    @NotEmpty
    private String url;
    @PositiveOrZero
    private Integer status;
    private DocumentosDTO documentos;
    private FileKey file;

}
