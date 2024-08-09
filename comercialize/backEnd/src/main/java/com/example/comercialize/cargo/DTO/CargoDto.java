package com.example.comercialize.cargo.DTO;

import com.example.comercialize.cargo.model.Cargo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CargoDto {
    private Long id;
    private String nome;
    private Integer status;

    public CargoDto(Cargo cargo) {
        this.id = cargo.getId();
        this.nome = cargo.getNome();
    }
}
