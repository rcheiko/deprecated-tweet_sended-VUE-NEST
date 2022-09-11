<template>
<body>
    <div class="tweet">
        <div class="sub_tweet">
            <form @submit.prevent="tweet_for_someone()">
                <label for="_subject">Tweet for someone : </label>
                <select class="select-twitter-account" v-model="tweetos_selected" required>
                    <option disabled value="">Twitter name</option>
                    <!-- <option>{{user.username}}</option> -->
                    <option v-for="(res, index) in perm">{{res.data.username}}</option>
                </select>
                <textarea v-model="_tweet" id="_subject" name="_subject" placeholder="Tweet something.." required></textarea>

                <div class="multiple_button_tweet"> <!-- MULTIPLE CHOICE FOR TWEET -->
                    <p class="button" @click="display_gif = !display_gif" style="margin-right: 5px;" v-if="pic.length == 0">GIF</p>
                    <p class="buttonDisabled" style="margin-right: 5px;" v-if="pic.length >= 1">GIF</p>
                    <p class="button" @click="display_schedule = !display_schedule" style="margin-right: 5px; margin-left: 5px;"><i class="fa-solid fa-calendar-days"></i></p>
                    <label for="file" v-if="gifToSend == undefined && pic[0]?.type != 'image/gif' && pic[0]?.type != 'video/mp4' && pic.length < 4"><i class="fa-solid fa-images icon_picture" style="margin-right: 5px; margin-left: 5px;"></i></label>
                    <label v-else><i class="fa-solid fa-images icon_picture_disabled" style="margin-right: 5px; margin-left: 5px;"></i></label>
                    <input style="display:none;" type="file" id="file" @change="addPicture" accept="image/png, image/jpeg, image/jpg, image/gif, video/mp4" v-if="pic.length === 0" multiple/>
                    <!-- <input style="display:none;" type="file" id="file" @change="addPicture" accept="image/png, image/jpeg, image/jpg" multiple/> -->
                    <input style="display:none;" type="file" id="file" @change="addPicture" accept="image/png, image/jpeg, image/jpg"  v-if="pic.length >= 1 && pic.length <= 2" multiple/>
                    <input style="display:none;" type="file" id="file" @change="addPicture" accept="image/png, image/jpeg, image/jpg"  v-if="pic.length === 3"/>
                    <button class="button" type="submit" style="margin-left: 5px;">Tweet</button>
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
                <DatePicker class="schedule" v-if="display_schedule === true" v-model="date" mode="datetime"/>
            </div>
            <button v-if="display_schedule === true" class="button" @click="cancel_schedule()" style="margin-top: 10px;">Cancel schedule</button>
            <div class="imgDownload"> <!-- DISPLAY IMAGE DOWNLOADED -->
                <div class="imgDownloadSub" v-for="(p, index) in pic">
                    <div v-if="isImage(p.type) === 1 || p.type === 'image/gif'" :style="{'background-image':'url(' + p.src + ')'}" class="imgDisplay">
                        <i class="fa-solid fa-circle-xmark fa-swap-opacity xmark" @click="cancelPicture(index)"></i>
                    </div>
                    <video class="imgDisplay" v-if="p.type === 'video/mp4'" :src="p.src"> <!-- A FINIR LA VIDEO NE FONCTIONNE PAS CORRECTEMENT REFAIRE L'INTERFACE -->
                        <i class="fa-solid fa-circle-xmark fa-swap-opacity xmark" @click="cancelPicture(index)"></i>
                    </video>
                </div>
            </div>
            <p>{{errorFile}}</p>
            <p>{{message_tweet}}</p>
        </div>

        <div class="schedule" v-if="scheduleInfo">
            <p>Schedule Tweet :</p>
            <br>
            <div class="every_tweet" v-for="(info, index) in scheduleInfo">
                <div class="img-name-tweet">
                    <div class="img-profile" style="margin-right: 5px;" :style="{'background-image':'url(' + info.profile_image_url + ')'}"></div>
                    <p style="margin-left: 5px;">{{info.username}}</p>
                </div>
                <p>Tweet : {{info.tweet}}</p>
                <p>Schedule : {{info.scheduleTweet}}</p>
                <div v-if="info.gifLink" class="gif-image img-selected" :style="{'background-image':'url(' + info.gifLink + ')'}"></div>
                <div class="multiple_button_tweet">
                    <button class="button" @click="remove_shedule_tweet(index)" style="margin-right: 5px;">Remove</button>
                    <button class="button" @click="edit_shedule_tweet(index)" style="margin-left: 5px;">Edit</button>
                </div>
            </div>
        </div>
        <div class="sub_tweet" v-if="display_edit">
            <form @submit.prevent="editTweet(id_edit)">

                <label for="_subjectEdit">Edit Tweet :</label>
                <textarea v-model="edit_tweet" id="_subjectEdit" name="_subjectEdit" placeholder="Tweet something.." required></textarea>
        
                <div class="multiple_button_tweet">
                    <p class="button" @click="display_gif_edit = !display_gif_edit" style="margin-right: 5px;">GIF</p>
                    <p class="button" @click="display_edit_date = !display_edit_date" style="margin-right: 5px; margin-left:5px;"><i class="fa-solid fa-calendar-days"></i></p>
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
            <DatePicker v-if="display_edit_date" v-model="edit_date" mode="datetime"/>
        </div>
    </div>
