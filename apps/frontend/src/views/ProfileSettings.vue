<template>
  <div class="settings-container">
    <div class="settings-card">
      <h1 class="settings-title">Impostazioni Profilo</h1>
      
      <!-- Banner Upload -->
      <div class="banner-section">
        <div class="banner-upload" :style="{ backgroundImage: banner ? `url(${banner})` : 'none' }">
          <label for="banner-upload" class="banner-label">
            <Camera :size="32" />
            <span>Carica Banner</span>
          </label>
          <input 
            id="banner-upload" 
            type="file" 
            accept="image/*" 
            @change="handleBannerUpload"
            class="file-input"
          />
        </div>
      </div>

      <!-- Avatar Upload -->
      <div class="avatar-section">
        <div class="avatar-container">
          <div class="avatar-preview" :style="{ backgroundImage: avatar ? `url(${avatar})` : 'none' }">
            <User v-if="!avatar" :size="48" />
          </div>
          <label for="avatar-upload" class="avatar-upload-btn">
            <Camera :size="16" />
          </label>
          <input 
            id="avatar-upload" 
            type="file" 
            accept="image/*" 
            @change="handleAvatarUpload"
            class="file-input"
          />
        </div>
      </div>

      <!-- Form Fields -->
      <form @submit.prevent="handleSave" class="settings-form">
        <div class="form-group">
          <label for="bio" class="form-label">
            <BookOpen :size="18" />
            Biografia
          </label>
          <textarea 
            id="bio"
            v-model="formData.bio"
            placeholder="Raccontaci qualcosa di te..."
            maxlength="200"
            rows="4"
            class="form-textarea"
          ></textarea>
          <span class="char-count">{{ formData.bio.length }}/200</span>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="birthdate" class="form-label">
              <Calendar :size="18" />
              Data di Nascita
            </label>
            <input 
              id="birthdate"
              type="date"
              v-model="formData.birthdate"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="city" class="form-label">
              <MapPin :size="18" />
              Città
            </label>
            <input 
              id="city"
              type="text"
              v-model="formData.city"
              placeholder="Milano"
              class="form-input"
            />
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="handleCancel" class="btn btn-cancel">
            Annulla
          </button>
          <button type="submit" class="btn btn-save">
            <Save :size="18" />
            Salva Modifiche
          </button>
        </div>
      </form>

      <!-- Toast Notification -->
      <Transition name="toast">
        <div v-if="showToast" class="toast">
          <Check :size="20" />
          <span>Modifiche salvate con successo!</span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { User, Camera, BookOpen, Calendar, MapPin, Save, Check } from 'lucide-vue-next'

const avatar = ref('')
const banner = ref('')
const showToast = ref(false)

const formData = ref({
  bio: '',
  birthdate: '',
  city: ''
})

const handleAvatarUpload = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      avatar.value = e.target?.result
    }
    reader.readAsDataURL(file)
  }
}

const handleBannerUpload = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      banner.value = e.target?.result
    }
    reader.readAsDataURL(file)
  }
}

const handleSave = () => {
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const handleCancel = () => {
  formData.value = {
    bio: '',
    birthdate: '',
    city: ''
  }
  avatar.value = ''
  banner.value = ''
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.settings-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  padding: 2rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.settings-card {
  width: 100%;
  max-width: 700px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.settings-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  text-align: center;
  padding: 2rem 1.5rem 1rem;
  letter-spacing: -0.02em;
}

.banner-section {
  padding: 0 1.5rem 1rem;
}

.banner-upload {
  width: 100%;
  height: 180px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  border: 2px dashed rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background-size: cover;
  background-position: center;
}

.banner-upload:hover {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.6);
  transform: translateY(-2px);
}

.banner-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-weight: 500;
  cursor: pointer;
  padding: 1rem;
  transition: all 0.3s ease;
}

.banner-label:hover {
  transform: scale(1.05);
}

.avatar-section {
  display: flex;
  justify-content: center;
  margin-top: -60px;
  padding: 0 1.5rem 1.5rem;
  position: relative;
  z-index: 10;
}

.avatar-container {
  position: relative;
}

.avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 4px solid rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background-size: cover;
  background-position: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.avatar-upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #667eea;
}

.avatar-upload-btn:hover {
  transform: scale(1.1);
  background: white;
}

.file-input {
  display: none;
}

.settings-form {
  padding: 0 1.5rem 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
  flex: 1;
  min-width: 200px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.char-count {
  display: block;
  text-align: right;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.btn-save {
  background: white;
  color: #667eea;
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.2);
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(255, 255, 255, 0.3);
}

.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 1rem 1.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #667eea;
  font-weight: 600;
  z-index: 1000;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media (max-width: 640px) {
  .settings-container {
    padding: 1rem;
  }

  .settings-title {
    font-size: 1.5rem;
    padding: 1.5rem 1rem 0.75rem;
  }

  .banner-upload {
    height: 140px;
  }

  .avatar-preview {
    width: 100px;
    height: 100px;
  }

  .form-row {
    flex-direction: column;
  }

  .form-actions {
    flex-direction: column;
  }

  .toast {
    right: 1rem;
    left: 1rem;
  }
}
</style>
