import { appUrl } from "@/contants";
import { Period } from "@/types/Period";
import axios, { AxiosResponse } from "axios";
import moment from "moment";
import { createStore } from "vuex";

interface StateType {
  isLoading: boolean;
  periods: Period[];
  timeStatus: boolean;
  currentTime: number;
  intervalTimer: number;
}

export default createStore<StateType>({
  state: {
    isLoading: true,
    periods: [],
    timeStatus: true,
    currentTime: 0,
    intervalTimer: 0,
  },
  mutations: {
    toggleLoading(state) {
      state.isLoading = !state.isLoading;
    },
    updatePeriodsList(state, payload) {
      state.periods = payload;
      if (state.periods.length && state.periods[0].endTime) {
        state.timeStatus = false;
      }
    },
    resumeTimer(state) {
      state.timeStatus = true;
      state.intervalTimer = setInterval(() => {
        state.currentTime++;
      }, 1000);
    },
    stopTimer(state) {
      clearInterval(state.intervalTimer);
    },
    updateTime(state) {
      let total = 0;
      state.periods.forEach((period: Period) => {
        if (state.timeStatus) {
          if (period.endTime) {
            total += moment(period.endTime).diff(
              moment(period.startTime),
              "seconds"
            );
          } else {
            total += moment(new Date()).diff(
              moment(period.startTime),
              "seconds"
            );
          }
        } else {
          total += moment(period.endTime).diff(
            moment(period.startTime),
            "seconds"
          );
        }
      });
      state.currentTime = total;
    },
  },
  actions: {
    getPeriods({ commit }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${appUrl}/periods`)
          .then((res: AxiosResponse) => {
            commit("updatePeriodsList", res.data);
            resolve(res.data);
          })
          .catch(() => reject);
      });
    },
    updateTime({ commit }) {
      return new Promise((resolve) => {
        commit("updateTime");
        resolve("done");
      });
    },
    resumeTimer({ commit }) {
      axios.post(`${appUrl}/periods/new`).then(() => {
        commit("resumeTimer");
        axios.get(`${appUrl}/periods`).then((res: AxiosResponse) => {
          commit("updatePeriodsList", res.data);
        });
      });
    },
    startTimer({ commit }) {
      commit("resumeTimer");
    },
    stopTimer({ commit }) {
      axios.put(`${appUrl}/periods/stop`).then(() => {
        commit("stopTimer");
        axios.get(`${appUrl}/periods`).then((res: AxiosResponse) => {
          commit("updatePeriodsList", res.data);
        });
      });
    },
  },
  modules: {},
});
