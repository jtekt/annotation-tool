<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-row align="baseline" justify="space-between">
        <v-col cols="auto">
          <v-btn
            icon
            :disabled="loading || currentCursor === 0"
            @click="getPreviousItem"
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-col>

        <v-col v-if="item" cols="auto">{{ item.file }}</v-col>

        <v-col cols="auto">
          <v-btn icon :disabled="loading" @click="getNextItem">
            <v-icon>mdi-arrow-right</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-divider />

    <template v-if="item">
      <v-card-text>
        <v-row align="center">
          <v-spacer />
          <v-col cols="2">
            <!-- Give it actual column width -->
            <v-img :src="imageSrc" alt="" contain max-height="70vh" />
          </v-col>
          <v-spacer />
          <v-col cols="4">
            <v-radio-group
              v-model="item.data.annotation"
              @update:model-value="saveAnnotation"
            >
              <v-radio :value="null">
                <template v-slot:label>
                  <v-icon>mdi-tag-off</v-icon>
                </template>
              </v-radio>
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
    </template>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/axios";
import { useAppStore } from "@/store";
import runtimeEnv from "@/runtimeEnv";

interface AnnotationItem {
  _id: string;
  file: string;
  data: { annotation: string | null; [key: string]: unknown };
}

const storageApiUrl = runtimeEnv.VITE_IMAGE_STORAGE_API_URL;

const route = useRoute();
const router = useRouter();
const store = useAppStore();

const loading = ref(false);
const item = ref<AnnotationItem | null>(null);
const snackbar = ref({ show: false, text: "", color: "" });

const documentId = computed(() => route.params._id as string);
const currentCursor = computed(() => Number(route.query.cursor || 0));
const query = computed(() => route.query as Record<string, string | number>);
const labels = computed(() => store.labels ?? []);
const imageSrc = computed(
  () => `${storageApiUrl}/images/${documentId.value}/image`,
);

watch(documentId, () => getItemById());

onMounted(() => {
  getItemById();
  document.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeydown);
});

function getItemById() {
  loading.value = true;
  axios
    .get(`/images/${documentId.value}`)
    .then(({ data }) => {
      if (!data.data) data.data = {};
      if (!Object.prototype.hasOwnProperty.call(data.data, "annotation")) {
        data.data.annotation = null;
      }
      item.value = data;
    })
    .catch(console.error)
    .finally(() => {
      loading.value = false;
    });
}

function getItemsWithOptions(
  params: Record<string, unknown>,
  nextQuery?: Record<string, unknown>,
) {
  if (loading.value) return;
  loading.value = true;
  axios
    .get("/images", { params })
    .then(({ data: { items } }) => {
      if (!items.length) {
        snackbar.value = { show: true, text: "No more items", color: "orange" };
        return;
      }
      const { _id } = items[0];
      if (documentId.value !== _id) {
        router.push({
          name: "annotate",
          params: { _id },
          query: { ...route.query, ...(nextQuery || {}) },
        });
      }
    })
    .catch(() => {
      snackbar.value = {
        show: true,
        text: "Error loading item",
        color: "#c00000",
      };
    })
    .finally(() => {
      loading.value = false;
    });
}

function getNextItem() {
  const { sort = "time", order = 1, ...rest } = query.value;
  const cursor = currentCursor.value + 1;
  const params = { ...rest, sort, order, skip: cursor, limit: 1 };
  delete (params as Record<string, unknown>).cursor;
  getItemsWithOptions(params, { cursor });
}

function getPreviousItem() {
  if (currentCursor.value === 0) {
    snackbar.value = { show: true, text: "No previous items", color: "orange" };
    return;
  }
  const { sort = "time", order = 1, ...rest } = query.value;
  const cursor = Math.max(0, currentCursor.value - 1);
  const params = { ...rest, sort, order, skip: cursor, limit: 1 };
  delete (params as Record<string, unknown>).cursor;
  getItemsWithOptions(params, { cursor });
}

function saveAnnotation() {
  if (!item.value) return;
  axios
    .patch(`/images/${item.value._id}`, {
      annotation: item.value.data.annotation,
    })
    .then(({ data }) => {
      item.value = data;
      getNextItem();
    })
    .catch(() => {
      snackbar.value = {
        show: true,
        text: "Error saving annotation",
        color: "#c00000",
      };
    });
}

function annotate(newAnnotation: string | null) {
  if (!item.value) return;
  item.value.data.annotation = newAnnotation;
  saveAnnotation();
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    getPreviousItem();
  }
  if (e.key === "ArrowRight") {
    e.preventDefault();
    getNextItem();
  }
  if (e.key === "0") {
    e.preventDefault();
    annotate(null);
  }
  labels.value.forEach((label, index) => {
    if (e.key === String(index + 1)) {
      e.preventDefault();
      annotate(label);
    }
  });
}
</script>
