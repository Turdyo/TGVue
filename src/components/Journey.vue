<script setup>
import moment from 'moment'
import { ref } from 'vue'

moment.locale('fr')

let props = defineProps({
    journey: {
        default: []
    }
})

</script>

<template>
    <div class="journeyContainer">
        <div class="dates">
            {{moment(journey.departure_date_time).format('DD/MM')}}&nbsp;
            {{moment(journey.departure_date_time).format('HH:mm')}}&nbsp;&nbsp;
            <i class="gg-arrow-right"></i>&nbsp;
            {{moment(journey.arrival_date_time).format('HH:mm')}}
        </div>
        <div v-if="journey.nb_transfers != 0">
            {{journey.nb_transfers}} correspondances
        </div>

        <div v-for='section in props.journey.sections.filter(section => section.type === "public_transport")'>
            {{section.from.name}} to {{section.to.name}}&nbsp;{{moment.utc(new Date(section.duration * 1000)).format("HH:mm")}}
        </div>

    </div>


</template>

<style scoped>
.journeyContainer{
    text-align: left;
    border: 1px solid grey;
    border-radius: 5px;
    padding: 20px;
    /* display: flex; */

}

.dates{
    display: flex;
    flex-direction: row;
}

.gg-arrow-right {
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(var(--ggs,1));
    width: 22px;
    height: 22px
}
.gg-arrow-right::after, .gg-arrow-right::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
    right: 3px
}
.gg-arrow-right::after {
    width: 8px;
    height: 8px;
    border-top: 2px solid;
    border-right: 2px solid;
    transform: rotate(45deg);
    bottom: 7px
}
.gg-arrow-right::before {
    width: 16px;
    height: 2px;
    bottom: 10px;
    background: currentColor
}
</style>