package com.example.voluntarios_ods4.repository;

import com.example.voluntarios_ods4.model.Projeto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjetoRepository extends JpaRepository<Projeto, Long> {
    
}