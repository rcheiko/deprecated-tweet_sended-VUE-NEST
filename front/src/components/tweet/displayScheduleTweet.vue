<template>
        <div class="schedule" v-if="scheduleTweetArr">
            <p>Schedule Tweet :</p>
            <br>
            <div class="every_tweet" v-for="(info, index) in scheduleTweetArr">
                <div class="img-name-tweet">
                    <div class="img-profile" :style="{'background-image':'url(' + info.profile_image_url + ')'}"></div>
                    <p>{{info.username}}</p>
                </div>
                <p>Tweet : {{info.tweet}}</p>
                <p>Schedule : {{info.scheduleTweet}}</p>
                <div v-if="info.gifLink" class="gif-image img-selected" :style="{'background-image':'url(' + info.gifLink + ')'}"></div>
                <div class="multiple_button_tweet">
                    <button class="button" @click="remove_shedule_tweet(index)">Remove</button>
                    <!-- <button class="button" @click="edit_shedule_tweet(index)">Edit</button> -->
                </div>
            </div>
        </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { removeTweet } from '@/constants/graphql'
import { useMutation } from '@vue/apollo-composable'
import authHeader from '@/services/auth-header'
import axios from 'axios'

// const scheduleTweet = ref(); // All the schedule tweet will be stocked here
const { mutate: _removeTweet, onDone: _removeTweetDone } = useMutation(removeTweet);
const props = defineProps(['scheduleTweetArr']);
const emit = defineEmits(['update:scheduleTweetArr']);

onBeforeMount(async () => {
    let user = await JSON.parse(localStorage.getItem('user') || '');
	await axios.get(import.meta.env.VITE_BACKEND_URL + '/tweet/schedule/' + user.id, {headers: authHeader()})
	    .then(async(response) => {
            await emit('update:scheduleTweetArr', response.data);
            // scheduleTweet.value = await response.data;
	    })
	    .catch((err: Error) => {
	        console.log('error : ' + err);
	    })
})

// const edit_shedule_tweet = async (index:number) => {
    // if (display_edit.value) {
        // display_edit.value = false;
        // edit_date.value = undefined;
        // edit_tweet.value = '';
    // }
    // else {
        // id_edit.value = index;
        // display_edit.value = true;
        // edit_date.value = scheduleInfo.value[index].scheduleTweet;
        // edit_tweet.value = scheduleInfo.value[index].tweet;
    // }
// }

const remove_shedule_tweet = async (index:number) => {
    let user = await JSON.parse(localStorage.getItem('user') || '');
    await _removeTweet({id: props.scheduleTweetArr[index].id})
        .catch((err: Error) => {
            console.log("error :", err);
        })
	await axios.get(import.meta.env.VITE_BACKEND_URL + '/tweet/schedule/' + user.id, {headers: authHeader()})
	    .then(async(response) => {
            // scheduleTweet.value = await response.data;
            await emit('update:scheduleTweetArr', response.data);
	    })
	    .catch((err: Error) => {
	        console.log('error : ' + err);
	    })
    
}

</script>

<style scoped>
    .schedule{
        display: flex;
        align-self: flex-start;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
    .every_tweet {
        background-color: #dbdbdb;
        border-radius: 10px;
        padding: 5px;
        margin-bottom: 10px;
    }
    .img-name-tweet {
        display: flex;
        justify-content: center;
        align-items: center;
    }
	.img-profile {
		width: 32px;
		height: 32px;
        background-position: center;
        background-size: cover;
		border-radius: 25px;
	}

    .gif-image {
    	width:120px;
    	height:120px;
        border-radius:5px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
    }

    .img-selected{
        margin-left: auto;
        margin-right: auto;
    }

    .multiple_button_tweet {
        display:flex;
        justify-content: center;
        align-items: center;
    }

    .button {
        font-family: 'Coiny';
        font-size: 18px;
        color: var(--blue);
        background-color: var(--grey);
        border: none;
        border-radius: 10px;
        padding: 0 8px;
        cursor: pointer;
    }
    .button:hover {
        color: var(--teal);
        opacity: 0.6;
    }
</style>