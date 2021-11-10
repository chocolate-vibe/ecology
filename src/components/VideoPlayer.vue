<template>
  <div
    ref="player"
    class="player"
  >
    <video
      ref="video"
      :poster="poster"
      :class="{ 'zoom-face': zoomFace, fullscreen: fullscreen }"
      class="video"
      preload="auto"
      @loadedmetadata="loadedmetadata()"
      @play="
        isPlay = true;
        isPlayed = true;
      "
      @pause="isPlay = false"
      @timeupdate="timeupdate()"
      @progress="bufferProgress()"
      @click="togglePlay()"
      @canplay="loading = false"
    >
      <source :src="src">
    </video>
    <div
      :class="{
        hide: (holdOnSlider && isPlayingBeforeHoldOnSlider) || isPlay,
      }"
      class="playback-animation toggle"
      @click="togglePlay()"
    >
      <v-icon x-large>
        {{ !isPlayed ? "mdi-play" : isPlay ? "mdi-play" : "mdi-pause" }}
      </v-icon>
    </div>
    <div
      :class="{ hide: !arrowRightPress }"
      class="playback-animation right"
    >
      <v-icon x-large>mdi-arrow-right-thick</v-icon>
    </div>
    <div
      :class="{ hide: !arrowLeftPress }"
      class="playback-animation left"
    >
      <v-icon x-large>mdi-arrow-left-thick</v-icon>
    </div>
    <div
      id="video-controls"
      class="video-controls"
    >
      <div class="video-controls-background" />
      <div
        ref="time-progress"
        class="time-progress"
        @mousemove="updateTimeTooltip"
      >
        <v-slider
          id="video-progress"
          v-model="currentTime"
          :max="duration"
          :loading="loading ? 'error' : false"
          :readonly="loading"
          loader-height="4"
          color="red lighten"
          class="video-progress"
          hide-details
          min="0"
          @click="() => setCurrentTime(currentTime)"
          @mousedown="mousedownSlider()"
          @mouseup="mouseupSlider()"
        />
        <div
          ref="time-tooltip"
          class="time-tooltip"
        />
        <div
          ref="buffer"
          class="buffer"
        />
        <div
          ref="intervals"
          class="intervals"
        />
      </div>

      <div class="bottom-controls">
        <div class="left-controls">
          <button
            :data-title="
              intervals ? 'Предыдущий интервал' : 'Интервалы не установлены'
            "
            :disabled="!intervals"
            @click="prevInterval"
          >
            <v-icon> mdi-skip-previous </v-icon>
          </button>
          <button
            ref="play"
            :data-title="isPlay ? 'Пауза' : 'Смотреть'"
            @click="togglePlay()"
          >
            <v-icon x-large>
              {{
                (holdOnSlider && isPlayingBeforeHoldOnSlider) || isPlay
                  ? "mdi-pause"
                  : "mdi-play"
              }}
            </v-icon>
          </button>
          <button
            :data-title="
              intervals ? 'Следующий интервал' : 'Интервалы не установлены'
            "
            :disabled="!intervals"
            @click="nextInterval"
          >
            <v-icon> mdi-skip-next </v-icon>
          </button>

          <div class="volume-controls mr-3">
            <button
              :data-title="muted ? 'Включить звук' : 'Отключение звука'"
              @click="muted = !muted"
            >
              <v-icon>
                {{
                  muted
                    ? "mdi-volume-off"
                    : volume > 66
                      ? "mdi-volume-high"
                      : volume > 33
                        ? "mdi-volume-medium"
                        : "mdi-volume-low"
                }}
              </v-icon>
            </button>
            <v-slider
              v-model="volume"
              :thumb-color="'grey darken-1'"
              color="grey lighten-1"
              class="volume"
              hide-details
              thumb-label
            />
          </div>

          <div class="time mr-3">
            <time id="time-elapsed">{{
              currentTime ? $secondsToTime(currentTime) : "00:00:00"
            }}</time>
            <span> / </span>
            <time id="duration">{{ $secondsToTime(duration) }}</time>
          </div>
          <v-chip
            v-if="metricTitle"
            class="metric-title"
            close
            color="orange"
            outlined
            small
            @click:close="$emit('reset-intervals')"
          >
            {{ metricTitle }}
          </v-chip>
        </div>

        <div class="right-controls">
          <button
            :data-title="
              zoomFace ? 'Убрать приближение' : 'Приблизить web-камеру'
            "
            class="face__button"
            @click="zoomFace = !zoomFace"
          >
            <v-icon
              :color="zoomFace ? `${$accent} lighten-2` : 'white'"
              large
              class="face__icon"
            >
              mdi-account-box-multiple-outline
            </v-icon>
          </button>
          <button
            :disabled="!supportPictureInPicture"
            :data-title="
              supportPictureInPicture
                ? 'Мини-проигрыватель'
                : 'Ваш браузер не поддерживает режим мини-проигрывателя'
            "
            @click="togglePip()"
          >
            <v-icon
              :color="!supportPictureInPicture ? 'grey darken-3' : 'white'"
              class="icon-content-duplicate"
              large
            >
              mdi-content-duplicate
            </v-icon>
          </button>
          <button
            data-title="Скорость воспроизведения"
            class="speed__button"
            @click="showSpeedList = !showSpeedList"
          >
            <v-icon
              :color="
                showSpeedList || speedList[speedIndx] !== 1
                  ? `${$accent} lighten-2`
                  : 'white'
              "
              large
              class="speed__icon"
            >
              mdi-play-speed
            </v-icon>
            <span
              v-if="speedList[speedIndx] !== 1"
              class="speed__button-text text--lighten-2"
              :class="`${accent}--text`"
              v-html="`x&nbsp;${speedList[speedIndx]}`"
            />
          </button>
          <v-list
            :class="{ hide: !showSpeedList }"
            dense
            class="speed__list"
          >
            <v-list-item-group v-model="speedIndx">
              <v-list-item
                v-for="speed in speedList"
                :key="`speed-${speed}`"
              >
                <v-list-item-title v-text="speed === 1 ? 'Обычная' : speed" />
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <button
            :data-title="
              fullscreen ? 'Выход из полноэкранного режима' : 'Во весь экран'
            "
            @click="toggleFullScreen()"
          >
            <v-icon large>
              {{ fullscreen ? "mdi-fullscreen-exit" : "mdi-fullscreen" }}
            </v-icon>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref, Watch } from 'vue-property-decorator';
