package com.example.portal.Empresas.controller;

import com.example.portal.Empresas.DTO.EmpresaCreateDto;
import com.example.portal.Empresas.filter.FilterEmpresa;
import com.example.portal.Utils.Interfaces.LocaleInteface;
import com.example.portal.Empresas.DTO.EmpresaDto;
import com.example.portal.Empresas.service.EmpresaService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.PositiveOrZero;
import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/empresa")
public class EmpresaController {

    private final EmpresaService empresaService;
    private final MessageSource messageSource;

    @RequestMapping(value = "/create", method = RequestMethod.POST, produces = "application/json")
    @Operation(summary = "Cadastro de empresa", description = "Metodo utilizado para cadastrar as empresas", tags = "Empresa")
    public ResponseEntity<String> create(@Valid @RequestBody EmpresaCreateDto empresaCreateDto) throws Exception {
        empresaService.create(empresaCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(messageSource.getMessage("success.created", null, LocaleInteface.BR));
    }

    @RequestMapping(value = "/findById/{id}", method = RequestMethod.GET, produces = "application/json")
    @Operation(summary = "FindById", description = "Metodo utilizado para resgatar o empresa por ID", tags = "Empresa")
    public EmpresaCreateDto findById(@Positive @NotNull @PathVariable("id") Integer id) {
        return empresaService.findEmpresaById(id);
    }

    @RequestMapping(value = "/deleteById/{id}", method = RequestMethod.DELETE, produces = "application/json")
    @Operation(summary = "Deletar empresa", description = "Metodo utilizado para deletar as empresa", tags = "Empresa")
    public ResponseEntity<Void> deleteById(@NotNull @Positive @PathVariable("id") Integer id) {
        try {
            empresaService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @RequestMapping(value = "/page", method = RequestMethod.POST, produces = "application/json")
    @Operation(summary = "Paginação de empresa", description = "Metodo utilizado para buscar os empresa paginados", tags = "Empresa")
    public ResponseEntity<Page<EmpresaDto>> findAllByPage(@Valid @RequestBody FilterEmpresa filtro) {
        return ResponseEntity.ok(empresaService.findByPage(filtro));
    }

    @PutMapping(value = "/editar", produces = "application/json")
    @Operation(summary = "Editar empresa", description = "Metodo utilizado para editar os empresa por ID", tags = "Empresa")
    public void editar(@RequestBody EmpresaCreateDto empresaCreateDto) throws Exception {
        empresaService.edit(empresaCreateDto);
    }

    @RequestMapping(value = "/findByCnpj/{cnpj}", method = RequestMethod.GET, produces = "application/json")
    @Operation(summary = "Busca as empresas por CNPJ", description = "Metodo utilizado para resgatar os empresa por CNPJ", tags = "Empresa")
    public EmpresaDto findByCpfCnpj(@NotEmpty @PathVariable("cnpj") String cnpj) {
        return empresaService.findByCnpj(cnpj);
    }

    @RequestMapping(value = "/activeOrDisable/{id}/{status}", method = RequestMethod.PUT, produces = "application/json")
    @Operation(summary = "Ativar e desativar a empresa", description = "Metodo utilizado para ativar e desativar empresa", tags = "Empresa")
    public ResponseEntity<Void> activeOrDisable(@Positive @PathVariable("id") Integer id, @PositiveOrZero @PathVariable("status") Integer status) throws Exception {
        empresaService.activeOrDisable(id, status);
        return ResponseEntity.noContent().build();
    }

    @RequestMapping(value = "/relatorio", method = RequestMethod.GET, produces = "application/json")
    @Operation(summary = "Gerar relatorio empresa", description = "Metodo utilizado para gerar relatorio", tags = "Empresa")
    public void relatorioPagamento(HttpServletResponse response) throws Exception {
        byte[] bytes = empresaService.relatorioPagamentoColaborador();
        response.setContentType(MediaType.APPLICATION_PDF_VALUE);
        response.getOutputStream().write(bytes);
    }

    @RequestMapping(value = "/status/{login}", method = RequestMethod.POST, produces = "application/json")
    @Operation(summary = "Status da empresa", description = "Verifica Status da empresa por login do usuario", tags = "Empresa")
    public void statusEmpresaByCpfUser(@NotEmpty @PathVariable("login") String login) {
        empresaService.getStatusEmpresaByCpfUser(login);
    }
}

