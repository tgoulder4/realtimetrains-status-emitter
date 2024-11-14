'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown, X } from 'lucide-react'
import { cn } from "@/lib/utils"

type Station = {
    code: string;
    name: string;
}

type StationSelectorProps = {
    label: string;
    value: Station | null;
    onChange: (station: Station | null) => void;
    stations: Station[];
    allowClear?: boolean;
    readOnly?: boolean;
}

export default function StationSelector({ 
    label, 
    value, 
    onChange, 
    stations, 
    allowClear = false, 
    readOnly = false 
}: StationSelectorProps) {
    const [open, setOpen] = useState(false)
    const triggerRef = useRef<HTMLButtonElement>(null)

    const handleSelect = (station: Station) => {
        onChange(station)
        setOpen(false)
        triggerRef.current?.focus()
    }

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!readOnly) {
            onChange(null)
            setOpen(false)
        }
    }

    return (
        <div>
            <span className="text-white text-opacity-80 font-bold mb-2 block">{label}:</span>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        ref={triggerRef}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        aria-readonly={readOnly}
                        className={cn(
                            "w-full justify-between bg-[#222222] border-none text-left rounded-lg font-normal",
                            !value && allowClear && "border-2 border-blue-500",
                            readOnly && "cursor-default"
                        )}
                        onClick={() => !readOnly && setOpen(!open)}
                    >
                        <span>{value ? `${value.name} (${value.code})` : "Select station..."}</span>
                        {!readOnly && value && allowClear ? (
                            <X className="h-4 w-4 text-gray-400" onClick={handleClear} />
                        ) : (
                            <ChevronDown className="h-4 w-4 opacity-50" />
                        )}
                    </Button>
                </PopoverTrigger>
                {!readOnly && (
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command className="bg-[#222222] border-none rounded-lg font-sans">
                            <CommandInput placeholder="Search stations..." className="text-white placeholder-gray-400" />
                            <CommandEmpty className="text-gray-400">No station found.</CommandEmpty>
                            <CommandGroup className="text-white">
                                <CommandList>
                                    {stations.map((station) => (
                                        <CommandItem
                                            key={station.code}
                                            onSelect={() => handleSelect(station)}
                                            className="hover:bg-gray-700 aria-selected:bg-gray-600 aria-selected:text-black"
                                        >
                                            {station.name} ({station.code})
                                        </CommandItem>
                                    ))}
                                </CommandList>
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                )}
            </Popover>
        </div>
    )
}