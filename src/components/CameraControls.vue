<template>
  <v-row>
    <v-col style="position: relative">
      <!-- Camera preview in video -->
      <video v-show="!value" @canplay="showCameraPreview()" ref="video">
        Video stream not available.
      </video>
      <canvas v-show="false" ref="canvas"></canvas>
      <img v-show="value" ref="photo" class="picture" />

      <v-btn
        color="rgba(255,255,255, 0.85)"
        absolute
        bottom
        fab
        small
        style="right: 20px; bottom: 20px; transform: translate(-50%, -50%)"
        @click="cameraSelectorClicked()"
      >
        <v-icon>mdi-camera-flip</v-icon>
      </v-btn>

      <v-fab-transition>
        <v-btn
          color="rgba(255,255,255, 0.85)"
          absolute
          bottom
          fab
          x-large
          style="left: 50%; bottom: 10px; transform: translate(-50%, -50%)"
          @click="handleShutterClicked()"
        >
          <v-icon v-if="file">mdi-restore</v-icon>
          <v-icon v-else>mdi-camera</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-col>
  </v-row>
</template>

<script lang="js">
export default {
    name: 'CameraControls',
    data(){
        return {
            cameras: [],
            selectedCameraIndex: null,
            video: null,
            canvas: null,
            streaming: false,
        }
    },
    props: {
        // Using value so as to use v-model on parent
        value: undefined,
    },
    mounted(){
        this.enumerateDevices()
        this.initCamera()
    },
    beforeDestroy(){
        if (!this.video.srcObject) return
        this.video.srcObject.getTracks().forEach(track => track.stop())
    },
    methods: {
        async enumerateDevices(){
            if (!navigator.mediaDevices?.enumerateDevices) return console.error('enumerateDevices() not supported')
            const devices = await navigator.mediaDevices.enumerateDevices()
            this.cameras = devices.filter(d => d.kind === 'videoinput')
        },
        cameraSelectorClicked(){
            if ( (this.selectedCameraIndex + 1) === this.cameras.length) this.selectedCameraIndex = 0
            else this.selectedCameraIndex ++
            this.initCamera()
        },
        handleShutterClicked(){
            if(this.file) this.reset()
            else this.takePicture()
        },
        async initCamera(){
            const cameraQuery = { video: { facingMode: "environment" } }
            if (this.selectedCameraIndex !== null ) cameraQuery.video = { deviceId: this.cameras[this.selectedCameraIndex].deviceId }
            try {
                const stream = await navigator.mediaDevices.getUserMedia(cameraQuery)
                this.video = this.$refs.video
                this.canvas = this.$refs.canvas
                this.video.setAttribute("playsinline", true)
                this.video.srcObject = stream
                this.video.play()
            } catch (error) {
                console.error(`An error occurred: ${error}`);
            }

        },
        showCameraPreview(){
            if (!this.streaming) this.streaming = true
        },
        dataURLtoBlob(dataURL) {
            let array, binary, i, len;
            binary = atob(dataURL.split(',')[1]);
            array = [];
            i = 0;
            len = binary.length;
            while (i < len) {
                array.push(binary.charCodeAt(i));
                i++;
            }
            return new Blob([new Uint8Array(array)], {
                type: 'image/png'
            });
        },
        async takePicture(){
            const context = this.canvas.getContext('2d')

            this.canvas.height = this.video.videoHeight
            this.canvas.width = this.video.videoWidth

            context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

            const data = this.canvas.toDataURL('image/png')
            this.$refs.photo.setAttribute('src', data);
            this.file = this.dataURLtoBlob(data)
        },
        reset(){
            this.file = null
        }
    },
    computed: {
        file: {
            get(){
                return this.value
            },
            set(newVal){
                this.$emit('input', newVal)
            }
        }
    }





}
</script>

<style>
video,
.picture {
  width: 100%;
}

.cameraSelector {
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>
