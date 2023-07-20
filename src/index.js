const express = require('express');
const path = require('path');
const fs = require('fs').promises;

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
