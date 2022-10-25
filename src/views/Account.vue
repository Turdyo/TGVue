<script>
import Header from '../components/Header.vue';
import data from '../assets/data';

export default {
    data(){
        return {
            user: {},
            error: false,
            deleteError: false,
        }
    },
    created() {
        if (data.is_auth()) {
            data.getUserData()
            .then(res => {
                console.log(res)
                this.user = res
            })
            .catch(e => {
                console.log(e)
                this.error = true 
            })
        }
        else {
            this.$router.push({
                name:'Home'
            })
        }
    },
    methods:{
        deleteAccount() {
            data.deleteUser()
            .then(res => {
                this.$cookies.remove('auth_token')
                this.$cookies.remove('id')
                this.$router.push({
                    name: 'Home'
                })
            })
            .catch(e => {
                console.log(e)
                this.deleteError = true
            })
        }
    },
    components:{
        Header
    }
}
</script>

<template>
    <Header></Header>
    <div v-if="!error" class="container">
      
        <div class="userData">
            <h3>Nom : {{user.lastName}}</h3>
            <h3>Prénom : {{user.firstName}}</h3>
            <h3>Email : {{user.email}}</h3>

            <button id="deleteButton" @click="deleteAccount">Supprimer le compte</button>
            <p v-if="deleteError" class="errMsg">Quelque chose s'est map passé.</p>
        </div>
        <div class="tickets">
            <h2>Tickets</h2>
            <div v-for="ticket in user.tickets" :key="ticket" class="ticketComponent">
                <h4>Gare de départ : {{ticket.start_station}}</h4>
                <h4>Gare d'arrivée : {{ticket.end_station}}</h4>
                <p>Date et heure : <span class="price">{{ticket.date}}</span></p>
                <p>Prix : <span class="price">{{ticket.price}}</span></p>
            </div>
        </div>

    </div>
    <div v-else>
        <h1>Quelque chose s'est mal passé</h1>
    </div>
</template>

<style scoped>

.container {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-evenly;
    width: 100vw;
    
}

.userData{
    text-align:left;
}

.ticketComponent{
    display: flex;
    flex-direction: column;
    border: 1px solid white;
    border-radius: 1em;
    padding: 15px;
    padding-bottom: 0px;
    background-color: #2b2a33;
    margin-bottom: 10px;
}

.ticketComponent h4, .ticketComponent p {
    padding: 0px;
    margin: 0px 0px 15px 0px;
}

.price{
    color: #41b883;
    font-weight: bold;
}

.ticketComponent:last-child{
    margin: 0px
}

.tickets{
    display:flex;
    flex-direction: column;
    margin-left: 100px
}

#deleteButton {
    background-color: red;
}

</style>