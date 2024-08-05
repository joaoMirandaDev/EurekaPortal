package com.example.comercialize.Endereco.controller;

import com.example.comercialize.Endereco.service.EnderecoService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@NoArgsConstructor
@RestController
@RequestMapping("/api/endereco/")
@Slf4j
public class EnderecoController {


    @Autowired
    private EnderecoService enderecoService;

    public EnderecoController(EnderecoService enderecoService) {
        this.enderecoService = enderecoService;
    }

    @GetMapping("findByRegiao/{cep}")
    @Operation(summary = "Busca CEP", description = "Metodo utilizado para buscar via CEP", tags = "Endereco")
    public Object findByRegiao(@PathVariable String cep) throws IOException {
        return enderecoService.findByRegiao(cep);
    }

}

