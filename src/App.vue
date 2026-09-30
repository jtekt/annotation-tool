<template>
  <AppTemplate :options="options">
    <template v-slot:nav>
      <v-list nav>
        <v-list-item>
          <LocaleSelector />
        </v-list-item>
        <v-divider />

        <v-list-item
          exact
          :to="{ name: 'items', query }"
          prepend-icon="mdi-image-multiple"
          title="Images"
        />

        <NavCategories />

        <v-list-item
          v-if="cameraAvailable"
          exact
          :to="{ name: 'camera' }"
          prepend-icon="mdi-camera"
          title="Camera"
        />

        <v-list-item
          exact
          :to="{ name: 'settings' }"
          prepend-icon="mdi-cogs"
          title="Settings"
        />

        <v-list-item
          exact
          :to="{ name: 'about' }"
          prepend-icon="mdi-information-outline"
          title="About"
        />
      </v-list>
    </template>
  </AppTemplate>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import AppTemplate from "./components/AppTemplate.vue";
import LocaleSelector from "./components/LocaleSelector.vue";
import NavCategories from "./components/NavCategories.vue";
import { useAppStore } from "./store";
import runtimeEnv from "@/runtimeEnv";

const store = useAppStore();
const route = useRoute();

const cameraAvailable = ref(false);

const options = {
  title: "Annotation tool",
  login_url: runtimeEnv.VITE_LOGIN_URL,
  identification_url: runtimeEnv.VITE_IDENTIFICATION_URL,
  oidc: {
    authority: runtimeEnv.VITE_OIDC_AUTHORITY,
    client_id: runtimeEnv.VITE_OIDC_CLIENT_ID,
    extraQueryParams: {
      audience: runtimeEnv.VITE_OIDC_AUDIENCE,
    },
  },
  header_logo: "/jtekt_logo_negative.jpg",
  authentication_logo: "/jtekt_logo.jpg",
  colors: { app_bar: "#000" },
  author: "Maxime Moreillon, JTEKT Corporation",
};

const query = computed(() => {
  const { cursor, ...rest } = route.query;
  return rest;
});

onMounted(async () => {
  store.loadLabels();
  const devices = await navigator.mediaDevices?.enumerateDevices();
  cameraAvailable.value = !!devices?.filter((d) => d.kind === "videoinput")
    .length;
});
</script>

<style>
.header_logo {
  border-right: 1px solid white;
}
</style>
