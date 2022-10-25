<template>
    <HeaderVue :login_page="true"></HeaderVue>
    <div class="container">
        <div class="authForm">
            <h1>Se connecter</h1>
            <input type="text" v-model="email" placeholder="Email">
            <input type="password" v-model="password" placeholder="Mot de passe">
            <p v-if="errorMsg!==''" class="errMsg">{{errorMsg}}</p>
            <button class="submitButton" @click="login">Se connecter</button>
        </div>
    </div>
</template>

<script>
import HeaderVue from '../components/Header.vue';
import data from '../assets/data';

export default {
    data() {
        return {
            email: '',
            password:'',
            errorMsg:'',
        }
    },
    created() {
        if (data.is_auth()) 
            this.$router.push({
                name:'Home'
            })
    },
    methods:{
        login() {
            data.login(this.email, this.password)
            .then(answer => {
                console.log(answer.token)
                if (answer.error !== undefined) {
                    this.errorMsg = 'Identifiants invalides.'
                } else {
                    this.$cookies.set('auth_token', answer.token, 84600);
                    this.$cookies.set('id', answer.id, 84600);
                    this.$router.push({
                        name:'Home'
                    });
                    
                }
            })
            .catch(error => {
                console.log(error)
                this.errorMsg = 'Identifiants invalides.'
            });
        }
    },
    components:{
        HeaderVue
    }
}

</script>