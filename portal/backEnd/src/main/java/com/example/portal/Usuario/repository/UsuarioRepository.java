package com.example.portal.Usuario.repository;


import com.example.portal.Usuario.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends PagingAndSortingRepository<Usuario, Integer>, JpaRepository<Usuario, Integer>, JpaSpecificationExecutor<Usuario> {
   Optional<Usuario> findByLogin(String login);

   void deleteByLogin(String cpf);

    List<Usuario> findByEmpresaId(Integer idEmpresa);
}
