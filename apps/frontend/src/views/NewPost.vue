<script setup lang="ts">
import Userinfo from '@/components/UserInfo.vue'
import { useAuthStore } from '@/stores/auth'
import { usePostStore } from '@/stores/posts'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { trpc } from '@/trpc'
import { colorMap, getColorRgba, type ColorEnum } from '@/utils/colors'

const { Normal, ...colorMapToShow } = colorMap

const postStore = usePostStore()
const router = useRouter()

const postContent = ref('')
const selectedColorKey = ref<ColorEnum>('Normal')

const computedBackgroundColor = computed(() => {
    return getColorRgba(selectedColorKey.value)
})

const handleNewPost = async () => {
    //handle categories #

    if (!postContent.value) return

    const categories: string[] = postContent.value.split(' ').filter((word) => word[0] === '#')
    const parsedCategories: { name: string }[] = categories.map((cat) => {
        return { name: cat.slice(1) }
    })
    //await postStore.createNewPost(postContent.value, parsedCategories);
    await trpc.post.create.mutate({
        text: postContent.value.trim(),
        categories: parsedCategories,
        color: selectedColorKey.value,
    })
    postContent.value = ''
    await postStore.fetchAllPosts()
    router.push('/feed')
}

const handleKeyPress = async (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        await handleNewPost()
    }
}

const goBack = () => {
    router.go(-1)
}

const auth = useAuthStore()
</script>

<template>
    <div class="container">
        <div class="header" @click="goBack">
            <div>
                <FontAwesomeIcon :icon="faArrowLeft" />
            </div>
            <h2>New Post</h2>
        </div>

        <div class="body">
            <div class="create" :style="{ background: computedBackgroundColor }">
                <div class="profile">
                    <Userinfo :user="auth.user" disable-over />
                </div>
                <div class="send">
                    <input
                        type="text"
                        placeholder="Write a post..."
                        v-model="postContent"
                        @keypress="handleKeyPress"
                    />
                    <div @click="handleNewPost">
                        <FontAwesomeIcon :icon="faArrowRight" class="send-btn" />
                    </div>
                </div>
            </div>
            <div class="background-container">
                <h2>Palette</h2>
                <div class="background">
                    <div
                        class="palette"
                        v-for="(colorArray, key) in colorMapToShow"
                        :key="key"
                        @click="selectedColorKey = key as ColorEnum"
                        :style="{ background: `rgba(${colorArray.join(',')})` }"
                    ></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    width: 96%;
}

h2 {
    font-weight: 200;
    margin-left: 10px;
}

.header {
    width: 100%;
    padding: 2rem 1rem;
    position: fixed;
    top: 0;
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    z-index: 90;
    cursor: pointer;
}

.body {
    max-width: 600px;
    margin: 0 auto;
    margin-top: 7rem;
    padding: 20px;
}

.create {
    backdrop-filter: blur(6px);
    padding: 1rem;
    border-radius: 16px;
    margin-bottom: 2rem;
}

.profile {
    display: flex;
    font-size: 0.9rem;
    align-items: center;
    margin-bottom: 1rem;
    color: #ffffff81;
}

.profile img {
    width: 50px;
    border-radius: 100%;
    margin-right: 10px;
}

#fullname {
    font-weight: 700;
    font-size: 1rem;
    color: #fff;
}

.send {
    display: flex;
    align-items: center;
}

.send div {
    cursor: pointer;
    transition: 300ms;
    color: #fff;
}

.send div:hover {
    transition: 300ms;
    color: #ffffff5b;
}

input {
    height: 2rem;
    color: #fff;
    font-size: 1.2rem;
    width: 100%;
    outline: none;
    background: transparent;
    border: none;
}

input::placeholder {
    color: #fffb;
}

.background-container {
    background: #a5a6ff13;
    padding: 1rem;
    border-radius: 16px;
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.background {
    margin-top: 1rem;
    display: grid;
    width: 50%;
    grid-template-columns: repeat(auto-fill, minmax(50px, 5px));
    gap: 5px;
}

.palette {
    width: 50px;
    aspect-ratio: 1/1;
    transition: transform 0.2s ease;
    cursor: pointer;
    border-radius: 4px;
    border: 1px solid #fff3;
}

.palette:hover {
    transform: scale(1.05);
}
</style>
