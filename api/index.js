import express from 'express'
import videoService from './service/videoService'

const app = express()

const router = express.Router()

router.get('/video', async (req, res) => {
	const url = req.query.url
	let data = null

	const services = {
		'.pipix': videoService.pipixia,
		'.douyin': videoService.getDouyinVideo,
		'.huoshan': videoService.huoshan,
		'h5.weishi': videoService.weishi,
		'weibo.com': videoService.weibo,
		'oasis.weibo': videoService.lvzhou,
		'.zuiyou': videoService.zuiyou,
		'.xiaochuankeji': videoService.zuiyou,
		'bbq.bilibili': videoService.bbq,
		'.kuaishou': videoService.kuaishou,
		'.hanyuhl': videoService.before,
		'.eyepetizer': videoService.kaiyan,
		'.immomo': videoService.momo,
		'.vuevideo': videoService.vuevlog,
		'.xiaokaxiu': videoService.xiaokaxiu,
		'.ippzone': videoService.pipigaoxiao,
		'.pipigx': videoService.pipigaoxiao,
		'qq.com': videoService.quanminkge,
		'ixigua.com': videoService.xigua,
		'.doupai': videoService.doupai,
		'6.cn': videoService.sixroom,
		'huya.com/play/': videoService.huya,
		'pearvideo.com': videoService.pear,
		'xinpianchang.com': videoService.xinpianchang,
		'acfun.cn': videoService.acfan,
		'meipai.com': videoService.meipai
	}

	for (const key in services) {
		if (url.includes(key)) {
			data = await services[key](url)
			return
		}
	}
	const result = {
		code: 1,
		data,
		msg: 'success'
	}
	if (data === null) {
		result.code = 0
		result.msg = '不支持的链接'
	} else if (data === 'error') {
		result.code = 0
		result.msg = '解析失败'
	}
	res.send(result)
})
app.use('/api', router)
// 监听端口

module.exports = app
