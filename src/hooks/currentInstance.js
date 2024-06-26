import { getCurrentInstance, useCssModule } from 'vue'

export default function useCurrentInstance(props) {
	if (typeof props === 'string') props = [props]
	const { appContext, proxy, parent } = getCurrentInstance()
	const globalProperties = appContext.config.globalProperties
	let style = {}
	props && props.includes('style') && (style = useCssModule())
	return {
		globalProperties,
		proxy,
		parent,
		style
	}
}
