import { createPinia } from 'pinia'
import { createApp } from 'vue'
import vue3GoogleLogin from 'vue3-google-login'
import App from './App.vue'
import router from './router'
import './style.css'

const rvKey = import.meta.env.VITE_RV_API_KEY
if (rvKey) {
  const script = document.createElement('script')
  script.src = `https://code.responsivevoice.org/responsivevoice.js?key=${rvKey}`
  script.async = true
  script.onload = () => {
    console.log('ResponsiveVoice loaded successfully')
  }
  script.onerror = () => {
    console.warn('Failed to load ResponsiveVoice')
  }
  document.head.appendChild(script)
}

const app = createApp(App)

app.use(vue3GoogleLogin, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE',
})

app.use(createPinia())
app.use(router)

app.mount('#app')
