package com.example.comercialize.usuario.infra;

import com.example.comercialize.autenticacao.DTO.CredenciaisDTO;
import com.example.comercialize.autenticacao.DTO.TokenDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;


@FeignClient(value = "msportal", path = "/api/usuarios")
public interface UsuarioResourceClient {

    @RequestMapping(value = "/auth", method = RequestMethod.POST, produces = "application/json")
    public TokenDTO auth(@RequestBody CredenciaisDTO credenciais);

}
