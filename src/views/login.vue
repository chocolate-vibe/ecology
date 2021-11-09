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
    <v-card-actions>
      <v-btn
        :disabled="!isValid"
        @click="signIn"
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
import { store } from '@/store';
import { emailRules, passwordRules } from '@/utils/validation';

@Component
export default class LoginPage extends Vue {
  private errors = '';
  loading = false;
  email = null;
  password = null;
  isValid = false;
  emailRules = emailRules;
  passwordRules = passwordRules;

  // async userLogin(): Promise<void> {
  //   return this.$auth
  //     .loginWith('local', {
  //       data: { email: this.email, password: this.password },
  //     })
  //     .then(() => {
  //       store.notify.mutations.showNotify({
  //         type: 'success',
  //         content: 'Добро пожаловать!',
  //       });
  //     })
  //     .catch((err: any) => {
  //       this.errors = err.response.data.error;
  //       store.notify.mutations.showNotify({ type: 'error', content: this.errors });
  //     });
  // }
  async signIn(): Promise<void> {
    try {
      if (this.email && this.password) {
        await store.auth.actions.fetchAuth({ email: this.email, password: this.password })
          .then(() => {
            store.notify.mutations.showNotify({
              type: 'success',
              content: 'Добро пожаловать!',
            });
          })
          .catch((err: any) => {
            this.errors = err.response.data.error;
            store.notify.mutations.showNotify({ type: 'error', content: this.errors });
          });
      }
    } catch (err) {
      console.log(err);
    }
  }
}
</script>
