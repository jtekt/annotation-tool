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
      <v-row justify="center">
        <v-col cols="auto">
          <v-btn :loading="uploading" @click="upload()" color="primary">
            <v-icon left>mdi-upload</v-icon>
            <span>Upload</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.text }}

      <template v-slot:action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
import CameraControls from "../components/CameraControls.vue"
import { v4 as uuidv4 } from "uuid"

const { VUE_APP_LABELS } = process.env

export default {
  name: "Camera",
  components: {
    CameraControls,
  },
  data() {
    return {
      picture: null,
      annotation: null,
      uploading: false,
      snackbar: {
        show: false,
        text: null,
        color: undefined,
      },
    }
  },
  methods: {
    async upload() {
      const body = new FormData()

      const fileName = `${uuidv4()}.png`

      // TODO: annotation field environment variable
      body.append("annotation", this.annotation)
      body.append("image", this.picture, fileName)

      const headers = { "Content-Type": "multipart/form-data" }

      try {
        this.uploading = true
        await this.axios.post(`/images`, body, { headers })

        this.picture = false

        this.snackbar.show = true
        this.snackbar.color = "success"
        this.snackbar.text = "Upload successful"
      } catch (error) {
        console.error(error)
        this.snackbar.show = true
        this.snackbar.color = "error"
        this.snackbar.text = "Upload failed"
      } finally {
        this.uploading = false
      }
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
