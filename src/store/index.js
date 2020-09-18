import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    labels: ["OK","NG"]
  },
  mutations: {
    parse_labels_from_env(state){

      let labels_string = process.env.VUE_APP_LABELS
      if(!labels_string) return

      state.labels = labels_string.split(/[,;]+/)

    }
  },
  actions: {
  },
  modules: {
  }
})
