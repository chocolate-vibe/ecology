<template>
  <v-card
    @click="$router.push(`/lesson/${lessonId}`)"
    :loading="loading"
    elevation="10"
    outlined
    class="video-card"
    tile
  >
    <div
      :class="{ shine: loading, placeholder: loading }"
      class="video-card__preview mb-3"
    >
      <img
        v-if="!loading"
        :src="posterUrl"
      >
    </div>
    <div
      :class="{ shine: loading, placeholder: loading }"
      class="video-card__title  px-3 pb-3"
    >
      <user-avatar
        :user="teacher"
        size="40"
        class="mr-3"
      />
      <div>
        #{{ lessonId }} {{ teacher.lastName }} {{ teacher.firstName }} <br> {{ title }}
        <div class="grey--text caption">{{ formattingTimeDate }}</div>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import UserAvatar from '@/components/UserAvatar.vue';
import { ITeacher } from '@/types/teacher';

@Component({
  components: {
    UserAvatar,
  },
})
export default class VideoCard extends Vue {
  @Prop({ default: false })
  @Prop() protected readonly loading!: boolean;
  @Prop() protected readonly lessonId!: number;
  @Prop() protected readonly posterUrl!: string;
  @Prop() protected readonly title!: string;
  @Prop() protected readonly teacher!: ITeacher;
  @Prop() protected readonly date!: string;

  get formattingTimeDate() {
    return this.$formattingDate(this.date);
  }
}
</script>

<style lang="scss" scoped>
.video-card {
  display: flex;
    flex-direction: column;
    justify-content: space-between;

  &__preview {
    height: 150px;
    img {
      object-fit: cover;
      height: 100%;
      width: 100%;
    }
  }
  &__title {
    font-size: 16px;
    display: flex
  }
}
</style>
