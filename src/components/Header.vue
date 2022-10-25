<template>
    <div class="headerContainer">
        <RouterLink to="/">
            <img src="https://media.discordapp.net/attachments/1024274664220020796/1031890537810239529/TGVue_logo_Blanc.png" alt="TGVue logo">
        </RouterLink>
        <div v-if="is_auth" class="header_usage">
            <RouterLink v-if="!account_page" to="/account">
                <img src="https://cdn-icons-png.flaticon.com/512/5195/5195775.png" alt="Profil" class="profileIcon">
            </RouterLink>
            <button @click="logout">Déconnexion</button>
        </div>
        <div v-else class="header_usage">
            <RouterLink v-if="!login_page" to="/login">
                <h2>Connexion</h2>
            </RouterLink>
            <RouterLink v-if="!auth_page" to="/register">
                <h2>Inscription</h2>
            </RouterLink>
        </div>
    </div>
</template>

<script>
import data from '../assets/data'

export default {
    data() {
        return {
            is_auth:false,
            login_page:false,
            auth_page:false,
            account_page:false
        }
    },
    created() {
        this.is_auth = data.is_auth()
    },
    methods: {
        logout() {
            this.$cookies.remove('id')
            this.$cookies.remove('auth_token')
            this.$router.push({
                name:'Home'
            })
            window.location.reload()
            
        }
    }
}
</script>

<style scoped>

.profileIcon{
    width: 50px;
    height: auto;
    opacity: 0.9;
}
.accountLink{
    position: absolute;
    right: 0;
    margin-right: 50px;
}

.headerContainer{
    display: flex;
    height: auto;
    margin-bottom: 50px;
    width: 100vw;
    justify-content: space-between;
    padding-top: 15px;
}
h1{
    text-align: center;
}


.header_usage {
    display: flex;
    justify-content:space-evenly;
    align-items: center;
    width: 30%;
    padding-right: 50px;
}

img{
    height: 150px;
    width: auto;
    padding-left: 50px;
}

@media (max-width: 768px) {
    img{
        height: 50px;
    }
}

</style>