import { metricValuesWithIntervals } from '@/types/metric';

@Component
export default class videoPlayer extends Vue {
  @Ref('video') video!: HTMLVideoElement & { requestPictureInPicture: any };
  @Ref('player') player!: HTMLDivElement;
  @Ref('buffer') buffer!: HTMLDivElement;
  @Ref('intervals') intervalsDOM!: HTMLDivElement;
  @Ref('time-tooltip') timeTooltip!: HTMLDivElement;
  @Ref('time-progress') timeProgress!: HTMLDivElement;
  @Prop() protected readonly src!: string;
  @Prop() protected readonly poster!: string;

  public isPlay = false;
  public isPlayed = false;
  public volume = 50;
  public muted = false;
  public duration = 0;
  public currentTime = 0;
  public isPlayingBeforeHoldOnSlider = false;
  public holdOnSlider = false;
  public loading = true;
  public fullscreen = false;
  public zoomFace = false;
  public pictureInPicture = false;
  public showSpeedList = false;
  public speedList = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  public speedIndx = 3;
  public arrowLeftPress = false;
  public arrowRightPress = false;
  public metricTitle = '';
  public intervals: metricValuesWithIntervals | null = null;
  public startIntervalTime: number | null = null;
  public stopIntervalTime: number | null = null;

  get supportPictureInPicture(): boolean {
    if (!('pictureInPictureEnabled' in document)) return false;
    return true;
  }

