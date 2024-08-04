package com.example.comercialize.usuario.service;
import com.example.comercialize.autenticacao.DTO.CredenciaisDTO;
import com.example.comercialize.autenticacao.DTO.TokenDTO;
import com.example.comercialize.empresas.service.EmpresaService;
import com.example.comercialize.usuario.infra.UsuarioResourceClient;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return null;
    }
}
