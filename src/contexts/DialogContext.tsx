'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type DialogContextType = {
    isDialogOpen: boolean
    openDialog: () => void
    closeDialog: () => void
    activeTab: string
    setActiveTab: (tab: string) => void
    credits: number
    fetchCredits: () => Promise<void>
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

export function DialogProvider({ children }: { children: React.ReactNode }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('account')
    const [credits, setCredits] = useState(0)

    const openDialog = () => setIsDialogOpen(true)
    const closeDialog = () => setIsDialogOpen(false)

    const fetchCredits = async () => {
        try {
            const response = await fetch('/api/credits')
            const data = await response.json()
            setCredits(data.credits)
        } catch (error) {
            console.error('Failed to fetch credits:', error)
        }
    }

    useEffect(() => {
        fetchCredits()
    }, [])

    return (
        <DialogContext.Provider value={{ isDialogOpen, openDialog, closeDialog, activeTab, setActiveTab, credits, fetchCredits }}>
            {children}
        </DialogContext.Provider>
    )
}

export function useDialog() {
    const context = useContext(DialogContext)
    if (context === undefined) {
        throw new Error('useDialog must be used within a DialogProvider')
    }
    return context
}