</body>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import { createTweet, createTweet_gif, removeTweet, updateTweet, updateTweet_gif } from '@/constants/graphql'
import { useMutation } from '@vue/apollo-composable'
import useDebouncedRef from '../composables/useDebouncedRef'
import authHeader from '@/services/auth-header'
import axios from 'axios'
import { DatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'

// let user = await JSON.parse(localStorage.getItem('user') || '');


const test = ref('0');


const _tweet = ref('')
const tweetos_selected = ref('')
const message_tweet = ref('')

const perm = ref();

const scheduleInfo = ref();
const display_schedule = ref(false)

const display_gif = ref(false)
const gifToSend = ref();
const registerGifs = ref();

const gifSelected = useDebouncedRef('', 1000, false);

const pic = ref([{}]);
pic.value.shift();
const allPicture = ref(['']);
allPicture.value.shift();
const errorFile = ref('');

watch(gifSelected, async() => {
  await SearchGifApi();
})

const gifSelected_edit = useDebouncedRef('', 1000, false);

watch(gifSelected_edit, async() => {
  await SearchGifApi_edit();
})

const date = ref();

const registerGifs_edit = ref();
const gifToSend_edit = ref();
const display_gif_edit = ref(false)
const display_edit_date = ref(false);
const display_edit = ref(false);
const edit_tweet = ref('');
const edit_date = ref();
const id_edit = ref();


const { mutate: _createTweet, onDone: _createTweetDone } = useMutation(createTweet);
const { mutate: _createTweetGif} = useMutation(createTweet_gif);
const { mutate: _removeTweet, onDone: _removeTweetDone } = useMutation(removeTweet);
const { mutate: _updateTweet, onDone: _updateTweetDone } = useMutation(updateTweet);
const { mutate: _updateTweet_gif, onDone: _updateTweet_gifDone } = useMutation(updateTweet_gif);

_createTweetDone(() => {
	console.log('DONE createTweetDone')
})

_removeTweetDone(() => {
	console.log('DONE removeTweetDone')
})

onBeforeMount(async () => {
    let user = await JSON.parse(localStorage.getItem('user') || '');
	await axios.get(import.meta.env.VITE_BACKEND_URL + '/tweet/schedule/' + user.id, {headers: authHeader()})
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

const cancel_schedule = () => {
    date.value = undefined;
    display_schedule.value = false;
}

const remove_shedule_tweet = async (index:number) => {
    let user = await JSON.parse(localStorage.getItem('user') || '');
    await _removeTweet({id: scheduleInfo.value[index].id})
        .catch((err) => {
            console.log("error :", err);
        })

	await axios.get(import.meta.env.VITE_BACKEND_URL + '/tweet/schedule/' + user.id, {headers: authHeader()})
	    .then(async(response) => {
            scheduleInfo.value = await response.data;
	    })
	    .catch((err: Error) => {
	        console.log('error : ' + err);
	    })
    
}

const edit_shedule_tweet = async (index:number) => {
    if (display_edit.value) {
        display_edit.value = false;
        edit_date.value = undefined;
        edit_tweet.value = '';
    }
    else {
        id_edit.value = index;
        display_edit.value = true;
        edit_date.value = scheduleInfo.value[index].scheduleTweet;
        edit_tweet.value = scheduleInfo.value[index].tweet;
    }
}

const editTweet = async(index:number) => {
    let user = await JSON.parse(localStorage.getItem('user') || '');
    if (gifToSend_edit.value === undefined) {
        await _updateTweet({
            id:scheduleInfo.value[index].id,
            scheduleTweet: edit_date.value,
            tweet: edit_tweet.value
        })
            .catch((err) => {
                console.log('error :', err);
                return ;
            })
        display_edit.value = false;
        edit_date.value = undefined;
        edit_tweet.value = '';
    }
    else {
        await _updateTweet_gif({
            id:scheduleInfo.value[index].id,
            scheduleTweet: edit_date.value,
            tweet: edit_tweet.value,
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
        display_edit.value = false;
        edit_date.value = undefined;
        edit_tweet.value = '';
    }
    await axios.get(import.meta.env.VITE_BACKEND_URL + '/tweet/schedule/' + user.id, {headers: authHeader()})
	    .then(async(response) => {
            scheduleInfo.value = await response.data;
	    })
	    .catch((err: Error) => {
	        console.log('error : ' + err);
	    })
}



const gifClick = (index: number) => {
    gifToSend.value = registerGifs.value[index].images.original.url;
}

const gifClick_edit = (index: number) => {
    gifToSend_edit.value = registerGifs_edit.value[index].images.original.url;
}

const hide_message = () => {
    setTimeout(() => message_tweet.value = "", 2000);
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

const tweet_for_someone = async() => {
    let user_id;
    let user = await JSON.parse(localStorage.getItem('user') || '');
    for (let i = 0; perm.value[i]; i++){
        if (perm.value[i].data.username === tweetos_selected.value){
            user_id = perm.value[i].data.id;
        }
    }
    if (date.value === undefined) {
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
                scheduleTweet: date.value,
                user_id_owner: user.id,
                user_id: user_id
            })
            .catch((err) => {
                console.log("error :", err);
                return ;
            })
            message_tweet.value = "The message has been Programmed."
            hide_message();
        }
        else {
            await _createTweetGif({
                tweet: _tweet.value,
                scheduleTweet: date.value,
                gifLink: gifToSend.value,
                user_id_owner: user.id,
                user_id: user_id
            })
            .catch((err) => {
                console.log("error :", err);
                return ;
            })
            message_tweet.value = "The message has been Programmed."
            hide_message();
        }
	    await axios.get(import.meta.env.VITE_BACKEND_URL + '/tweet/schedule/' + user.id, {headers: authHeader()})
	        .then(async(response) => {
                scheduleInfo.value = await response.data;
	        })
	        .catch((err: Error) => {
	            console.log('error : ' + err);
	        })
    }
    date.value = undefined;
    display_schedule.value = false;
    display_gif.value = false;
    registerGifs.value = undefined;
    gifToSend.value = undefined;
    gifSelected.value = undefined;
    _tweet.value = '';
}

const addPicture = async(e:any) => {
    const tmpPicture = e.target.files;
    if (tmpPicture.length + allPicture.value.length > 4) {
        errorFile.value = "You need to put 4 images maximum";
        error_file();
        return;
    }
    for (let i = 0; tmpPicture[i]; i++) {
        console.log(e.target.files[i]);
        allPicture.value.push(tmpPicture[i]);
    }
    for (let i = 0; allPicture.value[i]; i++) { // CHECK ERROR FILE UPLOAD
        if (isImage(allPicture.value[i].type) === 1 && allPicture.value[i].size >= 20000000){
            pic.value.splice(0, pic.value.length);
            allPicture.value.splice(0, allPicture.value.length);
            errorFile.value = "The image size is too large, please put picture on 20MB maximum.";
            error_file();
            return ;
        }
        if (allPicture.value[i].type === 'image/gif' && allPicture.value.length >= 2) {
            pic.value.splice(0, pic.value.length);
            allPicture.value.splice(0, allPicture.value.length);
            errorFile.value = "Please choose either 1 GIF or up to 4 photos.";
            error_file();
            return ;
        }
        if (allPicture.value[i].type === 'video/mp4' && allPicture.value.length >= 2) {
            pic.value.splice(0, pic.value.length);
            allPicture.value.splice(0, allPicture.value.length);
            errorFile.value = "Please choose either 1 Video or up to 4 photos.";
            error_file();
            return ;
        }
        if (allPicture.value[i].type === 'image/gif' && allPicture.value[i].size >= 15000000) {
            pic.value.splice(0, pic.value.length);
            allPicture.value.splice(0, allPicture.value.length);
            errorFile.value = "The gif size is too large, please put gif on 15MB maximum";
            error_file();
            return ;
        }
    }
    for (let i = 0; e.target.files[i]; i++) {
        if (isImage(e.target.files[i].type) === 1) {
            let img = new Image();
            img.src = URL.createObjectURL(e.target.files[i]);
            await img.decode()
            console.log(img.width, " - ", img.height);
            if (img.width > 8192 || img.height > 8192) {
                pic.value.splice(0, pic.value.length);
                allPicture.value.splice(0, allPicture.value.length);
                errorFile.value = "The maximum resolution for image is 8192x8192";
                error_file();
                return ;
            }
        }
        if (e.target.files[i].type === 'image/gif') {
            let gif = new Image();
            gif.src = URL.createObjectURL(e.target.files[i]);
            await gif.decode()
            console.log(gif.width, " - ", gif.height);
            if (gif.width > 2048 || gif.height > 2048) {
                pic.value.splice(0, pic.value.length);
                allPicture.value.splice(0, allPicture.value.length);
                errorFile.value = "The maximum resolution for gif is 2048x2048";
                error_file();
                return ;
            }
        }
        let picUrlInfo = { src: URL.createObjectURL(e.target.files[i]), type: e.target.files[i].type };
        pic.value.push(picUrlInfo);
        console.log(pic.value[0].type);
    }
    console.log("ALL PICTURE :", allPicture.value);
    display_gif.value = false;
    gifToSend.value = undefined;
    e.target.value = '';
}

const isImage = (res:any) => {
    let check:number = 0;
    const formatImage = ['image/jpeg', 'image/jpg', 'image/png'];
    for (let i = 0; formatImage[i]; i++) {
        if (res === formatImage[i]){
            check++;
        }
    }
    if (check === 0) {
        return (0);
    }
    return (1);
}

const error_file = () => {
    setTimeout(() => errorFile.value = "", 2500);
}

const cancelPicture = async(index:number) => {
    pic.value.splice(index, 1);
    allPicture.value.splice(index, 1);
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
        width: 100%;
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

    .tweet{
        display:flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 2%;
        margin-bottom: 2%;
    }

    .schedule, .sub_tweet{
        display: flex;
        align-self: flex-start;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

/* GIF */
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

    .img-background {
    	margin: 2px;
    }

    .img-selected{
        margin-left: auto;
        margin-right: auto;
    }

    .gif-image {
    	width:120px;
    	height:120px;
        border-radius:5px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
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
	.img-profile {
		width: 32px;
		height: 32px;
        background-position: center;
        background-size: cover;
		border-radius: 25px;
	}
    .img-name-tweet {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .every_tweet {
        background-color: #dbdbdb;
        border-radius: 10px;
        padding: 5px;
        margin-bottom: 10px;
    }
    .icon_picture {
        font-size: 18px;
        color: var(--blue);
        background-color: var(--grey);
        border: none;
        border-radius: 10px;
        padding: 6px;
        cursor: pointer;
    }
    .icon_picture_disabled {
        font-size: 18px;
        color: var(--light-dark-grey);
        background-color: var(--grey);
        border: none;
        border-radius: 10px;
        padding: 6px;
        cursor:not-allowed;
    }
    .icon_picture:hover {
        color: var(--teal);
        opacity: 0.6;
    }
    .imgDownload {
        display:flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: center;
        margin-top:10px;
    }

    .imgDownloadSub {
        margin: 0 5px;
    }
    .xmark {
        position: relative;
        left: 47px;
        color:white;
        cursor: pointer;
        margin-top: 3px;
    }
    .xmark:hover {
        opacity: 0.9;
    }
    .imgDisplay {
        width: 120px;
        height: 120px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        border-radius: 5px;
    }
    .buttonDisabled {
        font-family: 'Coiny';
        font-size: 18px;
        background-color: var(--grey);
        border: none;
        border-radius: 10px;
        padding: 0 8px;
        cursor:not-allowed;
        color: var(--light-dark-grey);
    }
</style>