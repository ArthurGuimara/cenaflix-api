package br.com.cenaflix.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.cenaflix.domain.Analise;
import java.util.List;

public interface AnaliseRepository extends JpaRepository<Analise, Long> {
    List<Analise> findByFilmeId(Long filmeId);
}
