function validateName(name) {
  if (!name) {
    return 'O campo "name" é obrigatório';
  }

  if (name.length < 3) {
    return 'O "name" deve ter pelo menos 3 caracteres';
  }

  return null;
}

function validateAge(age) {
  if (!age) {
    return 'O campo "age" é obrigatório';
  }

  if (typeof age !== 'number' || !Number.isInteger(age) || age < 18) {
    return 'O campo "age" deve ser um número inteiro igual ou maior que 18';
  }

  return null;
}

// eslint-disable-next-line max-lines-per-function, complexity, sonarjs/cognitive-complexity
function validateTalk(talk) {
  if (!talk) {
    return 'O campo "talk" é obrigatório';
  }
  const { watchedAt, rate } = talk;
  if (!watchedAt || typeof watchedAt !== 'string' || watchedAt.trim() === '') {
    return 'O campo "watchedAt" é obrigatório';
  }
  const watchedAtRegex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
  if (!watchedAtRegex.test(watchedAt)) {
    return 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"';
  }
  if (rate === undefined) {
    return 'O campo "rate" é obrigatório';
  }
  if (Number(rate) === 0) {
    return 'O campo "rate" deve ser um número inteiro entre 1 e 5';
  }
  if (typeof rate !== 'number' || !Number.isInteger(rate) || Number(rate) < 1 || Number(rate) > 5) {
    return 'O campo "rate" deve ser um número inteiro entre 1 e 5';
  }
  return null;
}

function validateToken(token) {
  if (!token) {
    return 'Token não encontrado';
  }

  if (typeof token !== 'string' || token.length !== 16) {
    return 'Token inválido';
  }

  return null;
}

module.exports = {
  validateName,
  validateAge,
  validateTalk,
  validateToken,
};