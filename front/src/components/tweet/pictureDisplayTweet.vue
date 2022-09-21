<template>
    <div class="imgDownload"> <!-- DISPLAY IMAGE DOWNLOADED -->
        <div class="imgDownloadSub" v-for="(p, index) in pic">
            <div v-if="isImage(p.type) === 1 || p.type === 'image/gif'" :style="{'background-image':'url(' + p.src + ')'}" class="imgDisplay">
                <i class="fa-solid fa-circle-xmark fa-swap-opacity xmark" @click="cancelPicture(index)"></i>
            </div>
            <div class="video-upload">
                <video v-if="p.type === 'video/mp4'" :src="p.src" controls preload="metadata" width="250" loop> <!-- A FINIR LA VIDEO NE FONCTIONNE PAS CORRECTEMENT REFAIRE L'INTERFACE -->
                </video>
                <i v-if="p.type === 'video/mp4'" class="fa-solid fa-circle-xmark fa-swap-opacity xmark-video" @click="cancelPicture(index)"></i>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import axios from 'axios'
import router from '../../router'

const props = defineProps([]);
const emit = defineEmits([]);

const isImage = (res:any) => {
    let check:number = 0;
    const formatImage = ['image/jpeg', 'image/jpg', 'image/png'];
    for (let i = 0; formatImage[i]; i++) {
        if (res === formatImage[i]){
            check++;
        }
    }
    if (check === 0) {
        return (0);
    }
    return (1);
}

const cancelPicture = async(index:number) => {
    pic.value.splice(index, 1);
    allPicture.value.splice(index, 1);
}

</script>

<style scoped>

</style>