<template>
  <header>
    <Navbar/>
  </header>
<!-- <p v-if="loading">Loading...</p> -->
<!-- <p v-if="error">{{error}}</p> -->
<!-- <button @click="rep()">test</button> -->
<!-- <p v-for="u in user">{{u.user_id}}</p> -->
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import { provideApolloClient } from '@vue/apollo-composable'
import { apolloClient } from './main'
import { onBeforeMount, ref } from 'vue'
import { userInformationStore } from '@/stores/user_information'

provideApolloClient(apolloClient)
const user = userInformationStore();

onBeforeMount(async () => {
  user.getInfoUser();
})

</script>

<style>
	@font-face {
		font-family: "Coiny";
		src: local("Coiny"),
		url(font/Coiny-Cyrillic.ttf) format("truetype");
	}

  :root {
    --black: #222831;
    --navy: #053742;
    --teal: #00ADB5;
    --blue: #39A2DB;
    --light-blue: #A2DBFA;
    --dark-blue: #7293a5;
    --grey: #EEEEEE;
    --dark-grey: #393E46;
    --light-grey: #E8F0F2;
    --light-dark-grey: #8d99ae;
  }

  * {
    padding:0px;
    margin:0px;
    box-sizing: border-box;
  }
</style>