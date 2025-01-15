'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function ServiceWorkerManager() {
    const [isInstallable, setIsInstallable] = useState(false)
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js')
                    .then(async (registration) => {
                        console.log('Service Worker registered with scope:', registration.scope)

                        // Wait for the service worker to be ready
                        if (registration.active) {
                            await setupPeriodicSync(registration)
                        } else {
                            registration.addEventListener('activate', (event) => {
                                event.waitUntil(setupPeriodicSync(registration))
                            })
                        }
                    })
                    .catch((error) => {
                        console.error('Service Worker registration failed:', error)
                    })
            })
        }

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault()
            setDeferredPrompt(e)
            setIsInstallable(true)
        })
    }, [])

    const setupPeriodicSync = async (registration: ServiceWorkerRegistration) => {
        if ('periodicSync' in registration) {
            try {
                const status = await navigator.permissions.query({
                    name: 'periodic-background-sync' as PermissionName,
                })

                if (status.state === 'granted') {
                    await registration.periodicSync.register('update-weather', {
                        minInterval: 30 * 60 * 1000 // 30 minutes
                    })
                    console.log('Periodic sync registered')
                } else {
                    console.log('Periodic sync permission not granted')
                }
            } catch (error) {
                console.error('Error setting up periodic sync:', error)
            }
        } else {
            console.log('Periodic sync not supported')
        }
    }

    const handleInstall = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt()
            deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt')
                } else {
                    console.log('User dismissed the install prompt')
                }
                setDeferredPrompt(null)
                setIsInstallable(false)
            })
        }
    }

    return (
        <>
            {isInstallable && (
                <Button onClick={handleInstall} className="fixed bottom-4 right-4 z-50">
                    Install App
                </Button>
            )}
        </>
    )
}

