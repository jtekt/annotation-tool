<template>
  <v-app>
    <template v-if="!isLoginRoute">
      <v-app-bar color="#000">
        <v-app-bar-nav-icon v-if="showDrawer" @click="drawer = !drawer" />
        <v-app-bar-title>Annotation tool</v-app-bar-title>
        <template #append>
          <LocaleSelector />
          <ThemeToggle />
          <v-btn v-if="session" icon="mdi-logout" @click="logout" />
        </template>
      </v-app-bar>

      <v-navigation-drawer v-if="showDrawer" v-model="drawer">
        <v-list nav>
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
      </v-navigation-drawer>
    </template>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useOptionalAuth } from "@/composables/useOptionalAuth";
import { useAxiosAuth } from "@/composables/useAxiosAuth";
import { useAppStore } from "./store";
import LocaleSelector from "./components/LocaleSelector.vue";
import NavCategories from "./components/NavCategories.vue";
import ThemeToggle from "./components/ThemeToggle.vue";

useAxiosAuth();

const { session, logout, authConfigured } = useOptionalAuth();
const store = useAppStore();
const route = useRoute();
const drawer = ref(true);
const showDrawer = computed(() => !authConfigured || session.value);
const cameraAvailable = ref(false);

const isLoginRoute = computed(() => route.name === "login");

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
