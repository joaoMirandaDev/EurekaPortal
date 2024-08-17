package com.example.portal.Empresas.service;

import com.example.portal.Empresas.DTO.EmpresaCreateDto;
import com.example.portal.Empresas.filter.FilterEmpresa;
import com.example.portal.Documentos.model.FileKey;
import com.example.portal.Documentos.service.DocumentosService;
import com.example.portal.Documentos.service.PdfGenerator;
import com.example.portal.Endereco.service.EnderecoService;
import com.example.portal.Modulos.model.Modulos;
import com.example.portal.Modulos.service.ModulosService;
import com.example.portal.Usuario.DTO.UsuarioDTO;
import com.example.portal.Usuario.model.Usuario;
import com.example.portal.Usuario.services.UsuarioService;
import com.example.portal.Utils.genericClass.GenericSpecification;
import com.example.portal.Utils.Interfaces.LocaleInteface;
import com.example.portal.Utils.exceptions.NotFoundException;
import com.example.portal.Empresas.DTO.EmpresaDto;
import com.example.portal.Empresas.model.Empresa;
import com.example.portal.Empresas.repository.EmpresaRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static com.example.portal.Utils.genericClass.GenericSpecification.*;

@Service
@RequiredArgsConstructor
public class EmpresaService {

    private final MessageSource messageSource;
    private final DocumentosService documentosService;
    @Autowired
    private final UsuarioService usuarioService;
    private final ModelMapper modelMapper;
    private final ModulosService modulosService;
    private final EnderecoService enderecoService;
    private final EmpresaRepository empresaRepository;

    public Pageable createPageableFromFiltro(@Valid FilterEmpresa filtro, String OrderInitial) {
        if (Objects.isNull(filtro.getColumnOrder())) {
            filtro.setColumnOrder(OrderInitial);
            filtro.setDesc(true);
        }

        Sort sort = filtro.isDesc() ? Sort.by(filtro.getColumnOrder()).descending() : Sort.by(filtro.getColumnOrder()).ascending();
        return PageRequest.of(filtro.getPagina(), filtro.getTamanhoPagina(), sort);
    }

    @Transactional(rollbackFor = Exception.class)
    public void create(@Valid EmpresaCreateDto dto) throws Exception {
        Empresa empresa = modelMapper.map(dto, Empresa.class);
        if (!dto.getIdModulos().isEmpty() && Objects.nonNull(dto.getIdModulos())) {
            List<Modulos> list = new ArrayList<>();
            for (Integer idModulo : dto.getIdModulos()) {
                Modulos modulos = modulosService.findById(idModulo);
                list.add(modulos);
            }
            empresa.setModulos(list);
        }
        empresa.setEndereco(enderecoService.add(dto.getEndereco()));
        if (Objects.nonNull(dto.getFile().getKey()) && !dto.getFile().getKey().isEmpty()) {
            empresa.setDocumentos(documentosService.save(dto.getFile()));
        }
        empresaRepository.save(empresa);
    }

    public Empresa findById(@Positive @NotNull Integer id) {
        Empresa empresa =  empresaRepository.findById(id).orElseThrow(() -> new NotFoundException(
                messageSource.getMessage("error.isEmpty", null, LocaleInteface.BR)
        ));
        return empresa;
    }

    public void activeOrDisable(Integer id, Integer status) {
        Empresa empresa = this.findById(id);
        empresa.setAtivo(status);
        List<Usuario> usuarios = usuarioService.usuariosByEmpresa(empresa.getId());
        usuarios.forEach(obj -> usuarioService.activeOrDesactive(obj.getId(), empresa.getAtivo()));
        empresaRepository.save(empresa);
    }

