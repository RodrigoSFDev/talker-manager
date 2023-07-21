const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const generateRandomToken = require('./function/generateRandomToken');
const { validateLogin } = require('./function/isValidEmail');

const app = express();
app.use(express.json());

const arquivo = path.join(__dirname, 'talker.json');

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

const lendoArquivo = async () => {
  try {
    const data = await fs.readFile(arquivo);
    const talker = JSON.parse(data);
    return talker;
  } catch (error) {
    console.error(`Erro ao tentar lê o arquivo: ${error.message}`);
  }
  };

  app.get('/talker', async (req, res) => {
    try {
      const talker = await lendoArquivo();
      res.status(200).json(talker);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  });

  app.get('/talker/:id', async (req, res) => {
    try {
      const talkers = await lendoArquivo();
      const talker = talkers.find(({ id }) => id === Number(req.params.id));
      if (!talker) {
        return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
      }
      res.status(200).json(talker);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  });
  app.post('/login', (req, res) => {
    try {
      const { email, password } = req.body;
      const validationError = validateLogin(email, password);
      if (validationError) {
        return res.status(400).json({ message: validationError });
      }
      const token = generateRandomToken();
      res.status(200).json({ token });
    } catch (err) {
      res.status(500).send({ message: 'Erro interno do servidor' });
    }
  });