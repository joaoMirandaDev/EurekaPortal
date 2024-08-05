package com.example.comercialize.Documentos.service;

import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class PdfGenerator {

    //Metodo Retornar o arquivo, a principio salva na pasta TEMP
    public static byte[] pdf(Object obj, String nameTemplate) throws Exception {
        // Configuração do template resolver
        ClassLoaderTemplateResolver templateResolver = new ClassLoaderTemplateResolver();
        templateResolver.setSuffix(".html");
        templateResolver.setTemplateMode("HTML");

        // Configuração do template engine
        TemplateEngine templateEngine = new TemplateEngine();
        templateEngine.setTemplateResolver(templateResolver);

        // Gerar o PDF
        byte[] pdfContent = gerarPDF(templateEngine, obj, nameTemplate);

        return pdfContent;
    }

    public static byte[] gerarPDF(TemplateEngine templateEngine, Object object, String nameTemplate) throws Exception {
        final Context context = new Context();

        context.setVariable("object", object);

        String processedHtml = templateEngine.process("template/".concat(nameTemplate), context);

        try (ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream()) {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(processedHtml);
            renderer.layout();
            renderer.createPDF(byteArrayOutputStream, false);
            renderer.finishPDF();
            return byteArrayOutputStream.toByteArray();
        } catch (IOException e) {
            throw new Exception("Erro ao gerar PDF");
        }
    }
}
