# 🔐 Gerenciador de Senhas — Frontend

Frontend do projeto acadêmico **Gerenciador de Senhas**, desenvolvido com **React, JavaScript, HTML e CSS**.

Este repositório contém a interface web da aplicação, responsável pelas telas de cadastro, login, painel principal e gerenciamento visual das senhas.

O backend do sistema será mantido em outro repositório, desenvolvido em **Java com Spring Boot**.

---

## 📌 Sobre o Projeto

O objetivo da aplicação é permitir que usuários autenticados possam gerenciar senhas de sites e aplicativos de forma organizada.

Pelo frontend, o usuário poderá:

- Criar conta;
- Realizar login;
- Visualizar painel principal;
- Cadastrar senhas;
- Listar senhas;
- Mostrar e ocultar senhas;
- Editar senhas;
- Excluir senhas;
- Buscar registros;
- Filtrar por categoria.

---

## 🚀 Tecnologias Utilizadas

- React
- JavaScript
- HTML
- CSS
- Vite
- npm
- Axios, caso seja usado para requisições HTTP
- React Router DOM, caso seja usado para rotas

---

## 🏗️ Arquitetura

```text
Frontend React  →  API REST Spring Boot  →  Banco de Dados MariaDB
```

Este repositório representa apenas a camada de frontend da aplicação.

---

## 📁 Estrutura do Projeto

```text
gerenciador-senhas-frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── routes/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── index.html
└── README.md
```

---

## 📦 Organização das Pastas

### `components/`

Contém componentes reutilizáveis da interface.

Exemplos:

- Botões;
- Inputs;
- Cards;
- Modal de cadastro;
- Modal de confirmação;
- Componente de senha oculta/visível.

---

### `pages/`

Contém as páginas principais da aplicação.

Exemplos:

- `Login`
- `Cadastro`
- `Dashboard`
- `Senhas`
- `Categorias`

---

### `services/`

Contém os arquivos responsáveis pela comunicação com a API backend.

Exemplos:

- `api.js`
- `authService.js`
- `passwordService.js`
- `categoryService.js`

---

### `routes/`

Contém a configuração de rotas da aplicação.

Exemplos:

- Rotas públicas;
- Rotas protegidas;
- Redirecionamento para login.

---

### `styles/`

Contém arquivos CSS globais ou específicos da aplicação.

Exemplos:

- `global.css`
- `login.css`
- `dashboard.css`

---

## 🖥️ Telas do Sistema

### Tela de Cadastro

Permite que o usuário informe nome, e-mail, senha e confirmação de senha.

### Tela de Login

Permite autenticação com e-mail e senha.

### Painel Principal

Tela protegida exibida após o login.

Deve conter:

- Nome do usuário;
- Botão de logout;
- Campo de busca;
- Botão para cadastrar nova senha;
- Lista de senhas cadastradas.

### Cadastro de Senha

Tela ou modal para cadastrar uma nova senha.

Campos sugeridos:

- Nome do serviço;
- URL;
- Login ou e-mail;
- Senha;
- Categoria;
- Observações.

### Edição de Senha

Tela ou modal para alterar uma senha já cadastrada.

---

## 🔗 Comunicação com a API

O frontend deve consumir a API REST do backend.

URL base sugerida em ambiente local:

```text
http://localhost:8080
```

Exemplo de configuração em `services/api.js`:

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080"
});

export default api;
```

---

## 🔐 Rotas Protegidas

As telas internas do sistema devem ser acessadas apenas por usuários autenticados.

Exemplos de rotas:

| Rota | Tipo | Descrição |
|---|---|---|
| `/login` | Pública | Tela de login |
| `/cadastro` | Pública | Tela de cadastro |
| `/dashboard` | Protegida | Painel principal |
| `/senhas` | Protegida | Listagem de senhas |
| `/categorias` | Protegida | Categorias |

---

## 🧩 Funcionalidades da Interface

- Formulário de cadastro;
- Formulário de login;
- Listagem de senhas em cards ou tabela;
- Botão para mostrar senha;
- Botão para ocultar senha;
- Botão para editar;
- Botão para excluir;
- Campo de busca;
- Filtro por categoria;
- Mensagens de sucesso e erro;
- Layout responsivo.

---

## ▶️ Como Executar

### Pré-requisitos

- Node.js
- npm
- Git

### Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO_FRONTEND
cd gerenciador-senhas-frontend
```

### Instalar dependências

```bash
npm install
```

### Executar o projeto

```bash
npm run dev
```

O frontend será executado em:

```text
http://localhost:5173
```

---

## ⚙️ Configuração de Ambiente

Caso seja utilizado arquivo `.env`, pode-se definir:

```env
VITE_API_URL=http://localhost:8080
```

Exemplo de uso:

```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

---

## 🧪 Testes Sugeridos

- Renderização da tela de login;
- Validação de campos obrigatórios;
- Cadastro de usuário;
- Login com dados válidos;
- Login com dados inválidos;
- Redirecionamento após login;
- Proteção de rotas internas;
- Cadastro de senha;
- Mostrar e ocultar senha;
- Edição de senha;
- Exclusão de senha;
- Busca de registros;
- Logout.

---

## 📌 Status

```text
🚧 Em desenvolvimento
```

---

## 👨‍💻 Autor

**Sandro Nogueira**

- GitHub: [SandroNogueiraBittencourt](https://github.com/SandroNogueiraBittencourt)

---

## 📚 Observação

Este projeto possui finalidade acadêmica e depende do backend para autenticação, persistência dos dados e regras de negócio.
