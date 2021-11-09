<template>
  <div
    class="page-container d-flex flex-column justify"
    style="padding-top: 0"
  >
    <div
      ref="video-container"
      class="player__wrap"
    >
      <video-player
        ref="video-player"
        :src="lesson.videoSource"
        :poster="lesson.previewSource"
        @timeupdate="(time) => (chatCurrentTime = time)"
        @reset-intervals="resetIntervalsVisual"
        class="player__video"
      />
      <chat
        :time="chatCurrentTime"
        :messages="chatMessages"
        :show-before-time="chatCurrentTime"
        class="player__board"
      />
    </div>

    <div
      class="d-flex align-center my-6 ml-6"
      style="padding-top: 68vh"
    >
      <user-avatar
        :user="lesson.educationGroup.teacher"
        size="40"
        class="mr-3"
      />
      <div>
        <h2>
          {{ lesson.educationGroup.teacher.lastName }} {{ lesson.educationGroup.teacher.firstName }} - {{ lesson.title }}
        </h2>
        <span class="grey--text darken-3 text-caption">{{ lesson.educationGroup.title }}</span>
      </div>
    </div>
    <TextMetric
      :data="textMetrics"
      class="mb-6 mx-3"
    />

    <!-- Заголовки вкладок -->
    <v-tabs
      v-if="loadedMetrics"
      v-model="tab"
      fixed-tabs
      background-color="grey darken-4"
      class="metric__container rounded-0"
      style="filter: brightness(130%)"
    >
      <v-tab
        v-for="(title, priority) in sectionTitles"
        :key="`tab-${priority}`"
        class="rounded-0"
      >
        {{ title }}
      </v-tab>
      <!-- <v-tab class="rounded-0"> Завершение проверки урока </v-tab> -->
    </v-tabs>
    <!-- Контент вкладок -->
    <v-tabs-items
      v-if="loadedMetrics"
      v-model="tab"
    >
      <v-tab-item
        v-for="(subsections, sectionIndx) in renderListMetrics"
        :key="`subsection-${sectionIndx}`"
      >
        <v-expansion-panels
          v-model="accordeonSubsections[sectionIndx]"
          focusable
          multiple
        >
          <v-expansion-panel
            v-for="(metric, subsectionIndx) in subsections"
            :key="`${sectionIndx}-${subsectionIndx}`"
            :style="{ order: subsectionIndx }"
            class="rounded-0"
          >
            <v-expansion-panel-header
              class="grey darken-4"
              style="filter: brightness(80%)"
            >
              <div class="d-flex flex-row justify-space-between align-center">
                <span class="text-h6">{{ metric.title }}</span>
                <v-switch
                  v-if="metricsWithPoints.includes(metric.visualType) || metricsWithIntervals.includes(metric.visualType)"
                  v-model="intervalSwitcher"
                  @click.stop="intervalSwitcher === metric.id ? setIntervalsVisual(metric) : resetIntervalsVisual()"
                  :value="metric.id"
                  label="Показать отметки на видео"
                  color="success"
                  hide-details
                  class="metric__subsection-switch"
                />
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content
              class="pl-3 pr-6 py-3"
            >
              <div
                @mouseenter="!intervalSwitcher ? setIntervalsVisual(metric) : ''"
                @mouseleave="!intervalSwitcher ? resetIntervalsVisual(): ''"
                class="metric__subsection"
              >
                <visual-metric
                  v-if="metric"
                  v-bind="metric"
                  :video-duration="videoDuration"
                  @set-video-time="(from) => setVideoTime(from, metric)"
                  @set-video-interval="({ from, to }) => setVideoTime(from, metric, to)"
                  title=""
                />
                <feedback-drawer>
                  <comments
                    :metric-id="metric.id"
                    :lesson-id="lesson.id"
                    :comments="feedbackByLesson"
                  />
                </feedback-drawer>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-tab-item>
      <v-tab-item>
        <div
          style="display: flex; align-items: top"
          class="pa-6"
        >
          <div style="width: 50%">
            Отметить урок, как проверенный:<br>
            - Аудио метки совпадают с видео?<br>
            <br>
            <div
              @click="checkLesson()"
              style="
                border-radius: 5px;
                display: inline-block;
                font-weight: 700;
                padding: 7px 25px;
                cursor: pointer;
              "
            >
              Урок проверен!
            </div>
          </div>
          <div style="width: 50%">
            <b>Общий комментарий к уроку</b>
            <v-textarea
              v-model="enteredText"
              filled
              auto-grow
              name="input-7-4"
              label="Добавить комментарий"
              class="mt-3 rounded-0"
              color="green"
            />
            <div class="comments__actions">
              <v-btn
                class="rounded-0 mt-3"
                color="success"
              >
                Добавить
              </v-btn>
            </div>
          </div>
        </div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator';
