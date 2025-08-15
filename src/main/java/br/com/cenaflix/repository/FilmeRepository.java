package br.com.cenaflix.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.cenaflix.domain.Filme;

public interface FilmeRepository extends JpaRepository<Filme, Long> {
}
