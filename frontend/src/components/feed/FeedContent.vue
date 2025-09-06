<script setup lang="ts">
import type { Post } from '@/Feed.vue';
import { ref } from 'vue';
import FeedPosts from './FeedPosts.vue';

const props = defineProps<{
    currentPage: string;
}>()


const posts = ref<Post[]>([
    {
        author: {
            username: "giulia_r",
            avatar: "https://randomuser.me/api/portraits/women/45.jpg",
            place: "Parma, Italia",
        },
        category: "travel",
        likes: 120,
        comments: [
            { authorId: "luca_92", text: "Bellissimo posto 😍" },
            { authorId: "marianna_x", text: "Voglio andarci anch'io!" },
        ],
        text: "Weekend meraviglioso in montagna 🏔️ aria fresca e tanto relax!",
    },
    {
        author: {
            username: "mario.dev",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            place: "Milano, Italia",
        },
        category: "tech",
        likes: 85,
        comments: [
            { authorId: "giulia_r", text: "Super interessante, grazie per aver condiviso!" },
            { authorId: "code_master", text: "Non vedo l'ora di provarlo 🔥" },
        ],
        text: "Ho appena finito un progetto open source su GitHub. Chi vuole dare un'occhiata?",
    },
    {
        author: {
            username: "sofia_art",
            avatar: "https://randomuser.me/api/portraits/women/12.jpg",
            place: "Roma, Italia",
        },
        category: "art",
        likes: 220,
        comments: [
            { authorId: "giulia_r", text: "Wow, questo è un capolavoro 🎨" },
            { authorId: "art_lover", text: "Che tecnica hai usato?" },
            { authorId: "mario.dev", text: "Incredibile! 🔥" },
        ],
        text: "Nuova tela completata oggi. Amo sperimentare con i colori 🌈",
    },
    {
        author: {
            username: "travel_guy",
            avatar: "https://randomuser.me/api/portraits/men/76.jpg",
            place: "Bologna, Italia",
        },
        category: "food",
        likes: 154,
        comments: [
            { authorId: "foodie_queen", text: "Quel piatto sembra delizioso 😋" },
            { authorId: "giulia_r", text: "Dove hai mangiato questo?" },
        ],
        text: "Tagliatelle al ragù come tradizione vuole 🍝 #bolognese",
    },
    {
        author: {
            username: "luca_92",
            avatar: "https://randomuser.me/api/portraits/men/23.jpg",
            place: "Firenze, Italia",
        },
        category: "lifestyle",
        likes: 90,
        comments: [
            { authorId: "sofia_art", text: "La mattina perfetta 🌞" },
            { authorId: "travel_guy", text: "Che vista spettacolare!" },
        ],
        text: "Iniziare la giornata con un buon caffè e vista Duomo ☕🏛️",
    },
]);

const friendsPosts = ref<Post[]>([
    {
        author: {
            username: "valentina_c",
            avatar: "https://randomuser.me/api/portraits/women/28.jpg",
            place: "Torino, Italia",
        },
        category: "fitness",
        likes: 187,
        comments: [
            { authorId: "runner_guy", text: "Bravissima! 💪 Continua così!" },
            { authorId: "healthy_mind", text: "Che motivazione 🔥" },
        ],
        text: "Allenamento di stamattina completato: 5km di corsa + sessione di yoga. Mi sento piena di energia 🌱",
    },
    {
        author: {
            username: "enzo_chef",
            avatar: "https://randomuser.me/api/portraits/men/41.jpg",
            place: "Napoli, Italia",
        },
        category: "food",
        likes: 243,
        comments: [
            { authorId: "valentina_c", text: "Quella pizza sembra un sogno 😍" },
            { authorId: "foodie_lover", text: "Ma l'hai fatta tu? Complimenti!" },
            { authorId: "runner_guy", text: "Voglio la ricettaaa 🍕" },
        ],
        text: "L'arte della pizza napoletana non ha eguali. Questa è la mia creazione di stasera, impasto a lunga lievitazione! 🍕🔥",
    },
    {
        author: {
            username: "martina_travel",
            avatar: "https://randomuser.me/api/portraits/women/53.jpg",
            place: "Venezia, Italia",
        },
        category: "travel",
        likes: 198,
        comments: [
            { authorId: "adventure_max", text: "Che spettacolo 😍" },
            { authorId: "enzo_chef", text: "Ho sempre sognato di visitare Venezia!" },
        ],
        text: "Passeggiare tra i canali di Venezia al tramonto è pura magia ✨ #wanderlust",
    },
    {
        author: {
            username: "adventure_max",
            avatar: "https://randomuser.me/api/portraits/men/64.jpg",
            place: "Trento, Italia",
        },
        category: "nature",
        likes: 174,
        comments: [
            { authorId: "martina_travel", text: "Che panorama mozzafiato! 🏔️" },
            { authorId: "nature_freak", text: "Dove si trova questo posto?" },
        ],
        text: "Oggi ho raggiunto la cima dopo 6 ore di trekking. Stanco ma felice 🌲🏔️",
    },
    {
        author: {
            username: "code_master",
            avatar: "https://randomuser.me/api/portraits/men/12.jpg",
            place: "Berlino, Germania",
        },
        category: "tech",
        likes: 312,
        comments: [
            { authorId: "valentina_c", text: "Wow, che innovazione!" },
            { authorId: "dev_girl", text: "Interessantissimo progetto 🚀" },
            { authorId: "martina_travel", text: "Anche io voglio imparare a programmare!" },
        ],
        text: "Sto lavorando su un'app che usa AI per generare allenamenti personalizzati. Il futuro del fitness è qui! 🤖💪",
    },
]);
</script>

<template>
    <div class="feed-content">
        <div v-if="currentPage === 'explore'">
            <FeedPosts :posts="[...posts.values(), ...friendsPosts.values()]" type="explore" />
        </div>

        <div v-else>
            <FeedPosts :posts="[...friendsPosts.values(), ...posts.values()]" type="friends" />
        </div>
    </div>
</template>

<style scoped>
.feed-content {}
</style>
