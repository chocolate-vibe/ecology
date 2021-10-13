<script>
import { Radar, mixins } from 'vue-chartjs';

export default {
  name: 'RadarMixin',
  extends: Radar,
  mixins: [mixins.reactiveProp],
  props: {
    chartData: {
      type: Object,
      default: null,
    },
    options: {
      type: Object,
      default: null,
    },
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
</script>
