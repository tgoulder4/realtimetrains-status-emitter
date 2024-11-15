'use client'

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Train } from 'lucide-react'
import { useDialog } from '@/contexts/DialogContext'

export function Navbar() {

    return (
        <nav className="navbar sticky top-0 z-50 h-12 bg-black flex items-center justify-between px-4">
            <Train className="h-6 w-6 text-white" />
            <div className="flex items-center space-x-4">
                <Button
                    variant="ghost"
                    className="text-white"
                >
                    100 credits
                </Button>
                <Avatar
                    className="rounded-none h-8 w-8 cursor-pointer border-2 border-white border-opacity-10"
                >
                    <AvatarFallback className="bg-black text-white text-sm">
                        U
                    </AvatarFallback>
                </Avatar>
            </div>
        </nav>
    )
}