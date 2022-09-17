import { defineStore } from 'pinia'
import axios from 'axios'
import authHeader from '@/services/auth-header';

export const userInformationStore = defineStore({
    id: 'userInfo',
    state: () => ({
        username: "",
        tag: ""
    }),
    actions: {
        getInfoUser() {
            let user = JSON.parse(localStorage.getItem('user') || '');
            axios.get(import.meta.env.VITE_BACKEND_URL + '/users/infoUser/' + user.id, {headers: authHeader()})
                .then((response) => {
                    this.username = response.data.name;
                    this.tag = response.data.screen_name;
                })
                .catch((e) => {
                    console.log('error : ' + e);
                })
        },
    }
})