<script setup lang="ts"></script>

<template>
    <div>
        <img src="/logo_no_bg.png" alt="Polar" />
        <h1>Error <b>404</b></h1>
        <p>Sorry page not found... <router-link to="/">Back to home.</router-link></p>
    </div>
</template>

<style scoped>
div {
    display: block;
    justify-content: center;
    text-align: center;
}

b {
    color: #ff0000df;
}

p {
    margin-top: 3%;
}
</style>
