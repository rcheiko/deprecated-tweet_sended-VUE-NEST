<template>
    <label for="file" v-if="gifToSend === undefined && pic[0]?.type != 'image/gif' && pic[0]?.type != 'video/mp4' && pic.length < 4"><i class="fa-solid fa-images icon_picture"></i></label>
    <label v-else><i class="fa-solid fa-images icon_picture_disabled"></i></label>
    <input style="display:none;" type="file" id="file" @change="addPicture" accept="image/png, image/jpeg, image/jpg, image/gif, video/mp4" v-if="pic.length === 0" multiple/>
    <input style="display:none;" type="file" id="file" @change="addPicture" accept="image/png, image/jpeg, image/jpg"  v-if="pic.length >= 1 && pic.length <= 2" multiple/>
    <input style="display:none;" type="file" id="file" @change="addPicture" accept="image/png, image/jpeg, image/jpg"  v-if="pic.length === 3"/>
    <p>{{errorFile}}</p>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps(['gifToSend', 'display_gif', 'pic', 'allPicture']);
const emit = defineEmits([ 'update:gifToSend', 'update:display_gif', 'update:pic', 'update:allPicture']);

const errorFile = ref('');

const error_file = () => {
    setTimeout(() => errorFile.value = "", 2500);
}

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

const addPicture = async(e:any) => {
    const tmpPicture = e.target.files;
    if (tmpPicture.length + props.allPicture.length > 4) {
        errorFile.value = "You need to put 4 images maximum";
        error_file();
        return;
    }
    for (let i = 0; tmpPicture[i]; i++) {
        props.allPicture.push(tmpPicture[i]);
        emit('update:allPicture', props.allPicture);
    }
    for (let i = 0; props.allPicture[i]; i++) { // CHECK ERROR FILE UPLOAD
        if (isImage(props.allPicture[i].type) === 1 && props.allPicture[i].size >= 20000000){
            props.pic.splice(0, props.pic.length);
            emit('update:pic', props.pic);
            props.allPicture.splice(0, props.allPicture.length);
            emit('update:allPicture', props.allPicture);
            errorFile.value = "The image size is too large, please put picture on 20MB maximum.";
            error_file();
            return ;
        }
        if (props.allPicture[i].type === 'image/gif' && props.allPicture.length >= 2) {
            props.pic.splice(0, props.pic.length);
            emit('update:pic', props.pic);
            props.allPicture;
            emit('update:allPicture', props.allPicture);
            errorFile.value = "Please choose either 1 GIF or up to 4 photos.";
            error_file();
            return ;
        }
        if (props.allPicture[i].type === 'video/mp4' && props.allPicture.length >= 2) {
            props.pic.splice(0, props.pic.length);
            emit('update:pic', props.pic);
            props.allPicture.splice(0, props.allPicture.length);
            emit('update:allPicture', props.allPicture);
            errorFile.value = "Please choose either 1 Video or up to 4 photos.";
            error_file();
            return ;
        }
        if (props.allPicture[i].type === 'image/gif' && props.allPicture[i].size >= 15000000) {
            props.pic.splice(0, props.pic.length);
            emit('update:pic', props.pic);
            props.allPicture.splice(0, props.allPicture.length);
            emit('update:allPicture', props.allPicture);
            errorFile.value = "The gif size is too large, please put gif on 15MB maximum.";
            error_file();
            return ;
        }
        if (props.allPicture[i].type === 'video/mp4' && props.allPicture[i].size >= 300000000) {
            props.pic.splice(0, props.pic.length);
            emit('update:pic', props.pic);
            props.allPicture.splice(0, props.allPicture.length);
            emit('update:allPicture', props.allPicture);
            errorFile.value = "The video size is too large, please put video on 300MB maximum.";
            error_file();
            return ;
        }
    }
    for (let i = 0; e.target.files[i]; i++) {
        if (isImage(e.target.files[i].type) === 1) {
            let img = new Image();
            img.src = URL.createObjectURL(e.target.files[i]);
            await img.decode()
            console.log(img.width, " - ", img.height);
            if (img.width > 8192 || img.height > 8192) {
                props.pic.splice(0, props.pic.length)
                emit('update:pic', props.pic);
                props.allPicture.splice(0, props.allPicture.length)
                emit('update:allPicture', props.allPicture);
                errorFile.value = "The maximum resolution for image is 8192x8192.";
                error_file();
                return ;
            }
        }
        if (e.target.files[i].type === 'image/gif') {
            let gif = new Image();
            gif.src = URL.createObjectURL(e.target.files[i]);
            await gif.decode()
            console.log(gif.width, " - ", gif.height);
            if (gif.width > 2048 || gif.height > 2048) {
                props.pic.splice(0, props.pic.length)
                emit('update:pic', props.pic);
                props.allPicture.splice(0, props.allPicture.length)
                emit('update:allPicture', props.allPicture);
                errorFile.value = "The maximum resolution for gif is 2048x2048.";
                error_file();
                return ;
            }
        }

        if (e.target.files[i].type === 'video/mp4') {
            let video = document.createElement('video');

            video.src = URL.createObjectURL(e.target.files[i]);

            if ((video.width > 1900 || video.height > 1900) || (video.width > 1200 && video.height > 1200))  { // A TEST RESO 1900 x 1200 max -> 1200 x 1900 max
                props.pic.splice(0, props.pic.length);
                emit('update:pic', props.pic);
                props.allPicture.splice(0, props.allPicture.length);
                emit('update:allPicture', props.allPicture);
                errorFile.value = "The maximum resolution for video is 1900x1200 or 1200x1900.";
                error_file();
                return ;
            }
            takeDurationVideo(video);
        }
        let picUrlInfo = { src: URL.createObjectURL(e.target.files[i]), type: e.target.files[i].type };
        props.pic.push(picUrlInfo);
        emit('update:pic', props.pic);
    }
    emit('update:display_gif', false);
    emit('update:gifToSend', undefined);
    e.target.value = '';
}

const takeDurationVideo = async(video:any) => {
    video.onloadedmetadata = function() {
        console.log(video.videoWidth, " - ", video.videoHeight);
        console.log("DURATION :", video.duration);
        if (video.duration > 220) {
            emit('update:pic', props.pic.splice(0, props.pic.length));
            emit('update:allPicture', props.allPicture.splice(0, props.allPicture.length));
            errorFile.value = "The video can have a duration of 220 seconds.";
            error_file();
        }
    }
}

</script>

<style scoped>
.icon_picture {
        font-size: 18px;
        color: var(--blue);
        background-color: var(--grey);
        border: none;
        border-radius: 10px;
        padding: 6px;
        cursor: pointer;
    }
    .icon_picture_disabled {
        font-size: 18px;
        color: var(--light-dark-grey);
        background-color: var(--grey);
        border: none;
        border-radius: 10px;
        padding: 6px;
        cursor:not-allowed;
    }
    .icon_picture:hover {
        color: var(--teal);
        opacity: 0.6;
    }
</style>