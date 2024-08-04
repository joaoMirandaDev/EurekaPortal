package com.example.portal.Endereco.service;

import com.example.portal.Endereco.Dto.EnderecoDTO;
import com.example.portal.Endereco.model.Endereco;
import com.example.portal.Endereco.repository.EnderecoRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class EnderecoService {

    private final EnderecoRepository enderecoRepository;
    private final ModelMapper modelMapper;
    private final MessageSource messageSource;

    public Object findByRegiao(String cep) throws IOException {
        long cepConvert = Long.parseLong(cep);
        String url = "https://viacep.com.br/ws/"+cepConvert+"/json/";
        URL obj = new URL(url);
        //Abre a conexão
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();
        con.setRequestMethod("GET");

        // Lê a resposta do servidor
        BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
        String inputLine;
        StringBuilder response = new StringBuilder();

        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();

        return response;
    }

    public Endereco add(EnderecoDTO enderecoDTO) {
        Endereco endereco = modelMapper.map(enderecoDTO, Endereco.class);
        return enderecoRepository.save(endereco);
    }

    public void update(EnderecoDTO endereco) {
        if (Objects.nonNull(endereco.getId())) {
            Endereco newObj = modelMapper.map(endereco, Endereco.class);
            newObj.setId(endereco.getId());
            enderecoRepository.save(newObj);
        }
    }

    public void deteteById(Endereco endereco) {
        if (enderecoRepository.existsById(endereco.getId()))  {
            enderecoRepository.delete(endereco);
        }
    }

}
