package com.example.comercialize.Documentos.model;


import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "documentos")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Documentos {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(name = "nome", columnDefinition = "TEXT")
    private String nome;

    @Column(nullable = false, unique = true, columnDefinition = "TEXT")
    private String route;

    @Column(name = "status")
    private Integer status;

}