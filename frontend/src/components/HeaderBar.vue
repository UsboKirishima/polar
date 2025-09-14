<script setup lang="ts">
import { useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const router = useRouter();

const goBack = () => {
    router.go(-1);
}

</script>

<template>
    <div class="bar">
        <div @click="goBack" class="back-ic">
            <FontAwesomeIcon :icon="faArrowLeft" />
        </div>
        <h2>
            <slot></slot>
        </h2>
    </div>
</template>

<style scoped>
h2 {
    font-weight: 200;
    margin-left: 10px;
}

b {
    font-weight: 700;
}

.bar {
    width: 96%;
    text-align: left;
    background: #14141bb0;
    margin: 0 auto;
    display: flex;
    align-items: center;
    padding: 2rem 1rem;
    position: sticky;
    backdrop-filter: blur(6px);
    top: 0;
    z-index: 90;
}

.back-ic {
    cursor: pointer;
    transition: 300ms;
    color: #fff;
}

.back-ic:hover {
    opacity: 70%;
    transition: 300ms;
}
</style>