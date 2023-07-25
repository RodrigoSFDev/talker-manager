const { validateName, 
  validateAge, 
  validateTalk, 
  validateToken } = require('../function/validations');

function validateRequestBody(req, res, next) {
  const { name, age, talk } = req.body;

  const nameError = validateName(name);
  if (nameError) return res.status(400).json({ message: nameError });

  const ageError = validateAge(age);
  if (ageError) return res.status(400).json({ message: ageError });

  const talkError = validateTalk(talk);
  if (talkError) return res.status(400).json({ message: talkError });

  next();
}

function validateAuthorizationHeader(req, res, next) {
  const { authorization } = req.headers;

  const tokenError = validateToken(authorization);
  if (tokenError) return res.status(401).json({ message: tokenError });

  next();
}

module.exports = {
  validateRequestBody,
  validateAuthorizationHeader,
};