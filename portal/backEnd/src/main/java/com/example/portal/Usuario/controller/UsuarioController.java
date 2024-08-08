package com.example.portal.Usuario.controller;


import com.example.portal.autenticacao.DTO.CredenciaisDTO;
import com.example.portal.autenticacao.DTO.TokenDTO;
import com.example.portal.Empresas.model.Empresa;
import com.example.portal.Empresas.service.EmpresaService;
import com.example.portal.Usuario.DTO.UsuarioCreateUpdateDTO;
import com.example.portal.Usuario.DTO.UsuarioDTO;
import com.example.portal.Usuario.filter.FilterUsuario;
import com.example.portal.Usuario.model.Usuario;
import com.example.portal.autenticacao.config.securityJwt.JwtService;
import com.example.portal.Usuario.services.UsuarioService;
import com.example.portal.Utils.Interfaces.LocaleInteface;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.PositiveOrZero;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final MessageSource messageSource;
    private final EmpresaService empresaService;
    private final JwtService jwtService;

    @PostMapping("/create")
    @Operation(summary = "Create", description = "Criar usuário", tags = "Usuario")
    public ResponseEntity create(@RequestBody @Valid UsuarioCreateUpdateDTO dto) {
        try {
            Empresa empresa = empresaService.findById(dto.getEmpresa().getId());
            usuarioService.create(dto, empresa);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(messageSource.getMessage("success.created", null, LocaleInteface.BR));
        } catch (Exception e) {
            throw e;
        }
    }

    @GetMapping("/findById/{id}")
    @Operation(summary = "FindById", description = "Resgastar os usuarios por ID", tags = "Usuario")
    public Usuario findById(@PathVariable Integer id) {
        return usuarioService.findById(id);
    }

    @GetMapping("/findByLogin/{login}")
    @Operation(summary = "FindByLogin", description = "Resgastar os usuarios por login", tags = "Usuario")
    public UsuarioDTO findByLogin(@PathVariable String login) {
        return usuarioService.findByLogin(login);
    }

    @PostMapping("/auth")
    @Operation(summary = "Autenticação", description = "autenticas os usuarios", tags = "Usuario")
    public TokenDTO autenticar(@RequestBody CredenciaisDTO credenciais){
        try{
            Usuario usuario = Usuario.builder()
                    .login(credenciais.getLogin())
                    .senha(credenciais.getSenha()).build();
            usuarioService.autenticar(credenciais);
            String token = jwtService.gerarToken(usuario);
            return new TokenDTO(usuario.getLogin(), token);
        } catch (Exception e ){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }
    }

    @GetMapping("/validatorUser/{token}")
    @Operation(summary = "Validar Token", description = "Metodo utilizado para validar Token", tags = "Usuario")
    public boolean userValidator(@PathVariable("token") String token) {
        return  jwtService.tokenValido(token);
    }

    @RequestMapping(value = "/page", method = RequestMethod.POST, produces = "application/json")
    @Operation(summary = "Paginação", description = "Paginação dos usuarios", tags = "Usuario")
    public ResponseEntity<Page<UsuarioDTO>> findAllByPage(@RequestBody @Valid FilterUsuario filtro){
        Empresa empresa = empresaService.findById(filtro.getEmpresa());
        return ResponseEntity.ok(usuarioService.findAllUserByEmpresaAndPage(filtro, empresa));
    }

    @RequestMapping(value = "/activeOrDisable/{id}/{status}", method = RequestMethod.PUT, produces = "application/json")
    @Operation(summary = "Ativar e desativar usuario", description = "Metodo utilizado para ativar e desativar usuario", tags = "Usuario")
    public ResponseEntity<Void> activeOrDisable(@Positive @PathVariable("id") Integer id, @PositiveOrZero @PathVariable("status") Integer status) throws Exception {
        usuarioService.activeOrDesactive(id, status);
        return ResponseEntity.noContent().build();
    }

    @RequestMapping(value = "/deleteById/{id}", method = RequestMethod.DELETE, produces = "application/json")
    @Operation(summary = "Deletar usuário", description = "Metodo utilizado para deletar usuário", tags = "Usuario")
    public ResponseEntity<Void> deleteById(@NotNull @Positive @PathVariable("id") Integer id) {
        usuarioService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @RequestMapping(value = "/edit", method = RequestMethod.PUT, produces = "application/json")
    @Operation(summary = "Editar usuário", description = "Metodo utilizado para editar usuário", tags = "Usuario")
    public ResponseEntity<Void> deleteById(@RequestBody @Valid UsuarioCreateUpdateDTO dto) {
        usuarioService.update(dto);
        return ResponseEntity.noContent().build();
    }
}
