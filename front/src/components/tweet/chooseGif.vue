<template>
    <p class="button" @click="emit('update:display_gif', !props.display_gif)">GIF</p> <!-- v-if="pic.length == 0" -->
    <!-- <p class="buttonDisabled">GIF</p> v-if="pic.length >= 1" -->
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
        <button class="button" @click="gifToSend = undefined, emit('update:gifToSend', undefined)">Cancel the gif</button>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import useDebouncedRef from '../../composables/useDebouncedRef'
import axios from 'axios'

const gifToSend = ref(); // The gif that the user selected and want to send
const registerGifs = ref(); // List of Gifs

const props = defineProps(['display_gif', 'gifToSend']);

const emit = defineEmits(['update:display_gif', 'update:gifToSend']);

const gifClick = (index: number) => {
    gifToSend.value = registerGifs.value[index].images.original.url;
    emit('update:gifToSend', gifToSend.value);
}

const gifSelected = useDebouncedRef('', 1000, false);

watch(gifSelected, async() => {
    await SearchGifApi();
})

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

</script>

<style scoped>

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

    .gif-image {
    	width:120px;
    	height:120px;
        border-radius:5px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
    }

    .img-background {
    	margin: 2px;
    }

    .img-selected{
        margin-left: auto;
        margin-right: auto;
    }
</style>