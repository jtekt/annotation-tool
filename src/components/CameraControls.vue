<template>
    <v-row>
        <v-col style="position: relative">
            <video v-show="!modelValue" @canplay="streaming = true" ref="videoEl">
                Video stream not available.
            </video>
            <canvas v-show="false" ref="canvasEl" />
            <img v-show="modelValue" ref="photoEl" class="picture" />

            <v-btn
                color="rgba(255,255,255, 0.85)"
                position="absolute"
                style="right: 20px; bottom: 20px"
                icon
                size="small"
                @click="cameraSelectorClicked"
            >
                <v-icon>mdi-camera-flip</v-icon>
            </v-btn>

            <v-btn
                color="rgba(255,255,255, 0.85)"
                position="absolute"
                style="left: 50%; bottom: 10px; transform: translateX(-50%)"
                icon
                size="x-large"
                @click="handleShutterClicked"
            >
                <v-icon v-if="modelValue">mdi-restore</v-icon>
                <v-icon v-else>mdi-camera</v-icon>
            </v-btn>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{ modelValue: Blob | null }>()
const emit = defineEmits<{ 'update:modelValue': [value: Blob | null] }>()

const cameras = ref<MediaDeviceInfo[]>([])
const selectedCameraIndex = ref<number | null>(null)
const streaming = ref(false)

const videoEl = ref<HTMLVideoElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)
const photoEl = ref<HTMLImageElement | null>(null)

onMounted(async () => {
    await enumerateDevices()
    await initCamera()
})

onBeforeUnmount(() => {
    if (!videoEl.value?.srcObject) return
    ;(videoEl.value.srcObject as MediaStream).getTracks().forEach((t) => t.stop())
})

async function enumerateDevices() {
    if (!navigator.mediaDevices?.enumerateDevices) return
    const devices = await navigator.mediaDevices.enumerateDevices()
    cameras.value = devices.filter((d) => d.kind === 'videoinput')
}

function cameraSelectorClicked() {
    if (selectedCameraIndex.value === null) selectedCameraIndex.value = 0
    else if (selectedCameraIndex.value + 1 === cameras.value.length) selectedCameraIndex.value = 0
    else selectedCameraIndex.value++
    initCamera()
}

function handleShutterClicked() {
    if (props.modelValue) reset()
    else takePicture()
}

async function initCamera() {
    const query: MediaStreamConstraints =
        selectedCameraIndex.value !== null
            ? { video: { deviceId: cameras.value[selectedCameraIndex.value].deviceId } }
            : { video: { facingMode: 'environment' } }
    try {
        const stream = await navigator.mediaDevices.getUserMedia(query)
        if (!videoEl.value) return
        videoEl.value.setAttribute('playsinline', 'true')
        videoEl.value.srcObject = stream
        videoEl.value.play()
    } catch (error) {
        console.error(`Camera error: ${error}`)
    }
}

function dataURLtoBlob(dataURL: string): Blob {
    const binary = atob(dataURL.split(',')[1])
    const array = Array.from(binary, (c) => c.charCodeAt(0))
    return new Blob([new Uint8Array(array)], { type: 'image/png' })
}

function takePicture() {
    if (!canvasEl.value || !videoEl.value || !photoEl.value) return
    const context = canvasEl.value.getContext('2d')!
    canvasEl.value.height = videoEl.value.videoHeight
    canvasEl.value.width = videoEl.value.videoWidth
    context.drawImage(videoEl.value, 0, 0, canvasEl.value.width, canvasEl.value.height)
    const data = canvasEl.value.toDataURL('image/png')
    photoEl.value.setAttribute('src', data)
    emit('update:modelValue', dataURLtoBlob(data))
}

function reset() {
    emit('update:modelValue', null)
}
</script>

<style>
video,
.picture {
    width: 100%;
}
</style>
