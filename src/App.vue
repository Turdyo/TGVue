<script setup>

import Recherche from './components/Recherche.vue'
import Header from './components/Header.vue';

</script>

<template>
  <Header></Header>
  <Suspense>
    <Recherche></Recherche>
    <template #fallback>
      <div style="text-align:center; font-size: larger">
        Chargement ...
      </div>
    </template>
  </Suspense>
</template>

<style scoped>

</style>
