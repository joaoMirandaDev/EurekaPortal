package com.example.portal.Modulos.service;

import com.example.portal.Documentos.service.DocumentosService;
import com.example.portal.Modulos.DTO.ModulosCreateDto;
import com.example.portal.Modulos.DTO.ModulosDto;
import com.example.portal.Modulos.DTO.ModulosListDto;
import com.example.portal.Modulos.filter.FilterModulos;
import com.example.portal.Modulos.model.Modulos;
import com.example.portal.Modulos.repository.ModulosRepository;
import com.example.portal.Utils.Interfaces.LocaleInteface;
import com.example.portal.Utils.exceptions.NotFoundException;
import com.example.portal.Utils.genericClass.GenericSpecification;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.Valid;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static com.example.portal.Utils.genericClass.GenericSpecification.*;

@Service
@RequiredArgsConstructor
public class ModulosService {

    private final ModulosRepository modulosRepository;
    private final DocumentosService documentosService;
    private final ModelMapper modelMapper;
    private final MessageSource messageSource;

    public Pageable createPageableFromFiltro(@Valid FilterModulos filtro, String OrderInitial) {
        if (Objects.isNull(filtro.getColumnOrder())) {
            filtro.setColumnOrder(OrderInitial);
            filtro.setDesc(true);
        }

        Sort sort = filtro.isDesc() ? Sort.by(filtro.getColumnOrder()).descending() : Sort.by(filtro.getColumnOrder()).ascending();
        return PageRequest.of(filtro.getPagina(), filtro.getTamanhoPagina(), sort);
    }

    private List<Modulos> findAll() {
        return modulosRepository.findAll();
    }


    @Transactional(rollbackFor =  Exception.class)
    public void create(ModulosCreateDto dto) throws Exception {
        Modulos modulos = modelMapper.map(dto, Modulos.class);
        if (Objects.nonNull(dto.getFile().getKey())) {
            modulos.setDocumentos(documentosService.save(dto.getFile()));
        }
        modulosRepository.save(modulos);

    }

    public Page<ModulosDto> findByPage(FilterModulos filtro) {
        if (filtro.getColumnOrder() == null || filtro.getColumnOrder().isEmpty()) {
            throw new IllegalArgumentException(messageSource.getMessage("error.isEmpty", null, LocaleInteface.BR));
        }
        Pageable pageable = createPageableFromFiltro(filtro, "nome");
        Specification<Modulos> specification = GenericSpecification.
                <Modulos>filterByProperty("nome",filtro.getNome())
                .and(filterByProperty("url", filtro.getUrl()))
                .and(filterByPropertyInterger("status", filtro.getStatus()));
        Page<Modulos> modulosPage = modulosRepository.findAll(specification, pageable);
        if (Objects.nonNull(modulosPage) && !modulosPage.getContent().isEmpty()) {
            return modulosPage.map(ModulosDto::new);
        }
        return Page.empty();
    }

    public List<ModulosListDto> listModulos() {
        try {
            List<Modulos> modulos = this.findAll();
            return  modulos.stream().map((element) -> modelMapper.map(element, ModulosListDto.class)).collect(Collectors.toList());
        } catch (Exception e) {
            throw e;
        }
    }

    public Modulos findById(Integer id) {
     return   modulosRepository.findById(id).orElseThrow(() -> new NotFoundException(
                messageSource.getMessage("error.isEmpty", null, LocaleInteface.BR)
        ));
    }
}
