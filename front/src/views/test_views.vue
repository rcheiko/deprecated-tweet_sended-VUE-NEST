<template>
<Test_compo v-model:salut="salut">
    <!-- <template #yo>aurevoir mec</template> -->
</Test_compo>
<!-- <p>EVENT : {{event}}</p> -->
<div>{{salut}}</div>
<button @click="test()">salutsalut</button>
<!-- <p>test : {{ user.username }}</p> -->
<!-- <p>test 2 : {{ user.tag }}</p> -->
<!-- <button @click="user.getInfoUser">infos</button> -->
<!-- <button @click="salut.push('1')">abcdef</button> -->
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import axios from 'axios'
import router from '../router'
import Test_compo from '../components/test_compo.vue'
import { userInformationStore } from '@/stores/user_information'

const user = userInformationStore();

const salut = ref([]);

const test = () => {
    console.log("RES :", salut.value);
}

</script>