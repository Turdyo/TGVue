<script setup>
import { ref } from 'vue'
import moment from 'moment'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import Autocomplete from './Autocomplete.vue';

moment.locale('fr')

let champsCoord = []
// let rechercheResultsDepart = ref()
// let rechercheResultsArrivee = ref()
let journeys = ref()
let links = ref()
let rechercheDate = ref()
let rechercheDepart = ref()
let rechercheArrivee = ref()


await fetch("https://ressources.data.sncf.com/api/records/1.0/search/?dataset=referentiel-gares-voyageurs&q=&rows=10000")
    .then((response) => response.json())
    .then((json) => {
        champsCoord = json.records.map(element => {
            return { "geometry": element.geometry, "name": `${element.fields.gare_alias_libelle_noncontraint}` }
        })
    })

let gares = [...new Set(champsCoord.map(obj => obj.name))] // unique list

function makeRequest(urlOptional, startLong, startLat, endLong, endLat, date) {
    let url = urlOptional ? urlOptional : `https://api.sncf.com/v1/coverage/sncf/journeys?from=${startLong};${startLat}&to=${endLong};${endLat}&datetime_represents=departure&datetime=${date}`
    console.log(url)
    fetch(url, {
        headers: new Headers({
            'Authorization': 'b71612e2-708e-45e9-9880-790a6617049a'
        })
    })
        .then(response => response.json())
        .then(json => {
            journeys.value = json.journeys
            links.value = json.links
        })
}

function nextDeparture(precedent) {
    let url = precedent ? links.value[1].href : links.value[0].href
    makeRequest(url)
}

function preProcessRequest(depart, arrivee, date) {

    let startLat = champsCoord.find(gare => gare.name == depart).geometry.coordinates[0]
    let startLong = champsCoord.find(gare => gare.name == depart).geometry.coordinates[1]    

    let endLat = champsCoord.find(gare => gare.name == arrivee).geometry.coordinates[0]
    let endLong = champsCoord.find(gare => gare.name == arrivee).geometry.coordinates[1]

    makeRequest(false, startLat, startLong, endLat, endLong, moment(date).format('YMDTHHmm'))
}



</script>

<template>
    <div class="mainContainer">
        <form autocomplete="off" class="mainForm">
        <div class="mainFormContainer">
            <Autocomplete ref="rechercheDepart" :gares="gares" placeHolder="Gare de départ"/>
            <Autocomplete ref="rechercheArrivee" :gares="gares" placeHolder="Gare d'arrivée"/>
        </div>
        <Datepicker class="datePicker" v-model="rechercheDate" placeholder="Date de départ" :dark=true format='dd/MM/yyyy HH:mm'></Datepicker>
        <input class="submitButton" type="submit" value="Rechercher" @click.prevent="preProcessRequest(rechercheDepart.recherche, rechercheArrivee.recherche, rechercheDate)"/>
    </form>

    <div class="results" v-if="journeys">
        {{journeys[0].sections.length}} Étapes <br/> 
        Date de départ : {{moment(journeys[0].departure_date_time).format('D MMM HH:mm')}} <br/> 
        Date d'arrivée : {{moment(journeys[0].arrival_date_time).format('D MMM HH:mm')}} <br/>
        Durée : {{moment.utc(journeys[0].duration*1000).format('HH:mm')}}
        <div class="navButtons">

            <div class="submitButton nextButton" @click="nextDeparture('precedent')">Train&nbsp;Précédent</div>
            <div class="submitButton nextButton" @click="nextDeparture()">Train&nbsp;Suivant</div>
        </div>
    </div>
    
</div>
</template>

<style scoped>
.mainContainer{
    display: flex;
    flex-direction: column;
}
.mainForm{
    display: flex;
    flex-direction: column;
    align-items: center;
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


</style>
