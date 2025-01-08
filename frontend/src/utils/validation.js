export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^\+?[1-9]\d{1,14}$/;
  return re.test(phone);
};

export const validatePassword = (password) => {
  return password.length >= 8;
}; 