  loadedmetadata(): void {
    this.duration = this.video.duration;
  }

  async togglePlay() {
    if (this.loading) return;
    if (this.video?.paused || this.video?.ended) await this.video.play();
    else this.video.pause();
  }

  timeupdate(): void {
    if (this.loading) return;
    this.currentTime = this.video?.currentTime;
    this.$emit('timeupdate', this.currentTime);
    if (this.stopIntervalTime) {
      if (Math.floor(this.currentTime) === this.stopIntervalTime) {
        this.video.pause();
        this.stopIntervalTime = null;
      }
    }
  }

  setCurrentTime(time: number): void {
    if (this.loading) return;
    this.video.currentTime = time;
    this.currentTime = this.video.currentTime;
    if (this.stopIntervalTime) {
      if (
        time < Number(this.startIntervalTime)
        || time > Number(this.stopIntervalTime)
      ) {
        this.startIntervalTime = null;
        this.stopIntervalTime = null;
      }
    }
  }

  updateTimeTooltip(event: any): void {
    const coordinatesPlayer = this.timeProgress.getBoundingClientRect();
    const cursorX = event.clientX - coordinatesPlayer.left;
    let secondsFromStart = Math.round(
      (cursorX / coordinatesPlayer.width) * this.duration,
    );

    if (secondsFromStart < 0) secondsFromStart = 0;
    if (secondsFromStart > this.duration) secondsFromStart = this.duration;

    this.timeTooltip.textContent = `${this.$secondsToTime(secondsFromStart)}`;
    this.timeTooltip.style.left = `${cursorX}px`;
  }

  mousedownSlider(): void {
    this.isPlayingBeforeHoldOnSlider = this.isPlay;
    this.holdOnSlider = true;
    this.video.pause();
  }

  mouseupSlider(): void {
    this.holdOnSlider = false;
    if (this.isPlayingBeforeHoldOnSlider) this.video.play();
  }

  @Watch('volume')
  setVolume(val: number): void {
    if (this.loading) return;
    if (val !== 0 && this.muted) this.muted = false;
    if (val === 0) this.muted = true;
    this.video.volume = val / 100;
  }

  @Watch('muted')
  setMute(val: boolean): void {
    if (this.loading) return;
    this.video.muted = val;
    if (!val && !this.volume) this.volume = 34;
  }

  @Watch('speedIndx')
  setSpeed(val: number, oldVal: number): void {
    if (this.loading) return;
    if (val === undefined) {
      this.video.playbackRate = this.speedList[oldVal];
      this.speedIndx = oldVal;
    } else this.video.playbackRate = this.speedList[val];
    setTimeout(() => {
      this.showSpeedList = false;
    }, 200);
  }

  @Watch('intervals')
  watchIntervals(val: metricValuesWithIntervals) {
    if (val) this.setIntervals();
    else this.resetIntervals();
  }