    public Page<EmpresaDto> findByPage(@Valid FilterEmpresa filtro) {
        if (filtro.getColumnOrder() == null || filtro.getColumnOrder().isEmpty()) {
            throw new IllegalArgumentException(messageSource.getMessage("error.isEmpty", null, LocaleInteface.BR));
        }
        Pageable pageable = createPageableFromFiltro(filtro, "razaoSocial");
        Specification<Empresa> specification = GenericSpecification.
                <Empresa>filterByProperty("razaoSocial",filtro.getRazaoSocial())
                .and(filterByProperty("nomeFantasia",filtro.getNomeFantasia()))
                .and(filterByProperty("cnpj",filtro.getCnpj()))
                .and(filterByIdWithJoin("endereco","estado",filtro.getEstado()))
                .and(filterByIdWithJoin("endereco","cidade" ,filtro.getCidade()))
                .and(filterByPropertyInterger("ativo", filtro.getAtivo()));
        Page<Empresa> colaboradorPage = empresaRepository.findAll(specification, pageable);
        if (Objects.nonNull(colaboradorPage) && !colaboradorPage.getContent().isEmpty()) {
            return colaboradorPage.map(EmpresaDto::new);
        }
        return Page.empty();
    }

    public void deleteById(@NotNull @Positive Integer id) throws IOException {
        Empresa empresa = this.findById(id);
        if (Objects.nonNull(empresa)) {
            empresaRepository.deleteById(id);
            enderecoService.deteteById(empresa.getEndereco());
            documentosService.delete(empresa.getDocumentos());
        } else {
            throw new RuntimeException(messageSource.getMessage("erro.invalid.result.baseData", null, LocaleInteface.BR));
        }
    }

    public void edit(EmpresaCreateDto dto) throws Exception {
        try {
            Empresa empresa = modelMapper.map(dto, this.findById(dto.getId()).getClass()) ;
            if (Objects.nonNull(dto.getFile()) && Objects.nonNull(dto.getFile().getKey()) && !dto.getFile().getKey().isEmpty() ) {
                empresa.setDocumentos(documentosService.update(dto.getFile(), empresa.getDocumentos()));
            }
            if (!dto.getIdModulos().isEmpty() && Objects.nonNull(dto.getIdModulos())) {
                List<Modulos> list = new ArrayList<>();
                for (Integer idModulo : dto.getIdModulos()) {
                    Modulos modulos = modulosService.findById(idModulo);
                    list.add(modulos);
                }
                empresa.setModulos(list);
            }
            enderecoService.update(dto.getEndereco());
            empresaRepository.save(empresa);
        } catch (DataAccessException e) {
            throw new Exception(messageSource.getMessage("error.save", null, LocaleInteface.BR),e);
        }
    }

    public EmpresaDto findByCnpj(@NotNull @NotEmpty String cnpj) {
        if (cnpj.isEmpty()) {
            throw new IllegalArgumentException("CNPJ não pode ser vazio");
        }
        return modelMapper.map(empresaRepository.findByCnpj(cnpj), EmpresaDto.class);
    }

    public EmpresaCreateDto findEmpresaById(Integer id) {
        Empresa empresa = this.findById(id);
       List<Integer> listId = empresa.getModulos().stream().map(obj -> obj.getId()).collect(Collectors.toList());
        EmpresaCreateDto dto = modelMapper.map(empresa, EmpresaCreateDto.class);
        dto.setIdModulos(listId);
        if (Objects.nonNull(empresa.getDocumentos())) {
            FileKey fileKey = new FileKey();
            fileKey.setKey(empresa.getDocumentos().getRoute());
            fileKey.setName(empresa.getDocumentos().getNome());
            dto.setFile(fileKey);
        } else {
            dto.setFile(new FileKey());
        }
        return dto;
    }
    
    public byte[] relatorioPagamentoColaborador() throws Exception {
        String PATH = "relatorioEmpresas";
        List<Empresa> empresa = empresaRepository.findAllByAtivo();
        List<EmpresaDto> dto = empresa.stream().map(EmpresaDto::new).collect(Collectors.toList());
        return PdfGenerator.pdf(dto, PATH);
    }

    public void getStatusEmpresaByCpfUser(String login) {
        UsuarioDTO usuario = usuarioService.findByLogin(login);
        if (usuario.getEmpresaDto().getAtivo().equals("Inativo")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
    }
}