<template>
  <div>
    <v-row>
      <v-col>
        <h3>Labels</h3>
      </v-col>
      <v-spacer />
      <v-col cols="auto" v-if="!disabled">
        <v-btn @click="saveLabels()">
          <v-icon left>mdi-content-save</v-icon>
          <span>Save labels</span>
        </v-btn>
      </v-col>
    </v-row>
    <template v-if="!disabled">
      <v-row v-for="(label, index) in labels" :key="index" align="center" dense>
        <v-col>
          <v-text-field :value="label" @input="labels[index] = $event" />
        </v-col>
        <v-col cols="auto">
          <v-btn icon @click="labels.splice(index, 1)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="auto">
          <v-btn @click="labels.push('')">
            <v-icon left>mdi-plus</v-icon>
            <span>Add label</span>
          </v-btn>
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <p>Label editing disabled by administrator</p>
      <ul>
        <li v-for="(label, index) in labels" :key="index">
          {{ label }}
        </li>
      </ul>
    </template>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.text }}

      <template v-slot:action="{ attrs }">
        <v-btn icon v-bind="attrs" @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
const {
  VUE_APP_PREVENT_LABELS_EDIT,
  // VUE_APP_LABELS
} = process.env

export default {
  name: "LabelsEdit",
  data() {
    return {
      labels: this.$store.state.labels,
      disabled: VUE_APP_PREVENT_LABELS_EDIT,
      snackbar: {
        show: false,
        text: "",
        color: "success",
      },
    }
  },
  methods: {
    resetLabels() {},
    saveLabels() {
      this.$store.commit("saveLabels", this.labels)
      this.snackbar.text = "Labels saved"
      this.snackbar.color = "success"
      this.snackbar.show = true
    },
  },
}
</script>
