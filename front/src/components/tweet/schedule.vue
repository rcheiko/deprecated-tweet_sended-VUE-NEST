<template>
    <p class="button" @click="emit('update:display_schedule', !display_schedule)"><i class="fa-solid fa-calendar-days"></i></p>
    <div>
        <DatePicker v-if="display_schedule === true" v-model="updateValueSchedule" mode="datetime"/>
    </div>
    <button v-if="display_schedule === true" class="button" @click="cancel_schedule()">Cancel schedule</button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'

const props = defineProps(['date', 'display_schedule'])
const emit = defineEmits(['update:date', 'update:display_schedule'])

const updateValueSchedule = computed({
    get: () => {

    },
    set: async(value:any) => {
        await emit('update:date', value);
    }
});

const cancel_schedule = async() => {
    await emit('update:display_schedule', false);
    await emit('update:date', undefined);
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