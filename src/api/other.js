import axios from 'axios'

export const fetchWeiboUserinfo = (uid = 1189615035) => {
	const config = {
		method: 'get',
		url: `/wbinfo/2/profile/userinfo?c=android&uid=${uid}&s=d2a8f60e&from=10E4295010&gsid=_2A25LIS2HDeRxGeRH71AV-SnMyj-IHXVmdyZPrDV6PUJbkdANLUnMkWpNTaAEYJrh0rnAXMfWAG9k1uierOrdA9Bv`,
		headers: {
			'Content-Type': 'application/json'
		}
	}
	return axios.request(config)
}
