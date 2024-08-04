package com.example.portal.Modulos.model;

import com.example.portal.Documentos.model.Documentos;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "modulos")
public class Modulos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotEmpty
    @Column(columnDefinition = "TEXT", nullable = false)
    private String nome;
    @Column(columnDefinition = "TEXT", nullable = false)
    private String url;
    private Integer status;
    @OneToOne
    @JoinColumn(name = "id_photo_documento", referencedColumnName = "id")
    private Documentos documentos;
}
