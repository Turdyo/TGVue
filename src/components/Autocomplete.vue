<script setup>
import { ref } from 'vue'
import Fuse from 'fuse.js'


let props = defineProps({
    gares: {
        type: Array,
        default: []
    },
    placeHolder: {
        type: String,
        default: "Gare"
    }
})

const fuseOptions = {
    includeScore: true,
    minMatchCharLength: 3
}

let recherche = ref()
let rechercheResults = ref()
const fuse = new Fuse(props.gares, fuseOptions)

defineExpose({
    recherche
})


function showResults(val, hide) {
    if (hide == "hide") {
        rechercheResults.value = [];
    } else {
        rechercheResults.value = fuse.search(val).filter(search => search.score < 0.5).map(search => search.item).slice(0, 10);
    }
}


function handleAutoComplete(value) {
    recherche.value = value
    showResults(recherche, 'hide')
}

</script>

<template>
    <div v-auto-animate class="gareDepart">
        <input class="gareInput" v-model="recherche" :placeholder="props.placeHolder"
            @keyup="showResults(recherche)" />

        <ul v-for="result in rechercheResults" @click="handleAutoComplete(result);">
            {{result}}
        </ul>

    </div>

</template>

<style>
input:focus{
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    transition: box-shadow 0.2s ease-in-out;
}
.gareDepart {
    background-color: #2b2a33;
    display: flex;
    flex-direction: column;
    justify-content: left;
    width: 40%;
    height: min-content;
    border-radius: 5px;
    border: 1px solid grey;
}

input {
    padding: 15px;
    border-radius: 5px;
    border: none;
    font-size: larger;
    background-color: #2b2a33;
}

ul {
    padding: 0px;
    padding-left: 15px;
    padding-top: 7px;
    padding-bottom: 7px;
    margin: 0px;
    border-top: 1px solid grey;
    cursor: pointer;
    opacity: 0.5;

}

ul:hover {
    background-color: rgb(69, 136, 99);
}

ul:last-child {
    padding-bottom: 10px;
}

input:focus {
    outline: none;
}
</style>