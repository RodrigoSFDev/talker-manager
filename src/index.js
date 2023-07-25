const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const generateRandomToken = require('./function/generateRandomToken');
const { validateLogin } = require('./function/isValidEmail');
const { validateRequestBody, validateAuthorizationHeader } = require('./middleware/middleware');

const app = express();
app.use(express.json());

const arquivo = path.join(__dirname, 'talker.json');
let nextId = 1;

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
    const data = await fs.readFile(arquivo, 'utf8');
    const talker = JSON.parse(data);
    return talker || [];
  } catch (error) {
    console.error(`Erro ao tentar lê o arquivo: ${error.message}`);
    return [];
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

app.post('/talker', validateAuthorizationHeader, validateRequestBody, async (req, res) => {
    try {
      const { name, age, talk } = req.body;
      const talker = { id: nextId, name, age, talk };
      nextId += 1;
      const currentTalkers = await lendoArquivo();
      currentTalkers.push(talker);
      await fs.writeFile(arquivo, JSON.stringify(currentTalkers, null, 2));
      res.status(201).json(talker);
    } catch (err) {
      res.status(400).json({ message: 'Erro interno do servidor' });
    }
});

app.put('/talker/:id', validateAuthorizationHeader, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, talk } = req.body;
    const movies = await lendoArquivo();
    const index = movies.findIndex((element) => element.id === Number(id));
    movies[index] = { id: Number(id), name, age, talk };
    const updatedMovies = JSON.stringify(movies, null, 2);
    await fs.writeFile(arquivo, updatedMovies);
    res.status(200).json(movies[index]);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.delete('/talker/:id', validateAuthorizationHeader, async (req, res) => {
  try {
    const { id } = req.params;
    const talkers = await lendoArquivo();
    const filteredTalkers = talkers.filter((talker) => talker.id !== Number(id));
    const updatedTalkers = JSON.stringify(filteredTalkers, null, 2);
    await fs.writeFile(arquivo, updatedTalkers);
    res.status(204).end();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});