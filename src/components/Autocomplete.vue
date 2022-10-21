<script setup>
import { ref } from 'vue'

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

let recherche = ref()
let rechercheResults = ref()

defineExpose({
    recherche
})


function showResults(val, hide) {
    if (hide == "hide") {
        rechercheResults.value = autocompleteMatch('');
    } else {
        rechercheResults.value = autocompleteMatch(val);
    }
}


function autocompleteMatch(input) {
    if (input == '' || input.length < 3) {
        return [];
    }
    return props.gares.filter((str) =>
        str.toLowerCase().includes(input.toLowerCase())
    )
}

function handleAutoComplete(value) {
    recherche.value = value
    showResults(recherche, 'hide')
}

</script>

<template>
    <div class="gareDepart">
        <input id="gareInputDepart" class="gareInput" v-model="recherche" :placeholder="props.placeHolder"
            @keyup="showResults(recherche)" />

        <ul v-for="result in rechercheResults" @click="handleAutoComplete(result); ">
            {{result}}
        </ul>

    </div>

</template>

<style scoped>
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

.gareInput {
    padding: 15px;
    border-radius: 5px;
    border: none;
    font-size: larger;
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