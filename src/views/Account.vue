<script>
import Header from '../components/Header.vue';
import data from '../assets/data';

export default {
    data(){
        return {
            tickets: []
        }
    },
    created() {
        if (data.is_auth()) {
            data.getUserData()
            .then(res => this.tickets = res)
        }
    },
    components:{
        Header
    }
}
</script>

<template>
    <Header></Header>
    <div class="container">
      

        <div v-for="ticket in tickets" :key="ticket">
            <div>
                <h4>Gare de départ : {{ticket.start_station}}</h4>
                <h4>Gare d'arrivée : {{ticket.end_station}}</h4>
                <p>Date et heure : {{ticket.date}}</p>
                <p>Prix : {{ticket.price}}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>


</style>