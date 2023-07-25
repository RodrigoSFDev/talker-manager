/* function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
*/

function validateLogin(email, password) {
  if (!email) {
    return 'O campo "email" é obrigatório';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'O "email" deve ter o formato "email@email.com"';
  }

  if (!password) {
    return 'O campo "password" é obrigatório';
  }

  if (password.length < 6) {
    return 'O "password" deve ter pelo menos 6 caracteres';
  }

  return null; 
}

module.exports = { validateLogin };