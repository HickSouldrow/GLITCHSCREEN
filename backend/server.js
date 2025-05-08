require('dotenv').config();

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const JSON_SERVER_URL = process.env.JSON_SERVER_URL;

app.use(express.json());
app.use(cors());

// Endpoint para login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const response = await fetch(`${JSON_SERVER_URL}/users?username=${username}`);
    const users = await response.json();

    if (users.length === 0) {
      return res.status(400).json({ message: 'Usuário ou senha inválidos' });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Usuário ou senha inválidos' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

// Endpoint para criar novo usuário
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const response = await fetch(`${JSON_SERVER_URL}/users?username=${username}`);
    const users = await response.json();

    if (users.length > 0) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await fetch(`${JSON_SERVER_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password: hashedPassword }),
    });

    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
