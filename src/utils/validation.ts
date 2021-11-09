export const emailRules = [
  (v: string): boolean | string => !!v || 'Введите Email',
  (v: string): boolean | string => /.+@.+/.test(v) || 'E-mail некорректный',
];

export const passwordRules = [
  (v: string): boolean | string => !!v || 'Введите пароль',
  (v: string): boolean | string => (v && v.length >= 5) || 'Пароль должен быть больше 6 символов',
];

export const passwordEdit = [
  (v: string) => !v
    || (v && v.length >= 6 && v.length <= 16)
    || 'Пароль должен быть больше 6 и меньше 16 символов',
];

export const passwordCreate = [
  (v: string) => !!v || 'Введите пароль',
  (v: string) => (v && v.length >= 6 && v.length <= 16)
    || 'Пароль должен быть больше 6 и меньше 16 символов',
];

export const name = [(v: string) => !!v || 'Поле не может быть пустым'];
