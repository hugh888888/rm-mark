// 引入vue router
import { createRouter, createWebHistory } from 'vue-router'
import { watchEffect } from 'vue'
// 引入组件

// 创建router实例
const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			component: () => import('@/views/index.vue')
		},
	]
})
// 监听路由变化
watchEffect(() => {
	// 如果当前路由有 meta.title 属性，则设置文档标题为 meta.title
	if (router.currentRoute.value.meta.title) {
		document.title = router.currentRoute.value.meta.title
	}
})
// 导出router实例
export default router
