<template>
  <div>
    Name: {{ fullName }}
    Message: {{ message }}
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

interface User {
  firstName: string
  lastName: string
}

@Component
export default class YourComponent extends Vue {
  @Prop({ type: Object,
  required: false,
  default: () => {
          return {
            firstName: 'firstName',
            lastName: 'lastName',
          };
        } }) readonly user!: User

  message = 'This is a message'

  get fullName(): string {
    return this.$getUserFullName(this.user);
  }
}
</script>

<style lang="scss" scoped></style>
