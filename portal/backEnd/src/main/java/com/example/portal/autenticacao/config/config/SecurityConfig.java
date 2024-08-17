package com.example.portal.autenticacao.config.config;

import com.example.portal.autenticacao.config.securityJwt.JwtAuthFilter;
import com.example.portal.autenticacao.config.securityJwt.JwtService;
import com.example.portal.Role.enuns.RolesEnum;
import com.example.portal.Usuario.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.util.Arrays;

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private JwtService jwtService;

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public OncePerRequestFilter jwtFilter(){
        return new JwtAuthFilter(jwtService, usuarioService);
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
                .userDetailsService(usuarioService)
                .passwordEncoder(passwordEncoder());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .cors().and().csrf().disable()
                .authorizeRequests()
                .antMatchers(AUTH_LIST).permitAll()
                .antMatchers("/api/**/list", "/api/**/list/**").hasAnyRole(RolesEnum.PORTAL.name(), RolesEnum.ADMIN.name())
                .antMatchers(HttpMethod.GET,"/api/**").hasAnyRole(RolesEnum.PORTAL.name(), RolesEnum.ADMIN.name())
                .antMatchers("/api/**").hasAnyRole(RolesEnum.PORTAL.name(), RolesEnum.ADMIN.name())
                .anyRequest().authenticated()
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .addFilterBefore(jwtFilter(), UsernamePasswordAuthenticationFilter.class);
    }



    private static final String[] AUTH_LIST = {
            "/swagger-ui/**",
            "/api/empresa/status/**",
            "/swagger-ui.html",
            "/v3/api-docs/**",
            "/v3/api-docs.yaml",
            "/javainuse-openapi/**",
            "/api/usuarios/**"
    };


    //Libera o cors para as rotas
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:1081")); // Configure as origens permitidas
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE")); // Configure os métodos HTTP permitidos
        configuration.setAllowedHeaders(Arrays.asList("Content-Type", "Authorization")); // Configure os cabeçalhos permitidos
        configuration.setAllowCredentials(true); // Permitir envio de credenciais (por exemplo, cookies)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
