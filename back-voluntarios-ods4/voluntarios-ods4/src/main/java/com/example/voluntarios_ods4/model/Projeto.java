package com.example.voluntarios_ods4.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projetos")
public class Projeto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    
    @Column(columnDefinition = "TEXT")
    private String descricao;
    
    private String cpfCoordenador;
    private String email;
    private String instituicao;
    private String cnpjInstituicao;
    private Integer vagasDisponiveis;

 
    @Column(name = "link_projeto")
    private String linkProjeto;

    // relação das tabelas voluntários e dos prticipantes
    @ManyToMany
    @JoinTable(
        name = "projeto_voluntarios",
        joinColumns = @JoinColumn(name = "projeto_id"),
        inverseJoinColumns = @JoinColumn(name = "participante_id")
    )
    private List<Participante> voluntarios = new ArrayList<>();

    // getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getCpfCoordenador() { return cpfCoordenador; }
    public void setCpfCoordenador(String cpfCoordenador) { this.cpfCoordenador = cpfCoordenador; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getInstituicao() { return instituicao; }
    public void setInstituicao(String instituicao) { this.instituicao = instituicao; }

    public String getCnpjInstituicao() { return cnpjInstituicao; }
    public void setCnpjInstituicao(String cnpjInstituicao) { this.cnpjInstituicao = cnpjInstituicao; }

    public Integer getVagasDisponiveis() { return vagasDisponiveis; }
    public void setVagasDisponiveis(Integer vagasDisponiveis) { this.vagasDisponiveis = vagasDisponiveis; }

    public String getLinkProjeto() { return linkProjeto; }
    public void setLinkProjeto(String linkProjeto) { this.linkProjeto = linkProjeto; }

    public List<Participante> getVoluntarios() { return voluntarios; }
    public void setVoluntarios(List<Participante> voluntarios) { this.voluntarios = voluntarios; }
}