package br.com.cenaflix.controller;

import br.com.cenaflix.domain.Filme;
import br.com.cenaflix.exception.NotFoundException;
import br.com.cenaflix.repository.FilmeRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/filmes")
public class FilmeController {

    private final FilmeRepository repo;

    public FilmeController(FilmeRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Filme> list() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Filme get(@PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Filme não encontrado"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Filme create(@Valid @RequestBody Filme filme) {
        filme.setId(null);
        return repo.save(filme);
    }

    @PutMapping("/{id}")
    public Filme update(@PathVariable Long id, @Valid @RequestBody Filme filme) {
        Filme existente = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Filme não encontrado"));
        existente.setTitulo(filme.getTitulo());
        existente.setSinopse(filme.getSinopse());
        existente.setGenero(filme.getGenero());
        existente.setAno(filme.getAno());
        return repo.save(existente);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        Filme existente = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Filme não encontrado"));
        repo.delete(existente);
    }
}
