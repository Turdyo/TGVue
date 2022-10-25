const url = "localhost:3000/api"

export default {
    
    async login(email, password) {
        return fetch(url + "/auth/login", {
            method:'POST',
            body:JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(data => data.json())
    },

    async createAccount(email, lastName, firstName, password) {
        return fetch(url + "/auth/createUser", {
            method:'POST',
            body:{
                email: email,
                lastName: lastName,
                firstName: firstName,
                password: password
            }
        })
        .then(data => data.json())
    }
}