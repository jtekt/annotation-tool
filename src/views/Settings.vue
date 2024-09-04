<template>
  <v-card class="mx-auto" max-width="40em">
    <v-toolbar flat>
      <v-toolbar-title> Settings </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="saveLabels()">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-title></v-card-title>
    <v-card-text>
      <h3>Labels</h3>
      <v-row v-for="(label, index) in labels" :key="index" align="center">
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
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Settings",
  data() {
    return {
      labels: this.$store.state.labels,
    }
  },
  methods: {
    saveLabels() {
      this.$store.commit("saveLabels", this.labels)
    },
  },
}
</script>
