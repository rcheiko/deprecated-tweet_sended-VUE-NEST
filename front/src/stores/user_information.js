import { defineStore } from 'pinia'

export const userInformationStore = defineStore({
    id: 'userInfo',
    state: () => {
        test: 0;
        username: "salut";
    }
})