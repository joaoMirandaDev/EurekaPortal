package com.example.portal.Modulos.controller;

import com.example.portal.Modulos.DTO.ModulosCreateDto;
import com.example.portal.Modulos.DTO.ModulosDto;
import com.example.portal.Modulos.DTO.ModulosListDto;
import com.example.portal.Modulos.filter.FilterModulos;
import com.example.portal.Modulos.service.ModulosService;
import com.example.portal.Utils.Interfaces.LocaleInteface;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import java.util.List;

import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/modulos")
public class ModulosController {

    private final ModulosService empresaService;
    private final MessageSource messageSource;

    @RequestMapping(value = "/create", method = RequestMethod.POST, produces = "application/json")
    @Operation(summary = "Cadastro de modulos", description = "Metodo utilizado para cadastrar os modulos", tags = "Modulos")
    public ResponseEntity<String> create(@Valid @RequestBody ModulosCreateDto dto) throws Exception {
        empresaService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(messageSource.getMessage("success.created", null, LocaleInteface.BR));
    }

    @RequestMapping(value = "/page", method = RequestMethod.POST, produces = "application/json")
    @Operation(summary = "Paginação de modulos", description = "Metodo utilizado para buscar os modulos paginados", tags = "Modulos")
    public ResponseEntity<Page<ModulosDto>> findAllByPage(@Valid @RequestBody FilterModulos filtro) {
        return ResponseEntity.ok(empresaService.findByPage(filtro));
    }

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    @Operation(summary = "Listagem de modulos", description = "Metodo utilizado para buscar os modulos listados", tags = "Modulos")
    public ResponseEntity<List<ModulosListDto>> findAll() {
        return ResponseEntity.ok(empresaService.listModulos());
    }
}

