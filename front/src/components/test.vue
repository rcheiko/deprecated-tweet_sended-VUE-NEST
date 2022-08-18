<template>

<form @submit.prevent="send()">
    <label for="file"><i class="fa-solid fa-images icon_picture"></i></label>
    <input style="display:none;" type="file" id="file" @change="addPicture" accept="image/*" multiple/>
    <button type="submit">aaaaa</button>
</form>
<div v-if="pic" :style="{'background-image':'url(' + pic + ')'}" class="test"></div>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const pic = ref('')
const allPicture = ref();

const addPicture = async(e:any) => {
    allPicture.value = e.target.files;
    pic.value = URL.createObjectURL(e.target.files[0]);
}

const send = async() => {
    let formData = new FormData();

    for (let i = 0; allPicture.value[i]; i++) {
        formData.append("file", allPicture.value[i]);
        console.log(allPicture.value[i]);
    }
    await axios.post(import.meta.env.VITE_BACKEND_URL + '/users/file', formData)
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log('error :', err);
        })
}

</script>

<style scoped>
    .test {
        width: 120px;
        height: 120px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        border-radius: 5px;
    }

    .icon_picture {
        font-size: 2em;
        color: var(--blue);
        cursor: pointer;
    }
</style>