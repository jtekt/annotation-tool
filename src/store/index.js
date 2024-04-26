import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const { VUE_APP_LABELS } = process.env

export default new Vuex.Store({
  state: {
    labels: null,
  },
  mutations: {
    loadLabels(state) {
      const localStorageLabels = localStorage.getItem("labels")
      if (localStorageLabels) {
        try {
          state.labels = JSON.parse(localStorageLabels)
        } catch (error) {
          console.error(error)
        }
      } else if (VUE_APP_LABELS) state.labels = VUE_APP_LABELS.split(",")
      else state.labels = ["OK", "NG"]
    },
    saveLabels(state, labels) {
      state.labels = labels
      localStorage.setItem("labels", JSON.stringify(labels))
      console.log(localStorage.getItem("labels"))
    },
  },
  actions: {},
  modules: {},
})
