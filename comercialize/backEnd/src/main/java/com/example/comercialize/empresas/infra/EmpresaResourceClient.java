package com.example.comercialize.empresas.infra;

import com.example.comercialize.autenticacao.DTO.CredenciaisDTO;
import com.example.comercialize.autenticacao.DTO.TokenDTO;
import com.example.comercialize.empresas.DTO.EmpresaDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;


@FeignClient(value = "msportal", path = "/api/empresa")
public interface EmpresaResourceClient {

    @RequestMapping(value = "/status/{login}", method = RequestMethod.POST, produces = "application/json")
    void statusEmpresaByCpfUser(@NotNull @NotEmpty @PathVariable("login") String login);

    @RequestMapping(value = "/findByCnpj/{cnpj}", method = RequestMethod.GET, produces = "application/json")
    EmpresaDto findByCnpj(@NotNull @NotEmpty @PathVariable("cnpj")  String cnpj);
}
