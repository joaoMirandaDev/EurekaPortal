package com.example.comercialize.usuario.model;

import com.example.comercialize.role.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@AllArgsConstructor
@Data
@NoArgsConstructor
@Builder
public class Usuario {

    private Integer id;
    private String login;
    private String senha;
    private String userName;
    private LocalDateTime dataCadastro;
    private Role role;
    private Integer ativo;

    public Usuario(String login, String senha) {
        this.login = login;
        this.senha = senha;
    }
}
