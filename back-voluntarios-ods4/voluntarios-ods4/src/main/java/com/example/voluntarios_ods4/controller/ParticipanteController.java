package com.example.voluntarios_ods4.controller;

import com.example.voluntarios_ods4.model.Participante;
import com.example.voluntarios_ods4.repository.ParticipanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/participantes")
@CrossOrigin(origins = "*")
public class ParticipanteController {

    @Autowired
    private ParticipanteRepository participanteRepository;

    @GetMapping
    public List<Participante> listar() {
        return participanteRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Participante> buscarPorId(@PathVariable Long id) {
        Optional<Participante> participante = participanteRepository.findById(id);
        
        if (participante.isPresent()) {
            return ResponseEntity.ok(participante.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Participante participante) {
        try {
            Participante novoParticipante = participanteRepository.save(participante);
            return ResponseEntity.status(201).body(novoParticipante);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro ao salvar participante: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Participante participanteDetalhes) {
        Optional<Participante> participanteOptional = participanteRepository.findById(id);
        
        if (participanteOptional.isPresent()) {
            try {
                Participante participante = participanteOptional.get();
                participante.setNome(participanteDetalhes.getNome());
                participante.setEmail(participanteDetalhes.getEmail());
                participante.setTelefone(participanteDetalhes.getTelefone());
                participante.setCpf(participanteDetalhes.getCpf());
                participante.setPerfil(participanteDetalhes.getPerfil());
                participante.setDataNascimento(participanteDetalhes.getDataNascimento());
                
                Participante participanteAtualizado = participanteRepository.save(participante);
                return ResponseEntity.ok(participanteAtualizado);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body("Erro ao atualizar participante: " + e.getMessage());
            }
        }
        
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (participanteRepository.existsById(id)) {
            participanteRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}