<template>

<input type="file" @change="addPicture" ref="file" accept="image/*" multiple>
<div v-if="pic" :style="{'background-image':'url(' + pic + ')'}" class="test"></div>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import router from '../router'

const pic = ref('')

const addPicture = async(e:any) => {
    let formData = new FormData();
    // console.log(e.target.files[0]);
    // console.log('################');
    // console.log(e.target.files[1]);
    
    for (let i = 0; e.target.files[i]; i++) {
        formData.append("file " + i, e.target.files[i]);
    }
    await axios.post(import.meta.env.VITE_BACKEND_URL + '/users/file', formData)
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log('error :', err);
        })
    pic.value = URL.createObjectURL(e.target.files[0]);
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
</style>