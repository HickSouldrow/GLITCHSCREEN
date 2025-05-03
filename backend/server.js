const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

// Chave secreta para assinar os JWTs
const JWT_SECRET = 'minha_chave_secreta';

// Endpoint para login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const response = await fetch(`http://localhost:5000/users?username=${username}`);
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
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

// Endpoint para criar novo usuário
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const response = await fetch(`http://localhost:5000/users?username=${username}`);
    const users = await response.json();

    if (users.length > 0) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await fetch('http://localhost:5000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password: hashedPassword }),
    });

    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});