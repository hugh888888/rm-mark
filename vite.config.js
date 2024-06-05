import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import NutUIResolver from '@nutui/auto-import-resolver'
export default defineConfig({
	plugins: [
		vue(),
		// 开启 unplugin 插件，自动引入 NutUI 组件
		Components({
			resolvers: [NutUIResolver()]
		})
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src') // 设置 '@' 指向 'src' 目录
		}
	}
})
