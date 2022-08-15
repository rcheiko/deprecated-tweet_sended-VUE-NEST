<template>

<label for="file"><i class="fa-solid fa-images icon_picture"></i></label>
<input style="display:none;" type="file" id="file" @change="addPicture" accept="image/*" multiple />
<div v-if="pic" :style="{'background-image':'url(' + pic + ')'}" class="test"></div>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import router from '../router'

const pic = ref('')

const addPicture = async(e:any) => {
    let formData = new FormData();

    for (let i = 0; e.target.files[i]; i++) {
        formData.append("file " + i, e.target.files[i]);
        console.log(e.target.files[i]);
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

    .icon_picture {
        font-size: 2em;
        color: var(--blue);
    }
</style>