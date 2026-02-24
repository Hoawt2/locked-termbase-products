import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Shield, User, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function LoginPage() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [accountId, setAccountId] = useState('');
    const [error, setError] = useState('');

    // Redirect to dashboard if already logged in
    useEffect(() => {
        const role = localStorage.getItem('userRole');
        if (role === 'admin') {
            navigate('/admin/liquidity');
        } else if (role === 'user') {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleLogin = (role: 'admin' | 'user') => {
        if (!accountId.trim()) {
            setError('Please enter your Wallet ID or Admin ID to continue');
            return;
        }

        setError('');
        localStorage.setItem('userRole', role);

        if (role === 'admin') {
            localStorage.setItem('admin_id', accountId.trim());
            navigate('/admin/liquidity');
        } else {
            localStorage.setItem('wallet_id', accountId.trim());
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent/20">
                        <span className="text-accent-foreground font-bold text-2xl">LA</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-muted-foreground">
                        Simulate login by entering an ID and selecting a role
                    </p>
                </div>

                <div className="bg-secondary/30 p-6 rounded-2xl border border-border/50 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="accountId">Account ID</Label>
                        <Input
                            id="accountId"
                            placeholder="Enter Wallet ID or Admin ID"
                            value={accountId}
                            onChange={(e) => {
                                setAccountId(e.target.value);
                                if (error) setError('');
                            }}
                            className={cn("bg-background", error && "border-destructive focus-visible:ring-destructive")}
                        />
                        {error && (
                            <p className="text-sm font-medium text-destructive flex items-center gap-1.5 mt-2">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    {/* User Role Card */}
                    <button
                        onClick={() => handleLogin('user')}
                        className={cn(
                            "p-6 rounded-2xl border-2 transition-all duration-300",
                            "border-border hover:border-accent hover:bg-accent/5",
                            "flex flex-col items-center gap-4 text-center group"
                        )}
                    >
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                            <User className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Investor</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Login using Wallet ID
                            </p>
                        </div>
                    </button>

                    {/* Admin Role Card */}
                    <button
                        onClick={() => handleLogin('admin')}
                        className={cn(
                            "p-6 rounded-2xl border-2 transition-all duration-300",
                            "border-border hover:border-destructive hover:bg-destructive/5",
                            "flex flex-col items-center gap-4 text-center group"
                        )}
                    >
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                            <Shield className="w-6 h-6 text-muted-foreground group-hover:text-destructive transition-colors" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Admin</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Login using Admin ID
                            </p>
                        </div>
                    </button>
                </div>

                <div className="text-center mt-8">
                    <Button variant="ghost" className="text-muted-foreground" onClick={() => navigate('/')}>
                        ← Back to Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
