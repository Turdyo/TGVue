import { createRouter, createWebHistory } from "vue-router";
import  Home  from '../views/Home.vue'
import  Account  from '../views/Account.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

const routes = [
    {
        name: "Home",
        path: '/',
        component: Home
    }, 
    {
        name: "Account",
        path: '/account',
        component: Account
    },
    {
        name: "Login",
        path: '/login',
        component: Login
    },
    {
        name:"Register",
        path: '/register',
        component: Register
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
}) 


export default router;