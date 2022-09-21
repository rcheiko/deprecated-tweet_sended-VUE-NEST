<template>
    <button @click="added()">ADD LIST</button>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'

const props = defineProps(['salut']);
const emit = defineEmits(['update:salut']);

const nb = ref(0);

const added = () => {
    props.salut.push(nb.value++)
    emit('update:salut', props.salut);
}

</script>

<style scoped>

</style>