<template>
  <div class="timer container">
    <div class="header-timer">
      <h1>{{ day }}</h1>
      <div class="config-timer">
        <button
          class="btn btn-outline-danger"
          @click="$store.dispatch('stopTimer')"
          :disabled="!$store.state.timeStatus"
        >
          <i class="fas fa-square me-2"></i>Stop
        </button>
        <button
          class="btn btn-outline-success"
          @click="$store.dispatch('resumeTimer')"
          :disabled="$store.state.timeStatus"
        >
          <i class="fas fa-stopwatch me-2"></i>Start Now
        </button>
        <h3>{{ getTimeString($store.state.currentTime) }}</h3>
      </div>
    </div>
    <PeriodTimer
      v-for="period in $store.state.periods"
      :key="period.id"
      :period="period"
    ></PeriodTimer>
    <div class="footer-timer">
      <h2>Total</h2>
      <h3>{{ getTimeString($store.state.currentTime) }}</h3>
    </div>
  </div>
</template>

<script lang="ts">
import PeriodTimer from "../PeriodTimer/PeriodTimer.vue";
import { getTimeString, months } from "../../contants";
import store from "@/store";

export default {
  name: "Timer",
  components: {
    PeriodTimer,
  },
  computed: {
    isLoading: (): boolean => store.state.isLoading,
    day: function (): string {
      const d = new Date();
      return `${months[d.getMonth()]} ${d.getDate()}`;
    },
  },
  methods: {
    getTimeString: (el: number): string => getTimeString(el),
  },
  mounted(): void {
    store.dispatch("getPeriods").then((res) => {
      store.dispatch("updateTime", res).then(() => {
        if (!res.length || !res[0].endTime) store.dispatch("startTimer");
      });
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "./Timer.scss";
</style>
