import createElement from '../lib/dom.js'
import { LOGIN_CONTROLLER, REGISTER_CONTROLLER } from '../app/controller.js'
import { ALERT_NOTIFICATION } from './components.js'

const MAIN_CONTAINER = document.querySelector('.container')

const loginPage = (data) => {
	MAIN_CONTAINER.innerHTML = ''

	const usernameInput = createElement('input', { class: 'input', type: 'text', name: 'username', placeholder: 'Enter Username' })
	const passwordInput = createElement('input', { class: 'input', type: 'password', name: 'password', placeholder: 'Enter Password' })

	let alert = null

	// CHECK DATA
	if (data) {
		// CHECK ALERT
		if (data.type === 'alert') {
			alert = ALERT_NOTIFICATION(data.alertType, data.message)
		}
	}

	const container = createElement('div', { id: 'page-login', class: 'columns' }, [
		createElement('div', { class: 'column is-half is-offset-one-quarter' }, [
			createElement('div', { class: 'card p-5' }, [
				alert,
				createElement('form', { class: 'm-5', onsubmit: handleLogin }, [
					createElement('h1', { class: 'title ml-5' }, ['Login to Bank']),
					createElement('div', { class: 'm-5' }, [createElement('label', { for: 'username' }, ['Username']), usernameInput]),
					createElement('div', { class: 'm-5' }, [createElement('label', { for: 'password' }, ['Password']), passwordInput]),
					createElement('div', { class: 'is-flex is-justify-content-space-between' }, [
						createElement('div', { class: 'm-5' }, [createElement('button', { class: 'button is-success is-dark', type: 'submit' }, ['Login'])]),
						createElement('div', { class: 'm-5' }, [createElement('button', { class: 'button is-info is-dark', type: 'button' }, ['Register'])]),
					]),
				]),
			]),
		]),
	])

	MAIN_CONTAINER.appendChild(container)

	function handleLogin(event) {
		event.preventDefault()

		const username = usernameInput.value
		const password = passwordInput.value

		const response = LOGIN_CONTROLLER.login(username, password)

		if (response.status === 'error') {
			registerPage({ type: 'alert', alertType: 'danger', message: response.message })
		} else {
			// dashboardPage()
		}
	}
}

const registerPage = (data) => {
	MAIN_CONTAINER.innerHTML = ''

	const usernameInput = createElement('input', { class: 'input', type: 'text', name: 'username', placeholder: 'Enter Username' })
	const nameInput = createElement('input', { class: 'input', type: 'text', name: 'name', placeholder: 'Enter Fullname' })
	const emailInput = createElement('input', { class: 'input', type: 'email', name: 'email', placeholder: 'Enter Email', autocomplete: 'off' })
	const passwordInput = createElement('input', { class: 'input', type: 'password', name: 'password', placeholder: 'Enter Password' })

	let alert = null

	// CHECK DATA
	if (data) {
		// CHECK ALERT
		if (data.type === 'alert') {
			alert = ALERT_NOTIFICATION(data.alertType, data.message)
		}
	}

	const container = createElement('div', { id: 'page-register', class: 'columns' }, [
		createElement('div', { class: 'column is-half is-offset-one-quarter' }, [
			createElement('div', { class: 'card p-5' }, [
				alert,
				createElement('h1', { class: 'title ml-5' }, ['Register to Bank']),
				createElement('div', { class: 'm-5' }, [createElement('label', { for: 'username' }, ['Username']), usernameInput]),
				createElement('div', { class: 'm-5' }, [createElement('label', { for: 'name' }, ['Fullname']), nameInput]),
				createElement('div', { class: 'm-5' }, [createElement('label', { for: 'email' }, ['Email']), emailInput]),
				createElement('div', { class: 'm-5' }, [createElement('label', { for: 'password' }, ['Password']), passwordInput]),
				createElement('div', { class: 'm-5 is-flex is-justify-content-space-between' }, [
					createElement('button', { class: 'button is-success is-dark', onclick: handleRegister }, ['Register']),
					createElement('button', { class: 'button is-info is-dark' }, ['Login']),
				]),
			]),
		]),
	])

	MAIN_CONTAINER.appendChild(container)

	function handleRegister(event) {
		event.preventDefault()

		const username = usernameInput.value
		const name = nameInput.value
		const email = emailInput.value
		const password = passwordInput.value

		const response = REGISTER_CONTROLLER.register({ username, name, email, password })

		if (response.status === 'error') {
			registerPage({ type: 'alert', alertType: 'danger', message: response.message })
		} else {
			loginPage({ type: 'alert', alertType: 'success', message: 'Register Success' })
		}
	}
}

const dashboardPage = () => {
	ALL_PAGES.forEach((page) => addClass(page, 'is-hidden'))
	removeClass(DASHBOARD_PAGE_CONTAINER, 'is-hidden')
}

function addClass(element, className) {
	if (!element.classList.contains(className)) element.classList.add(className)
}

function removeClass(element, className) {
	if (element.classList.contains(className)) element.classList.remove(className)
}

export default { loginPage, registerPage, dashboardPage }
