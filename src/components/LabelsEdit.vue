<template>
    <div>
        <v-row>
            <v-col>
                <h3>Labels</h3>
            </v-col>
            <v-spacer />
            <v-col cols="auto" v-if="!disabled">
                <v-btn @click="saveLabels">
                    <v-icon start>mdi-content-save</v-icon>
                    <span>Save labels</span>
                </v-btn>
            </v-col>
        </v-row>

        <template v-if="!disabled">
            <v-row v-for="(label, index) in labels" :key="index" align="center" dense>
                <v-col>
                    <v-text-field :model-value="label" @update:model-value="labels[index] = $event" />
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
                        <v-icon start>mdi-plus</v-icon>
                        <span>Add label</span>
                    </v-btn>
                </v-col>
            </v-row>
        </template>
        <template v-else>
            <p>Label editing disabled by administrator</p>
            <ul>
                <li v-for="(label, index) in labels" :key="index">{{ label }}</li>
            </ul>
        </template>

        <v-snackbar v-model="snackbar.show" :color="snackbar.color">
            {{ snackbar.text }}
            <template v-slot:actions>
                <v-btn icon @click="snackbar.show = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '@/store'

const store = useAppStore()

const disabled = !!import.meta.env.VITE_PREVENT_LABELS_EDIT
const labels = ref<string[]>([...(store.labels ?? [])])

const snackbar = ref({ show: false, text: '', color: 'success' })

function saveLabels() {
    store.saveLabels(labels.value)
    snackbar.value = { show: true, text: 'Labels saved', color: 'success' }
}
</script>
