package com.example.comercialize.Utils.pdf;

import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

import java.io.*;

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

        // Processa o template com Thymeleaf
        String processedHtml = templateEngine.process("template/".concat(nameTemplate), context);

        // Cria um arquivo temporário para o HTML
        File tempHtmlFile = File.createTempFile("temp", ".html");
        try (FileWriter writer = new FileWriter(tempHtmlFile)) {
            writer.write(processedHtml);
        }

        // Cria um arquivo temporário para o PDF
        File tempPdfFile = File.createTempFile("output", ".pdf");

        try {
            // Executa o wkhtmltopdf
            ProcessBuilder processBuilder = new ProcessBuilder("wkhtmltopdf", tempHtmlFile.getAbsolutePath(), tempPdfFile.getAbsolutePath());
            Process process = processBuilder.start();
            int exitCode = process.waitFor();

            if (exitCode != 0) {
                throw new Exception("Erro ao gerar PDF");
            }

            // Lê o PDF gerado em um array de bytes
            try (InputStream inputStream = new FileInputStream(tempPdfFile)) {
                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    byteArrayOutputStream.write(buffer, 0, bytesRead);
                }
                return byteArrayOutputStream.toByteArray();
            }
        } finally {
            // Limpa arquivos temporários
            tempHtmlFile.delete();
            tempPdfFile.delete();
        }
    }
}