// Stores
import { store } from '@/store';
// Components
import VideoPlayer from '@/components/VideoPlayer.vue';
import Chat from '@/components/chat/index.vue';
import FeedbackDrawer from '@/components/navigation/feedback-drawer.vue';
import VisualMetric from '@/components/visualization-metric/VisualMetric.vue';
import UserAvatar from '@/components/UserAvatar.vue';
import TextMetric from '@/components/visualization-metric/TextMetric.vue';

// Metrics
import Comments from '@/components/comments/Comments.vue';
import { IVisualMetric, metricValuesWithIntervals, metricValuesWithPoints, visualType } from '@/types/metric';

@Component({
  components: {
    VideoPlayer,
    Chat,
    Comments,
    FeedbackDrawer,
    VisualMetric,
    UserAvatar,
    TextMetric,
  },
})
export default class VdpViewPage extends Vue {
  @Ref('video-container') videoContainer!: HTMLDivElement;
  @Ref('video-player') videoPlayer!: any;

  private scrollPosition = 0; // Позиция скролла, для определенияя в какую сторону прокручивается страница
  private enteredText = '';
  private tab = null; // активная вкладка
  public chatCurrentTime = 0;
  public metricsWithIntervals: Array<visualType> = ['button_intervals'];
  public metricsWithPoints: Array<visualType> = ['button_time', 'chart_line', 'chart_bar']; // 'button_time_prob',
  public intervalSwitcher: number | null = null;
  public intervalStopTime: number | null = null;

