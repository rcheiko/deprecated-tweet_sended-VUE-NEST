<template>
	<p class="title">WELCOME TO TWEET SENDED</p>
	<test></test>
</template>

<script setup lang="ts">
import test from '../components/test.vue'
</script>

<style scoped>
	@font-face {
		font-family: "Coiny";
		src: local("Coiny"),
		url(../font/Coiny-Cyrillic.ttf) format("truetype");
	}
	.title {
		position: absolute;
		top: 50%; left: 50%;
		transform: translate(-50%, -50%);

		font-family: 'Coiny';
		font-style: normal;
		font-weight: 400;
		font-size: 50px;
		line-height: 70px;
		text-align: center;
		background: linear-gradient(180deg, #2980B9 0%, #2C3E51 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	}
</style>