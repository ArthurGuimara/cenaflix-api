package br.com.cenaflix.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
public class Analise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "filme_id")
    @JsonIgnoreProperties({"analises"}) // evita loop: filme -> análises -> filme...
    private Filme filme;

    @NotBlank
    @Size(max = 1000)
    private String texto;

    @NotNull
    @Min(0) @Max(10)
    private Integer nota;

    public Analise() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Filme getFilme() { return filme; }
    public void setFilme(Filme filme) { this.filme = filme; }

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }

    public Integer getNota() { return nota; }
    public void setNota(Integer nota) { this.nota = nota; }
}
