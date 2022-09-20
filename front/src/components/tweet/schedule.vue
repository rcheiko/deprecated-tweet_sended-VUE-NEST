<template>
    <p class="button" @click="display_schedule = !display_schedule"><i class="fa-solid fa-calendar-days"></i></p>
    <div>
        <DatePicker v-if="display_schedule === true" v-model="updateValueSchedule" mode="datetime"/>
    </div>
    <button v-if="display_schedule === true" class="button" @click="cancel_schedule()">Cancel schedule</button>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue'
import { DatePicker } from 'v-calendar'
import axios from 'axios'
import router from '../../router'

const props = defineProps(['date'])
const emit = defineEmits(['update:date'])

const display_schedule = ref(false)
const schedule = ref();

const updateValueSchedule = computed({
    get: () => {

    },
    set: (value:any) => {
        emit('update:date', value);
        schedule.value = value;
    }
});

const cancel_schedule = () => {
    schedule.value = undefined;
    display_schedule.value = false;
    emit('update:date', schedule.value);
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
</style>