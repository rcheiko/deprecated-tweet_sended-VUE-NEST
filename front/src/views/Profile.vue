<template>
	<body>
		<div class="card">
			<div class="top_card">
				<img class="img-profile" v-bind:src="infoUser?.profile_image_url_https">
				<h4>{{infoUser?.name}}</h4>
				<h4>@{{infoUser?.screen_name}}</h4>
				<h6>{{infoUser?.description}}</h6>
				<h6>Joined in {{infoUser?.created_at}}</h6>
			</div>
			<div class="bottom_card">
				<div>
					<p>TWEETS</p>
					<p>{{infoUser?.statuses_count}}</p>
				</div>
				<div>
					<p>FOLLOWING</p>
					<p>{{infoUser?.friends_count}}</p>
				</div>
				<div>
					<p>FOLLOWERS</p>
					<p>{{infoUser?.followers_count}}</p>
				</div>
				<div>
					<p>LISTED</p>
					<p>{{infoUser?.listed_count}}</p>
				</div>
				<div>
					<p>FAVORITES COUNT</p>
					<p>{{infoUser?.favourites_count}}</p>
				</div>
			</div>
		</div>
	</body>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import axios from 'axios'
import authHeader from '@/services/auth-header';

const infoUser = ref();

onBeforeMount(async () => {
    let user = JSON.parse(localStorage.getItem('user') || '');
	await axios.get(import.meta.env.VITE_BACKEND_URL + '/users/infoUser/' + user.id, {headers: authHeader()})
	    .then(async (response) => {
			infoUser.value = await response.data;
	    })
	    .catch((e: Error) => {
	        console.log('error : ' + e);
	    })
})

</script>

<style scoped>
	.card {
		margin-top:10%;
	}

	.top_card {
		margin: 0 32%;
		padding: 1% 0;
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		justify-content: center;
		background-color: var(--black);
		border-radius: 20px 20px 0px 0px;
		align-items: center;
	}

	.img-profile {
		width: 48px;
		height: 48px;
		border-radius: 25px;
	}

	h4 {
		padding: 2% 15%;
		font-family: 'Coiny';
		font-style: normal;
		font-weight: 400;
		font-size: 18px;
		line-height: 18px;
		color: var(--light-grey);
	}

	h6 {
		
		padding: 2% 15%;
		font-family: 'Coiny';
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 15px;
		color: var(--light-grey);
		text-align: center;
	}

	.bottom_card {
		margin: 0 32%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		padding: 20px 0;
		gap: 6%;
		background: var(--light-grey);
		border-radius: 0px 0px 15px 15px;
		flex-wrap: wrap;

		font-family: 'Coiny';
		font-style: normal;
		font-weight: 400;
		font-size: 15px;
		text-align: center;
		color: var(--navy);
	}
</style>