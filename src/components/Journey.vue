<script setup>
import moment from 'moment'
import { ref } from 'vue'

moment.locale('fr')

let props = defineProps({
    journey: {
        default: null
    }
})


</script>

<template>
    <div v-if="props.journey" class="journeyContainer">
        
        <div class="dates">
            <span class="dateIcon">
                <img src="https://cdn-icons-png.flaticon.com/512/3501/3501843.png" alt="Date" class="waitingIcon">
                {{moment(journey.departure_date_time).format('DD/MM')}}
            </span>
            <span class="heures">
                <img src="https://cdn-icons-png.flaticon.com/512/3721/3721924.png" alt="Horloge" class="waitingIcon">
                {{moment(journey.departure_date_time).format('HH:mm')}}
                <i class="gg-arrow-down"></i>
                {{moment(journey.arrival_date_time).format('HH:mm')}}
            </span>
        </div>

        <div class="steps">
            <div v-for='section in props.journey.sections.filter(section => section.type === "public_transport" || section.type === "waiting")' class="section">
                <div v-if="section.type === 'waiting' ">
                    <img src="https://cdn-icons-png.flaticon.com/512/4388/4388350.png" alt="Attendre" class="waitingIcon">
                    {{moment.utc(new Date(section.duration * 1000)).format("HH:mm")}}
                </div>
                <div v-else>
                    <img src="https://cdn-icons-png.flaticon.com/512/2855/2855692.png" alt="Train" class="waitingIcon">
                    {{moment.utc(new Date(section.duration * 1000)).format("HH:mm")}}&nbsp;{{section.from.name}} to {{section.to.name}}
    
                </div>
            </div>

        </div>

    </div>

    <div v-else>
        Journey bogué
    </div>


</template>

<style scoped>
.steps{
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.section{
    padding-top: 2px;
    padding-bottom: 2px;
}
.waitingIcon{
    width: 35px;
    vertical-align: middle;
}
.journeyContainer{
    text-align: left;
    border: 1px solid grey;
    border-radius: 5px;
    padding: 20px;
    display: flex;
    margin-bottom: 10px;
}
.dates{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 30px;
    justify-content: space-around;
    padding-right: 20px;
    border-right: 1px solid #5C5C5C;
    min-height: 170px;
}
.heures{
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: large;
    font-weight: bold;
    color: #42b883;
    /* justify-content: space-around; */
}
.dateIcon{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.gg-arrow-down {
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(var(--ggs,1));
    width: 22px;
    height: 22px;
}
.gg-arrow-down::after, .gg-arrow-down::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
    bottom: 4px;
}
.gg-arrow-down::after {
    width: 8px;
    height: 8px;
    border-bottom: 2px solid;
    border-left: 2px solid;
    transform: rotate(-45deg);
    left: 7px
}
.gg-arrow-down::before {
    width: 2px;
    height: 16px;
    left: 10px;
    background: currentColor
}
</style>