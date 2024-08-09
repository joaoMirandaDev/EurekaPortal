package com.example.comercialize.Documentos.service;

import com.example.comercialize.Utils.Interfaces.Routes;
import com.example.comercialize.Documentos.model.Documentos;
import com.example.comercialize.Documentos.model.FileKey;
import com.example.comercialize.Documentos.repository.DocumentosRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
@EnableWebMvc
@RequiredArgsConstructor
public class DocumentosService {

    private final DocumentosRepository documentosRepository;

    public Optional<Documentos> findAll(Short id) {
        List<Documentos> arquivos = documentosRepository.findAll();
        return arquivos.stream()
                .filter(arquivo -> arquivo.getId().equals(id))
                .findFirst();
    }

    public Optional<Documentos> findByShortId(Short id) {
        Optional<Documentos> arquivosUploadOptional = documentosRepository.find(id);
        return arquivosUploadOptional;
    }

//    public ResponseEntity<Object> getArquivo(Short id) {
//        try {
//            Optional<ArquivosUpload> optionalUpload = findByShortId(id);
//            if (!optionalUpload.isPresent()) {
//                return ResponseEntity.notFound().build();
//            }
//
//            ArquivosUpload upload = optionalUpload.get();
//            byte[] conteudo = upload.getArquivo();
//            ByteArrayResource resource = new ByteArrayResource(conteudo);
//
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.APPLICATION_PDF);
//            headers.setContentDisposition(ContentDisposition.builder("attachment").filename(upload.getNome()).build());
//
//            return ResponseEntity.ok().headers(headers).contentLength(conteudo.length).body(resource);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().build();
//
//        }
//    }
    @Transactional(rollbackFor = Exception.class)
    private String moveFileToPaste(FileKey file)  {
        // Caminho da pasta de destino
        String destino = Routes.PASTA_DEFINITIVA;

        // Gere uma chave única para o arquivo
        String chave = UUID.randomUUID().toString();

        // Crie o arquivo de destino usando a chave no nome do arquivo
        File arquivoDestino = new File(destino + chave);

        // Baixa o arquivo da URL e salva no destino
        try {
            saveUrlToFile(file.getKey(), arquivoDestino);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao mover arquivo para pasta definitiva");
        }

        return destino + chave;

    }

    //Salva na pasta definitiva e retorna o caminho cripto
    @Transactional(rollbackFor = Exception.class)
    public Documentos save(FileKey file) throws Exception {
        String route = null;
        try {
            route = moveFileToPaste(file);
            Documentos documentos = new Documentos();
            documentos.setRoute(route);
            documentos.setNome(file.getName());
            documentos.setStatus(0);
            documentosRepository.save(documentos);
            return documentos ;

        } catch (Exception e) {
            if (Objects.nonNull(route) && !route.isEmpty()) {
                this.deleteDocumentoByPath(route);
            }
            throw new Exception(e.getMessage());
        }

    }

    private void saveUrlToFile(String url, File destino) throws Exception {
            Files.copy(Path.of(url), destino.toPath());
    }

    //Salva o arquivo na pasta temporaria
    @Transactional(rollbackFor = Exception.class)
    public String saveTemp(MultipartFile multipartFile) throws Exception {

                // Caminho pasta temp
                String destino = Routes.PASTA_TEMP;

                // Gere uma chave única para o arquivo
                String chave = UUID.randomUUID().toString();

                String name = multipartFile.getOriginalFilename();

                FileKey file = new FileKey();

                file.setName(name);

                file.setKey(chave);

                // Crie o arquivo de destino usando a chave no nome do arquivo
                File arquivoDestino = new File(destino + file.getKey()) ;

                // Salva o arquivo
                multipartFile.transferTo(arquivoDestino);

                return destino + file.getKey();
    }

    //Metodo para pegar a foto de perfil
    public ResponseEntity<Resource> getImagem(String nomeImagem) {
        Path caminhoImagem = Paths.get(nomeImagem);
        try {
            Resource resource = new UrlResource(caminhoImagem.toUri());
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(resource);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return ResponseEntity.notFound().build();
    }

    public void deleteDocumentoByPath(String val) throws IOException {
        Path path = Paths.get(val);
        Files.delete(path);
    }

    public Documentos update(FileKey file, Documentos doc) throws Exception {
        if (Objects.isNull(doc) && Objects.nonNull(file.getKey())) {
            return this.save(file);
        }
        if (Objects.isNull(file.getKey())) {
            this.deleteDocumentoByPath(doc.getRoute());
            documentosRepository.delete(doc);
            return null;
        }
        Documentos documentos = doc;
        if (Objects.nonNull(documentos) && Objects.nonNull(file.getKey())) {
            Boolean result = file.getKey().equals(documentos.getRoute());

            if (!result) {
                try {
                    String route = this.moveFileToPaste(file);
                    this.deleteDocumentoByPath(documentos.getRoute());
                    documentos.setRoute(route);
                    documentosRepository.save(documentos);
                } catch (IOException e) {
                    throw e;
                }
            }
        }
        return documentos;
    }
}

