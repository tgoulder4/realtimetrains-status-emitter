import React from 'react'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Service } from '@/lib/types'
import { Check, ChevronsUpDown } from 'lucide-react'
type Props = {
    form: UseFormReturn<any>,
    _options: { label: string, value: string }[],
    defaultOption?: { label: string, value: string }
    onSubmit: (data: any) => void
}

function DeparturesComboBoxFormField({
    form, _options, onSubmit
}: Props) {
    //add a clear value to options
    const options = [
        { label: "Clear", value: "" },
        ..._options];
    return (
        <FormField
            control={form.control}
            name="dest"
            render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    type='button'
                                    className={cn(
                                        "justify-between bg-zinc-800 border-zinc-800/90 text-white font-bold rounded-none",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value
                                        ? options.find(
                                            (station) => station.value === field.value
                                        )?.label
                                        : "Select a station..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                            <Command>
                                <CommandInput placeholder="Search stations..." />
                                <CommandList>
                                    <CommandEmpty>No stations found.</CommandEmpty>
                                    <CommandGroup>
                                        {options.map((option) => (
                                            <CommandItem
                                                value={option.label}
                                                key={option.value}
                                                className={`${option.value === "" ? "text-white/40" : ""}`}
                                                onSelect={() => {
                                                    form.setValue("dest", option.value);
                                                    form.handleSubmit(onSubmit)();
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        option.value === field.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {option.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default DeparturesComboBoxFormField