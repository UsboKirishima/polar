import * as services from '@polar/services'
import servicesDefault from '@polar/services'

console.log('Services object:', services)
console.log('Available keys:', Object.keys(services))
console.log('Services default:', servicesDefault)
console.log('Default keys:', Object.keys(servicesDefault || {}))

if (services.authService) {
    console.log(
        'authService found in services:',
        Object.keys(services.authService)
    )
} else {
    console.log('authService not found in services')
}

if (servicesDefault && servicesDefault.authService) {
    console.log(
        'authService found in default:',
        Object.keys(servicesDefault.authService)
    )
} else {
    console.log('authService not found in default')
}

// Try destructuring from default
try {
    const { authService, userService } = servicesDefault || {}
    console.log('Default destructuring successful')
    console.log('authService from default destructuring:', !!authService)
    console.log('userService from default destructuring:', !!userService)
} catch (error) {
    console.log('Default destructuring failed:', error.message)
}
