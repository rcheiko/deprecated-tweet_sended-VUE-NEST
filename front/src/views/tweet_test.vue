<template>
    <body>
        <div>
            <form @submit.prevent="tweet_for_someone()">
                <label for="_subject">Tweet for someone : </label>
                <select class="select-twitter-account" v-model="tweetos_selected" required>
                    <option disabled value="">Twitter name</option>
                    <option>{{user.tag}}</option>
                    <option v-for="res in userPermission">{{res.data.username}}</option>
                </select>
                <textarea v-model="_tweet" id="_subject" name="_subject" placeholder="Tweet something.." required></textarea>
                <div class="multiple_button_tweet"> <!-- MULTIPLE CHOICE FOR TWEET -->
                    <chooseGif v-model:gifSelected="gifSelected" v-model:display_gif="display_gif"  v-model:gifToSend="gifToSend"></chooseGif>
                    <schedule v-model:display_schedule="display_schedule" v-model:date="dateScheduledTweet"></schedule>
                    <pictureDownload v-model:pic="pic" v-model:allPicture="allPicture" v-model:display_gif="display_gif" v-model:gifToSend="gifToSend"></pictureDownload>
                    <button class="button" type="submit">Tweet</button>
                </div>
            </form>
            <p>{{message_tweet}}</p> <!-- Message when the user programmed or sended a tweet -->
            <pictureDisplay v-model:pic="pic" v-model:allPicture="allPicture"></pictureDisplay>
            <displaySchedule :edit_shedule_tweet="edit_shedule_tweet" v-model:scheduleTweetArr="scheduleTweetArr" v-model:display_schedule="display_schedule"></displaySchedule>
        </div>

        <div v-if="display_edit">
            <form @submit.prevent="">
                <label for="_subjectEdit">Edit Tweet :</label>
                <textarea v-model="edit_tweet" id="_subjectEdit" name="_subjectEdit" placeholder="Tweet something.." required></textarea>

                <div class="multiple_button_tweet">
                    <chooseGif v-model:gifSelected="gifSelected_edit" v-model:display_gif="display_gif_edit"  v-model:gifToSend="gifToSend_edit"></chooseGif>
                    <schedule v-model:display_schedule="display_schedule_edit" v-model:date="edit_dateScheduledTweet"></schedule>
                    <pictureDownload v-model:pic="picEdit" v-model:allPicture="allPictureEdit" v-model:display_gif="display_gif_edit" v-model:gifToSend="gifToSend_edit"></pictureDownload>
                    <button class="button" type="submit">Save</button>
                </div>

                <!-- <div class="multiple_button_tweet"> MULTIPLE CHOICE FOR TWEET -->
                    <!-- <chooseGif v-model:gifSelected="gifSelected" v-model:display_gif="display_gif"  v-model:gifToSend="gifToSend"></chooseGif> -->
                    <!-- <schedule v-model:display_schedule="display_schedule" v-model:date="dateScheduledTweet"></schedule> -->
                    <!-- <pictureDownload v-model:pic="pic" v-model:allPicture="allPicture" v-model:display_gif="display_gif" v-model:gifToSend="gifToSend"></pictureDownload> -->
                    <!-- <button class="button" type="submit">Tweet</button> -->
                <!-- </div> -->
            </form>
            <p>{{message_tweet}}</p> <!-- Message when the user programmed or sended a tweet -->
            <!-- <pictureDisplay v-model:pic="pic" v-model:allPicture="allPicture"></pictureDisplay> -->
            <!-- <displaySchedule :edit_shedule_tweet="edit_shedule_tweet" v-model:scheduleTweetArr="scheduleTweetArr" v-model:display_schedule="display_schedule"></displaySchedule> -->
        </div>

    </body>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import type { Ref } from 'vue'
import { userInformationStore } from '@/stores/user_information'
import { createTweet, createTweet_gif } from '@/constants/graphql'
import { useMutation } from '@vue/apollo-composable'
import axios from 'axios'
import authHeader from '@/services/auth-header'
import chooseGif from '../components/tweet/chooseGif.vue'
import schedule from '../components/tweet/schedule.vue'
import pictureDownload from '../components/tweet/picture/pictureDownloadTweet.vue'
import pictureDisplay from '../components/tweet/picture/pictureDisplayTweet.vue'
import displaySchedule from '../components/tweet/displayScheduleTweet.vue'

const { mutate: _createTweet, onDone: _createTweetDone } = useMutation(createTweet);
const { mutate: _createTweetGif} = useMutation(createTweet_gif);

const user = userInformationStore();

