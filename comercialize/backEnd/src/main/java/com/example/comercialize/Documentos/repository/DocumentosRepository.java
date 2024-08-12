package com.example.comercialize.Documentos.repository;

import com.example.comercialize.Documentos.model.Documentos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DocumentosRepository extends JpaRepository<Documentos,Long> {
    @Query(nativeQuery = true, value = "select * FROM financeiro.arquivos_upload WHERE id= :id")
    Optional<Documentos> find(Short id);

    @Query(nativeQuery = true, value = "select * FROM financeiro.arquivos_upload WHERE route= :key")
    Documentos findByRoute(String key);
}
