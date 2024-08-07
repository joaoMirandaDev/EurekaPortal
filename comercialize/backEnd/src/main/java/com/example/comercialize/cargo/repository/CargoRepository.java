package com.example.comercialize.cargo.repository;

import com.example.comercialize.cargo.model.Cargo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CargoRepository extends PagingAndSortingRepository<Cargo, Long>, JpaRepository<Cargo, Long>, JpaSpecificationExecutor<Cargo> {

}
