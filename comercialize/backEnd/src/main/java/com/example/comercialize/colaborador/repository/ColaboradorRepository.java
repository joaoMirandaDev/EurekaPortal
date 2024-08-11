package com.example.comercialize.colaborador.repository;

import com.example.comercialize.colaborador.model.Colaborador;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ColaboradorRepository extends PagingAndSortingRepository<Colaborador, Long>, JpaRepository<Colaborador, Long>, JpaSpecificationExecutor<Colaborador> {

    Colaborador findByCpf(String cpf);

    @Query(nativeQuery = true, value = "select * FROM comercialize.colaborador c WHERE c.ativo = 0")
    List<Colaborador> findAllByAtivo();

    @Query(nativeQuery = true, value = "SELECT * FROM comercialize.colaborador c " +
            "WHERE c.cnpj_empresa = :cnpj AND (:global IS NULL OR :global = '' " +
            "OR c.nome LIKE CONCAT('%', :global, '%') " +
            "OR c.sobrenome LIKE CONCAT('%', :global, '%') " +
            "OR c.cpf LIKE CONCAT('%', :global, '%'))")
    Page<Colaborador> findAll(Pageable pageable, @Param("global") String global, @Param("cnpj") String cnpj);

}
