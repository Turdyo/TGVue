<script setup>
import { ref } from 'vue'
import moment from 'moment'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

moment.locale('fr')


let champsCoord = []
let rechercheResultsDepart = ref()
let rechercheResultsArrivee = ref()
let journeys = ref()
let links = ref()
let rechercheDate = ref()


await fetch("https://ressources.data.sncf.com/api/records/1.0/search/?dataset=referentiel-gares-voyageurs&q=&rows=10000")
    .then((response) => response.json())
    .then((json) => {
        champsCoord = json.records.map(element => {
            return { "geometry": element.geometry, "name": `${element.fields.gare_alias_libelle_noncontraint}` }
        })
    })

let gares = [...new Set(champsCoord.map(obj => obj.name))] // unique list

// console.log(gares)

// makeRequest(2.373520, 48.844888, -0.556697, 44.825873, moment().format())

function makeRequest(urlOptional, startLong, startLat, endLong, endLat, date) {
    let url = ""
    if(urlOptional){
        url = urlOptional
    } else {

        url = `https://api.sncf.com/v1/coverage/sncf/journeys?from=${startLong};${startLat}&to=${endLong};${endLat}&datetime_represents=departure&datetime=${date}`
    }

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
    let url = ""
    if (precedent == 'precedent') {
        url = links.value[1].href
    } else [
        url = links.value[0].href
    ]

    makeRequest(url)
}


function autocompleteMatch(input) {
    if (input == '' || input.length < 3) {
        return [];
    }
    return [...gares]
        .filter((str) =>
            str.toLowerCase().includes(input.toLowerCase())
        )
}

function showResults(val, depart, hide) {
    if(depart == "depart") {
        if(hide == "hide") {
            rechercheResultsDepart.value = autocompleteMatch('');
        } else {
            rechercheResultsDepart.value = autocompleteMatch(val);
        }
    } else {
        if(hide == "hide") {
            rechercheResultsArrivee.value = autocompleteMatch('');
        } else {
        rechercheResultsArrivee.value = autocompleteMatch(val);
        }
    }
}

function handleAutoComplete(value, depart) {
    if(depart == "depart") {
        this.rechercheDepart = value
        showResults(this.rechercheDepart, 'depart', 'hide')
    } else {

        this.rechercheArrivee = value
        showResults(this.rechercheArrivee)
        showResults(this.rechercheDepart, 'arrivee', 'hide')

    }

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

            <div class="gareDepart">
                <input id="gareInputDepart" class="gareInput" v-model="rechercheDepart" placeholder="Gare de départ"
                    @keyup ="showResults(rechercheDepart, 'depart')" />

                <ul v-for="result in rechercheResultsDepart" @click="handleAutoComplete(result, 'depart'); ">
                    {{result}}
                </ul>

            </div>

            <div class="gareArrivee">
                <input id="gareInputArrivee" class="gareInput" v-model="rechercheArrivee" placeholder="Gare d'arrivée"
                    @keyup="showResults(rechercheArrivee)" />

                <ul v-for="result in rechercheResultsArrivee" @click="handleAutoComplete(result); ">
                    {{result}}
                </ul>

            </div>

            
        </div>
        
        <Datepicker class="datePicker" v-model="rechercheDate" placeholder="Date de départ" :dark=true format='dd/MM/yyyy HH:mm'></Datepicker>
        <input class="submitButton" type="submit" value="Rechercher" @click.prevent="preProcessRequest(rechercheDepart, rechercheArrivee, rechercheDate)"/>
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
.gareArrivee {
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
    /* border: 1px solid gray; */
    border: none;
    font-size: larger;
}

.nextButton{
    width: min-content;
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
    /* color: #213547; */
}
ul:hover{
    background-color: rgb(69, 136, 99);
}
ul:last-child{
    padding-bottom: 10px;
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

input:focus{
    outline: none;
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
