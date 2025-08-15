package br.com.cenaflix.controller;

import br.com.cenaflix.domain.Analise;
import br.com.cenaflix.domain.Filme;
import br.com.cenaflix.exception.NotFoundException;
import br.com.cenaflix.repository.AnaliseRepository;
import br.com.cenaflix.repository.FilmeRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class AnaliseController {
    private final AnaliseRepository analiseRepo;
    private final FilmeRepository filmeRepo;

    public AnaliseController(AnaliseRepository analiseRepo, FilmeRepository filmeRepo) {
        this.analiseRepo = analiseRepo;
        this.filmeRepo = filmeRepo;
    }

    // CRUD de análises
    @GetMapping("/analises")
    public List<Analise> list() {
        return analiseRepo.findAll();
    }

    @GetMapping("/analises/{id}")
    public Analise get(@PathVariable Long id) {
        return analiseRepo.findById(id).orElseThrow(() -> new NotFoundException("Análise não encontrada"));
    }

    @PostMapping("/analises")
    @ResponseStatus(HttpStatus.CREATED)
    public Analise create(@Valid @RequestBody Analise analise) {
        // garante filme válido
        Long filmeId = analise.getFilme() != null ? analise.getFilme().getId() : null;
        if (filmeId == null) throw new NotFoundException("Filme da análise é obrigatório");
        Filme filme = filmeRepo.findById(filmeId).orElseThrow(() -> new NotFoundException("Filme não encontrado"));
        analise.setId(null);
        analise.setFilme(filme);
        return analiseRepo.save(analise);
    }

    @PutMapping("/analises/{id}")
    public Analise update(@PathVariable Long id, @Valid @RequestBody Analise analise) {
        Analise existente = analiseRepo.findById(id).orElseThrow(() -> new NotFoundException("Análise não encontrada"));
        if (analise.getFilme() != null && analise.getFilme().getId() != null) {
            Filme filme = filmeRepo.findById(analise.getFilme().getId()).orElseThrow(() -> new NotFoundException("Filme não encontrado"));
            existente.setFilme(filme);
        }
        existente.setTexto(analise.getTexto());
        existente.setNota(analise.getNota());
        return analiseRepo.save(existente);
    }

    @DeleteMapping("/analises/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        Analise existente = analiseRepo.findById(id).orElseThrow(() -> new NotFoundException("Análise não encontrada"));
        analiseRepo.delete(existente);
    }

    // Análises por filme
    @GetMapping("/filmes/{filmeId}/analises")
    public List<Analise> byFilme(@PathVariable Long filmeId) {
        filmeRepo.findById(filmeId).orElseThrow(() -> new NotFoundException("Filme não encontrado"));
        return analiseRepo.findByFilmeId(filmeId);
    }
}
