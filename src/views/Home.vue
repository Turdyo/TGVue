<script setup>
    import Recherche from '../components/Recherche.vue'
    import Header from '../components/Header.vue';
</script>

<template>
    <Header></Header>
    <Suspense id="container">
        <Recherche></Recherche>
        <template #fallback>
            <div style="text-align:center; font-size: larger">
                <img src="https://cdn.dribbble.com/users/1305855/screenshots/5945198/loading_800-600.gif"
                    class="loadingImg fade-in">
            </div>
        </template>
    </Suspense>

</template>

<style>

.loadingImg{
  border-radius: 50px;
  opacity: 80%;
  width: auto;
  -moz-transform: scale(-1, 1);
  -o-transform: scale(-1, 1);
  -webkit-transform: scale(-1, 1); 
  transform: scale(-1, 1);
}

.fade-in {
	opacity: 0.8;
	animation-name: fadeInOpacity;
	animation-iteration-count: 1;
	animation-timing-function: ease-in;
	animation-duration: 0.2s;
}

#container {
    display: flex;
    align-items: center;
    width: 100%;
}

@keyframes fadeInOpacity {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 0.8;
	}
}

</style>