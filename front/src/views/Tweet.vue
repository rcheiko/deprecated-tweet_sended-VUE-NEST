<template>
<body>
    <div class="tweet">
        <div class="sub_tweet">
            <form @submit.prevent="tweet" >
                <label for="subject">Tweet for me :</label>

                <textarea  v-model="_tweet_for_me" id="subject" name="subject" placeholder="Tweet something.." required></textarea>

                <div class="multiple_button_tweet">
                    <p class="button" @click="display_gif = !display_gif" style="margin-right:5px;">GIF</p>
                    <p class="button" @click="display_schedule_for_me = !display_schedule_for_me" style="margin-right: 5px; margin-left: 5px;"><i class="fa-solid fa-calendar-days"></i></p>
                    <button class="button" type="submit" style="margin-left:5px;">Tweet</button>
                </div>
                <div v-if="display_gif === true && gifToSend === undefined">
                    <input class="search_gif" v-model="gifSelected" type="text" placeholder="Search some gifs">
                    <div v-if="registerGifs" class="gif">
                        <div v-for="(gif, index) in registerGifs">
                            <div @click="gifClick(index)" class="gif-image img-background" :style="{'background-image':'url(' + gif.images.original.url + ')'}"></div>
                        </div>
                    </div>
                </div>
                <div v-if="gifToSend != undefined">
                    <div class="gif-image img-selected" :style="{'background-image':'url(' + gifToSend + ')'}"></div>
                    <button class="button" @click="gifToSend = undefined">Cancel the gif</button>
                </div>
            </form>

            <div>
                <DatePicker class="schedule" v-if="display_schedule_for_me === true" v-model="date_for_me" mode="datetime"/>
            </div>
            <button v-if="display_schedule_for_me === true" class="button" @click="cancel_schedule_for_me()" style="margin-top: 10px;">Cancel schedule</button>
            <p>{{message_tweet_for_me}}</p>
        </div>

        <div class="schedule" v-if="scheduleInfo">
            <p>My Schedule Tweet :</p>
            <br>
            <div class="every_tweet" v-for="(info, index) in scheduleInfo">
                <p>Tweet : {{info.tweet}}</p>
                <p>Schedule : {{info.scheduleTweet}}</p>
                <div v-if="info.gifLink" class="gif-image img-selected" :style="{'background-image':'url(' + info.gifLink + ')'}"></div>
                <div class="multiple_button_tweet">
                    <button class="button" @click="remove_shedule_tweet_for_me(index)" style="margin-right: 5px;">Remove</button>
                    <button class="button" @click="edit_shedule_tweet_for_me(index)" style="margin-left: 5px;">Edit</button>
                </div>
            </div>
        </div>
        <div class="sub_tweet" v-if="display_edit_for_me">
            <form @submit.prevent="editTweet(id_edit_for_me)">

                <label for="subjectEdit">Edit Tweet :</label>
                <textarea v-model="edit_tweet_for_me" id="subjectEdit" name="subjectEdit" placeholder="Tweet something.." required></textarea>

                <div class="multiple_button_tweet">
                    <p class="button" @click="display_gif_edit = !display_gif_edit" style="margin-right: 5px;">GIF</p>
                    <p class="button" @click="display_edit_date_for_me = !display_edit_date_for_me" style="margin-right: 5px; margin-left:5px;"><i class="fa-solid fa-calendar-days"></i></p>
                    <button class="button" type="submit" style="margin-left: 5px;">Save</button>
                </div>

                <div v-if="display_gif_edit === true && gifToSend_edit === undefined">
                    <input class="search_gif_edit" v-model="gifSelected_edit" type="text" placeholder="Search some gifs">
                    <div class="gif" v-if="registerGifs_edit">
                        <div v-for="(gif, index) in registerGifs_edit">
                            <div @click="gifClick_edit(index)" class="gif-image img-background" :style="{'background-image':'url(' + gif.images.original.url + ')'}"></div>
                        </div>
                    </div>
                </div>
                <div v-if="gifToSend_edit != undefined">
                    <div class="gif-image img-selected" :style="{'background-image':'url(' + gifToSend_edit + ')'}"></div>
                    <button class="button" @click="gifToSend_edit = undefined">Cancel the gif</button>
                </div>
            </form>
            
            <DatePicker v-if="display_edit_date_for_me" v-model="edit_date_for_me" mode="datetime"/>

        </div>
    </div>
    <br>
    <hr>
    <br>
    <TweetForSomeone />
