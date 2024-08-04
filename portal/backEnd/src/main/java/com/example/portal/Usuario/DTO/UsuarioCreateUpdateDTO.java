package com.example.portal.Usuario.DTO;

import com.example.portal.Empresas.DTO.EmpresaDto;
import com.example.portal.Role.DTO.RoleDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioCreateUpdateDTO {

    private Integer id;
    @NotEmpty
    @NotNull
    private String login;
    @NotEmpty
    @NotNull
    private String senha;
    @NotEmpty
    @NotNull
    private String userName;
    @NotNull
    private RoleDTO role;
    @NotNull
    private EmpresaDto empresa;

}
