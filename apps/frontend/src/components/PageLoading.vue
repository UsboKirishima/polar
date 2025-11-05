<script setup lang="ts">

</script>

<template>
    <div class="container">
        <img src="/logo_no_bg.png" alt="">
        <div class="loader"></div>
    </div>
</template>

<style scoped>
.container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    z-index: 9999;

    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 2rem;
    flex-direction: column;
}

.loader {
    height: 15px;
    aspect-ratio: 5;
    -webkit-mask: linear-gradient(90deg, #ffffff00, #ffffff 20% 80%, #ffffff00);
    background: radial-gradient(closest-side at 37.5% 50%, #ffffff 94%, #ffffff00) 0/calc(80%/3) 100%;
    animation: l48 .75s infinite linear;
}

@keyframes l48 {
    100% {
        background-position: 36.36%
    }
}

img {
    width: 20%;
}
</style>