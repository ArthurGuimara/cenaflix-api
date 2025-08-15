package br.com.cenaflix.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Filme {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 120)
    private String titulo;

    @NotBlank
    @Size(max = 500)
    private String sinopse;

    @NotBlank
    @Size(max = 60)
    private String genero;

    @NotNull
    @Min(1895)
    @Max(2100)
    private Integer ano;

    @OneToMany(mappedBy = "filme", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore // <<< apenas AQUI, e apenas uma vez
    private List<Analise> analises = new ArrayList<>();

    public Filme() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getSinopse() { return sinopse; }
    public void setSinopse(String sinopse) { this.sinopse = sinopse; }

    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }

    public Integer getAno() { return ano; }
    public void setAno(Integer ano) { this.ano = ano; }

    public List<Analise> getAnalises() { return analises; }
    public void setAnalises(List<Analise> analises) { this.analises = analises; }
}