  toggleFullScreen() {
    if (this.loading) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
      this.fullscreen = false;
    } else {
      this.player.requestFullscreen();
      this.fullscreen = true;
    }
  }

  async togglePip() {
    if (this.loading) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await this.video.requestPictureInPicture();
      }
    } catch (error) {
      console.error(error);
    }
    this.pictureInPicture = !!document.pictureInPictureElement;
  }

  bufferProgress() {
    // if (this.loading) return;
    // let innerColors = '';
    // let lastPercentEnd = 0;
    // for (let i = 0; i < this.video.buffered.length; i++) {
    //   const start = this.video.buffered.start(i);
    //   const end = this.video.buffered.end(i);
    //   const percentStart = Math.round((start * 100) / this.duration);
    //   const percentEnd = Math.round((end * 100) / this.duration);
    //   const divEmpty = `<div style="width: ${percentStart - lastPercentEnd}%;"></div>`;
    //   const divColor = `<div class="buffer-color" style="width: ${percentEnd - percentStart}%;"></div>`;
    //   lastPercentEnd = percentEnd;
    //   innerColors += `${divEmpty}${divColor}`;
    // }
    // this.buffer.innerHTML = innerColors;
  }

  keydown(e: any) {
    if (this.loading) return;
    const exclideDOMElements = ['textarea'];
    if (!exclideDOMElements.includes(e.target.localName)) {
      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePlay();
      }

      if (e.code === 'ArrowRight') {
        this.setCurrentTime((this.video.currentTime += 5));
        this.arrowRightPress = true;
      }
      if (e.code === 'ArrowLeft') {
        this.setCurrentTime((this.video.currentTime -= 5));
        this.arrowLeftPress = true;
      }
    }
  }

  keyup(e: any) {
    const exclideDOMElements = ['textarea'];
    if (!exclideDOMElements.includes(e.target.localName)) {
      if (e.code === 'ArrowRight') this.arrowRightPress = false;
      if (e.code === 'ArrowLeft') this.arrowLeftPress = false;
    }
  }

  public setIntervals(): void {
    if (this.loading) return;
    if (!this.intervals) return;
    const intervals: metricValuesWithIntervals = this.sortInterval(
      this.intervals,
    );
    let innerColors = '';
    let lastPercentEnd = 0;

    intervals.forEach((interval) => {
      const start = interval.from;
      const end = interval.to;

      const percentStart = (start * 100) / this.duration;
      const percentEnd = (end * 100) / this.duration;

      const divEmpty = `<div style="width: ${(
        percentStart - lastPercentEnd
      ).toFixed(2)}%;"></div>`;
      const divColor = `<div class="interval-color" style="width: ${(
        percentEnd - percentStart
      ).toFixed(2)}%;"></div>`;
      lastPercentEnd = percentEnd;
      innerColors += `${divEmpty}${divColor}`;
    });
    this.intervalsDOM.innerHTML = innerColors;
  }

  public resetIntervals(): void {
    this.intervalsDOM.innerHTML = '';
    this.metricTitle = '';
    this.startIntervalTime = null;
    this.stopIntervalTime = null;
  }

  /**
   *  Обходной путь из-за бага с бесконечной сортировкой функции sort()
   */
  sortInterval(
    intervalsList: metricValuesWithIntervals,
  ): metricValuesWithIntervals {
    const intervalsFrom = intervalsList.map(({ from }) => from);
    intervalsFrom.sort((a, b) => a - b);
    const intervals = intervalsFrom.map((fromSort: number) => {
      const interval = intervalsList.find(({ from }) => fromSort === from);
      return { from: fromSort, to: interval?.to };
    });
    return intervals as metricValuesWithIntervals;
  }

  nextInterval(): void {
    if (this.intervals) {
      const currentIndex = this.findCurrentInterval(this.intervals);
      const lastIndex = this.intervals.length - 1;
      const nextInretval = currentIndex === lastIndex
        ? this.intervals[0]
        : this.intervals[currentIndex + 1];
      this.setCurrentTime(nextInretval.from);
    }
  }

  prevInterval(): void {
    if (this.intervals) {
      const currentIndex = this.findCurrentInterval(this.intervals);
      const lastIndex = this.intervals.length - 1;
      const prevInretval = currentIndex === 0 || currentIndex === -1
        ? this.intervals[lastIndex]
        : this.intervals[currentIndex - 1];
      this.setCurrentTime(prevInretval.from);
    }
  }

  findCurrentInterval(intervals: metricValuesWithIntervals): number {
    const index = intervals.findIndex(({ from }) => this.currentTime < from);
    return index === -1 ? intervals.length - 1 : index - 1;
  }

  mounted() {
    // setTimeout(() => this.bufferProgress(), 4000);
    document.addEventListener('keydown', this.keydown);
    document.addEventListener('keyup', this.keyup);
  }
}
</script>

<style lang="scss" scoped>
.player {
  position: relative;
  margin: 0 auto;
  height: 100%;
  border: none;
  outline: none;
  background: #000;
  overflow: hidden;
}

