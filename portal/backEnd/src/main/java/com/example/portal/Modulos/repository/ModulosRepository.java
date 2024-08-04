package com.example.portal.Modulos.repository;

import com.example.portal.Modulos.model.Modulos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModulosRepository extends PagingAndSortingRepository<Modulos, Integer>, JpaRepository<Modulos, Integer>, JpaSpecificationExecutor<Modulos> {

}
