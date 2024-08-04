package com.example.comercialize.usuario.infra;

import com.example.comercialize.autenticacao.DTO.CredenciaisDTO;
import com.example.comercialize.autenticacao.DTO.TokenDTO;
import com.example.comercialize.usuario.DTO.UsuarioDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;


@FeignClient(value = "msportal", path = "/api/usuarios")
public interface UsuarioResourceClient {

    @RequestMapping(value = "/auth", method = RequestMethod.POST, produces = "application/json")
    public TokenDTO auth(@RequestBody CredenciaisDTO credenciais);

    @RequestMapping(value = "/findByLogin/{login}", method = RequestMethod.GET, produces = "application/json")
    public UsuarioDTO findByLogin(@NotEmpty @NotNull @PathVariable("login") String login);

}
