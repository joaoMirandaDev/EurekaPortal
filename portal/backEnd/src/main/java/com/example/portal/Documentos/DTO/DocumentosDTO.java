package com.example.portal.Documentos.DTO;


import com.example.portal.Documentos.model.Documentos;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

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

    public DocumentosDTO(Documentos documentos) {
    }
}