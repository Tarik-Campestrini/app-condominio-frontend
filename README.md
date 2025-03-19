# Backend - App Condomínio

Este é o backend do sistema **App Condomínio**, desenvolvido com **Node.js**, **Express** e **MongoDB**. O sistema permite o cadastro, login e gestão de usuários do condomínio.

## Tecnologias Utilizadas
- **Node.js** - Runtime JavaScript
- **Express** - Framework para criação de API
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para interação com MongoDB
- **bcryptjs** - Para hashing de senhas
- **dotenv** - Para configuração de variáveis de ambiente
- **cors** - Para permitir requisições de diferentes origens

## Estrutura de Pastas
```
app-condominio-backend/
├── src/
│   ├── config/
│   │   ├── db.js  # Conexão com MongoDB
│   ├── controllers/
│   │   ├── authController.js  # Controle de autenticação
│   │   ├── userController.js  # Controle de usuários
│   ├── models/
│   │   ├── User.js  # Modelo de usuário
│   ├── routes/
│   │   ├── authRoutes.js  # Rotas de autenticação
│   │   ├── userRoutes.js  # Rotas de usuários
├── server.js  # Arquivo principal do servidor
├── .env  # Configuração de variáveis de ambiente
├── package.json  # Dependências do projeto
```

## Configuração e Instalação
1. **Clone o repositório:**
   ```sh
   git clone https://github.com/seu-usuario/app-condominio-backend.git
   ```
2. **Acesse a pasta do projeto:**
   ```sh
   cd app-condominio-backend
   ```
3. **Instale as dependências:**
   ```sh
   npm install
   ```
4. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto e defina:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://usuario:senha@seucluster.mongodb.net/nomeDoBanco
   ```

5. **Inicie o servidor:**
   ```sh
   npm start
   ```

## Rotas da API

### Autenticação (`/api/auth`)
| Método | Rota            | Descrição               |
|---------|----------------|--------------------------|
| POST    | /register      | Cadastro de usuário     |
| POST    | /login         | Login de usuário        |

### Usuários (`/api/users`)
| Método | Rota       | Descrição               |
|---------|-----------|--------------------------|
| GET     | /         | Listar usuários         |
| PUT     | /:id      | Atualizar usuário       |
| DELETE  | /:id      | Deletar usuário         |

## Autor
Projeto desenvolvido por **Seu Nome**.

