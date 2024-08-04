package com.example.comercialize.usuario.controller;

import com.example.comercialize.autenticacao.DTO.CredenciaisDTO;
import com.example.comercialize.autenticacao.DTO.TokenDTO;
import com.example.comercialize.usuario.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping("/auth")
    @Operation(summary = "Autenticação", description = "autenticas os usuarios", tags = "Usuario")
    public TokenDTO autenticar(@RequestBody @Valid CredenciaisDTO credenciais) throws Exception {
        return usuarioService.autenticar(credenciais);
    }
}
