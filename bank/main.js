import { getQueryParams } from './app/utility.js'
import pages from './views/router.js'
// Get Page
const page = getQueryParams('page') ?? 'login'

// Show Page
switch (page) {
	case 'login':
		pages.loginPage()
		break
	case 'register':
		pages.registerPage()
		break
	case 'dashboard':
		pages.dashboardPage()
		break
	default:
		pages.loginPage()
}

// function update() {
// 	const url = new URL(window.location)
// 	URL.searchParams.set('page', 'dashboard')
// 	history.replaceState({}, '', url)
// }
