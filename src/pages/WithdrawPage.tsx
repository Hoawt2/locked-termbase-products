import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowDownToLine, Info } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

// Mock data structured around the Earnings table DataModel
const earningsData = [
    {
        id: 1,
        productName: '90-Day Lock',
        principal: 50000,
        available: 1540.20,
        holdingDays: 41,
        termDays: 90,
        totalInterest: 986.30,
        interestPerDay: 24.05,
    },
    {
        id: 2,
        productName: '60-Day Lock',
        principal: 30000,
        available: 200.00,
        holdingDays: 25,
        termDays: 60,
        totalInterest: 420.80,
        interestPerDay: 16.83,
    },
    {
        id: 3,
        productName: '30-Day Lock',
        principal: 10000,
        available: 0,
        holdingDays: 8,
        termDays: 30,
        totalInterest: 58.20,
        interestPerDay: 7.27,
    },
];

function WithdrawActionDialog({ earning }: { earning: typeof earningsData[0] }) {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [amount, setAmount] = useState<string>('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState<string>('');

    const parsedAmount = parseFloat(amount || '0');

    const handleConfirm = () => {
        if (parsedAmount <= 0) {
            setError(t('withdraw.errorMin') || 'Please enter a valid amount greater than 0.');
            return;
        }
        if (parsedAmount > earning.available) {
            setError(t('withdraw.errorMax') || 'Withdrawal amount exceeds available balance.');
            return;
        }

        setError('');
        setIsConfirming(true);

        // Simulate network delay
        setTimeout(() => {
            setIsConfirming(false);
            setIsOpen(false);
            setAmount('');
        }, 1500);
    };

    const handleMaxClick = () => {
        setAmount(earning.available.toString());
        setError('');
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setAmount('');
            setError('');
        }
    };

    if (earning.available <= 0) {
        return (
            <Button variant="outline" size="sm" disabled>
                <ArrowDownToLine className="w-4 h-4 mr-1" />
                {t('packages.withdraw') || 'Withdraw'}
            </Button>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-accent hover:text-accent hover:bg-accent/10 border-accent/20">
                    <ArrowDownToLine className="w-4 h-4 mr-1" />
                    {t('packages.withdraw') || 'Withdraw'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('withdraw.title') || 'Withdraw Available Amount'}</DialogTitle>
                    <DialogDescription>
                        {t('withdraw.enterAmount') || 'Enter the amount you wish to withdraw to your wallet.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="p-4 bg-secondary/50 rounded-lg flex justify-between items-center mb-4">
                        <span className="text-muted-foreground">{t('withdraw.availableToWithdraw') || 'Available to Withdraw'}</span>
                        <span className="text-xl font-bold text-accent">${earning.available.toLocaleString()}</span>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {t('common.amount') || 'Amount'}
                        </label>
                        <div className="relative relative-input flex items-center">
                            <span className="absolute left-3 text-muted-foreground">$</span>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => {
                                    setAmount(e.target.value);
                                    setError('');
                                }}
                                className={`pl-7 pr-16 ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                min="0"
                                step="0.01"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 h-7 text-xs text-accent hover:text-accent font-semibold"
                                onClick={handleMaxClick}
                            >
                                MAX
                            </Button>
                        </div>
                        {error && <p className="text-xs text-destructive">{error}</p>}
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => handleOpenChange(false)}>{t('common.cancel')}</Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isConfirming || !amount || parsedAmount <= 0}
                        className="bg-accent hover:bg-accent/90"
                    >
                        {isConfirming ? t('common.loading') : t('common.confirm')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function WithdrawPage() {
    const { t } = useLanguage();

    return (
        <MainLayout>
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-1">{t('nav.withdraw') || 'Withdraw Available'}</h1>
                    <p className="text-muted-foreground">
                        {t('withdraw.subtitle') || 'Withdraw your accumulated interest and available funds.'}
                    </p>
                </div>

                {/* WithdrawTable */}
                <div className="data-card overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="fintech-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>{t('packages.principal') || 'Principal'}</th>
                                    <th>
                                        <div className="flex items-center gap-1">
                                            {t('withdraw.availableToWithdraw') || 'Available'}
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Info className="w-3.5 h-3.5 text-muted-foreground" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Total funds currently available for immediate withdrawal</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </th>
                                    <th>{t('packages.accruedInterest') || 'Total Interest'}</th>
                                    <th>{t('packages.holdingDays') || 'Holding Days'}</th>
                                    <th>
                                        <div className="flex items-center gap-1">
                                            {t('packages.progress') || 'Progress'}
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Info className="w-3.5 h-3.5 text-muted-foreground" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{t('tooltip.progress') || 'Time elapsed within the lock term'}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </th>
                                    <th>{t('common.action') || 'Action'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {earningsData.map((earning) => {
                                    const progress = Math.round((earning.holdingDays / earning.termDays) * 100);
                                    return (
                                        <tr key={earning.id}>
                                            <td>
                                                <div className="font-medium">{earning.productName}</div>
                                            </td>
                                            <td className="text-muted-foreground">${earning.principal.toLocaleString()}</td>
                                            <td className="font-bold text-accent">
                                                ${earning.available.toLocaleString()}
                                            </td>
                                            <td className="text-success font-medium">
                                                +${earning.totalInterest.toLocaleString()}
                                            </td>
                                            <td>
                                                {earning.holdingDays} / {earning.termDays} {t('common.days')}
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <div className="progress-track w-20">
                                                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">{progress}%</span>
                                                </div>
                                            </td>
                                            <td>
                                                <WithdrawActionDialog earning={earning} />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {earningsData.length === 0 && (
                    <div className="data-card text-center py-12">
                        <p className="text-muted-foreground">{t('packages.noPackages') || 'No earnings data found.'}</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
