# Cenaflix API (Spring Boot + Front-end estático)

CRUD de **Filmes** e **Análises** com API REST em Spring Boot e páginas web estáticas (HTML/CSS/JS).  
Inclui **tema claro/escuro** com persistência via **cookie**.

## ✨ Funcionalidades
- CRUD de **Filmes** (`/filmes`)
- CRUD de **Análises** (`/analises`) e listagem por filme (`/filmes/{id}/analises`)
- Front-end simples em **HTML/CSS/JS** (jQuery) servido pelo próprio Spring
- **Dark mode**: botão “🌙 Escuro / ☀️ Claro” com cookie `theme` (`light`/`dark`)
- Build **WAR** para deploy em Tomcat

## 🧱 Stack
- Java 17, Spring Boot 3.x (Web, Data JPA, Validation)
- MySQL (Hibernate/JPA)
- Maven
- jQuery (para integração com a API)
- Páginas estáticas em `src/main/resources/static`

## 📂 Estrutura (resumo)
cenaflix-api/
├─ src/main/java/br/com/cenaflix/...
│ ├─ CenaflixApiApplication.java # classe principal (WAR-ready)
│ ├─ controller/ # controllers REST
│ ├─ domain/ # entidades JPA (Filme, Analise)
│ └─ repository/ # Spring Data JPA
└─ src/main/resources/
├─ application.properties # credenciais do DB (não commitar em público)
└─ static/ # front-end
├─ index.html
├─ filmes.html
├─ analises.html
├─ css/styles.css
└─ js/app.js

▶️ Como executar (dev)

Com Maven instalado:

mvn clean spring-boot:run
Ou, no NetBeans/IntelliJ, Run na classe CenaflixApiApplication.

## ⚙️ Configuração
Edite `src/main/resources/application.properties` com seu MySQL:
```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/cenaflix?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=********
spring.datasource.password=********
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.jdbc.time_zone=UTC

Front-end:

Home: http://localhost:8080/index.html

Filmes: http://localhost:8080/filmes.html

Análises: http://localhost:8080/analises.html

📦 Build do WAR
mvn clean package