video {
  position: absolute;
  width: 100%;
  height: 490px;
  border-radius: 4px;
  &::picture-in-picture {
  }
  &.zoom-face {
    transform: scale(3) translateY(33%) translateX(-33%);
  }
  &.fullscreen {
    height: 100%;
  }
}
::v-deep {
  .v-slider {
    cursor: pointer;
    &:hover {
      .v-slider__track-container {
        height: 6px !important;
      }
    }
  }
  .v-slider--horizontal {
    margin: 0;
  }
  .v-slider__track-container {
    height: 4px !important;
    cursor: pointer;
    transition: 0.1s;
    &:hover {
      height: 6px !important;
    }
  }
  .v-slider__thumb {
    cursor: pointer;
  }
  .v-progress-linear {
    top: inherit;
  }

  .interval-color {
    background: linear-gradient(0deg, orange 0%, transparent 80%);
    height: 100%;
  }

  // .v-progress-linear__indeterminate {

  // }
}

.video-controls {
  position: absolute;
  bottom: 0;
  padding: 8px;
  transition: all 0.2s ease;
  z-index: 6;
  width: 100%;
}

.video-controls-background {
  z-index: 5;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.01),
    rgba(0, 0, 0, 0.9)
  );
}

.video-controls.hide {
  opacity: 0;
  pointer-events: none;
}

.video-progress {
  z-index: 7;
  position: relative;
}
.buffer,
.intervals {
  position: absolute;
  pointer-events: none;
  width: 100%;
  top: -15px;
  height: 100%;
  z-index: 0;
  display: flex;
}

.time-progress {
  position: relative;
}
.time-progress:hover > .time-tooltip {
  display: block;
}

.time-tooltip {
  content: attr(data-title);
  display: none;
  position: absolute;
  top: -20px;
  margin-left: -20px;
  font-size: 13px;
  padding: 5px 7px;
  border-radius: 4px;
  font-weight: bold;
  color: lightgrey;
  background-color: rgba(0, 0, 0, 0.6);
}

.bottom-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 7;
  position: relative;
  padding: 0 10px;
}

.left-controls {
  display: flex;
  align-items: center;
}

.volume {
  width: 100px;
}
.volume-controls {
  display: flex;
  align-items: center;
  cursor: pointer !important;
}

button {
  position: relative;
  margin-right: 15px;
  font-size: 12px;
  border: none;
  outline: none;
  &:hover:not(:disabled) {
    filter: brightness(75%);
  }
  &:not(:disabled) {
    cursor: pointer;
  }
  &:disabled {
    opacity: 0.3;
  }
}

button * {
  pointer-events: none;
}

button::before {
  content: attr(data-title);
  position: absolute;
  display: none;
  right: -50px;
  top: -50px;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-weight: bold;
  padding: 4px 6px;
  word-break: keep-all;
  white-space: pre;
}

button:hover::before {
  display: inline-block;
}

.playback-animation {
  position: absolute;
  margin-left: -40px;
  margin-top: -40px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
  transition: 0.3s;
  transform: scale(1.5);
  cursor: pointer !important;
  &.hide {
    transform: scale(3);
    opacity: 0;
  }
  &.toggle {
    top: 50%;
    left: 50%;
  }

  &.right {
    top: 50%;
    left: 85%;
    pointer-events: none;
  }

  &.left {
    top: 50%;
    left: 15%;
    pointer-events: none;
  }
}

.speed {
  &__button {
    position: relative;
  }
  &__button-text {
    position: absolute;
    top: -7px;
    left: 27px;
    color: "#fff";
    font-size: 10px;
  }
  &__list {
    position: absolute;
    bottom: 60px;
    right: 90px;
    z-index: 2;
    opacity: 1;
    transition: 0.3s;
    &.hide {
      opacity: 0;
      transform: translateY(30%);
      pointer-events: none;
    }
  }
}

.icon-content-duplicate {
  transform: scale(-1, 1) rotate(90deg);
}

.hidden {
  display: none;
}
</style>
