import { createApp } from 'vue'
import './style.css'
import VConsole from 'vconsole'
import App from './App.vue'

import router from './routers/'
const params = new URLSearchParams(window.location.search)
// 初始化 vConsole
// 只在开发环境中初始化 vConsole
if (process.env.NODE_ENV === 'development' || params.get('debug')) {
	const vConsole = new VConsole()
}

import '@nutui/nutui/dist/packages/toast/style/css'
import '@nutui/nutui/dist/packages/notify/style/css'
import '@nutui/nutui/dist/packages/dialog/style/css'
import '@nutui/nutui/dist/packages/imagepreview/style/css'

const app = createApp(App)

app.use(router)
app.mount('#app')
