package com.example.comercialize.cargo.service;

import com.example.comercialize.Utils.Interfaces.LocaleInteface;
import com.example.comercialize.cargo.model.Cargo;
import com.example.comercialize.cargo.repository.CargoRepository;
import javassist.NotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CargoService {

    private final CargoRepository cargoRepository;
    private final MessageSource messageSource;

    public List<Cargo> findAll() {
        return cargoRepository.findAll();
    }

    public Cargo findById(Long id) throws NotFoundException {
        return cargoRepository.findById(id).orElseThrow(() -> new NotFoundException(
                messageSource.getMessage("error.isEmpty", null, LocaleInteface.BR)
        ));
    }
}
