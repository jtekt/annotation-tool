<template>
    <v-card>
        <v-card-title>Camera</v-card-title>
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
                    <v-btn :loading="uploading" @click="upload" color="primary">
                        <v-icon start>mdi-upload</v-icon>
                        <span>Upload</span>
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>

        <v-snackbar v-model="snackbar.show" :color="snackbar.color">
            {{ snackbar.text }}
            <template v-slot:actions>
                <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
            </template>
        </v-snackbar>
    </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import CameraControls from '@/components/CameraControls.vue'
import axios from '@/axios'
import { useAppStore } from '@/store'

const store = useAppStore()

const picture = ref<Blob | null>(null)
const annotation = ref<string | null>(null)
const uploading = ref(false)
const snackbar = ref({ show: false, text: '', color: '' })

const labels = computed(() => store.labels ?? [])

async function upload() {
    if (!picture.value) return
    const body = new FormData()
    body.append('annotation', annotation.value ?? '')
    body.append('image', picture.value, `${uuidv4()}.png`)

    try {
        uploading.value = true
        await axios.post('/images', body, { headers: { 'Content-Type': 'multipart/form-data' } })
        picture.value = null
        snackbar.value = { show: true, color: 'success', text: 'Upload successful' }
    } catch (error) {
        console.error(error)
        snackbar.value = { show: true, color: 'error', text: 'Upload failed' }
    } finally {
        uploading.value = false
    }
}
</script>
