package com.example.comercialize.cargo.controller;

import com.example.comercialize.cargo.service.CargoService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/cargo")
@RequiredArgsConstructor
public class CargoController {

    private final CargoService service;

    @RequestMapping(value = "/findAll", method = RequestMethod.GET, produces = "application/json")
    @Operation(summary = "FindAll cargos", description = "Metodo utilizado para listar todos os cargos", tags = "Cargos")
    public ResponseEntity findAll() {
        return ResponseEntity.ok(service.findAll());
    }

}
