<template>
    <div class="imgDownload"> <!-- DISPLAY IMAGE DOWNLOADED -->
        <div class="imgDownloadSub" v-for="(p, index) in pic">
            <div v-if="isImage(p.type) === 1 || p.type === 'image/gif'" :style="{'background-image':'url(' + p.src + ')'}" class="imgDisplay">
                <i class="fa-solid fa-circle-xmark fa-swap-opacity xmark" @click="cancelPicture(index)"></i>
            </div>
            <div class="video-upload">
                <video v-if="p.type === 'video/mp4'" :src="p.src" controls preload="metadata" width="250" loop></video>
                <i v-if="p.type === 'video/mp4'" class="fa-solid fa-circle-xmark fa-swap-opacity xmark-video" @click="cancelPicture(index)"></i>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import axios from 'axios'

const props = defineProps(['pic', 'allPicture']);
const emit = defineEmits(['update:pic', 'update:allPicture']);

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
    props.pic.splice(index, 1);
    emit('update:pic', props.pic);
    props.allPicture.splice(index, 1);
    emit('update:allPicture', props.allPicture);
}

</script>

<style scoped>
    .imgDisplay {
        width: 120px;
        height: 120px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        border-radius: 5px;
    }

    .imgDownload {
        display:flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: flex-start;
        margin-top:10px;
    }

    .imgDownloadSub {
        margin: 0 5px;
    }

    .xmark {
        position: relative;
        left: 5px;
        top: 3px;
        color: white;
        cursor: pointer;
    }

    .xmark-video {
        position: absolute;
        color:white;
        cursor:pointer;
        left: 5px;
        top: 5px;
    }
    .video-upload {
        position:relative;
    }
    .xmark:hover, .xmark-video:hover {
        opacity: 0.9;
    }
</style>