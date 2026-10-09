import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
const buttonVariants = cva('inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c95133] disabled:pointer-events-none disabled:opacity-40', { variants: { variant: { default: 'bg-[#191816] text-[#f4f0e7] hover:bg-[#b33f2a]', outline: 'border border-[#191816] bg-transparent text-[#191816] hover:bg-[#191816] hover:text-white', ghost: 'bg-transparent text-current hover:bg-[#e5dfd3]' }, size: { default: 'h-11 px-5 py-2', sm: 'h-9 px-3', lg: 'h-14 px-7 text-base', icon: 'h-10 w-10' } }, defaultVariants: { variant: 'default', size: 'default' } })
function Button({ className, variant, size, asChild = false, ...props }: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?:boolean }) { const Comp = asChild ? Slot : 'button'; return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props}/> }
export { Button, buttonVariants }
