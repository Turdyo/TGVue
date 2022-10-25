const url = "http://localhost:3000/api/"

export default {
    
    async login(email, password) {
        return fetch(url + "auth/login", {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(data => data.json())
    },

    async createAccount(email, lastName, firstName, password) {
        return fetch(url + "auth/createUser", {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                email: email,
                lastName: lastName,
                firstName: firstName,
                password: password
            })
        })
        .then(data => data.json())
    },

    is_auth() {
        let cookies = document.cookie.split(";")
        if (cookies.length === 0) {
            return false
        }
        let isCookie = false
        cookies.forEach(value => {
            if(value.match("auth_token") != null) {
                isCookie = true
            }
        })

        return isCookie
    },

    getToken() {
        if(this.is_auth()) {
            let cookies = document.cookie.split(";")
            let token = null
            cookies.forEach(value => {
                if(value.match("auth_token") != null) {
                    token = value.split('=')[1]
                }
            })
    
            return token
        }
        return null
    },
}