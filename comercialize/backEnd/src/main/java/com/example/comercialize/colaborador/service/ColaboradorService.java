package com.example.comercialize.colaborador.service;

import com.example.comercialize.Documentos.model.Documentos;
import com.example.comercialize.Documentos.model.FileKey;
import com.example.comercialize.Documentos.service.DocumentosService;
import com.example.comercialize.Endereco.service.EnderecoService;
import com.example.comercialize.Utils.Interfaces.LocaleInteface;
import com.example.comercialize.Utils.genericClass.GenericSpecification;
import com.example.comercialize.Utils.pdf.PdfGenerator;
import com.example.comercialize.cargo.service.CargoService;
import com.example.comercialize.colaborador.DTO.ColaboradorCreateDto;
import com.example.comercialize.colaborador.DTO.ColaboradorDto;
import com.example.comercialize.colaborador.filter.FilterColaborador;
import com.example.comercialize.colaborador.model.Colaborador;
import com.example.comercialize.colaborador.repository.ColaboradorRepository;
import com.example.comercialize.empresas.DTO.EmpresaDto;
import com.example.comercialize.empresas.model.Empresa;
import com.example.comercialize.empresas.service.EmpresaService;
import com.example.comercialize.usuario.service.UsuarioService;
import javassist.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.context.MessageSource;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.util.*;

import static com.example.comercialize.Utils.genericClass.GenericSpecification.*;


@Service
@RequiredArgsConstructor
public class ColaboradorService {

    private final MessageSource messageSource;
    private final ModelMapper modelMapper;
    private final EnderecoService enderecoService;
    private final CargoService cargoService;
    private final EmpresaService empresaService;
    private final UsuarioService usuarioService;
    private final DocumentosService documentosService;
    private final ColaboradorRepository colaboradorRepository;

    public Pageable createPageableFromFiltro(@Valid FilterColaborador filtro, String OrderInitial) {
        if (Objects.isNull(filtro.getId())) {
            filtro.setId(OrderInitial);
            filtro.setDesc(true);
        }

        Sort sort = filtro.isDesc() ? Sort.by(filtro.getId()).descending() : Sort.by(filtro.getId()).ascending();
        return PageRequest.of(filtro.getPagina(), filtro.getTamanhoPagina(), sort);
    }

    @Transactional(rollbackFor = Exception.class)
    public void create(@Valid ColaboradorCreateDto colaboradorDto) throws Exception {
            Colaborador colaborador = modelMapper.map(colaboradorDto, Colaborador.class);
            if (Objects.nonNull(colaboradorDto.getFile()) && Objects.nonNull(colaboradorDto.getFile().getKey()) && !colaboradorDto.getFile().getKey().isEmpty() ) {
                colaborador.setDocumentos(documentosService.save(colaboradorDto.getFile()));
            }
            colaborador.setCargo(cargoService.findById(colaboradorDto.getCargo().getId()));
            colaborador.setEndereco(enderecoService.add(colaboradorDto.getEndereco()));
            colaboradorRepository.save(colaborador);

    }

    public Colaborador findById(@Positive @NotNull Long id) throws NotFoundException {
        Colaborador colaborador =  colaboradorRepository.findById(id).orElseThrow(() -> new NotFoundException(
                messageSource.getMessage("error.isEmpty", null, LocaleInteface.BR)
        ));
        return colaborador;
    }

    public void activeOrDisableColaborador(Long id, Integer status) throws NotFoundException {
        Colaborador colaborador = this.findById(id);
        colaborador.setStatus(status);
        colaboradorRepository.save(colaborador);
    }

