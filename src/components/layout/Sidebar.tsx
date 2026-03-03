import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  History,
  Receipt,
  Bell,
  Droplets,
  Clock,
  Wrench,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ArrowDownToLine,
  PackagePlus,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isAdmin?: boolean;
}

export function Sidebar({ isAdmin: propIsAdmin = false }: SidebarProps) {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  // Check login role
  const role = localStorage.getItem('userRole');
  const isAdmin = propIsAdmin || role === 'admin';

  const userLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/packages', icon: Package, label: t('nav.activePackages') },
    { to: '/withdraw', icon: ArrowDownToLine, label: t('nav.withdraw') },
    { to: '/history', icon: History, label: t('nav.investmentHistory') },
    { to: '/transactions', icon: Receipt, label: t('nav.transactions') },
  ];

  const adminLinks = [
    { to: '/admin/liquidity', icon: Droplets, label: t('nav.liquidity') },
    { to: '/admin/pending', icon: Clock, label: t('nav.pending') },
    { to: '/admin/manual', icon: Wrench, label: t('nav.manual') },
    { to: '/admin/products/create', icon: PackagePlus, label: 'Create Product' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  const handleSwitchAccount = () => {
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col sticky top-16 h-[calc(100vh-4rem)]",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <link.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{link.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-2 border-t border-sidebar-border flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSwitchAccount}
          className="w-full justify-center text-destructive hover:bg-destructive/10 border-destructive hover:text-destructive"
        >
          {collapsed ? (
            <LogOut className="w-4 h-4 ml-2" />
          ) : (
            <>
              <LogOut className="w-4 h-4 mr-2" />
              <span>Switch Account</span>
            </>
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
