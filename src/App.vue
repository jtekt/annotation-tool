<template>
  <AppTemplate :options="options">
    <template v-slot:nav>
      <v-list dense nav>
        <v-list-item>
          <LocaleSelector />
        </v-list-item>
        <v-divider />

        <v-list-item
          v-for="(item, index) in nav"
          :key="`nav_item_${index}`"
          :to="item.to"
          exact
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <NavCategories />
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
    nav: [
      {
        title: "Images",
        to: { name: "items" },
        icon: "mdi-image-multiple",
      },
      {
        title: "About",
        to: { name: "About" },
        icon: "mdi-information-outline",
      },
    ],
  }),
}
</script>

<style>
.header_logo {
  border-right: 1px solid white;
}
</style>
