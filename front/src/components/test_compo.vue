<template>
    <!-- <slot name="yo">yop mec</slot> -->
    <button @click="a(fct())">test</button>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'

const props = defineProps(['a']);

onBeforeMount (async () => {
    // props.salut = 'test';
})

const fct = () => {
    return "POUET";
}

</script>

<style scoped>

</style>