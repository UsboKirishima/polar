<script setup lang="ts">
import { faArrowRight, faAt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ref } from 'vue'
import { useFriendStore } from '../../stores/friends'

const friendStore = useFriendStore()

const searchContent = ref('')

const handleSearch = async () => {
    await friendStore.sendRequestByUsername(searchContent.value)
}

const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        handleSearch()
    }
}
</script>

<template>
    <div class="search-container">
        <FontAwesomeIcon :icon="faAt" class="tag" />
        <input
            type="search"
            placeholder="Search friend by username"
            v-model="searchContent"
            class="search-bar"
            @keypress="handleKeyPress"
        />
        <div class="submit" @click="handleSearch">
            <FontAwesomeIcon :icon="faArrowRight" class="icon" />
        </div>
    </div>
</template>

<style scoped>
.search-container {
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;
    margin-top: 1rem;
}

.search-bar {
    width: 100%;
    height: 3rem;
    border-radius: 8px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.212);
}

.tag {
    position: absolute;
    left: 10px;
    color: #ffffff9f;
    width: 1.5rem;
    font-size: 1.3rem;
}

.icon {
    position: absolute;
    right: 10px;
    color: #ffffff9f;
    width: 1.5rem;
    font-size: 1.3rem;
    transition: 300ms;
}

.submit {
    cursor: pointer;
    display: flex;
    align-items: center;
}

.icon:hover {
    color: #fffe;
    transition: 300ms;
}

input::placeholder {
    font-weight: 700;
    font-size: 1rem;
    color: #ffffff3a;
}

input[type='search']::-webkit-search-cancel-button {
    -webkit-appearance: none;
    appearance: none;
    display: none;
}

input:focus {
    background: transparent;
    transition: 300ms;
    border: 1px solid rgba(255, 255, 255, 0.644);
}

input {
    color: #fff;
    font-weight: 700;
    padding-left: 2.5rem;
    outline: none;
    font-size: 1rem;
    line-height: 1.5rem;
    transition: 300ms;
}
</style>
