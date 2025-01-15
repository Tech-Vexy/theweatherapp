'use client'

import { useState, useEffect } from 'react'
import { Bell, Loader2 } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from 'sonner'

interface NotificationPreferences {
  dailyForecast: boolean
  severeWeather: boolean
}

const STORAGE_KEY = 'weatherNotificationPreferences'

export function NotificationPreferences() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    dailyForecast: false,
    severeWeather: false,
  })

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        // Check notification permission
        if ('Notification' in window) {
          const permission = await Notification.permission
          setNotificationsEnabled(permission === 'granted')
        }

        // Load saved preferences
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          setPreferences(JSON.parse(saved))
        }
      } catch (error) {
        console.error('Error loading preferences:', error)
        toast.error('Failed to load notification preferences')
      } finally {
        setIsLoading(false)
      }
    }

    loadPreferences()
  }, [])

  const handleEnableNotifications = async () => {
    try {
      if (!('Notification' in window)) {
        throw new Error('Notifications not supported')
      }

      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        setNotificationsEnabled(true)
        toast.success('Notifications enabled')
      } else {
        toast.error('Permission denied for notifications')
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      toast.error('Failed to enable notifications')
    }
  }

  const handleSavePreferences = async () => {
    setIsSaving(true)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
      
      // Here you would typically also send to your backend
      // await savePreferencesToServer(preferences)
      
      toast.success('Notification preferences saved')
      setIsOpen(false)
    } catch (error) {
      console.error('Error saving preferences:', error)
      toast.error('Failed to save preferences')
    } finally {
      setIsSaving(false)
    }
  }

  const updatePreference = (key: keyof NotificationPreferences) => (value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  if (isLoading) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Notification Preferences</DialogTitle>
          <DialogDescription>
            Choose which weather notifications you'd like to receive.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!notificationsEnabled ? (
            <Button 
              onClick={handleEnableNotifications}
              disabled={!('Notification' in window)}
            >
              Enable Notifications
            </Button>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <Switch
                  id="daily-forecast"
                  checked={preferences.dailyForecast}
                  onCheckedChange={updatePreference('dailyForecast')}
                />
                <Label htmlFor="daily-forecast">Daily Forecast</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="severe-weather"
                  checked={preferences.severeWeather}
                  onCheckedChange={updatePreference('severeWeather')}
                />
                <Label htmlFor="severe-weather">Severe Weather Alerts</Label>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button 
            onClick={handleSavePreferences} 
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save preferences'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

