package com.example.comercialize.usuario.service;
import com.example.comercialize.autenticacao.DTO.CredenciaisDTO;
import com.example.comercialize.autenticacao.DTO.TokenDTO;
import com.example.comercialize.empresas.service.EmpresaService;
import com.example.comercialize.role.interfaces.RolesInterface;
import com.example.comercialize.usuario.DTO.UsuarioDTO;
import com.example.comercialize.usuario.infra.UsuarioResourceClient;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UsuarioService implements UserDetailsService {

    private final UsuarioResourceClient resourceClient;
    private final EmpresaService empresaService;

    public TokenDTO autenticar(CredenciaisDTO dto) throws Exception {
        try {
            empresaService.statusEmpresaByCpfUser(dto.getLogin());
            TokenDTO tokenDTO = resourceClient.auth(dto);
            return tokenDTO;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }
    }

    @Override
    public UserDetails loadUserByUsername(String login) {
        UsuarioDTO usuario = resourceClient.findByLogin(login);
        String[] roles = new String[]{};
        if(usuario.getRole().getName().equals(RolesInterface.ADMIN)) {
            roles  = new String[]{RolesInterface.ADMIN};
        } else if(usuario.getRole().getName().equals(RolesInterface.PROPRIETARIO)) {
            roles =  new String[]{RolesInterface.PROPRIETARIO};
        } else if (usuario.getRole().getName().equals(RolesInterface.CAIXA)) {
            roles = new String[]{RolesInterface.CAIXA};
        }  else if (usuario.getRole().getName().equals(RolesInterface.PORTAL)) {
            roles = new String[]{RolesInterface.PORTAL};
        }

        return User
                .builder()
                .username(usuario.getLogin())
                .password(usuario.getSenha())
                .roles(roles)
                .build();
    }

    public UsuarioDTO findByLogin(String login) {
        return resourceClient.findByLogin(login);
    }
}
