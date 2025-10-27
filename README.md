# estacionamento-sys

[Vídeo de Demonstração](https://drive.google.com/file/d/1Wb7BhyuvKTsLVcfYQAcJMr6FiWXt-lSi/view?usp=sharing)

## Funcionalidades

- **TypeScript** - Para segurança de tipos e melhor experiência do desenvolvedor
- **React Router** - Roteamento declarativo para React
- **TailwindCSS** - CSS baseado em utilitários para desenvolvimento rápido de UI
- **shadcn/ui** - Componentes de UI reutilizáveis
- **Hono** - Framework de servidor leve e performático
- **oRPC** - APIs de ponta a ponta com tipagem e integração OpenAPI
- **Bun** - Ambiente de execução
- **Prisma** - ORM com TypeScript em primeiro lugar
- **PostgreSQL** - Mecanismo de banco de dados
- **Autenticação** - Better-Auth
- **Biome** - Linting e formatação
- **Turborepo** - Sistema de monorepo otimizado

## Primeiros Passos

Primeiro, instale as dependências:

```bash
npm install -g bun
bun install
```

## Configuração do Banco de Dados

Este projeto usa PostgreSQL com Prisma.

1. Certifique-se de ter um banco PostgreSQL configurado. (Dentro de `packages/db` há um `docker-compose.yml` que sobe um banco)

```
cd packages/db && docker compose up -d --build
```

2. Atualize seu arquivo `apps/server/.env` com os detalhes da conexão do PostgreSQL. (Se você usou o Docker do exemplo acima, este `.env` funcionará instantaneamente)

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/estacionamento-sys
BETTER_AUTH_SECRET=QviDmV9Oz3O7bEAjCzBI4vSUF1LcUrdd
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:5173
```

3. Configure o `.env` do frontend em `apps/web/.env`

```
VITE_SERVER_URL=http://localhost:3000
```

4. Gere o cliente do Prisma e envie o schema:

```bash
bun run db:migrate
bun run db:push
```

Em seguida, rode o servidor de desenvolvimento:

```bash
bun dev
```

Para ver o banco de dados na interface:

```bash
bun run db:studio
```

Para ver o docs OpenAPI / Scalar Docs, abre o link:

```
http://localhost:3000/api-reference
```

Para dar privilégios de admin ao seu usuário:
<img width="1896" height="250" alt="admin-user" src="https://github.com/user-attachments/assets/f349e2b7-c1ad-4404-80c7-8a50ab847c34" />


Abra [http://localhost:5173](http://localhost:5173) no navegador para ver a aplicação web.
A API está rodando em [http://localhost:3000](http://localhost:3000).

## Estrutura do Projeto

```
estacionamento-sys/
├── apps/
│   ├── web/         # Aplicação frontend (React + React Router)
│   └── server/      # API backend (Hono, ORPC)
├── packages/
│   ├── api/         # Camada de API / regras de negócio
│   ├── auth/        # Configuração e lógica de autenticação
│   └── db/          # Schema do banco e queries
```

## Scripts Disponíveis

- `bun dev`: Inicia todas as aplicações em modo de desenvolvimento
- `bun build`: Compila todas as aplicações
- `bun dev:web`: Inicia apenas a aplicação web
- `bun dev:server`: Inicia apenas o servidor
- `bun check-types`: Verifica os tipos TypeScript em todos os apps
- `bun db:push`: Envia mudanças do schema para o banco
- `bun db:studio`: Abre a interface do banco de dados
- `bun check`: Executa formatação e linting com Biome
