package com.example.voluntarios_ods4.repository;

import com.example.voluntarios_ods4.model.Instituicao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InstituicaoRepository extends JpaRepository<Instituicao, Long> {
}