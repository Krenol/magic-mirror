import { ErrorComponent } from '../components/error_component/ErrorComponent'

type ErrorType = {
    title?: string
    details?: string
    navigateTo?: string
}

const getErrorDetails = (type: string): ErrorType => {
    switch (type) {
        case 'google_signin_failed': {
            return {
                title: 'Google sign-in failed!',
                details:
                    'We could not sign you in with Google. Please try again from Settings.',
                navigateTo: '/settings',
            }
        }
        default: {
            return {
                title: 'Unknown error!',
                details: 'We have no idea what happened... Please try again!',
            }
        }
    }
}

export default function ErrorPage() {
    const params = new URLSearchParams(window.location.search)
    const type = params.get('type') ?? ''
    const details = getErrorDetails(type)

    return (
        <ErrorComponent
            title={details.title}
            details={details.details}
            navigateBackTo={details.navigateTo ?? '/'}
        />
    )
}
