const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const generateRandomToken = require('./function/generateRandomToken');
const { validateLogin } = require('./function/isValidEmail');
const { validateRequestBody, validateAuthorizationHeader } = require('./middleware/middleware');

const app = express();
app.use(express.json());

const arquivo = path.join(__dirname, 'talker.json');
let nextId = 6;

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

app.get('/talker', async (req, res) => {
  try {
    const talker = await lendoArquivo();
    res.status(200).json(talker);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});
/* function isValidDate(date) {
  const dateRegex = /^([0-2][0-9]|(3)[0-1])\/(((0)[0-9])|((1)[0-2]))\/\d{4}$/;
  return dateRegex.test(date);
} */
/* function filterTalker(searchTerm, rate, date, talker) {
  const isMatchingSearchTerm = !searchTerm || talker.name.toLowerCase().includes(searchTerm.toLowerCase());
  const isMatchingRate = !rate || (talker.talk.rate === Number(rate) && rate >= 1 && rate <= 5);
  const isMatchingDate = !date || (isValidDate(date) && talker.talk.watchedAt === date);
  return isMatchingSearchTerm && isMatchingRate && isMatchingDate;
}
app.get('/talker/search', validateAuthorizationHeader, async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const { rate } = req.query;
    const { date } = req.query;
    const currentTalkers = await lendoArquivo();
    const filteredTalkers = currentTalkers.filter(filterTalker.bind(null, searchTerm, rate, date));
    
    res.status(200).json(filteredTalkers);
  } catch (err) {
    res.status(400).json({ message: 'Erro interno do servidor' });
  }
}); */

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

app.post('/talker', validateAuthorizationHeader, validateRequestBody, async (req, res) => {
  try {
    const { name, age, talk } = req.body;
    const talker = { id: nextId, name, age, talk };
    const currentTalkers = await lendoArquivo();
    nextId += 1;
    currentTalkers.push(talker);
    await fs.writeFile(arquivo, JSON.stringify(currentTalkers));
    res.status(201).json(talker);
  } catch (err) {
    res.status(400).json({ message: 'Erro interno do servidor' });
  }
});

app.put('/talker/:id', validateRequestBody, validateAuthorizationHeader, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, talk } = req.body;
    const currentTalkers = await lendoArquivo();
    const talkerToUpdate = currentTalkers.find((talker) => talker.id === Number(id));
    if (!talkerToUpdate) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    talkerToUpdate.name = name;
    talkerToUpdate.age = age;
    talkerToUpdate.talk = talk;
    await fs.writeFile(arquivo, JSON.stringify(currentTalkers, null, 2));

    res.status(200).json(talkerToUpdate);
  } catch (err) {
    res.status(400).json({ message: 'Erro interno do servidor' });
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