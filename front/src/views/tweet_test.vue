<template>
    <body>
        <div>
            <form @submit.prevent="">
                <label for="_subject">Tweet for someone : </label>
                <select class="select-twitter-account" v-model="tweetos_selected" required>
                    <option disabled value="">Twitter name</option>
                    <option>{{user.tag}}</option>
                    <option v-for="res in userPermission">{{res.data.username}}</option>
                </select>
                <textarea v-model="_tweet" id="_subject" name="_subject" placeholder="Tweet something.." required></textarea>
                <div class="multiple_button_tweet"> <!-- MULTIPLE CHOICE FOR TWEET -->
                    <chooseGif v-model:display_gif="display_gif"  v-model:gifToSend="gifToSend"></chooseGif>
                    <schedule v-model:date="dateScheduledTweet"></schedule>
                    <pictureDownload v-model:pic="pic" v-model:allPicture="allPicture" v-model:display_gif="display_gif" v-model:gifToSend="gifToSend"></pictureDownload>
                    <button class="button" type="submit">Tweet</button>
                </div>
            </form>
            <pictureDisplay v-model:pic="pic" v-model:allPicture="allPicture"></pictureDisplay>
            <displaySchedule></displaySchedule>
        </div>
    </body>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import { userInformationStore } from '@/stores/user_information'
import axios from 'axios'
import authHeader from '@/services/auth-header'
import chooseGif from '../components/tweet/chooseGif.vue'
import schedule from '../components/tweet/schedule.vue'
import pictureDownload from '../components/tweet/picture/pictureDownloadTweet.vue'
import pictureDisplay from '../components/tweet/picture/pictureDisplayTweet.vue'
import displaySchedule from '../components/tweet/displayScheduleTweet.vue'

const user = userInformationStore();

const tweetos_selected = ref('') // v-model on tweetos selected by user in the form tweet
const _tweet = ref('') // v-model on tweet form
const userPermission = ref(); // user that gave permission to this user
// const scheduleTweet = ref(); // all the tweet that the user scheduled
const display_gif = ref(false) // check is we show the menu to take a gif
const gifToSend = ref(); // The gif that the user selected and want to send
const dateScheduledTweet = ref (''); // Date that the user put to schedule his tweet
const pic = ref([{}]);  // All picture selected to display with url created
pic.value.shift();
const allPicture = ref(['']); // All picture selected by the user with all information (size ...)
allPicture.value.shift();

const test = () => {
    console.log("ALL PICTURE :", allPicture.value);
    console.log("pic value", pic.value);
}

onBeforeMount(async () => {
    let user = await JSON.parse(localStorage.getItem('user') || '');
	await axios.get(import.meta.env.VITE_BACKEND_URL + '/users/giveUsersTweet/' + user.id, {headers: authHeader()})
	    .then(async(response) => {
            userPermission.value = await response.data;
	    })
	    .catch((err: Error) => {
	        console.log('error : ' + err);
	    })
})

</script>

<style scoped>

@font-face {
		font-family: "BeVietnamPro-SemiBold";
		src: local("BeVietnamPro-SemiBold"),
		url(../font/BeVietnamPro-SemiBold.ttf) format("truetype");
	}

    body{
        font-family: 'BeVietnamPro-SemiBold';
        font-size: 17px;
        color: var(--dark-grey);
    }

    form {
        height:100%;
    }

    textarea {
        display:block;
        box-sizing: border-box;
        width: 25%;
        height:150px;
        padding: 12px 15px;
        margin: 10px 40px 0 0;
        border: 2px solid #ccc;
        border-radius: 4px;
        background-color: var(--grey);
        resize: none;
        font-family: 'BeVietnamPro-SemiBold';
        font-size: 17px;
    }

    .select-twitter-account {
        font-family: 'BeVietnamPro-SemiBold';
        font-size: 16px;
        border: none;
        background-color: var(--light-grey);
        color: var(--blue);
        padding: 1px;
        border-radius: 5px;
        cursor: pointer;
    }

    .multiple_button_tweet {
        display:flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 10px;
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