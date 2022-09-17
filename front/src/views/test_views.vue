<template>
<Test_compo v-model="salut" :a="test">
    <!-- <template #yo>aurevoir mec</template> -->
</Test_compo>
<!-- <p>EVENT : {{event}}</p> -->
{{salut}}

<p>test : {{ user.username }}</p>
<p>test 2 : {{ user.test }}</p>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import axios from 'axios'
import router from '../router'
import Test_compo from '../components/test_compo.vue'
import { userInformationStore } from '@/stores/user_information'

const user = userInformationStore();

const salut = ref('1salut1');

const test = (val:any) => {
    salut.value = val;
}

// const event = ref('event');

</script>