<template>
  <AppTemplate :options="options">
    <template v-slot:nav>
      <v-list dense nav>
        <v-list-item>
          <LocaleSelector />
        </v-list-item>
        <v-divider />

        <v-list-item exact :to="{ name: 'items' }">
          <v-list-item-icon>
            <v-icon>mdi-image-multiple</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Images</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <NavCategories />

        <v-list-item exact :to="{ name: 'camera' }" v-if="cameraAvailable">
          <v-list-item-icon>
            <v-icon>mdi-camera</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Camera</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item exact :to="{ name: 'settings' }">
          <v-list-item-icon>
            <v-icon>mdi-cogs</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item exact :to="{ name: 'about' }">
          <v-list-item-icon>
            <v-icon>mdi-information-outline</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>About</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </AppTemplate>
</template>

<script>
import AppTemplate from "@moreillon/vue_application_template_vuetify"
import LocaleSelector from "./components/LocaleSelector.vue"
import NavCategories from "./components/NavCategories.vue"

const { VUE_APP_LOGIN_URL, VUE_APP_IDENTIFICATION_URL } = process.env

export default {
  name: "App",

  components: {
    AppTemplate,
    NavCategories,
    LocaleSelector,
  },

  data: () => ({
    options: {
      title: "Annotation tool",
      login_url: VUE_APP_LOGIN_URL,
      identification_url: VUE_APP_IDENTIFICATION_URL,
      header_logo: require("@/assets/jtekt_logo_negative.jpg"),
      authentication_logo: require("@/assets/jtekt_logo.jpg"),
      colors: { app_bar: "#000" },
      author: "Maxime Moreillon, JTEKT Corporation",
    },
    cameraAvailable: false,
  }),
  mounted() {
    this.getAvailableCameras()
    this.$store.commit("loadLabels")
  },
  methods: {
    async getAvailableCameras() {
      this.cameraAvailable = (
        await navigator.mediaDevices.enumerateDevices()
      )?.filter((d) => d.kind === "videoinput")?.length
    },
  },
}
</script>

<style>
.header_logo {
  border-right: 1px solid white;
}
</style>
