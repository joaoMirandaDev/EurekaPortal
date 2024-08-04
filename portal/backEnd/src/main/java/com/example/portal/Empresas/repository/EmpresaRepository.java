package com.example.portal.Empresas.repository;

import com.example.portal.Empresas.model.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmpresaRepository extends PagingAndSortingRepository<Empresa, Integer>, JpaRepository<Empresa, Integer>, JpaSpecificationExecutor<Empresa> {

    @Query(nativeQuery = true, value = "select * FROM empresas c WHERE c.ativo = 0")
    List<Empresa> findAllByAtivo();

    Empresa findByCnpj(String cnpj);
}
