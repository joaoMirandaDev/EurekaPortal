package com.example.portal.Modulos.DTO;

import com.example.portal.Documentos.DTO.DocumentosDTO;
import com.example.portal.Modulos.model.Modulos;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class ModulosDto {

    private Integer id;
    private String nome;
    private String url;
    private String status;
    private DocumentosDTO documentos;

    public ModulosDto(Modulos modulos) {
        this.id = modulos.getId();
        this.nome = modulos.getNome();
        this.url = modulos.getUrl();
        this.status = modulos.getStatus() == 0 ? "Ativo" : "Inativo";
    }
}
