# Conecta & Ação - Gestão de Projetos Sociais

> Projeto final desenvolvido para o **Programa Transforma Futuros (Recode Pro)**.
> **Mentores do projeto:** Professor Caíque e Bruna

O **Conecta & Ação** é uma solução tecnológica full-stack desenvolvida para centralizar voluntários/participantes, instituições e projetos sociais, promovendo inovação e impacto social alinhado às ODS da ONU.

---

## Tecnologias Utilizadas

### **Back-end**
- **Java 21**
- **Spring Boot** (Spring Web, Spring Data JPA)
- **Maven** (Gerenciamento de dependências)

### **Front-end**
- **React** (com Vite)
- **JavaScript (ES6+)**
- **HTML5 / CSS3**

### **Banco de Dados & Ferramentas**
- **MySQL / XAMPP** (phpMyAdmin)
- **Eclipse IDE** (para o Back-end)
- **Visual Studio Code (VS Code)** (para o Front-end)

---

## Como Executar o Projeto

### 1. Banco de Dados (MySQL / XAMPP)
No phpMyAdmin http://localhost/phpmyadmin, crie o banco de dados e execute o script SQL abaixo:

```sql
DROP DATABASE IF EXISTS projeto_social;
CREATE DATABASE projeto_social;
USE projeto_social;

CREATE TABLE `instituicoes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cep` varchar(255) DEFAULT NULL,
  `cnpj` varchar(255) DEFAULT NULL,
  `complemento` varchar(255) DEFAULT NULL,
  `cpf_diretor` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `logradouro` varchar(255) DEFAULT NULL,
  `nome` varchar(255) NOT NULL,
  `numero` varchar(255) DEFAULT NULL,
  `telefone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `participantes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `cpf` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `perfil` varchar(255) NOT NULL,
  `telefone` varchar(255) DEFAULT NULL,
  `data_nascimento` DATE NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `projetos` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descricao` text DEFAULT NULL,
  `cpf_coordenador` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `instituicao` varchar(255) NOT NULL,
  `vagas_disponiveis` int(11) NOT NULL,
  `cnpj_instituicao` varchar(255) DEFAULT NULL,
  `link_projeto` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `projeto_voluntarios` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `projeto_id` bigint(20) NOT NULL,
  `participante_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_projeto` (`projeto_id`),
  KEY `fk_participante` (`participante_id`),
  CONSTRAINT `fk_participante` FOREIGN KEY (`participante_id`) REFERENCES `participantes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_projeto` FOREIGN KEY (`projeto_id`) REFERENCES `projetos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

### 2. Back-end (Spring Boot)
Abra a pasta back-voluntarios-ods4 no Eclipse (ou IntelliJ).

Verifique se o arquivo application.properties aponta corretamente para o banco projeto_social na porta 3306.

Execute a classe principal da aplicação Spring Boot (Spring Boot App). O servidor rodará na porta 8080.

### 3. Front-end (React)
Abra a pasta front-voluntarios no VS Code.

No terminal integrado, execute os comandos:

Bash

npm install

npm run dev


Acesse: http://localhost:5173/


### 4. Exemplos de Requisições da API

Para testar os endpoints utilize o Postman ou extensões como o REST Client (VS Code).

### Participantes
POST http://localhost:8080/participantes

```JSON
{
  "nome": "Victor Silva",
  "email": "victor@email.com",
  "telefone": "11988887777",
  "cpf": "12345678901",
  "perfil": "Diretor",
  "data_nascimento": "2000-05-10"
}
```
* **GET / DELETE por ID**: http://localhost:8080/participantes/{id}

* **PUT**: http://localhost:8080/participantes/{id} (enviando o objeto com o ID preenchido).


### Instituições
POST http://localhost:8080/instituicoes

```JSON
{
  "nome": "Instituto Educar - ODS 4",
  "cnpj": "12.345.678/0001-99",
  "email": "educar@instituto.org",
  "telefone": "1133334444",
  "cep": "01001-000",
  "logradouro": "Avenida Paulista",
  "numero": "1000",
  "complemento": "Bloco B",
  "cpfDiretor": "12345678901"
}
```
* **GET / DELETE por ID**: http://localhost:8080/instituicoes/{id}

* **PUT**: http://localhost:8080/instituicoes/{id} (enviando o objeto com o ID preenchido).


### Projetos
POST http://localhost:8080/projetos

```JSON
{
  "titulo": "Alfabetização e Capacitação Digital para Adultos",
  "descricao": "PROPOSTA DO PROJETO:\n- Problema: A evasão escolar precoce e a falta de acesso à educação básica na infância deixam adultos à margem do mercado formal.\n- ODS da ONU: ODS 4 (Educação de Qualidade).\n- Público-Alvo: Jovens e adultos acima de 18 anos em situação de vulnerabilidade educacional.\n- Impacto Esperado: Elevar a empregabilidade, a autonomia e promover oportunidades de aprendizado ao longo da vida, preparando os participantes para exames de certificação e letramento digital.",
  "cpfCoordenador": "12345678901",
  "email": "educar@instituto.org",
  "instituicao": "Instituto Educar - ODS 4",
  "cnpjInstituicao": "12.345.678/0001-99",
  "vagasDisponiveis": 20,
  "linkProjeto": "https://institutoeducar-ods4.org"
}
```
* **GET / DELETE por ID**: http://localhost:8080/projetos/{id}

* **PUT**: http://localhost:8080/projetos/{id} (enviando o objeto com o ID preenchido).