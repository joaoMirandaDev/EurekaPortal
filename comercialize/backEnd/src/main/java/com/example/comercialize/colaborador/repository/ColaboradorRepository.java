package com.example.comercialize.colaborador.repository;

import com.example.comercialize.colaborador.model.Colaborador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ColaboradorRepository extends PagingAndSortingRepository<Colaborador, Integer>, JpaRepository<Colaborador, Integer>, JpaSpecificationExecutor<Colaborador> {

    Colaborador findByCpf(String cpf);

    @Query(nativeQuery = true, value = "select * FROM sistema.colaborador c WHERE c.ativo = 0")
    List<Colaborador> findAllByAtivo();
}
