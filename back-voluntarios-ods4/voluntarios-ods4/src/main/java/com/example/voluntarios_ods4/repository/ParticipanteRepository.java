package com.example.voluntarios_ods4.repository;

import com.example.voluntarios_ods4.model.Participante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParticipanteRepository extends JpaRepository<Participante, Long> {
}