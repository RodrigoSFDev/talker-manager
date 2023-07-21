function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const validateLogin = (email, password) => {
  if (!email || !password) {
    return 'Email e senha são obrigatórios';
  }

  if (!isValidEmail(email)) {
    return 'Email inválido';
  }

  if (password.length < 6) {
    return 'A senha deve ter pelo menos 6 caracteres';
  }
  return null;
};

module.exports = { isValidEmail, validateLogin };