</body>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import axios from 'axios'
import useDebouncedRef from '../composables/useDebouncedRef'
import { useMutation } from '@vue/apollo-composable'
import { createTweet, createTweet_2, createTweet_gif_2, updateTweet, updateTweet_gif, removeTweet } from '@/constants/graphql'
import TweetForSomeone from '../components/tweetForSomeone.vue'
import { DatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'
import authHeader from '@/services/auth-header'


const message_tweet_for_me = ref('')
const _tweet_for_me = ref('')
const perm = ref();

const display_gif = ref(false)
const display_gif_edit = ref(false)
const gifToSend = ref();
const gifToSend_edit = ref();
const registerGifs = ref();
const registerGifs_edit = ref();

const gifSelected = useDebouncedRef('', 1000, false);

watch(gifSelected, async() => {
  await SearchGifApi();
})

const gifSelected_edit = useDebouncedRef('', 1000, false);

watch(gifSelected_edit, async() => {
  await SearchGifApi_edit();
})

const gifClick = (index: number) => {
    gifToSend.value = registerGifs.value[index].images.original.url;
}

const gifClick_edit = (index: number) => {
    gifToSend_edit.value = registerGifs_edit.value[index].images.original.url;
}

const SearchGifApi = async() => {
	if (gifSelected.value != "") {
		await axios.get("https://api.giphy.com/v1/gifs/search?api_key=4heOuul2zl1B2ZskbnX6RJEqilwczV18&q=" + gifSelected.value + "&limit=9&offset=0&rating=g&lang=fr")
			.then(async (response) => {
				registerGifs.value = await response.data.data
			})
			.catch((err) => {
				console.log("error :", err);	
			});
	}
}

const SearchGifApi_edit = async() => {
	if (gifSelected_edit.value != "") {
		await axios.get("https://api.giphy.com/v1/gifs/search?api_key=4heOuul2zl1B2ZskbnX6RJEqilwczV18&q=" + gifSelected_edit.value + "&limit=9&offset=0&rating=g&lang=fr")
			.then(async (response) => {
				registerGifs_edit.value = await response.data.data
			})
			.catch((err) => {
				console.log("error :", err);	
			});
	}
}

const { mutate: _createTweet, onDone: _createTweetDone } = useMutation(createTweet);
const { mutate: _createTweet_2, onDone: _createTweetDone_2 } = useMutation(createTweet_2);
const { mutate: _removeTweet, onDone: _removeTweetDone } = useMutation(removeTweet);
const { mutate: _updateTweet, onDone: _updateTweetDone } = useMutation(updateTweet);
const { mutate: _updateTweet_gif, onDone: _updateTweet_gifDone } = useMutation(updateTweet_gif);
const { mutate: _createTweetGif_2, onDone: _createTweetGif_2Done } = useMutation(createTweet_gif_2);

onBeforeMount(async () => {
    let user = await JSON.parse(localStorage.getItem('user') || '');
	await axios.get(import.meta.env.VITE_BACKEND_URL + '/tweet/schedule_for_me/' + user.id, {headers: authHeader()})
	    .then(async(response) => {
            scheduleInfo.value = await response.data;
	    })
	    .catch((err: Error) => {
	        console.log('error : ' + err);
	    })
	await axios.get(import.meta.env.VITE_BACKEND_URL + '/users/giveUsersTweet/' + user.id, {headers: authHeader()})
	    .then(async(response) => {
            perm.value = await response.data;
	    })
	    .catch((err: Error) => {
	        console.log('error : ' + err);
	    })
})


_createTweetDone(() => {
	console.log('DONE createTweetDone')
})

_createTweetDone_2(() => {
	console.log('DONE createTweetDone_2')
})

_removeTweetDone(() => {
	console.log('DONE removeTweetDone')
})

_updateTweetDone(() => {
	console.log('DONE updateTweetDone')
})


// SCHEDULE FOR ME

const display_schedule_for_me = ref(false)
const date_for_me = ref();
const scheduleInfo = ref();
const display_edit_for_me = ref(false);
const display_edit_date_for_me = ref(false);
const edit_tweet_for_me = ref('');
const edit_date_for_me = ref();
const id_edit_for_me = ref();

const cancel_schedule_for_me = () => {
    date_for_me.value = undefined;
    display_schedule_for_me.value = false;
}


const remove_shedule_tweet_for_me = async (index:number) => {
    let user = await JSON.parse(localStorage.getItem('user') || '');
    await _removeTweet({id: scheduleInfo.value[index].id})
        .catch((err) => {
            console.log("error :", err);
        })
	await axios.get(import.meta.env.VITE_BACKEND_URL + '/tweet/schedule_for_me/' + user.id, {headers: authHeader()})
	    .then(async(response) => {
            scheduleInfo.value = await response.data;
	    })
	    .catch((err: Error) => {
	        console.log('error : ' + err);
	    })
    
}

const edit_shedule_tweet_for_me = async (index:number) => {
    
    if (display_edit_for_me.value) {
        display_edit_for_me.value = false;
        edit_date_for_me.value = undefined;
        edit_tweet_for_me.value = '';
    }
    else {
        id_edit_for_me.value = index;
        display_edit_for_me.value = true;
        edit_date_for_me.value = scheduleInfo.value[index].scheduleTweet;
        edit_tweet_for_me.value = scheduleInfo.value[index].tweet;
    }
}

// TWEET

const tweet = async () => {
    let user = await JSON.parse(localStorage.getItem('user') || '');

    if (date_for_me.value != undefined) {
        if (gifToSend.value === undefined) {
            await _createTweet_2({
                tweet: _tweet_for_me.value,
                scheduleTweet: date_for_me.value,
                user_id: user.id
            })
            .catch((err) => {
                console.log("error :", err);
                return ;
            })
            date_for_me.value = undefined;
            display_schedule_for_me.value = false;
            message_tweet_for_me.value = "The message has been Programmed."
            hide_message_for_me();
        }
        else {
            await _createTweetGif_2({
                tweet: _tweet_for_me.value,
                scheduleTweet: date_for_me.value,
                user_id: user.id,
                gifLink: gifToSend.value
            })
            .catch((err) => {
                console.log("error :", err);
                return ;
            })
            message_tweet_for_me.value = "The message has been Programmed."
            hide_message_for_me();
        }
	    await axios.get(import.meta.env.VITE_BACKEND_URL + '/tweet/schedule_for_me/' + user.id, {headers: authHeader()})
	        .then(async(response) => {
                scheduleInfo.value = await response.data;
	        })
	        .catch((err: Error) => {
	            console.log('error : ' + err);
	        })
    }
    else {
        if (gifToSend.value === undefined) {
            await axios.post(import.meta.env.VITE_BACKEND_URL + '/users/tweet/' + user.id, { tweet: _tweet_for_me.value }, {headers: authHeader()})
                .then(() => {
                    message_tweet_for_me.value = "The message has been sended.";
                    hide_message_for_me();
                })            
                .catch((err) => {
                    console.log('error :', err);
                    return;
                })
        }
        else {
            await axios.post(import.meta.env.VITE_BACKEND_URL + '/users/tweet/' + user.id, { tweet: _tweet_for_me.value, media: gifToSend.value}, {headers: authHeader()})
                .then(() => {
                    message_tweet_for_me.value = "The message has been sended.";
                    hide_message_for_me();
                })
                .catch((err) => {
                    console.log('error : ' + err);
                })
        }
    }
    date_for_me.value = undefined;
    display_schedule_for_me.value = false;
    display_gif.value = false;
    registerGifs.value = undefined;
    gifToSend.value = undefined;
    gifSelected.value = undefined;
    _tweet_for_me.value = ''; 
}

const hide_message_for_me = () => {
    setTimeout(() => message_tweet_for_me.value = "", 2000);
}

// EDIT TWEET FOR ME

const editTweet = async(index:number) => {
    let user = await JSON.parse(localStorage.getItem('user') || '');
    if (gifToSend_edit.value === undefined) {
        await _updateTweet({
            id: scheduleInfo.value[index].id,
            scheduleTweet: edit_date_for_me.value,
            tweet: edit_tweet_for_me.value
        })
            .catch((err) => {
                console.log('error :', err);
                return ;
            })
        display_edit_for_me.value = false;
        edit_date_for_me.value = undefined;
        edit_tweet_for_me.value = '';
    }
    else {
        await _updateTweet_gif({
            id:scheduleInfo.value[index].id,
            scheduleTweet: edit_date_for_me.value,
            tweet: edit_tweet_for_me.value,
            gifLink: gifToSend_edit.value
        })
            .catch((err) => {
                console.log('error :', err);
                return ;
            })
        display_gif.value = false;
        registerGifs.value = undefined;
        gifToSend.value = undefined;
        gifSelected_edit.value = undefined;
        display_edit_for_me.value = false;
        edit_date_for_me.value = undefined;
        edit_tweet_for_me.value = '';
    }
    await axios.get(import.meta.env.VITE_BACKEND_URL + '/tweet/schedule_for_me/' + user.id, {headers: authHeader()})
	    .then(async(response) => {
            scheduleInfo.value = await response.data;
	    })
	    .catch((err: Error) => {
	        console.log('error : ' + err);
	    })
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
        height: 100%;
    }

    textarea {
        display: block;
        box-sizing: border-box;
        width: 100%;
        height: 150px;
        padding: 12px 15px;
        margin: 10px 40px 0 0;
        border: 2px solid #ccc;
        border-radius: 4px;
        background-color: var(--grey);
        resize: none;
        font-family: 'BeVietnamPro-SemiBold';
        font-size: 17px;
    }

    .tweet{
        display:flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 2%;
        margin-bottom: 2%;
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

    .schedule, .sub_tweet{
        display: flex;
        align-self: flex-start;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .gif{
    	position:absolute;
        display: flex;
        flex-wrap: wrap;
        flex-grow: 1;
        width:382px;
        background-color: var(--dark-blue);
        padding:5px;
        border-radius: 10px;
    }

    .gif-image {
    	width:120px;
    	height:120px;
    	background-repeat: no-repeat;
    	background-size: cover;
        background-position: center;
        border-radius: 5px;
    }

    .img-background {
    	margin: 2px;
    }

    .img-selected{
        margin-left: auto;
        margin-right: auto;
    }

    .search_gif {
        font-family: 'BeVietnamPro-SemiBold';
        font-size: 16px;
        background-color: var(--grey);
        text-align: center;
        border: none;
        border-radius: 10px;
        margin: 10px 0 0 0;
        padding: 4px 0;
    }

    .search_gif_edit {
        font-family: 'BeVietnamPro-SemiBold';
        font-size: 16px;
        background-color: var(--grey);
        text-align: center;
        border: none;
        border-radius: 10px;
        margin: 10px 0 0 0;
        padding: 4px 0;
    }

    .multiple_button_tweet {
        display:flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
    }

    .schedule {
        margin-top: 10px;
    }

    .every_tweet {
        background-color: #dbdbdb;
        border-radius: 10px;
        padding: 5px;
        margin-bottom: 10px;
    }
</style>