    public Page<ColaboradorDto> findByPage(@Valid FilterColaborador filtro) {
        if (filtro.getId() == null || filtro.getId().isEmpty()) {
            throw new IllegalArgumentException(messageSource.getMessage("error.isEmpty", null, LocaleInteface.BR));
        }
        Pageable pageable = createPageableFromFiltro(filtro, "nome");
        if (Objects.isNull(filtro.getGlobal()) || filtro.getGlobal().isEmpty()) {
            Specification<Colaborador> specification = GenericSpecification.
                    <Colaborador>filterByProperty("nome",filtro.getNome())
                    .and(filterByProperty("sobrenome",filtro.getSobrenome()))
                    .and(filterByProperty("cpf",filtro.getCpf()))
                    .and(filterByIdWithJoin("endereco","estado",filtro.getEstado()))
                    .and(filterByProperty("cnpjEmpresa","estado",filtro.getCnpj()))
                    .and(filterByIdWithJoin("endereco","cidade" ,filtro.getCidade()))
                    .and(filterByIdWithJoin("cargo","nome" ,filtro.getCargo()))
                    .and(filterByPropertyInterger("status", filtro.getAtivo()));
            Page<Colaborador> colaboradorPage = colaboradorRepository.findAll(specification, pageable);
            if (Objects.nonNull(colaboradorPage) && !colaboradorPage.getContent().isEmpty()) {
                return colaboradorPage.map(ColaboradorDto::new);
            }
            return Page.empty();
        } else {
            Page<Colaborador> colaboradorPage = colaboradorRepository.findAll(pageable, filtro.getGlobal(), filtro.getCnpj());
            return colaboradorPage.map(ColaboradorDto::new);
        }
    }

    public void deleteColaboradorById(@NotNull @Positive Long id) throws Exception {
        Colaborador colaborador = this.findById(id);
        try {
            colaboradorRepository.deleteById(id);
            if (Objects.nonNull(colaborador.getDocumentos())) {
                documentosService.deleteById(colaborador.getDocumentos().getId(), colaborador.getDocumentos().getRoute());
            }
        } catch (Exception e) {
            throw new Exception(e);
        }
    }


    public void edit(ColaboradorCreateDto dto) throws Exception {
        try {
         Colaborador colaborador = modelMapper.map(dto,Colaborador.class);
         Documentos documentos;
            if (Objects.nonNull(dto.getFile()) && Objects.nonNull(dto.getFile().getKey()) && !dto.getFile().getKey().isEmpty() ) {
                documentos = documentosService.update(dto.getFile(), colaborador.getDocumentos());
                colaborador.setDocumentos(documentos);
            } else {
                Colaborador col =  this.findById(dto.getId());
                Long idDoc = col.getDocumentos().getId();
                String routeDoc = col.getDocumentos().getRoute();
                colaborador.setDocumentos(null);
                colaboradorRepository.save(colaborador);
                documentosService.deleteById(idDoc, routeDoc);
            }
            enderecoService.update(dto.getEndereco());
            colaboradorRepository.save(colaborador);
        } catch (DataAccessException e) {
            throw new Exception(messageSource.getMessage("error.save", null, LocaleInteface.BR),e);
        }
    }

    public ColaboradorDto getColaboradorByCpf(@NotNull @NotEmpty String cpf) {
        if (cpf.isEmpty()) {
            throw new IllegalArgumentException("CPF não pode ser vazio");
        }
        return modelMapper.map(colaboradorRepository.findByCpf(cpf),ColaboradorDto.class);
    }

    public ColaboradorCreateDto findColaboradorById(Long id) throws NotFoundException {
        Colaborador colaborador = this.findById(id);
        ColaboradorCreateDto dto = modelMapper.map(colaborador, ColaboradorCreateDto.class);
        if (Objects.nonNull(colaborador.getDocumentos())) {
            FileKey fileKey = new FileKey();
            fileKey.setKey(colaborador.getDocumentos().getRoute());
            fileKey.setName(colaborador.getDocumentos().getNome());
            dto.setFile(fileKey);
        } else {
            dto.setFile(new FileKey());
        }
        return dto;
    }

    public byte[] relatorioPagamentoColaborador(@NotEmpty String cnpj) throws Exception {
        String PATH = "colaborador/folhaPagamentoColaborador";
        try{
            List<Colaborador> colaborador = colaboradorRepository.findAllByCnpjEmpresa(cnpj);
            EmpresaDto empresa = empresaService.getEmpresaByCnpj(cnpj);
            HashMap<String, Object> obj = new HashMap<>();
            obj.put("colaborador", colaborador);
            obj.put("empresa", empresa);
            return PdfGenerator.pdf(colaborador, PATH);
        } catch (Exception e) {
            throw new Exception(e);
        }
    }
}