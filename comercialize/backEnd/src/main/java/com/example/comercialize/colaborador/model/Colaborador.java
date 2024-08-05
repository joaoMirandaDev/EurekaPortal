package com.example.comercialize.colaborador.model;

import com.example.comercialize.Documentos.model.Documentos;
import com.example.comercialize.Endereco.model.Endereco;
import com.example.comercialize.cargo.model.Cargo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.util.Date;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "colaborador")
public class Colaborador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotEmpty
    @Column(columnDefinition = "TEXT", nullable = false)
    private String nome;
    private String sobrenome;
    private Date dataNascimento;
    private Date dataContratoInicial;
    private Date dataContratoFinal;
    private String sexo;
    @NotEmpty
    @Column(unique = true, nullable = false)
    private String cpf;
    @Column(unique = true, nullable = false)
    private String rg;
    @OneToOne
    @JoinColumn(name = "id_endereco", referencedColumnName = "id")
    private Endereco endereco;
    private String telefone;
    private String email;
    private Integer status;
    @OneToOne
    @JoinColumn(name = "documento_id_photo", referencedColumnName = "id")
    private Documentos documentos;
    @OneToOne
    @JoinColumn(name = "id_cargo", referencedColumnName = "id")
    private Cargo cargo;
    private Double salario;

    public Colaborador(Long id, String nome) {
        this.id = id;
        this.nome = nome;
    }
}
