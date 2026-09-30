<template>
    <v-card>
        <v-toolbar flat>
            <v-btn icon exact :to="{ name: 'items' }">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-toolbar-title>Annotation tool</v-toolbar-title>
        </v-toolbar>

        <v-card-text>
            <p>Author: Maxime MOREILLON</p>
            <v-data-table
                hide-default-footer
                :items-per-page="-1"
                :headers="headers"
                :items="services"
            />
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from '@/axios'
import pjson from '../../package.json'
import runtimeEnv from '@/runtimeEnv'

interface Service {
    name: string
    url: string
    version: string | null
}

const headers = [
    { title: 'Service', key: 'name' },
    { title: 'Version', key: 'version' },
    { title: 'URL', key: 'url' },
]

const services = ref<Service[]>([
    { name: 'Annotation tool', url: window.location.origin, version: pjson.version },
    { name: 'Image storage Back-end', url: runtimeEnv.VITE_IMAGE_STORAGE_API_URL, version: null },
])

onMounted(() => {
    services.value.forEach((service) => {
        if (service.version) return
        service.version = 'Connecting...'
        axios
            .get(service.url)
            .then(({ data }) => { service.version = data.version })
            .catch(() => { service.version = 'Unable to connect' })
    })
})
</script>
