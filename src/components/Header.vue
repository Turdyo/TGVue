<template>
    <div class="headerContainer">
        <RouterLink to="/">
            <img src="https://media.discordapp.net/attachments/1024274664220020796/1031890537810239529/TGVue_logo_Blanc.png" alt="TGVue logo">
        </RouterLink>
        <RouterLink to="/account" class="accountLink">
            <img src="https://cdn-icons-png.flaticon.com/512/5195/5195775.png" alt="Profil" class="profileIcon">
        </RouterLink>
    </div>
</template>

<script setup>

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
    justify-content: center;
}
h1{
    text-align: center;
}

img{
    height: 150px;
    width: auto;
}

@media (max-width: 768px) {
    img{
        height: 50px;
    }
}

</style>
