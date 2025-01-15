'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"

const publicVapidKey = 'BLBz-a9UrMHlVZEVXXmJZmBBZHBXBHXBZHBXBHXB'

async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js')
      console.log('Service Worker registered successfully:', registration)
      return registration
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      return null
    }
  }
  return null
}

async function subscribeUserToPush(registration: ServiceWorkerRegistration) {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    })
    console.log('Push notification subscription successful:', subscription)
    await sendSubscriptionToServer(subscription)
    return subscription
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error)
    return null
  }
}

async function sendSubscriptionToServer(subscription: PushSubscription) {
  const response = await fetch('/api/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscription),
  })
  if (!response.ok) {
    throw new Error('Failed to send subscription to server')
  }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function WeatherNotifications() {
  const [notificationStatus, setNotificationStatus] = useState<'default' | 'granted' | 'denied'>('default')
  const [isSubscribing, setIsSubscribing] = useState(false)

  useEffect(() => {
    const checkPermissionAndSubscription = async () => {
      if ('Notification' in window) {
        const permission = await Notification.permission
        setNotificationStatus(permission)

        if (permission === 'granted') {
          const registration = await registerServiceWorker()
          if (registration) {
            const subscription = await registration.pushManager.getSubscription()
            if (!subscription) {
              promptForNotifications()
            }
          }
        } else if (permission === 'default') {
          promptForNotifications()
        }
      }
    }
    checkPermissionAndSubscription()
  }, [])

  const promptForNotifications = async () => {
    setIsSubscribing(true)
    try {
      const permission = await Notification.requestPermission()
      setNotificationStatus(permission)
      if (permission === 'granted') {
        const registration = await registerServiceWorker()
        if (registration) {
          const subscription = await subscribeUserToPush(registration)
          if (subscription) {
            toast.success('Weather notifications enabled')
          }
        }
      } else if (permission === 'denied') {
        toast.error('Permission denied for notifications')
      }
    } catch (error) {
      console.error('Error enabling notifications:', error)
      toast.error('Failed to enable notifications')
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2" />
          Weather Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notificationStatus === 'default' && (
          <Button onClick={promptForNotifications} disabled={isSubscribing}>
            {isSubscribing ? 'Enabling notifications...' : 'Enable Weather Notifications'}
          </Button>
        )}
        {notificationStatus === 'granted' && (
          <p>You will receive daily weather notifications.</p>
        )}
        {notificationStatus === 'denied' && (
          <p>Notifications are blocked. Please enable them in your browser settings to receive weather updates.</p>
        )}
      </CardContent>
    </Card>
  )
}

