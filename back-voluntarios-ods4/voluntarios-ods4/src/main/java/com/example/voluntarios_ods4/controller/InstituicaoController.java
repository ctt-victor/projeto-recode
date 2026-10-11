package com.example.voluntarios_ods4.controller;

import com.example.voluntarios_ods4.model.Instituicao;
import com.example.voluntarios_ods4.model.Participante;
import com.example.voluntarios_ods4.model.Projeto; // <--- Import necessário
import com.example.voluntarios_ods4.repository.InstituicaoRepository;
import com.example.voluntarios_ods4.repository.ParticipanteRepository;
import com.example.voluntarios_ods4.repository.ProjetoRepository; // <--- Import necessário
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/instituicoes")
@CrossOrigin(origins = "*")
public class InstituicaoController {

    @Autowired
    private InstituicaoRepository instituicaoRepository;

    @Autowired
    private ParticipanteRepository participanteRepository;

    @Autowired
    private ProjetoRepository projetoRepository; 

    @GetMapping
    public List<Map<String, Object>> listar() {
        List<Instituicao> instituicoes = instituicaoRepository.findAll();
        List<Participante> participantes = participanteRepository.findAll();

        return instituicoes.stream().map(inst -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", inst.getId());
            map.put("nome", inst.getNome());
            map.put("cnpj", inst.getCnpj());
            map.put("email", inst.getEmail());
            map.put("telefone", inst.getTelefone());
            map.put("cep", inst.getCep());
            map.put("logradouro", inst.getLogradouro());
            map.put("numero", inst.getNumero());
            map.put("complemento", inst.getComplemento());
            map.put("cpfDiretor", inst.getCpfDiretor());

            
            String nomeDiretor = "Não informado";
            if (inst.getCpfDiretor() != null) {
                Optional<Participante> p = participantes.stream()
                        .filter(part -> part.getCpf().replaceAll("\\D", "").equals(inst.getCpfDiretor().replaceAll("\\D", "")))
                        .findFirst();
                if (p.isPresent()) {
                    nomeDiretor = p.get().getNome();
                }
            }
            map.put("diretor", nomeDiretor);
            return map;
        }).collect(Collectors.toList());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Instituicao> buscarPorId(@PathVariable Long id) {
        Optional<Instituicao> instituicao = instituicaoRepository.findById(id);
        
        if (instituicao.isPresent()) {
            return ResponseEntity.ok(instituicao.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Instituicao instituicao) {
        try {
            Instituicao novaInstituicao = instituicaoRepository.save(instituicao);
            return ResponseEntity.status(201).body(novaInstituicao);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro ao salvar instituição: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Instituicao instituicaoDetalhes) {
        Optional<Instituicao> instituicaoOptional = instituicaoRepository.findById(id);
        
        if (instituicaoOptional.isPresent()) {
            try {
                Instituicao instituicao = instituicaoOptional.get();
                
               
                String cnpjAntigo = instituicao.getCnpj();

                instituicao.setNome(instituicaoDetalhes.getNome());
                instituicao.setCnpj(instituicaoDetalhes.getCnpj());
                instituicao.setEmail(instituicaoDetalhes.getEmail());
                instituicao.setTelefone(instituicaoDetalhes.getTelefone());
                instituicao.setCep(instituicaoDetalhes.getCep());
                instituicao.setLogradouro(instituicaoDetalhes.getLogradouro());
                instituicao.setNumero(instituicaoDetalhes.getNumero());
                instituicao.setComplemento(instituicaoDetalhes.getComplemento());
                instituicao.setCpfDiretor(instituicaoDetalhes.getCpfDiretor());
                
                Instituicao instituicaoAtualizada = instituicaoRepository.save(instituicao);

                // --- atualiza o nome da instituição ---
                if (cnpjAntigo != null) {
                   
                    String cnpjLimpoBusca = cnpjAntigo.replaceAll("\\D", "").toUpperCase();
                    
                    List<Projeto> projetosVinculados = projetoRepository.findAll().stream()
                        .filter(proj -> proj.getCnpjInstituicao() != null && 
                                        proj.getCnpjInstituicao().replaceAll("\\D", "").toUpperCase().equals(cnpjLimpoBusca))
                        .collect(Collectors.toList());

                    for (Projeto projeto : projetosVinculados) {
                        projeto.setInstituicao(instituicaoAtualizada.getNome());
                        projetoRepository.save(projeto);
                    }
                }
                // -------------------------------------------------------------------------------

                return ResponseEntity.ok(instituicaoAtualizada);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body("Erro ao atualizar instituição: " + e.getMessage());
            }
        }
        
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (instituicaoRepository.existsById(id)) {
            instituicaoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}