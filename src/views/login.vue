<template>
  <v-card
    :loading="loading"
    dark
    tile
    class="auth mt-16 mx-auto"
    max-width="374"
  >
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
    <v-card-actions class="pa-4">
      <v-btn
        :disabled="!isValid"
        @click="signIn"
        color="success"
        class="rounded-0"
        large
        width="100%"
      >
        Войти
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { store } from '@/store';
import { emailRules, passwordRules } from '@/utils/validation';
import text from '@/utils/text';

@Component
export default class LoginPage extends Vue {
  private errors = '';
  loading = false;
  email = '';
  password = '';
  isValid = false;
  emailRules = emailRules;
  passwordRules = passwordRules;

  async signIn(): Promise<void> {
    if (this.email && this.password) {
      await store.auth.actions
        .fetchAuth({ email: this.email, password: this.password })
        .then(() => {
          store.notify.mutations.showNotify({
            type: 'success',
            content: text.login,
          });
          this.$router.push('/').catch(() => ({}));
        })
        .catch((error: string) => {
          store.notify.mutations.showNotify({
            type: 'error',
            content: error,
          });
        });
    }
  }
}
</script>
