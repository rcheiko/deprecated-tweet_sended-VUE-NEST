<template>
      <nav>
          <router-link class="router logged" to="/"><div class="logo">
            <div class="logo_img"></div>
            <p class="logged">TWEET SENDED</p>
          </div></router-link>
          <div class="nav-right">
            <div class="nav-middle">
              <div v-if="login">
                <router-link class="router logged" to="/">Home</router-link>
                <router-link class="router logged" to="/profile">Profile</router-link>
                <router-link class="router logged" to="/permission">Permission</router-link>
                <router-link class="router logged" to="/tweet">Tweet</router-link>
              </div>
              <div v-else>
                <router-link class="router no-login" to="/">Home</router-link>
                <router-link class="router no-login" to="/profile">Profile</router-link>
                <router-link class="router no-login" to="/permission">Permission</router-link>
                <router-link class="router no-login" to="/tweet">Tweet</router-link>
              </div>
            </div>
            <div class="router-end">
              <router-link @click="logout()" v-if="login" class="router logged" to="/">LOGOUT</router-link>
              <router-link @click="auth()" v-if="login === false" class="router logged" to="/">LOGIN</router-link>
            </div>
        </div>
      </nav>
  <router-view />
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import axios from 'axios'
import router from '../router'

const login = ref(false)

if (localStorage.hasOwnProperty('user') === true){
  login.value = true;
}

const logout = () => {
	localStorage.removeItem("user");
  login.value = false;
  // window.location.reload();
}

onBeforeMount(async () => {
    if (localStorage.hasOwnProperty("user") === false)
    {
      let url = new URL(window.location.href);
      let oauth_verifier = url.searchParams.get("oauth_verifier");
      let oauth_token = url.searchParams.get("oauth_token");
      if (oauth_verifier != null)
      {
        const info = localStorage.getItem("oauth");
        await axios.post(import.meta.env.VITE_BACKEND_URL + '/twitter-callback', {oauth_token:oauth_token, oauth_verifier:oauth_verifier, info:info})
          .then(async (response) => {
            const userJWT = parseJwt(response.data.jwt)
            userJWT.JWT = response.data.jwt;
            localStorage.removeItem("oauth");
            localStorage.setItem("user", JSON.stringify(userJWT));
            await router.push('/')
            login.value = true;
        })
          .catch((e: Error) => {
            console.log('error : ' + e);
        })
      }
    }
})

const parseJwt = (token:string) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

const auth = () => {
  axios.get(import.meta.env.VITE_BACKEND_URL + '/auth/', {})
	  .then((response) => {
      console.log(response)
		  localStorage.setItem("oauth", JSON.stringify(response.data));
      window.location.href = response.data.url
	  })
	  .catch((e: Error) => {
	    console.log('error : ' + e);
	  })
}

</script>

<style scoped>
nav {
  display:flex;
  flex-direction: row;
  justify-content:space-around;
  background-color: var(--dark-grey);
  align-items: center;
  flex-wrap: wrap;
}

nav .logo {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 15px;

  font-family: 'Coiny';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 26px;
  color: var(--light-grey);
  cursor:pointer;
}

.logo_img {
  margin-left: 10px;
  width: 48px;
  height: 53.61px;
  background: url(../assets/img/logo.png);
  background-repeat: no-repeat;
  background-size: contain;
}

nav .router {
  color: var(--light-grey);
  text-decoration: none;
  text-transform: uppercase;
  font-family: 'Coiny';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 26px;
  margin: 15px 40px;
}

nav .nav-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 181px;
}

nav .nav-middle {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

nav .router-end {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 10px;
  gap: 10px;
}

nav .logged:hover {
  color:var(--blue);
}

nav .no-login:hover {
  color:var(--dark-blue);
}

</style>