  /**
   * Указанные секции будут развёрнуты по-умолчанию
   */
  accordeonSubsections = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  ];

  // get getAccordeonSubsections() {
  //   const accordeon = Object.values(this.renderListMetrics).map((section: any) => {
  //     return Object.keys(section).map(
  //       (subsection: any, subsectionIndx: number) => {
  //         return subsectionIndx;
  //       },
  //     );
  //   });
  //   console.log(accordeon);
  //   return accordeon;
  // }

  /**
   * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   *              GETTERS
   * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */

  get loadedMetrics() {
    return store.metrics.state.loaded;
  }

  get lesson() {
    return store.metrics.state.lesson;
  }

  get sectionTitles() {
    return store.metrics.state.sections;
  }

  get chatMessages() {
    return store.chat.state.messages;
  }

  get feedbackByLesson() {
    return store.feedback.state.commentsByLesson;
  }

  get renderListMetrics() {
    return store.metrics.state.renderListMetrics;
  }

  get textMetrics() {
    return store.metrics.state.textMetrics;
  }

  get videoDuration() {
    const { lesson } = store.metrics.state;
    if (lesson?.framesCount && lesson.fps) {
      return lesson?.framesCount / lesson.fps;
    }
    return null;
  }

  /**
   * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   *         LIFECYCLE HOOKS
   * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */

  // mounted() {
  //   store.chat.actions.fetchChatMessages(Number(this.$route.params.id));
  //   store.feedback.actions.fetchCommentsByLesson(Number(this.$route.params.id));
  //   store.metrics.actions.init(Number(this.$route.params.id));
  // }
  async fetch() {
    const lessonId = parseInt(this.$route.params.id);
    await store.chat.actions.fetchChatMessages(lessonId);
    await store.feedback.actions.fetchCommentsByLesson(lessonId);
    await store.metrics.actions.init(lessonId);
  }

  created() {
    if (window) {
      window.addEventListener('scroll', this.videoPlayerScrollResize);
    }
  }

  beforeDestroy() {
    window.removeEventListener('scroll', this.videoPlayerScrollResize);
  }

  setVideoTime(from: number, metric: IVisualMetric, to?: undefined | number): void {
    this.videoPlayer.setCurrentTime(from);
    this.videoPlayer.video.play();
    this.intervalSwitcher = metric.id;
    this.setIntervalsVisual(metric);
    if (to) {
      this.videoPlayer.startIntervalTime = from;
      this.videoPlayer.stopIntervalTime = to;
    }
  }

  /**
   * Пометить урок проверенным преподавателем
   */
  checkLesson(): void {
    console.log('Пометить урок проверенным преподавателем');
    // store.metrics.actions.checkLesson();
    // this.$nuxt.$router.replace({ path: '/lesson' });
  }

  /**
   * Изменяяет размер видеоплеера при прокрутке страницы
   */
  videoPlayerScrollResize(): void {
    // Высчитываем значение 1vh в px
    const vh = Math.round(window.innerHeight / 100);
    // Минимальная высота плеера в px
    const minVh = 30 * vh;
    // Максимальнаяя высота плеера в px
    const maxVh = 70 * vh;

    if (window.scrollY > 10 * vh) {
      this.videoContainer.style.height = `${minVh}px`;
    }
    if (window.scrollY < 10 * vh) {
      this.videoContainer.style.height = `${maxVh}px`;
    }
  }

  setIntervalsVisual(metric: IVisualMetric) {
    if (this.metricsWithIntervals.includes(metric.visualType)) {
      this.videoPlayer.intervals = metric.value;
      this.videoPlayer.metricTitle = metric.title;
    } else if (this.metricsWithPoints.includes(metric.visualType)) {
      this.videoPlayer.intervals = this.preparePointsForIntervals(metric.value);
      this.videoPlayer.metricTitle = metric.title;
    } else this.resetIntervalsVisual();
  }

  public resetIntervalsVisual() {
    this.videoPlayer.intervals = null;
    this.intervalSwitcher = null;
  }

  preparePointsForIntervals(metricValue: metricValuesWithPoints) {
    if (!metricValue) return;
    const timestampsAll: any = [];

    if (typeof metricValue[0] === 'number') timestampsAll.push(...metricValue);
    else if (typeof metricValue[0] === 'object') {
      Object.values(metricValue).forEach(({ time }: any) => {
        if (typeof time === 'number') timestampsAll.push(time);
        else timestampsAll.push(...time);
      });
    }
    return timestampsAll.map((time: number) => ({
      from: time,
      to: time + 15,
    })) as metricValuesWithIntervals;
  }
}
</script>

<style lang="scss" scoped>
.player {
  &__wrap {
    display: flex;
    width: 100%;
    position: fixed;
    top: 0;
    height: 70vh;
    z-index: 2;
    transition: height 0.25s ease-in;
    overflow: hidden;
  }
  &__video {
    width: 70%;
    height: 100%;
  }
  &__board {
    position: relative;
    height: 100%;
    width: 30%;
    margin-right: 57px;
  }
}

.metric {
  &__container {
    display: flex;
    flex-direction: column;
  }
  &__section {
    & > .group-block__header {
      font-size: 20px !important;
    }
  }
  &__subsection {
    display: flex;
    min-height: 250px;
  }
  &__subsection-switch {
    margin-right: 30px ;
    margin-top: 0;
  }
}

.comments__actions {
  text-align: right;
}

.subsection-header {
  min-height: 0 !important;
}

::v-deep {
  .v-expansion-panel-content {
    position: relative !important;
  }
  .v-expansion-panel-content__wrap {
    padding: 0;
  }
}
</style>
