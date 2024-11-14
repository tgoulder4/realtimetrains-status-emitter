import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { CreditCard, User, Trash2 } from 'lucide-react'
import { cn } from "@/lib/utils"

type UserDialogProps = {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    credits: number;
}

export function UserDialog({ activeTab, setActiveTab, credits }: UserDialogProps) {
    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>User Account</DialogTitle>
                <DialogDescription>
                    Manage your account settings and view credit information.
                </DialogDescription>
            </DialogHeader>
            <div className="flex h-[300px]">
                <div className="w-1/3 border-r border-gray-200 dark:border-gray-800">
                    <nav className="flex flex-col space-y-1">
                        <button
                            className={cn(
                                "px-4 py-2 text-sm font-medium text-left",
                                activeTab === 'account'
                                    ? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                            )}
                            onClick={() => setActiveTab('account')}
                        >
                            <User className="w-4 h-4 mr-2 inline-block" />
                            Account
                        </button>
                        <button
                            className={cn(
                                "px-4 py-2 text-sm font-medium text-left",
                                activeTab === 'billing'
                                    ? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                            )}
                            onClick={() => setActiveTab('billing')}
                        >
                            <CreditCard className="w-4 h-4 mr-2 inline-block" />
                            Billing
                        </button>
                    </nav>
                </div>
                <div className="w-2/3 p-4">
                    {activeTab === 'account' && (
                        <div className="space-y-4">
                            <p>Your account details go here.</p>
                            <Button variant="destructive" className="w-full">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Account
                            </Button>
                        </div>
                    )}
                    {activeTab === 'billing' && (
                        <div>
                            <p>Your billing information goes here.</p>
                            <p className="mt-2">Current credits: {credits}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Credits decrease by 1 every minute while using the app.</p>
                        </div>
                    )}
                </div>
            </div>
        </DialogContent>
    )
}