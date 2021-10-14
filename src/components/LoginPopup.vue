<template>
  <v-overlay v-model="value" color="transparent">
    <v-card
      class="login"
      v-click-outside="hide"
      light
      tile
      width="400"
      color="transparent"
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
          @click="login"
          color="success"
          class="ml-2 mb-3 rounded-0"
        >
          Войти
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { emailRules, passwordRules } from '@/utils/validation';

@Component
export default class LoginPage extends Vue {
  @Prop() private readonly value!: boolean;
  email = 'ecology@eds.ru';
  password = null;
  isValid = false;
  emailRules = emailRules;
  passwordRules = passwordRules;

  hide(): void {
    if (this.value) this.$emit('hide');
  }
  /**
   * Авторизация
   */
  async login(): Promise<void> {
    try {
      const { data } = await this.$axios.get<{ token: string }>( // post
        '/data/auth.json',
        // { email: this.email, password: this.password }
      );
      // this.$axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;
      localStorage.setItem('auth_token', `${data.token}`);
      this.$emit('hide');
    } catch (err) {
      throw err.response.data.error;
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  background: rgba(255, 255, 255, 0.35);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(20px);
}
</style>
