<script>
import HeaderVue from '../components/Header.vue';
import data from '../assets/data'

export default {
    data() {
        return {
            email : "",
            firstName : "",
            lastName : "",
            password1 : "",
            password2 : "",

            errorEmail : "",
            errorfName : "",
            errorlName : "",
            errorPass1 : "",
            errorPass2 : ""
        }
    },
    created() {
        if (data.is_auth()) 
            this.$router.push({
                name:'Home'
            })
    },
    methods:{
        register() {
            this.errorEmail = "";
            this.errorfName = "";
            this.errorlName = "";
            this.errorPass1 = "";
            this.errorPass2 = "";

            let hasError = false;

            let validEmailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.([a-zA-Z0-9-]+)$/;

            if(this.email.length <= 1 || !validEmailFormat.test(this.email)) {
                this.errorEmail = "Email non valide.";
                hasError = true;
            }

            if (this.firstName.length <= 1) {
                hasError = true;
                this.errorfName = "Veuillez rentrer un prénom.";
            }
            else if (/\d/.test(this.firstName)) {
                hasError = true;
                this.errorfName = "Les chiffres ne sont pas acceptés";
            }

            if (this.lastName.length <= 1) {
                hasError = true;
                this.errorlName = "Veuillez rentrer un nom de famille.";
            }
            else if (/\d/.test(this.lastName)) {
                hasError = true;
                this.errorlName = "Les chiffres ne sont pas acceptés";
            }

            if(this.password1.length < 8) {
                hasError = true;
                this.errorPass1 = "Mot de passe trop court";
            }

            if (this.password1 !== this.password2) {
                hasError = true;
                this.errorPass2 = "Les mots de passe sont différents"
            }

            if (!hasError) {
                data.createAccount(this.email, this.lastName, this.firstName, this.password1)
                .then(answer => {
                    this.$cookies.set('auth_token', answer.token, 84600);
                    this.$cookies.set('id', answer.id, 84600);
                    this.$router.push({
                        name:'Home'
                    });
                });
            }
        }
    },
    components:{
        HeaderVue
    }
}

</script>

<template>
    <HeaderVue :auth_page="true"></HeaderVue>
    <div class="container">
        <div class="authForm">
            <h1>Inscription</h1>
            <input type="text" v-model="email" placeholder="Email">
            <p v-if="errorEmail!==''" class="errMsg">{{errorEmail}}</p>
            <input type="text" v-model="lastName" placeholder="Nom">
            <p v-if="errorlName!==''" class="errMsg">{{errorlName}}</p>
            <input type="text" v-model="firstName" placeholder="Prénom">
            <p v-if="errorfName!==''" class="errMsg">{{errorfName}}</p>
            <input type="password" v-model="password1" placeholder="Mot de passe">
            <p v-if="errorPass1!==''" class="errMsg">{{errorPass1}}</p>
            <input type="password" v-model="password2" placeholder="Confirmez votre mot de passe">
            <p v-if="errorPass2!==''" class="errMsg">{{errorPass2}}</p>
            <p v-else id="passInfo">8 charactères minimum</p>
            <button class="submitButton" @click="register">S'inscrire</button>
        </div>
    </div>
</template>

<style>
.container {
    display: flex;
    justify-content: center;
    width: 100vw;
}

.errMsg {
    font-size: 13px;
    margin: 10px 0px 0px 10px;
    color: red;
}

.authForm {
    display: flex;
    flex-direction: column;
    width: 30%;
}

.authForm input {
    margin-top: 20px;
}

.authForm .submitButton {
    width: 150px;
    align-self: center;
}

#passInfo {
    font-size: 13px;
    margin: 10px 0px 0px 10px;
    color:rgb(156, 156, 156)
}
</style>