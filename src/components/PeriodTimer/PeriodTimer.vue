<template>
  <div class="period">
    <div class="period-name">
      <h4>{{ period.name }}</h4>
    </div>
    <div class="period-times">
      <p>{{ moment(period.startTime).format("MMMM Do YYYY, h:mm:ss a") }}</p>
      <p>
        {{
          period.endTime
            ? moment(period.endTime).format("MMMM Do YYYY, h:mm:ss a")
            : ""
        }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import moment, { Moment } from "moment";
export default {
  props: ["period"],
  name: "PeriodTimer",
  methods: {
    moment: (): Moment => moment(),
  },
};
</script>

<style lang="scss" scoped>
@import "./PeriodTimer.scss";
</style>
