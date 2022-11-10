<template>
  <AppTemplate
    :options="options">

    <template v-slot:nav>
      <v-list
        dense
        nav >
        <v-list-item
          v-for="(item, index) in nav"
          :key="`nav_item_${index}`"
          :to="item.to"
          exact>
          <v-list-item-icon>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{item.title}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>

  </AppTemplate>
</template>

<script>
import AppTemplate from '@moreillon/vue_application_template_vuetify'
export default {
  name: 'App',

  components: {
    AppTemplate
  },

  data: () => ({
    options: {
      title: "Annotation tool",
      login_url: process.env.VUE_APP_LOGIN_URL,
      identification_url: process.env.VUE_APP_IDENTIFICATION_URL,
      header_logo: require('@/assets/jtekt_logo_negative.jpg'),
      authentication_logo: require('@/assets/jtekt_logo.jpg'),
      colors: { app_bar: '#000' },
      author: 'JTEKT Corporation',
    },
    nav: [
      {title: 'Items', to: {name: 'items'}, icon: 'mdi-format-list-bulleted'},
      {title: 'About', to: {name: 'About'}, icon: 'mdi-information-outline'},
    ]
  }),
};
</script>

<style>
.header_logo {
  border-right: 1px solid white;
}
</style>