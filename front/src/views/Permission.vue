<template>
    <body>
        <h4>Welcome you can allow or delete permissions of tweet in this page</h4>
        <h6>Members of this team can use Twitter as @{{user?.username}} without knowing the password.</h6>
        <div class="permission">
            <div>
                <form @submit.prevent="give_permission">
                    <div class="form_add">
                        <label for="perm">Type the username to add</label>
                        <input v-model="nameUser" type="text" id="perm" placeholder="username" required>
                        <button class="add_button" type="submit">ADD PERMISSION</button>
                    </div>
                </form>
            </div>
            <div class="remove_perm">
                <form class="userToRemove" v-for="(res, index) in perm" @submit.prevent="remove_permission(user.id, res.data.id)">
                    <div class="div_img_profile">
                        <img :href="'https://twitter.com/' + res.data.username" class="img-profile" v-bind:src="res.data.profile_image_url">
                    </div>
                    <a :href="'https://twitter.com/' + res.data.username" class="username_link" target="_blank">{{res.data.username}}</a>
                    <button class="remove_button" type="submit">REMOVE</button>
                </form>
            </div>
        </div>
    </body>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { createPermission, removePermission } from '@/constants/graphql'
import axios from 'axios'
import authHeader from '@/services/auth-header'

const nameUser = ref('');
const perm = ref();
let user = JSON.parse(localStorage.getItem('user') || '');

const { mutate: _createPermission, onDone: _createPermissionDone } = useMutation(createPermission);
const { mutate: _removePermission, onDone: _removePermissionDone } = useMutation(removePermission);

_removePermissionDone(() => {
	console.log('DONE removePermissionDone');
})

_createPermissionDone(() => {
	console.log('DONE createPermissionDone');
})


onBeforeMount(async () => {
	await axios.get(import.meta.env.VITE_BACKEND_URL + '/users/giveAllUsersPermissions/' + user.id, {headers: authHeader()})
	    .then((response) => {
            perm.value = response.data;
	    })
	    .catch((e: Error) => {
	        console.log('error :' + e);
	    })
})

const give_permission = async() => {
    await _createPermission({
        user_id_owner:user.id,
        nameUser: nameUser.value
    })
	await axios.get(import.meta.env.VITE_BACKEND_URL + '/users/giveAllUsersPermissions/' + user.id, {headers: authHeader()})
	    .then((response) => {
            perm.value = response.data;
	    })
	    .catch((e: Error) => {
	        console.log('error : ' + e);
	    })
}

const remove_permission = async(user_id_owner: string, user_id: string) => {
    await _removePermission({
        user_id_owner: user_id_owner,
        user_id: user_id
    })
        .catch ((err) => {
            console.log('error remove perm :', err);
        })
    
	await axios.get(import.meta.env.VITE_BACKEND_URL + '/users/giveAllUsersPermissions/' + user.id, {headers: authHeader()})
	    .then((response) => {
            perm.value = response.data;
	    })
	    .catch((e: Error) => {
	        console.log('error : ' + e);
	    })
}

</script>

<style scoped>
	@font-face {
		font-family: "Coiny";
		src: local("Coiny"),
		url(../font/Coiny-Cyrillic.ttf) format("truetype");
	}

    body {
        margin: 3% 15%;
    }

    h4 {
        text-align: center;
        font-family: 'Coiny';
        font-style: normal;
        font-weight: 400;
        font-size: 28px;
        line-height: 26px;
        color: var(--black);
    }

    h6 {
        text-align: center;
        margin: 4% 30% 8% 30%;
        font-family: 'Coiny';
        font-style: normal;
        font-weight: 400;
        font-size: 22px;
        line-height: 26px;
        color: var(--dark-blue);
    }

    .permission {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .form_add {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
    .add_button {
        cursor:pointer;
        text-align: center;
        background: var(--grey);
        padding: 5px;
        border-radius: 10px;
        border:none;
        font-family: 'Coiny';
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 26px;
        color: var(--blue);
    }

    .add_button:hover {
        color: var(--light-blue);
    }

    .remove_perm {
        background: #D9D9D9;
        padding: 1%;
        border-radius: 10px;
        width: 45%;
        font-family: 'Coiny';
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 26px;
        color: var(--black);
    }

    .remove_button {
        cursor:pointer;
        background: var(--grey);
        padding: 5px;
        border-radius: 10px;
        border:none;
        font-family: 'Coiny';
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 26px;
        color: var(--blue);
    }

    .remove_button:hover {
        color: var(--light-blue);
    }

    .img-profile {
        border-radius: 25px;
    }
    .username_link {
        color: inherit;
        align-items: center;
        flex-basis: 33.33%;
    }
    .div_img_profile {
        padding-left: 3%;
        flex-basis: 30%;
    }
    
    .userToRemove {
        display: flex;
        flex-direction: row;
        justify-content:center;
        align-items: center;
        padding: 5px 0px;
        gap: 80px;
    }

    label {
        display: block;
        font-family: 'Coiny';
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 26px;
        color: var(--black);
    }
    
    input {
        display: block;
        margin: 10px 0;
        width:85%;
        background: #D9D9D9;
        align-items: center;
        border: none;
        border-radius: 15px;
        padding: 5px;
        font-family: 'Coiny';
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 26px;
        color: var(--black);
    }
</style>