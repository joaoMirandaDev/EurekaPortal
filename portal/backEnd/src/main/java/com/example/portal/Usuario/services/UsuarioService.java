package com.example.portal.Usuario.services;

import com.example.portal.Empresas.model.Empresa;
import com.example.portal.Role.model.Role;
import com.example.portal.Role.service.RoleService;
import com.example.portal.Usuario.DTO.UsuarioCreateUpdateDTO;
import com.example.portal.Usuario.DTO.UsuarioDTO;
import com.example.portal.Usuario.filter.FilterUsuario;
import com.example.portal.Utils.Interfaces.LocaleInteface;
import com.example.portal.Utils.Interfaces.RolesInterface;
import com.example.portal.Usuario.model.Usuario;
import com.example.portal.Usuario.repository.UsuarioRepository;
import com.example.portal.Utils.exceptions.NotFoundException;
import com.example.portal.Utils.genericClass.GenericSpecification;
import com.example.portal.autenticacao.DTO.CredenciaisDTO;
import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static com.example.portal.Utils.genericClass.GenericSpecification.*;

@Service
@RequiredArgsConstructor
public class UsuarioService implements UserDetailsService {

    private final MessageSource messageSource;
    private final PasswordEncoder encoder;
    private final ModelMapper modelMapper;
    private final RoleService roleService;
    private final UsuarioRepository usuarioRepository;

    public Pageable createPageableFromFiltro(@Valid FilterUsuario filtro, String OrderInitial) {
        if (Objects.isNull(filtro.getColumnOrder())) {
            filtro.setColumnOrder(OrderInitial);
            filtro.setDesc(true);
        }

        Sort sort = filtro.isDesc() ? Sort.by(filtro.getColumnOrder()).descending() : Sort.by(filtro.getColumnOrder()).ascending();
        return PageRequest.of(filtro.getPagina(), filtro.getTamanhoPagina(), sort);
    }


    public Usuario findById(Integer id) {
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new NotFoundException(
                messageSource.getMessage("error.isEmpty", null, LocaleInteface.BR)
        ));
        return usuario;
    }

    public UserDetails autenticar(CredenciaisDTO credenciaisDTO) throws Exception {
        UserDetails user = loadUserByUsername(credenciaisDTO.getLogin());
        Usuario usuario = usuarioRepository.findByLogin(credenciaisDTO.getLogin()).orElseThrow(() -> new NotFoundException(
                messageSource.getMessage("error.isEmpty", null, LocaleInteface.BR)
        ));
        if (usuario.getAtivo().equals(1)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        boolean senhasBatem = encoder.matches( credenciaisDTO.getSenha(), user.getPassword() );
        if(senhasBatem){
            return user;
        }
        throw new Exception("Senha invalida");
    }
    @Override
    public UserDetails loadUserByUsername(String username) {
        Usuario usuario = usuarioRepository.findByLogin(username).get();

        String[] roles = new String[]{};

        if(usuario.getRole().getName().equals(RolesInterface.ADMIN)) {
            roles  = new String[]{RolesInterface.ADMIN};
        } else if(usuario.getRole().getName().equals(RolesInterface.PROPRIETARIO)) {
            roles =  new String[]{RolesInterface.PROPRIETARIO};
        } else if (usuario.getRole().getName().equals(RolesInterface.CAIXA)) {
            roles = new String[]{RolesInterface.CAIXA};
        }  else if (usuario.getRole().getName().equals(RolesInterface.PORTAL)) {
            roles = new String[]{RolesInterface.PORTAL};
        }

        return User
                .builder()
                .username(usuario.getLogin())
                .password(usuario.getSenha())
                .roles(roles)
                .build();
    }


    public UsuarioDTO findByLogin(String login) {
        Optional<Usuario> user = usuarioRepository.findByLogin(login);
        if (user.isPresent()) {
            return new UsuarioDTO(user.get());
        }
        return null;
    }

    public void create(UsuarioCreateUpdateDTO dto, Empresa empresa) {
        Usuario usuario = new Usuario();
        usuario.setLogin(dto.getLogin());
        Role role = roleService.findById(dto.getRole().getId());
        usuario.setRole(role);
        usuario.setUserName(dto.getUserName());
        usuario.setSenha(encoder.encode(dto.getSenha()));
        usuario.setEmpresa(empresa);
        usuario.setAtivo(0);
        usuario.setDataCadastro(LocalDateTime.now());
        usuarioRepository.save(usuario);
    }

//    public void editUser(String senha, Integer idRole, Empresa empresa) {
//        Optional<Usuario> usuario = usuarioRepository.findByLogin(empresa.getCpf());
//        if (!usuario.isPresent()) {
//            this.createNewUser(senha,idRole, empresa);
//        } else {
//            usuario.get().setLogin(empresa.getCpf());
//            Role role = roleService.findById(idRole);
//            usuario.get().setRole(role);
//            usuario.get().setSenha(passwordEncoder.encode(senha));
//            usuario.get().setEmpresa(empresa);
//            usuarioRepository.save(usuario.get());
//        }
//    }

    public void deleteByLogin(String cpf) {
        Optional<Usuario> user = usuarioRepository.findByLogin(cpf);
        if (user.isPresent()) {
            usuarioRepository.delete(user.get());
        }
    }

    public Page<UsuarioDTO> findAllUserByEmpresaAndPage(FilterUsuario filtro , Empresa empresa) {
        if (filtro.getColumnOrder() == null || filtro.getColumnOrder().isEmpty()) {
            throw new IllegalArgumentException(messageSource.getMessage("error.isEmpty", null, LocaleInteface.BR));
        }

        Pageable pageable = this.createPageableFromFiltro(filtro, "nomeUser");
        Specification<Usuario> specification = GenericSpecification
                .<Usuario>filterByProperty("login",filtro.getLogin())
                .and(filterByProperty("userName",filtro.getUserName()))
                .and(filterByIdWithJoin("empresa", "cnpj", empresa.getCnpj()))
                .and(filterByIdWithJoin("role", "name", filtro.getRole()))
                .and(filterByPropertyInterger("ativo", filtro.getAtivo()));
        Page<Usuario> page = usuarioRepository.findAll(specification ,pageable);
        if (Objects.nonNull(page) && !page.getContent().isEmpty()) {
            return page.map(UsuarioDTO::new);
        }
        return Page.empty();
    }

    public List<Usuario> usuariosByEmpresa(Integer id) {
        List<Usuario> usuarios = usuarioRepository.findByEmpresaId(id);
        return usuarios;
    }

    public void activeOrDesactive(Integer id, Integer ativo) {
        int novoStatus = (ativo == 0) ? 0 : 1;
            Usuario usuario = this.findById(id);
            usuario.setAtivo(novoStatus);
            usuarioRepository.save(usuario);
    }

    public void deleteById(Integer id) {
        Usuario user = this.findById(id);
        if (Objects.nonNull(user)) {
            usuarioRepository.delete(user);
        }
    }

    public void update(UsuarioCreateUpdateDTO dto) {
        Usuario usuario = this.findById(dto.getId());
        usuario.setLogin(dto.getLogin());
        usuario.setUserName(dto.getUserName());
        Role role = roleService.findById(dto.getRole().getId());
        usuario.setRole(role);
        usuarioRepository.save(usuario);
    }
}
