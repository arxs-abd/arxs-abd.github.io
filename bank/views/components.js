import createElement from '../lib/dom.js'

const ALERT_NOTIFICATION = (type, message) => {
	const notification = createElement('div', { class: `notification is-${type}` }, [
		createElement('button', { class: 'delete', onclick: handleRemove }),
		message,
	])

	function handleRemove(event) {
		this.parentElement.remove()
	}

	return notification
}

export { ALERT_NOTIFICATION }
