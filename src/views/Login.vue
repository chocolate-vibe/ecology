<template>
  <v-card tile class="auth mt-16 mx-auto" max-width="374">
    <v-card-title>Авторизация</v-card-title>
    <v-card-text>
      <v-form v-model="isValid">
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Email"
          required
        />
        <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="Пароль"
          type="password"
          required
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn
        :disabled="!isValid"
        @click="login"
        color="success"
        class="ml-2 mb-3 rounded-0"
      >
        Войти
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class LoginPage extends Vue {
  email = 'ecology@eds.ru';
  // email = null;
  password = null;
  isValid = false;
  emailRules = [
    (v: any) => !!v || 'Введите Email',
    (v: any) => /.+@.+/.test(v) || 'E-mail некорректный',
  ];
  passwordRules = [
    (v: any) => !!v || 'Введите пароль',
    (v: any) => (v && v.length >= 5) || 'Пароль должен быть больше 6 символов',
  ];

  /**
   * Авторизация
   */
  async login(): Promise<void> {
    try {
      const { data } = await this.$axios.get<{ token: string }>( // post
        '/data/auth.json',
        // { email: this.email, password: this.password }
      );
      this.$axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;
      localStorage.setItem('auth_token', `${data.token}`);
      this.$router.push('/');
    } catch (err) {
      throw err.response.data.error;
    }
  }
}
</script>