const tweetos_selected = ref('') // v-model on tweetos selected by user in the form tweet
const _tweet = ref('') // v-model on tweet form
const edit_tweet = ref('') // v-model on tweet form
const userPermission = ref(); // user that gave permission to this user
const display_gif = ref(false) // check is we show the menu to take a gif
const gifToSend = ref(); // The gif that the user selected and want to send
const dateScheduledTweet = ref (); // Date that the user put to schedule his tweet
const pic = ref([{}]);  // All picture selected to display with url created
pic.value.shift();
const allPicture = ref(['']); // All picture selected by the user with all information (size ...)
allPicture.value.shift();
const message_tweet = ref('') // Notification message
const gifSelected = ref(); // Gif selected by the user
const scheduleTweetArr = ref(); // All the schedule tweet will be stocked here
const display_schedule = ref(false) // display the menu schedule


const picEdit = ref([{}]);  // All picture selected to display with url created
picEdit.value.shift();
const allPictureEdit = ref(['']); // All picture selected by the user with all information (size ...)
allPictureEdit.value.shift();

const edit_dateScheduledTweet = ref (); // Edit Date that the user put to schedule his tweet
const display_schedule_edit = ref(false) // display the menu schedule
const display_edit = ref(false); // display edit tweet
const gifToSend_edit = ref(); // The gif in the edit menu that the user selected and want to send
const gifSelected_edit = ref(); // Gif in the edit menu selected by the user
const display_gif_edit = ref(false); // check is we show the menu to take a gif
const display_edit_scheduleTweet = ref(false); // Date that the user put to schedule his tweet
const id_edit: Ref<number | undefined>= ref(); // id of the tweet that the user want to edit

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

const hide_message = () => {
    setTimeout(() => message_tweet.value = "", 2000);
}

const tweet_for_someone = async() => {
    let user_id;
    let user = await JSON.parse(localStorage.getItem('user') || '');
    for (let i = 0; userPermission.value[i]; i++){
        if (userPermission.value[i].data.username === tweetos_selected.value){
            user_id = userPermission.value[i].data.id;
        }
    }
    if (dateScheduledTweet.value === undefined) {
        if (gifToSend.value === undefined) {
            await axios.post(import.meta.env.VITE_BACKEND_URL + '/users/tweetPermission/' + user.id, { tweet: _tweet.value, user_id: user_id}, {headers: authHeader()})
                .then(() => {
                    message_tweet.value = "The message has been sended."
                    hide_message();
                })
                .catch((e: Error) => {
                    console.log('error : ' + e);
                })
        }
        else {
            await axios.post(import.meta.env.VITE_BACKEND_URL + '/users/tweetPermission/' + user.id, { tweet: _tweet.value, user_id: user_id, gif: gifToSend.value}, {headers: authHeader()})
                .then(() => {
                    message_tweet.value = "The message has been sended."
                    hide_message();
                })
                .catch((e: Error) => {
                    console.log('error : ' + e);
                })
        }
    }
    else {
        if (gifToSend.value === undefined) {
            await _createTweet({
                tweet: _tweet.value,
                scheduleTweet: dateScheduledTweet.value,
                user_id_owner: user.id,
                user_id: user_id
            })
            .catch((err: any) => {
                console.log("error :", err);
                return ;
            })
            message_tweet.value = "The message has been Programmed."
            hide_message();
        }
        else {
            await _createTweetGif({
                tweet: _tweet.value,
                scheduleTweet: dateScheduledTweet.value,
                gifLink: gifToSend.value,
                user_id_owner: user.id,
                user_id: user_id
            })
            .catch((err: any) => {
                console.log("error :", err);
                return ;
            })
            message_tweet.value = "The message has been Programmed."
            hide_message();
        }
	    await axios.get(import.meta.env.VITE_BACKEND_URL + '/tweet/schedule/' + user.id, {headers: authHeader()})
	        .then(async(response) => {
                scheduleTweetArr.value = await response.data;
	        })
	        .catch((err: Error) => {
	            console.log('error : ' + err);
	        })
    }
    dateScheduledTweet.value = undefined;
    display_schedule.value = false;
    display_gif.value = false;
    gifToSend.value = undefined;
    gifSelected.value = undefined;
    _tweet.value = '';
}

const edit_shedule_tweet = async (index:number) => {
    console.log('index :', index);
    if (display_edit.value) {
        display_edit.value = false;
        edit_dateScheduledTweet.value = undefined;
        edit_tweet.value = '';
    }
    else {
        id_edit.value = index;
        display_edit.value = true;
        edit_dateScheduledTweet.value = scheduleTweetArr.value[index].scheduleTweet;
        edit_tweet.value = scheduleTweetArr.value[index].tweet;
    }
    console.log('display :', display_edit.value);
}

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