export const emailRules = [
  (v: string): boolean | string => !!v || 'Введите Email',
  (v: string): boolean | string => /.+@.+/.test(v) || 'E-mail некорректный',
];

export const passwordRules = [
  (v: string): boolean | string => !!v || 'Введите пароль',
  (v: string): boolean | string => (v && v.length >= 5) || 'Пароль должен быть больше 6 символов',
];
