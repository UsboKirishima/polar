<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
</script>

<template>
    <div class="container">
        <Sidebar class="sidebar" />
        <div class="view">
            <div class="padding"></div>
            <router-view class="page" />
        </div>
    </div>
</template>

<style scoped>
.container {
    width: 100%;
}

.padding {
    width: 100%;
}

.view {
    display: grid;
    grid-template-columns: 14.5% auto;
}

@media (max-width: 768px) {
    .padding {
        display: none;
    }
    .container {
        grid-template-columns: 100%;
        min-height: auto;
    }

    .sidebar {
        display: none;
    }

    .view {
        width: 100%;
        padding: 0;
    }
}
</style>
