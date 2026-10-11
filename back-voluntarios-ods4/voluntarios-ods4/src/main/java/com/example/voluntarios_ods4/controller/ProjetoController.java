package com.example.voluntarios_ods4.controller;

import com.example.voluntarios_ods4.model.Participante;
import com.example.voluntarios_ods4.model.Projeto;
import com.example.voluntarios_ods4.repository.ParticipanteRepository;
import com.example.voluntarios_ods4.repository.ProjetoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/projetos")
@CrossOrigin(origins = "*") // Libera o CORS para o React (não esquecer)
public class ProjetoController {

    @Autowired
    private ProjetoRepository projetoRepository;

    @Autowired
    private ParticipanteRepository participanteRepository;

    @GetMapping
    public List<Projeto> listar() {
        return projetoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Projeto> buscarPorId(@PathVariable Long id) {
        Optional<Projeto> projeto = projetoRepository.findById(id);
        if (projeto.isPresent()) {
            return ResponseEntity.ok(projeto.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Projeto> criar(@RequestBody Projeto projeto) {
        Projeto novoProjeto = projetoRepository.save(projeto);
        return ResponseEntity.status(201).body(novoProjeto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Projeto> atualizar(@PathVariable Long id, @RequestBody Projeto projetoDetalhes) {
        Optional<Projeto> projetoOptional = projetoRepository.findById(id);
        
        if (projetoOptional.isPresent()) {
            Projeto projeto = projetoOptional.get();
            projeto.setTitulo(projetoDetalhes.getTitulo());
            projeto.setDescricao(projetoDetalhes.getDescricao());
            projeto.setCpfCoordenador(projetoDetalhes.getCpfCoordenador());
            projeto.setEmail(projetoDetalhes.getEmail());
            projeto.setInstituicao(projetoDetalhes.getInstituicao());
            projeto.setCnpjInstituicao(projetoDetalhes.getCnpjInstituicao());
            projeto.setVagasDisponiveis(projetoDetalhes.getVagasDisponiveis());
            projeto.setLinkProjeto(projetoDetalhes.getLinkProjeto());
            
            Projeto projetoAtualizado = projetoRepository.save(projeto);
            return ResponseEntity.ok(projetoAtualizado);
        }
        
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (projetoRepository.existsById(id)) {
            projetoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // =====================
    // rotas dos voluntários
    // ======================

    @GetMapping("/{id}/voluntarios")
    public ResponseEntity<List<Participante>> listarVoluntarios(@PathVariable Long id) {
        Optional<Projeto> projetoOpt = projetoRepository.findById(id);
        if (projetoOpt.isPresent()) {
            return ResponseEntity.ok(projetoOpt.get().getVoluntarios());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/voluntarios")
    public ResponseEntity<Void> adicionarVoluntario(@PathVariable Long id, @RequestBody DtoParticipante payload) {
        Optional<Projeto> projetoOpt = projetoRepository.findById(id);
        Optional<Participante> participanteOpt = participanteRepository.findById(payload.getParticipanteId());

        if (projetoOpt.isPresent() && participanteOpt.isPresent()) {
            Projeto projeto = projetoOpt.get();
            Participante participante = participanteOpt.get();

            if (!projeto.getVoluntarios().contains(participante)) {
                projeto.getVoluntarios().add(participante);
                projetoRepository.save(projeto);
            }
            return ResponseEntity.status(201).build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}/voluntarios/{participanteId}")
    public ResponseEntity<Void> removerVoluntario(@PathVariable Long id, @PathVariable Long participanteId) {
        Optional<Projeto> projetoOpt = projetoRepository.findById(id);
        if (projetoOpt.isPresent()) {
            Projeto projeto = projetoOpt.get();
            projeto.getVoluntarios().removeIf(p -> p.getId().equals(participanteId));
            projetoRepository.save(projeto);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    public static class DtoParticipante {
        private Long participanteId;
        public Long getParticipanteId() { return participanteId; }
        public void setParticipanteId(Long participanteId) { this.participanteId = participanteId; }
    }
}