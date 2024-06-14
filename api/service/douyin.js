const crypto = require('crypto')
const axios = require('axios')
const { sign } = require('../lib/Signer.js')
const { generate_a_bogus } = require('../lib/a_bogus.js')
const userAgent =
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.47'
function msToken(length) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	const randomBytes = crypto.randomBytes(length)
	return Array.from(randomBytes, byte => characters[byte % characters.length]).join('')
}

async function getTtwid() {
	try {
		const url = 'https://ttwid.bytedance.com/ttwid/union/register/'
		const data = {
			region: 'cn',
			aid: 1768,
			needFid: false,
			service: 'www.ixigua.com',
			migrate_info: { ticket: '', source: 'node' },
			cbUrlProtocol: 'https',
			union: true
		}
		const response = await axios.post(url, data, {
			headers: { 'Content-Type': 'application/json' }
		})
		console.log('setCookie', response)
		const setCookie = response.headers['set-cookie']

		const regex = /ttwid=([^;]+)/
		const match = regex.exec(setCookie[0])
		return match && match.length > 1 ? match[1] : ''
	} catch (error) {
		console.error(error)
		return ''
	}
}
async function GetInfo(url, ttwid, msToken) {
	const invalid = /[\\\n\r/:*?\"<>|]/g
	const repWith = ``
	// 构造请求URL
	const response = await axios.get(url, {
		headers: {
			cookie: `ttwid=${ttwid};msToken=${msToken};`,
			referer: 'https://www.douyin.com/',
			'user-agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.47'
		}
	})

	// 如果response.data为空或未定义
	if (!response.data) {
		console.log('response', response.data)
		return -1
	}

	// 校验响应状态
	if (response.data.status_code === 0) {
		// 提取需要的数据
		const { video, music, author, desc, aweme_type } = response.data.aweme_detail
		const type = Number(aweme_type) === 0 ? '视频' : '图集'
		const images =
			Number(aweme_type) !== 0
				? response.data.aweme_detail.images.map(image => image.url_list[0])
				: []
		const url = video?.bit_rate?.[0]?.play_addr?.url_list?.[0] ?? ''
		const cleanedDesc = desc.replaceAll(invalid, repWith)

		return {
			url,
			type,
			images,
			desc: cleanedDesc,
			music: music.play_url.uri,
			title: music.title,
			nickName: author.nickname
		}
	} else {
		// 如果响应状态码不为0，抛出错误
		throw new Error(`Error with status code: ${response.data.status_code}`)
	}
}

async function getDouYinSign(url) {
	const query = url.includes('?') ? url.split('?')[1] : ''
	const xbogus = sign(query, userAgent)
	const newUrl = `${url}&X-Bogus=${xbogus}`
	const ttwid = await getTtwid()
	const msTokens = msToken(107)
	return {
		ttwid,
		xbogus,
		newUrl,
		msToken: msTokens
	}
}

async function GetID(dyurl) {
	const VIDEO_REGEX = /video\/(\d*)/
	const NOTE_REGEX = /note\/(\d*)/
	let item_ids = ''
	const response = await axios.get(dyurl, {
		headers: {
			'user-agent':
				'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
		}
	})

	if (response.request.res.responseUrl.includes('video')) {
		item_ids = VIDEO_REGEX.exec(response.request.res.responseUrl)[1]
	} else if (response.request.res.responseUrl.includes('note')) {
		item_ids = NOTE_REGEX.exec(response.request.res.responseUrl)[1]
	} else {
		console.error('URL格式不匹配任何已知模式')
		return
	}
	return item_ids
}
async function getDouyinVideo(url) {
	if (!url || !url.includes('douyin')) return -1
	try {
		const id = await GetID(url)
		const a_bogus = generate_a_bogus(
			`aweme_id=${id}&aid=1128&version_name=23.5.0&device_platform=android&os_version=2333`,
			userAgent
		)
		console.log('aa', a_bogus)
		const newUrl = `https://www.douyin.com/aweme/v1/web/aweme/detail/?aweme_id=${id}&aid=1128&version_name=23.5.0&device_platform=android&os_version=2333&a_bogus=${a_bogus}`
		const ttwid =
			'1%7ChLa6fHj5BbJT6oC0wXewbRE1DGHKriQAlv5pU8ZBgJI%7C1715163504%7C642d77f9a6de68014afb94ef7e2afd96db86186c8636bd1ad4c30ab87ff8f27f'
		const msToken =
			'Eb7xINrOHXfxSccjaSjPA9nw6hlESQbnDA5kE7Ho5b97YMXXFcTeDX2L32NhJx64tIFpyEz2nj52K3VoOxAIUEQkPcPGJzdRMlwgHBoPTO7'
		const result = await GetInfo(newUrl, ttwid, msToken)
		return result
	} catch (e) {
		console.error(e)
		return -1
	}
}

module.exports = { getDouYinSign, getDouyinVideo }
