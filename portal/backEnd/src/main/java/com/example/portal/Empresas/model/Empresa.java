package com.example.portal.Empresas.model;

import com.example.portal.Documentos.model.Documentos;
import com.example.portal.Endereco.model.Endereco;
import com.example.portal.Modulos.model.Modulos;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.util.Date;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "empresas")
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotEmpty
    @Column(columnDefinition = "TEXT", nullable = false)
    private String razaoSocial;
    @Column(columnDefinition = "TEXT", nullable = false)
    private String nomeFantasia;
    @NotEmpty
    @Column(columnDefinition = "TEXT", nullable = false, unique = true)
    private String cnpj;
    private Date dataAbertura;
    @Column(columnDefinition = "TEXT", nullable = false, unique = true)
    private String inscricaoEstadual;
    @OneToOne
    @JoinColumn(name = "id_endereco", referencedColumnName = "id")
    private Endereco endereco;
    private String telefone;
    private String email;
    private Integer ativo;
    @NotEmpty
    @Column(columnDefinition = "TEXT", nullable = false, unique = true)
    private String cpfResponsavel;
    @OneToOne
    @JoinColumn(name = "id_photo_documento", referencedColumnName = "id")
    private Documentos documentos;

    @OneToMany
    @JoinTable(name = "rel_modulos_empresa",
            joinColumns = @JoinColumn(name = "id_empresa", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "id_modulo", referencedColumnName = "id")
    )
    private List<Modulos> modulos;

}
