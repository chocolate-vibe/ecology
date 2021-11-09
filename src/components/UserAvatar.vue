<template>
  <v-avatar
    :color="$getUserColor(user.id)"
    :size="size"
    class="mr-2 mt-1"
  >
    <span class="white--text text-subtitle-1">{{ $getUserInitials(user) }}</span>
  </v-avatar>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class UserAvatar extends Vue {
  @Prop({ required: false, default: 48 })
  size?: number | string;

  @Prop({ required: true })
  user: any;
}
</script>
