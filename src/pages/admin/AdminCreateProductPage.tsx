import { useLanguage } from '@/contexts/LanguageContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    PackagePlus,
    CheckCircle2,
    AlertTriangle,
    ArrowLeft,
    DollarSign,
    Calendar,
    Percent,
    FileText,
} from 'lucide-react';

interface ProductFormData {
    termDays: string;
    interestRate: string;
    minAmount: string;
    maxAmount: string;
    totalQuota: string;
    description: string;
}

interface FormError {
    field?: string;
    message: string;
}

export default function AdminCreateProductPage() {
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [form, setForm] = useState<ProductFormData>({
        termDays: '',
        interestRate: '',
        minAmount: '',
        maxAmount: '',
        totalQuota: '',
        description: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<FormError | null>(null);

    const handleChange = (field: keyof ProductFormData, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (error?.field === field) setError(null);
    };

    const validate = (): FormError | null => {
        const days = parseInt(form.termDays);
        if (!form.termDays || isNaN(days) || days < 1)
            return { field: 'termDays', message: 'Term days must be a positive integer.' };

        const rate = parseFloat(form.interestRate);
        if (!form.interestRate || isNaN(rate) || rate < 0)
            return { field: 'interestRate', message: 'Interest rate must be a non-negative number.' };

        const min = parseFloat(form.minAmount);
        if (!form.minAmount || isNaN(min) || min < 0)
            return { field: 'minAmount', message: 'Min amount must be a non-negative number.' };

        const max = parseFloat(form.maxAmount);
        if (!form.maxAmount || isNaN(max) || max <= min)
            return { field: 'maxAmount', message: 'Max amount must be greater than min amount.' };

        const quota = parseFloat(form.totalQuota);
        if (!form.totalQuota || isNaN(quota) || quota <= 0)
            return { field: 'totalQuota', message: 'Total quota must be a positive number.' };

        if (!form.description.trim())
            return { field: 'description', message: 'Description is required.' };

        return null;
    };

    const handleSubmit = async () => {
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const payload = {
                termDays: parseInt(form.termDays),
                interestRate: Number((parseFloat(form.interestRate) / 100).toFixed(4)), // convert % to decimal, up to 4 decimal places API allows
                minAmount: parseFloat(form.minAmount),
                maxAmount: parseFloat(form.maxAmount),
                totalQuota: parseFloat(form.totalQuota),
                description: form.description.trim(),
            };

            const response = await fetch('/api/cms/locked-products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const result = await response.json().catch(() => ({}));
                throw new Error(result.message || `Server error: ${response.status}`);
            }

            setSuccess(true);
        } catch (err) {
            setError({ message: err instanceof Error ? err.message : 'Something went wrong.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <MainLayout>
                <div className="p-6 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
                    <div className="data-card w-full text-center py-12">
                        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-success" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Product Created!</h2>
                        <p className="text-muted-foreground mb-8">
                            The locked product has been successfully created and is now available.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSuccess(false);
                                    setForm({ termDays: '', interestRate: '', minAmount: '', maxAmount: '', totalQuota: '', description: '' });
                                }}
                            >
                                Create Another
                            </Button>
                            <Button onClick={() => navigate('/admin/liquidity')} className="bg-accent hover:bg-accent/90">
                                Back to Dashboard
                            </Button>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    const fieldClass = (field: string) =>
        `mt-1 ${error?.field === field ? 'border-destructive focus-visible:ring-destructive' : ''}`;

    return (
        <MainLayout>
            <div className="p-6 max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                            <PackagePlus className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Create Locked Product</h1>
                            <p className="text-muted-foreground text-sm">
                                Define a new locked-term savings product for users
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="data-card space-y-6">
                    {/* Error banner */}
                    {error && !error.field && (
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm font-medium">{error.message}</p>
                        </div>
                    )}

                    {/* Row 1: Term Days & Interest Rate */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="termDays" className="flex items-center gap-1.5 mb-1">
                                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                Term Days <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="termDays"
                                type="number"
                                min={1}
                                placeholder="e.g. 30"
                                value={form.termDays}
                                onChange={(e) => handleChange('termDays', e.target.value)}
                                className={fieldClass('termDays')}
                            />
                            {error?.field === 'termDays' && (
                                <p className="text-xs text-destructive mt-1">{error.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="interestRate" className="flex items-center gap-1.5 mb-1">
                                <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                                Interest Rate (%) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="interestRate"
                                type="number"
                                min={0}
                                step="0.01"
                                placeholder="e.g. 5.5"
                                value={form.interestRate}
                                onChange={(e) => handleChange('interestRate', e.target.value)}
                                className={fieldClass('interestRate')}
                            />
                            {error?.field === 'interestRate' && (
                                <p className="text-xs text-destructive mt-1">{error.message}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                                Enter as percentage, e.g. 5.5 for 5.5%
                            </p>
                        </div>
                    </div>

                    {/* Row 2: Min & Max Amount */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="minAmount" className="flex items-center gap-1.5 mb-1">
                                <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                                Min Amount <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative mt-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                                <Input
                                    id="minAmount"
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    placeholder="e.g. 1000"
                                    value={form.minAmount}
                                    onChange={(e) => handleChange('minAmount', e.target.value)}
                                    className={`pl-8 ${error?.field === 'minAmount' ? 'border-destructive' : ''}`}
                                />
                            </div>
                            {error?.field === 'minAmount' && (
                                <p className="text-xs text-destructive mt-1">{error.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="maxAmount" className="flex items-center gap-1.5 mb-1">
                                <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                                Max Amount <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative mt-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                                <Input
                                    id="maxAmount"
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    placeholder="e.g. 100000"
                                    value={form.maxAmount}
                                    onChange={(e) => handleChange('maxAmount', e.target.value)}
                                    className={`pl-8 ${error?.field === 'maxAmount' ? 'border-destructive' : ''}`}
                                />
                            </div>
                            {error?.field === 'maxAmount' && (
                                <p className="text-xs text-destructive mt-1">{error.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Row 3: Total Quota */}
                    <div>
                        <Label htmlFor="totalQuota" className="flex items-center gap-1.5 mb-1">
                            <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                            Total Quota <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative mt-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                            <Input
                                id="totalQuota"
                                type="number"
                                min={0}
                                step="0.01"
                                placeholder="e.g. 5000000"
                                value={form.totalQuota}
                                onChange={(e) => handleChange('totalQuota', e.target.value)}
                                className={`pl-8 ${error?.field === 'totalQuota' ? 'border-destructive' : ''}`}
                            />
                        </div>
                        {error?.field === 'totalQuota' && (
                            <p className="text-xs text-destructive mt-1">{error.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            Maximum total subscription amount allowed for this product
                        </p>
                    </div>

                    {/* Row 4: Description */}
                    <div>
                        <Label htmlFor="description" className="flex items-center gap-1.5 mb-1">
                            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                            Description <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Describe this product to users..."
                            value={form.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={4}
                            className={`mt-1 resize-none ${error?.field === 'description' ? 'border-destructive' : ''}`}
                        />
                        {error?.field === 'description' && (
                            <p className="text-xs text-destructive mt-1">{error.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            {form.description.length}/500 characters
                        </p>
                    </div>

                    {/* Preview Badge */}
                    {form.termDays && form.interestRate && (
                        <div className="p-4 bg-secondary/30 rounded-lg border border-border/50">
                            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Preview</p>
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge className="status-success text-sm px-3 py-1">
                                    {form.termDays}-Day Lock
                                </Badge>
                                <Badge variant="outline" className="text-sm px-3 py-1">
                                    {form.interestRate}% APR
                                </Badge>
                                {form.minAmount && form.maxAmount && (
                                    <Badge variant="outline" className="text-sm px-3 py-1">
                                        ${parseFloat(form.minAmount).toLocaleString()} – ${parseFloat(form.maxAmount).toLocaleString()}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Submit */}
                    <div className="flex justify-end gap-3 pt-2 border-t border-border/50">
                        <Button variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-accent hover:bg-accent/90 gap-2"
                        >
                            <PackagePlus className="w-4 h-4" />
                            {isSubmitting ? 'Creating...' : 'Create Product'}
                        </Button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
