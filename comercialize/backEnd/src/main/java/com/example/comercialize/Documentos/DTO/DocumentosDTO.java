package com.example.comercialize.Documentos.DTO;


import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@RequiredArgsConstructor
public class DocumentosDTO {

    private Integer id;

    private String nome;

    private String route;

    public DocumentosDTO(Integer id, String nome) {
        this.id = id;
        this.nome = nome;
    }
}