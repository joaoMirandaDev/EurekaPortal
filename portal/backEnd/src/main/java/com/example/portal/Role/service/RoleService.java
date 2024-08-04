package com.example.portal.Role.service;


import com.example.portal.Role.model.Role;
import com.example.portal.Role.repository.RoleRepository;
import com.example.portal.Utils.Interfaces.LocaleInteface;
import com.example.portal.Utils.exceptions.NotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final MessageSource messageSource;

    public List<Role> findAll() {
      List<Role> newList =  roleRepository.findAll().stream().filter(obj -> !obj.getName().equals("PORTAL")).collect(Collectors.toList());
       return newList ;
    }

    public Role findById(Integer id) {
      return  roleRepository.findById(id).orElseThrow(() -> new NotFoundException(
                messageSource.getMessage("error.isEmpty", null, LocaleInteface.BR)
        ));
    }
}
