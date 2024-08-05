package com.example.comercialize.Endereco.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "endereco")
public class Endereco {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id", nullable = false)
    private Long id;
    private String estado;
    @Column(columnDefinition = "TEXT")
    private String cidade;
    @Column(columnDefinition = "TEXT")
    private String cep;
    @Column(columnDefinition = "TEXT")
    private String numero;
    @Column(columnDefinition = "TEXT")
    private String bairro;
    @Column(columnDefinition = "TEXT")
    private String rua;


}
