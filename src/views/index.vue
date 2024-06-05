<template>
	<nut-searchbar
		v-model="url"
		background="linear-gradient(to right, #9866F0, #EB4D50)"
		input-background="#fff"
		placeholder="请输入链接"
	>
		<template #rightout> <span @click="submit">确定</span> </template>
	</nut-searchbar>
	<nut-cell title="标题" :desc="data.title"></nut-cell
	><nut-cell title="作者" :desc="data.nickName"></nut-cell>
	<nut-cell title="描述" :sub-title="data.desc"></nut-cell>
	<nut-cell
		v-if="data.images && data.images.length > 0"
		isLink
		title=" 图片预览"
		:showIcon="true"
		@click="showFn"
	></nut-cell>
	<nut-image-preview :show="showPreview" :images="images" @close="hideFn" />
	<nut-video v-if="data.url" :source="source" :options="options" />
</template>
<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { showToast } from '@nutui/nutui'
const url = ref('https://v.douyin.com/i2BNc9JH/')
const data = ref({})
const source = ref({
	src: '',
	type: 'video/mp4'
})
const options = ref({
	autoplay: true,
	muted: true,
	controls: true
})
const showPreview = ref(false)
const images = ref([])
const showFn = () => {
	showPreview.value = true
}

const hideFn = () => {
	showPreview.value = false
}
const submit = async () => {
	const urlRegex = /(https?:\/\/[^\s]+)/g
	const urls = url.value.match(urlRegex)
	console.log(urls)
	if (!urls || !urls[0].includes('douyin.com')) {
		showToast.fail('请输入正确的链接')
		return
	}
	showToast.loading('加载中', {
		cover: true
	})
	axios
		.get('/api/video', {
			params: {
				url: urls[0]
			}
		})
		.then(res => {
			if (res.data.code === 1) {
				data.value = res.data.data
				source.value.src = data.value.url
				if (data.value.images) {
					let arr = []
					data.value.images.forEach(item => {
						arr.push({
							src: item
						})
					})
					images.value = images.value.concat(arr)
					console.log(images.value)
				}
			} else {
				showToast.fail(res.data.msg)
			}

			showToast.hide()
		})
}
</script>

<style scoped>
/deep/.title {
	font-size: 16px;
	font-weight: 600;
}
/deep/.nut-cell__title-desc {
	margin-top: 12px;
}
</style>
