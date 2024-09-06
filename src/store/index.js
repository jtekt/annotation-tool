import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const { VUE_APP_LABELS, VUE_APP_PREVENT_LABELS_EDIT } = process.env

const defaultLabels = ["OK", "NG"]

export default new Vuex.Store({
  state: {
    labels: null,
  },
  mutations: {
    loadLabels(state) {
      if (VUE_APP_PREVENT_LABELS_EDIT) {
        if (VUE_APP_LABELS) state.labels = VUE_APP_LABELS.split(",")
        else state.labels = defaultLabels
      } else {
        const localStorageLabels = localStorage.getItem("labels")
        if (localStorageLabels) {
          try {
            state.labels = JSON.parse(localStorageLabels)
          } catch (error) {
            console.error(error)
          }
        } else if (VUE_APP_LABELS) state.labels = VUE_APP_LABELS.split(",")
        else state.labels = defaultLabels
      }
    },
    saveLabels(state, labels) {
      state.labels = labels
      localStorage.setItem("labels", JSON.stringify(labels))
    },
  },
  actions: {},
  modules: {},
})
