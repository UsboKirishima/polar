<script setup lang="ts">
import HeaderBar from '@/components/HeaderBar.vue';
import PageLoading from '@/components/PageLoading.vue';
import { useAuthStore } from '@/stores/auth';
import { useSettingsStore } from '@/stores/settings';
import { useUserStore } from '@/stores/users';
import { trpc } from '@/trpc';
import type { User } from '@/types';
import { onMounted, ref, watch } from 'vue';

const userStore = useUserStore();
const authStore = useAuthStore();
const settingsStore = useSettingsStore();
const user = ref<User>();

const username = ref(user.value?.profile.username);

const avatarFile = ref<File | null>(null);
const bannerFile = ref<File | null>(null);
const avatarPreview = ref('');
const bannerPreview = ref('');
const isUploading = ref(false);

const bio = ref('');
const bioPreview = ref('');

const handleFileChange = (event: Event, type: 'avatar' | 'banner') => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        const file = target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            if (type === 'avatar') {
                avatarFile.value = file;
                avatarPreview.value = reader.result as string;
            } else {
                bannerFile.value = file;
                bannerPreview.value = reader.result as string;
            }
        };
        reader.readAsDataURL(file);
    }
};

const uploadAvatar = () => {
    if (avatarFile.value) settingsStore.uploadAvatar(avatarFile.value);
};

const uploadBanner = () => {
    if (bannerFile.value) settingsStore.uploadBanner(bannerFile.value);
};

const uploadAll = () => {
    uploadAvatar();
    uploadBanner();
}

watch(bio, (newVal) => {
    bioPreview.value = newVal.trim();
});

const autoResize = (e: Event) => {
    const textarea = e.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
};

onMounted(async () => {
    if (authStore.user) {
        user.value = await userStore.getUserById(authStore.user.id);
        avatarPreview.value = user.value?.profile.avatar.url ?? ''
        bannerPreview.value = user.value?.profile.banner.url ?? ''
    }
});
</script>

<template>
    <PageLoading v-if="userStore.loading || authStore.loading" />
    <div v-else class="container">
        <HeaderBar><b>Preferences</b></HeaderBar>

        <div class="settings">
            <div class="sub">
                <h3>Media</h3>
                <hr>
                <div class="media">
                    <div class="upload-section">
                        <label for="avatarFile" class="image-label">
                            <img class="avatar" :src="avatarPreview ?? '/pfp_placeholder.png'" alt="Avatar Preview" />
                            <span class="overlay-text">Click to change avatar</span>
                        </label>
                        <input type="file" id="avatarFile" accept="image/*"
                            @change="(e) => handleFileChange(e, 'avatar')" hidden />
                    </div>

                    <div class="upload-section">
                        <label for="bannerFile" class="image-label">
                            <img class="banner" :src="bannerPreview ?? '/bg_placeholder.jpg'" alt="Banner Preview" />
                            <span class="overlay-text">Click to change banner</span>
                        </label>
                        <input type="file" id="bannerFile" accept="image/*"
                            @change="(e) => handleFileChange(e, 'banner')" hidden />
                    </div>
                </div>

                <div class="bio-section">
                    <div class="bio-input">
                        <label for="bio">Biography</label>
                        <hr>
                        <textarea rows="1" name="bio" id="bio" placeholder="Write something about yourself..."
                            v-model="bio" @input="autoResize"></textarea>
                    </div>
                </div>
                <button class="save" @click="uploadAll">
                    {{ !isUploading ? 'Save' : 'Loading' }}
                </button>
            </div>

        </div>
    </div>
</template>

<style scoped>
.settings {
    width: 68%;
    margin: 0 auto;
    padding: 2rem;
    background: #a5a6ff13;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

label,
h3 {
    display: block;
    margin-bottom: 10px;
    font-weight: 700;
    color: #fff;
}

.media {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    width: 100%;
    gap: 2rem;
    margin-bottom: 2rem;
    margin-top: 1rem;
}

.upload-section {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}

input[type="file"] {
    display: none;
}

.image-label {
    position: relative;
    cursor: pointer;
    display: inline-block;
    transition: transform 0.2s ease-in-out;
}

.image-label:hover {
    transform: scale(1.03);
}

.sub {
    width: 60%;
    margin: 0 auto;
}

.overlay-text {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    font-size: 0.8rem;
    padding: 4px 8px;
    border-radius: 8px;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
}

.image-label:hover .overlay-text {
    opacity: 1;
}

.banner {
    width: 23rem;
    aspect-ratio: 21/9;
    border-radius: 16px;
    border: 1px solid #666666;
    object-fit: cover;
    object-position: center;
    display: block;
}

.avatar {
    width: 10rem;
    aspect-ratio: 1/1;
    border-radius: 16px;
    border: 1px solid #666666;
    object-fit: cover;
    object-position: center;
    display: block;
}

.bio-section {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.bio-input {
    width: 100%;
}

textarea {
    background-color: #a369ff10;
    border: 1px solid #f7f7f750;
    width: 90%;
    min-height: 5rem;
    border-radius: 16px;
    outline: none;
    color: #fff;
    font-size: 1rem;
    margin-top: 1rem;
    padding: 10px;
    resize: none;
    overflow: hidden;
    font-family: Arial, sans-serif;
    line-height: 1.4;
    transition: border 0.2s ease-in-out, background-color 0.2s ease-in-out;
}

textarea:focus {
    background-color: #a68dff20;
}

textarea::placeholder {
    color: #ffffff70;
    font-style: italic;
}

.save {
    width: 5rem;
    height: 2rem;
    border: none;
    background: #c978ff21;
    border-radius: 12px;
    color: #ffffffd0;
    font-weight: 700;
    cursor: pointer;
    transition: 300ms;
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    margin-top: 2rem;
}

.save:hover {
    background: #c978ff48;
    transition: 300ms;
}
</style>
