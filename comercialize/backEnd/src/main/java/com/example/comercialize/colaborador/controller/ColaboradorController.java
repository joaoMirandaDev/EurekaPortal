package com.example.comercialize.colaborador.controller;

import com.example.comercialize.Utils.Interfaces.LocaleInteface;
import com.example.comercialize.colaborador.DTO.ColaboradorCreateDto;
import com.example.comercialize.colaborador.DTO.ColaboradorDto;
import com.example.comercialize.colaborador.filter.FilterColaborador;
import com.example.comercialize.colaborador.service.ColaboradorService;
import io.swagger.v3.oas.annotations.Operation;
import javassist.NotFoundException;
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

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/colaborador")
public class ColaboradorController {

    private final ColaboradorService colaboradorService;
    private final MessageSource messageSource;

    @RequestMapping(value = "/create", method = RequestMethod.POST, produces = "application/json")
    @Operation(summary = "Cadastro de colaborador", description = "Metodo utilizado para cadastrar os colaboradores", tags = "Colaborador")
    public ResponseEntity<String> createNewColaborador(@Valid @RequestBody ColaboradorCreateDto colaboradorDto) throws Exception {
        colaboradorService.create(colaboradorDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(messageSource.getMessage("success.created", null, LocaleInteface.BR));
    }

    @RequestMapping(value = "/findById/{id}", method = RequestMethod.GET, produces = "application/json")
    @Operation(summary = "FindById", description = "Metodo utilizado para resgatar o colaborador por ID", tags = "Colaborador")
    public ColaboradorCreateDto findById(@Positive @NotNull @PathVariable("id") Integer id) throws NotFoundException {
        return colaboradorService.findColaboradorById(id);
    }

    @RequestMapping(value = "/deleteById/{id}", method = RequestMethod.DELETE, produces = "application/json")
    @Operation(summary = "Deletar colaborador", description = "Metodo utilizado para deletar os colaboradores", tags = "Colaborador")
    public ResponseEntity<String> deleteById(@NotNull @Positive @PathVariable("id") Integer id) {
        try {
            colaboradorService.deleteById(id);
          return ResponseEntity.ok(messageSource.getMessage("success.delete", null, LocaleInteface.BR));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(messageSource.getMessage("error.delete", null, LocaleInteface.BR));
        }
    }

    @RequestMapping(value = "/page", method = RequestMethod.POST, produces = "application/json")
    @Operation(summary = "Paginação de colaborador", description = "Metodo utilizado para buscar os colaboradores paginados", tags = "Colaborador")
    public ResponseEntity<Page<ColaboradorDto>> findAllByPage(@Valid @RequestBody FilterColaborador filtro) {
        return ResponseEntity.ok(colaboradorService.findByPage(filtro));
    }

    @PutMapping(value = "/editar", produces = "application/json")
    @Operation(summary = "Editar colaborador", description = "Metodo utilizado para editar os colaboradores por ID", tags = "Colaborador")
    public void editar(@RequestBody ColaboradorCreateDto colaboradorDto) throws Exception {
        colaboradorService.edit(colaboradorDto);
    }

    @RequestMapping(value = "/findByCpfCnpj/{cpf}", method = RequestMethod.GET, produces = "application/json")
    @Operation(summary = "getColaboradorByCpf", description = "Metodo utilizado para resgatar os colaboradores por CPF", tags = "Colaborador")
    public ColaboradorDto getColaboradorByCpf(@NotEmpty @PathVariable("cpf") String cpf) {
        return colaboradorService.getColaboradorByCpf(cpf);
    }

    @RequestMapping(value = "/activeOrDisable/{id}/{status}", method = RequestMethod.PUT, produces = "application/json")
    @Operation(summary = "Editar colaborador", description = "Metodo utilizado para ativar e desativar colaborador", tags = "Colaborador")
    public ResponseEntity<Void> activeOrDisable(@Positive @PathVariable("id") Integer id, @PositiveOrZero @PathVariable("status") Integer status) throws Exception {
        colaboradorService.activeOrDisableColaborador(id, status);
        return ResponseEntity.noContent().build();
    }

    @RequestMapping(value = "/relatorioPagamentoColaborador", method = RequestMethod.GET, produces = "application/json")
    @Operation(summary = "Gerar relatorio colaborador", description = "Metodo utilizado para gerar relatorio", tags = "Colaborador")
    public void relatorioPagamentoColaborador(HttpServletResponse response) throws Exception {

        byte[] bytes = colaboradorService.relatorioPagamentoColaborador();
        response.setContentType(MediaType.APPLICATION_PDF_VALUE);
        response.getOutputStream().write(bytes);
    }
}

