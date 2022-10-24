<script setup>
import { isProxy, toRaw } from 'vue';
import Journey from './Journey.vue';


let props = defineProps({
    journeys: {
        default: []
    }
})


</script>

<template>
    <div class="journeysContainer">
        <div v-for="trajet in props.journeys">
            <Journey :journey="trajet" />
        </div>
    </div>
</template>

<style scoped>
.journeysContainer{
    display: flex;
    flex-direction: column;
    justify-content: center;
}

</style>