<template>
  <div
    :class="{ arrows: arrows }"
    class="horizontal-scroll__container"
  >
    <v-btn
      v-if="arrows"
      class="horizontal-scroll__button left"
      fab
      small
      color="grey darken-3"
      @click="clickRight"
    >
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
    <div
      ref="horizontal-scroll"
      :class="{ scrollbar: scrollbar, drag: drag }"
      class="horizontal-scroll d-flex flex-nowrap"
    >
      <slot />
    </div>
    <v-btn
      v-if="arrows"
      class="horizontal-scroll__button right"
      fab
      small
      color="grey darken-3"
      @click="clickLeft"
    >
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch, Prop } from 'vue-property-decorator';

@Component({ name: 'HorizontalScroll' })
export default class HorizontalScroll extends Vue {
  @Ref('horizontal-scroll') container!: HTMLDivElement;
  @Prop({ default: true }) protected readonly arrows!: boolean;
  @Prop({ default: false }) protected readonly scrollbar!: boolean;
  @Prop({ default: true }) protected readonly wheel!: boolean;
  @Prop({ default: true }) protected readonly drag!: boolean;

  private left = 0; // отпустили мышку - сохраняем положение скролла
  private draggable = false;
  private coorX = 0; // нажали мышку - сохраняем координаты.
  private speed = 1; // Скорость скролла.

  @Watch('draggable')
  changeCursor(draggable: boolean) {
    if (draggable) this.container.style.cursor = 'grabbing';
    else this.container.style.cursor = 'grab';
  }

  mounted() {
    this.container.addEventListener('mousedown', this.mousedown);
    this.container.addEventListener('wheel', this.wheelGo);
    document.addEventListener('mouseup', this.mouseup);
    document.addEventListener('mousemove', this.mousemove);
  }

  beforeDestroy() {
    document.removeEventListener('mouseup', this.mouseup);
    document.removeEventListener('mousemove', this.mousemove);
    this.container.removeEventListener('mousedown', this.mousedown);
    this.container.removeEventListener('wheel', this.wheelGo);
  }

  mousemove(e: any) {
    if (this.draggable) {
      this.container.scrollLeft = this.left
        + (this.coorX - e.pageX) * this.speed
        + (this.arrows ? 50 : 0);
    }
  }

  mouseup() {
    this.draggable = false;
    if (this.container.scrollLeft) this.left = this.container.scrollLeft;
  }

  mousedown(e: any) {
    this.draggable = !!this.drag;
    this.left = this.container.scrollLeft;
    this.coorX = e.pageX - this.container.offsetLeft;
  }

  wheelGo(e: any) {
    if (this.wheel) {
      e.preventDefault();
      this.container.scrollLeft += e.deltaY;
    }
  }

  clickRight() {
    this.container.style.scrollBehavior = 'smooth';
    this.container.scrollLeft -= this.container.scrollWidth / 2;
    this.container.style.scrollBehavior = 'auto';
  }

  clickLeft() {
    this.container.style.scrollBehavior = 'smooth';
    this.container.scrollLeft += this.container.scrollWidth / 2;
    this.container.style.scrollBehavior = 'auto';
  }
}
</script>

<style lang="scss" scoped>
.horizontal-scroll {
  scroll-behavior: auto;
  overflow-x: auto;
  min-width: 100%;
  user-select: none;
  &::-webkit-scrollbar {
    display: none;
    height: 5px;
    background: --grey-darken-4;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: --grey-darken-3;
  }
  &.scrollbar {
    &::-webkit-scrollbar {
      display: block;
    }
  }
  &__container {
    position: relative;
    &.arrows {
      padding: 0 50px 0;
    }
  }
  &.drag {
    cursor: grab;
  }

  &__button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    &.right {
      right: 0;
    }

    &.left {
      left: 0;
    }
  }
}
</style>
