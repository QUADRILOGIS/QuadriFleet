'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import {LayoutGrid, BarChart3, Bike, AlertTriangle, Settings, LucideIcon, AlertCircle} from 'lucide-react';

interface MenuItem {
  label: string;
  icon: LucideIcon;
  path: string;
}

export default function SideBar() {
  const t = useTranslations("SideBar");

  const pathname = usePathname();
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  if (isAuthRoute) {
    return null;
  }

  const menuItems: MenuItem[] = [
    { label: t('home'), icon: LayoutGrid, path: '/' },
    { label: t('stats'), icon: BarChart3, path: '/stats' },
    { label: t('fleetManagement'), icon: Bike, path: '/fleet' },
    { label: t('alerts'), icon: AlertTriangle, path: '/alerts' },
    { label: t('incidents'), icon: AlertCircle, path: '/incidents' },
    { label: t('settings'), icon: Settings, path: '/settings' },
  ];

  // Desktop Sidebar Content
  const desktopSidebarContent = (
    <div className="flex flex-col h-full p-4">
      {/* Logo and App Name */}
      <div className="flex items-center gap-3 mb-6">
        <Image
          src="/logo.svg"
          alt={t('logoAlt')}
          width={40}
          height={40}
          priority
        />
        <span className="text-xl font-bold text-gray-800">QuadriFleet</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.path;

            return (
                <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors
                    ${isActive
                        ? 'bg-gray-200 font-medium border-l-4 border-primary text-gray-900'
                        : 'text-surface-700 hover:bg-gray-100'}
                    `}>
                        <IconComponent size={20} />
                        <span className="text-base">{item.label}</span>
                </Link>
            );
        })}
    </nav>

        {/* Footer with LocaleSwitcher */}
      <div className="mt-auto pt-6 flex flex-col">
        <LocaleSwitcher />
      </div>
    </div>
  );


  const mobileBottomNav = (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
      <nav className="flex justify-around items-center h-16 px-4">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`
                flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200
                ${
                  pathname === item.path
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-400 hover:text-gray-600'
                }
              `}
            >
              <IconComponent size={22} />
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>

      {mobileBottomNav}
      <div className="hidden lg:block w-64 h-screen border-r border-gray-200 sticky top-0">
        {desktopSidebarContent}
      </div>
    </>
  );
}
