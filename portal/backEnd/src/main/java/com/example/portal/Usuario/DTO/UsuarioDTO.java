package com.example.portal.Usuario.DTO;

import com.example.portal.Empresas.DTO.EmpresaDto;
import com.example.portal.Empresas.model.Empresa;
import com.example.portal.Role.DTO.RoleDTO;
import com.example.portal.Role.model.Role;
import com.example.portal.Usuario.model.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Component
public class UsuarioDTO {
    private Integer id;
    private String login;
    private String senha;
    private LocalDateTime dataCadastro;
    private RoleDTO role;
    private String userName;
    private String ativo;
    private EmpresaDto empresaDto;

    public UsuarioDTO(Integer id, String login , Role role, Empresa empresa) {
        this.id = id;
        this.login = login;
        this.role = new RoleDTO(role.getId(), role.getName());
        this.empresaDto = new EmpresaDto(empresa);
    }

    public UsuarioDTO(Integer id, Role role) {
        this.id = id;
        this.role = new RoleDTO(role.getId(), role.getName());
    }

    public UsuarioDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.login = usuario.getLogin().replaceFirst("(\\d{3})(\\d{3})(\\d{3})(\\d{2})", "$1.$2.$3-$4");
        this.userName = usuario.getUserName();
        this.senha = usuario.getSenha();
        this.role = new RoleDTO(usuario.getRole());
        this.dataCadastro = usuario.getDataCadastro();
        this.ativo = usuario.getAtivo() == 0 ? "Ativo" : "Inativo";
        this.empresaDto = new EmpresaDto(usuario.getEmpresa());
    }

}
