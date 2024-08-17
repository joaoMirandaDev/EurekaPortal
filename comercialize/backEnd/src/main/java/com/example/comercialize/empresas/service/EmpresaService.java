package com.example.comercialize.empresas.service;

import com.example.comercialize.empresas.DTO.EmpresaDto;
import com.example.comercialize.empresas.infra.EmpresaResourceClient;
import com.example.comercialize.empresas.model.Empresa;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class EmpresaService {
    private final EmpresaResourceClient resourceClient;

    public void statusEmpresaByCpfUser(String login) {
        try {
             resourceClient.statusEmpresaByCpfUser(login);
        } catch (Exception e) {
            throw e;
        }
    }

    public EmpresaDto getEmpresaByCnpj(String cnpj) {
        try {
         return resourceClient.findByCnpj(cnpj);
        } catch (Exception e) {
            throw e;
        }
    }
}
