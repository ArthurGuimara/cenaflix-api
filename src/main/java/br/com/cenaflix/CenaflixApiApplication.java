package br.com.cenaflix; // <-- ajuste para o seu pacote raiz

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class CenaflixApiApplication extends SpringBootServletInitializer {

    // Necessário para empacotar como WAR (deploy em Tomcat externo)
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(CenaflixApiApplication.class);
    }

    // Continua permitindo rodar localmente (mvn spring-boot:run)
    public static void main(String[] args) {
        SpringApplication.run(CenaflixApiApplication.class, args);
    }
}
