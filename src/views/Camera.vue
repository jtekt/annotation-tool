<template>
  <v-card>
    <v-card-title> Camera </v-card-title>
    <v-card-text>
      <CameraControls v-model="picture" />
      <v-row>
        <v-col>
          <v-radio-group v-model="annotation">
            <v-radio label="No annotation" :value="null" />
            <v-radio
              v-for="(label, index) in labels"
              :key="`label_${index}`"
              :label="label"
              :value="label"
            />
          </v-radio-group>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import CameraControls from "../components/CameraControls.vue"

const { VUE_APP_LABELS } = process.env

export default {
  name: "Camera",
  data() {
    return {
      picture: null,
      annotation: null,
    }
  },
  methods: {
    upload() {
      alert("Not implemented")
      // TODO: POST with axios
    },
  },
  computed: {
    labels() {
      if (!VUE_APP_LABELS) return ["OK", "NG"]
      return VUE_APP_LABELS.split(",")
    },
  },
}
</script>
