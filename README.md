# Projeto Token Node

Este projeto utiliza **Node.js com Express** e **MongoDB via Docker**.

---

## 🚀 Rodar o projeto com banco de dados existente

1. Verifique se o container MongoDB está ativo:

```bash
docker start mongo
```

2. Rode o servidor:

```bash
node server.js
```

> A conexão será feita com o banco MongoDB já existente em `localhost:27017`.

---

## 🆕 Criar um novo banco com Docker

1. Suba o MongoDB com Docker Compose:

```bash
docker compose up -d
```

2. O banco será acessível em:

```
mongodb://admin:admin123@localhost:27017/mongodb?authSource=admin
```

3. Altere seu `.env` com essa conexão:

```env
MONGODB_URI=mongodb://admin:admin123@localhost:27017/mongodb?authSource=admin
```

4. Rode o servidor novamente:

```bash
node server.js
```

---

## 📄 Acessar a documentação Swagger

Após iniciar o servidor, acesse:

```
http://localhost:3000/api-docs
```

---

## 🛠️ Variáveis de ambiente `.env` (exemplo)

```env
MONGODB_URI=mongodb://localhost:27017/mongodb
PORT=3000
```

> Altere a URI conforme o banco que estiver utilizando (autenticado ou local sem auth).

---
