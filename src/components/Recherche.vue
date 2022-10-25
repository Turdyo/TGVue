<script setup>
import { ref } from 'vue'
import moment from 'moment'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import Autocomplete from './Autocomplete.vue';
import Journey from './Journey.vue';
import Journeys from './Journeys.vue';

moment.locale('fr')

let garesCoord = []
let journeys = ref([])
let resultsLoading = ref(false)
let resultsReady = ref(false)
let links = ref()
let rechercheDate = ref()
let rechercheDepart = ref()
let rechercheArrivee = ref()



await fetch("https://ressources.data.sncf.com/api/records/1.0/search/?dataset=referentiel-gares-voyageurs&q=&rows=10000")
    .then((response) => response.json())
    .then((json) => {
        garesCoord = json.records.map(element => {
            return { "geometry": element.geometry, "name": `${element.fields.gare_alias_libelle_noncontraint}` }
        })
    })
    .catch((error) => console.log(error));

let gares = [...new Set(garesCoord.map(obj => obj.name))] // unique list


function makeRequest(urlOptional, startLong, startLat, endLong, endLat, date) {
    let url = urlOptional ? urlOptional : `https://api.sncf.com/v1/coverage/sncf/journeys?from=${startLong};${startLat}&to=${endLong};${endLat}&datetime_represents=departure&datetime=${date}`
    console.log(url)
    return fetch(url, {
        headers: new Headers({
            'Authorization': import.meta.env.VITE_API_KEY 
        })
    })
        .then(response => response.json())
        .then(json => {
            journeys.value.push(json.journeys.filter(journey => journey.type === "best")[0])
            links.value = json.links
        })
        .then()
        .catch((error) => console.log(error));
}

async function preProcessRequest(depart, arrivee, date) {
    journeys.value = []
    resultsLoading.value = true
    resultsReady.value = false

    let startLat = garesCoord.find(gare => gare.name == depart).geometry.coordinates[0]
    let startLong = garesCoord.find(gare => gare.name == depart).geometry.coordinates[1]    
    let endLat = garesCoord.find(gare => gare.name == arrivee).geometry.coordinates[0]
    let endLong = garesCoord.find(gare => gare.name == arrivee).geometry.coordinates[1]

    await makeRequest(false, startLat, startLong, endLat, endLong, moment(date).format('YMDTHHmm'))
    await makeRequest(links.value[0].href)
    await makeRequest(links.value[0].href)
    await makeRequest(links.value[0].href)
    await makeRequest(links.value[0].href)
    resultsLoading.value = false
    resultsReady.value = true
}


async function nextDeparture(precedent) {
    journeys.value = []
    
    resultsLoading.value = true
    resultsReady.value = false

    for(let i = 0; i <5; i++) {
        let url = precedent ? links.value[1].href : links.value[0].href
        await makeRequest(url)
    }
    resultsLoading.value = false
    resultsReady.value = true
}


</script>

<template>
    <div v-auto-animate class="mainContainer">
        <form autocomplete="off" class="mainForm">
            <div class="mainFormContainer">
                <Autocomplete ref="rechercheDepart" :gares="gares" placeHolder="Gare de départ"/>
                <Autocomplete ref="rechercheArrivee" :gares="gares" placeHolder="Gare d'arrivée"/>
            </div>
            <Datepicker class="datePicker" v-model="rechercheDate" placeholder="Maintenant" :dark=true format='dd/MM/yyyy HH:mm'></Datepicker>
            <input class="submitButton" type="submit" value="Rechercher" @click.prevent="preProcessRequest(rechercheDepart.recherche, rechercheArrivee.recherche, rechercheDate)"/>
        </form>

        <div v-if="resultsLoading" class="loading">
            <img src="https://cdn.dribbble.com/users/1305855/screenshots/5945198/loading_800-600.gif" class="loadingImg loadingImgRecherche">
        </div>

        <div v-if="resultsReady" class="results" >
            <Journeys :journeys="journeys" />
            <div class="navButtons">
                <!-- <div class="submitButton nextButton" @click="nextDeparture('precedent')">Trains&nbsp;Précédents</div> -->
                <div class="submitButton nextButton" @click="nextDeparture()">Trains&nbsp;Suivants</div>
            </div>
        </div>
    </div>
</template>

<style>

.loading{
    display: flex; 
    justify-content: center;
    margin-top: 50px;
}

.loadingImgRecherche{
    width: 300px;
}

.mainContainer{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
}
.mainForm{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 70%;
}
.mainFormContainer{
    display: flex;
    justify-content: space-evenly;
    width: 100%;
}

.nextButton{
    width: min-content;
}
.submitButton{
    margin-top: 50px;
    margin-bottom: 50px;
    padding: 20px;
    font-size: large;
    cursor: pointer;
    border-radius: 5px;
    border: none;
    background-color: #42b883;
    color: #213547;
}

.submitButton:hover{
    background-color: #2E855E;
    transition: all .1s ease-in;
}

.datePicker{
    margin-top:50px;
}

.results{
    text-align: center;
    margin-top: 20px;
}
.navButtons{
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}

.dp__theme_dark {
   --dp-background-color: #2b2a33;
   --dp-text-color: #ffffff;
   --dp-hover-color: #484848;
   --dp-hover-text-color: #ffffff;
   --dp-hover-icon-color: #959595;
   --dp-primary-color: #005cb2;
   --dp-primary-text-color: #ffffff;
   --dp-secondary-color: #a9a9a9;
   --dp-border-color: #808080;
   --dp-menu-border-color: #808080;
   --dp-border-color-hover: #aaaeb7;
   --dp-disabled-color: #737373;
   --dp-scroll-bar-background: #212121;
   --dp-scroll-bar-color: #484848;
   --dp-success-color: #00701a;
   --dp-success-color-disabled: #428f59;
   --dp-icon-color: #959595;
   --dp-danger-color: #e53935;
   --dp-highlight-color: rgba(0, 92, 178, 0.2);
}

</style>
