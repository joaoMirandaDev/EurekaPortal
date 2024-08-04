package com.example.portal.Usuario.model;

import com.example.portal.Empresas.model.Empresa;
import com.example.portal.Role.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.time.LocalDateTime;


@Entity
@AllArgsConstructor
@Data
@NoArgsConstructor
@Builder
@Table(name = "usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(unique = true, nullable = false)
    @NotEmpty(message = "{campo.login.obrigatorio}")
    private String login;
    @Column(nullable = false)
    @NotEmpty(message = "{campo.senha.obrigatorio}")
    private String senha;
    @NotEmpty(message = "{campo.senha.obrigatorio}")
    @Column(columnDefinition = "TEXT", nullable = false, unique = true)
    private String userName;
    private LocalDateTime dataCadastro;
    @OneToOne
    @JoinColumn(name = "role", referencedColumnName = "id")
    private Role role;
    @OneToOne
    @JoinColumn(name = "id_empresa", referencedColumnName = "id")
    private Empresa empresa;
    private Integer ativo;

    public Usuario(String login, String senha) {
        this.login = login;
        this.senha = senha;
    }
}
