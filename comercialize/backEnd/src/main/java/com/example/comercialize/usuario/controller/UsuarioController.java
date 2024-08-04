package com.example.comercialize.usuario.controller;

import com.example.comercialize.autenticacao.DTO.CredenciaisDTO;
import com.example.comercialize.autenticacao.DTO.TokenDTO;
import com.example.comercialize.autenticacao.securityJwt.JwtService;
import com.example.comercialize.usuario.DTO.UsuarioDTO;
import com.example.comercialize.usuario.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final JwtService jwtService;

    @PostMapping("/auth")
    @Operation(summary = "Autenticação", description = "autenticas os usuarios", tags = "Usuario")
    public TokenDTO autenticar(@RequestBody @Valid CredenciaisDTO credenciais) throws Exception {
        return usuarioService.autenticar(credenciais);
    }

    @GetMapping("/findByLogin/{login}")
    @Operation(summary = "FindByLogin", description = "Resgastar os usuarios por login", tags = "Usuario")
    public UsuarioDTO findByLogin(@PathVariable String login) {
        return usuarioService.findByLogin(login);
    }

    @GetMapping("/validatorUser/{token}")
    @Operation(summary = "Validar Token", description = "Metodo utilizado para validar Token", tags = "Usuario")
    public boolean userValidator(@PathVariable String token) {
        return  jwtService.tokenValido(token);
    }

}
