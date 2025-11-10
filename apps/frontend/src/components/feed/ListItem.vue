<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons'

export interface Friend {
    username: string
    avatar: string
    newPostsCount: number
}

export interface Suggestion {
    username: string
    avatar: string
    friendsCount: number
}

function isFriend(data: Friend | Suggestion): data is Friend {
    return (data as Friend).newPostsCount !== undefined
}

const props = defineProps<{
    data: Friend | Suggestion
    type: 'feed' | 'suggestion' | 'verified'
}>()
</script>

<template>
    <div class="sb-friend">
        <a v-if="type === 'suggestion'" href="#" class="add-friend">
            <FontAwesomeIcon class="icon" :icon="faAdd" />
        </a>
        <img :src="data.avatar" />
        <div class="f-info">
            <p class="username">
                {{ data.username }}
                <svg
                    v-if="type === 'verified'"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="15"
                    height="15"
                    viewBox="0,0,256,256"
                >
                    <g
                        fill="#07f"
                        fill-rule="nonzero"
                        stroke="none"
                        stroke-width="1"
                        stroke-linecap="butt"
                        stroke-linejoin="miter"
                        stroke-miterlimit="10"
                        stroke-dasharray=""
                        stroke-dashoffset="0"
                        font-family="none"
                        font-weight="none"
                        font-size="none"
                        text-anchor="none"
                        style="mix-blend-mode: normal"
                    >
                        <g transform="scale(5.12,5.12)">
                            <path
                                d="M45.103,24.995l3.195,-6.245l-5.892,-3.807l-0.354,-7.006l-7.006,-0.35l-3.81,-5.89l-6.242,3.2l-6.245,-3.196l-3.806,5.893l-7.005,0.354l-0.352,7.007l-5.89,3.81l3.2,6.242l-3.194,6.243l5.892,3.807l0.354,7.006l7.006,0.35l3.81,5.891l6.242,-3.2l6.245,3.195l3.806,-5.893l7.005,-0.354l0.352,-7.006l5.89,-3.81zM22.24,32.562l-6.82,-6.819l2.121,-2.121l4.732,4.731l10.202,-9.888l2.088,2.154z"
                            ></path>
                        </g>
                    </g>
                </svg>
            </p>
            <p class="new-posts">
                {{
                    isFriend(data)
                        ? data.newPostsCount + ' new posts'
                        : Math.floor(Math.random() * 100) + ' friends'
                }}
            </p>
        </div>
    </div>
</template>

<style scoped>
.sb-friend {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 3px;
    text-decoration: none;
    width: 80%;
    border-radius: 12px;
    margin: 2px 0;
}

.sb-friend img {
    width: 40px;
    border-radius: 100%;
}

.f-info {
    margin-left: 13px;
}

.f-info .username {
    display: flex;
    align-items: center;
    color: #fff;
    font-weight: 600;
}

.f-info .username svg {
    margin-left: 4px;
}

.f-info .new-posts {
    font-size: 0.7rem;
}

.add-friend {
    margin-right: 0.4rem;
    color: #fff;
    background: #a5a6ff13;
    padding: 0.3rem;
    border-radius: 100%;
}
</style>
