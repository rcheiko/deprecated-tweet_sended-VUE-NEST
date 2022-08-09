<template>

<input type="file" @change="addPicture">
<div v-if="pic" :style="{'background-image':'url(' + pic + ')'}">aaa</div>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import router from '../router'

const pic = ref('')

const addPicture = async(e:any) => {
    const file = await e.target.files;
    const test = await e.target
    // console.log(file);
    var reader = new FileReader();
    reader.onload = async (e) => {
    //   pic.value = await e;
      console.log(e);
      
    }
    
    // console.log(pic.value);
    // pic.value = file[0].name;
    
}

</script>

<style scoped>

</style>