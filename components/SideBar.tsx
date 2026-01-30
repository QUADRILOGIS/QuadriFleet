'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import Image from 'next/image';
import 'primeicons/primeicons.css';
import { useTranslations } from 'next-intl';
import LocaleSwitcher from '@/components/LocaleSwitcher';

export default function SideBar() {
  const t = useTranslations("SideBar");

  const pathname = usePathname();
  const [mobileVisible, setMobileVisible] = useState(false);

  const menuItems = [
    { label: t('home'), icon: 'pi pi-home', path: '/' },
    { label: t('fleetManagement'), icon: 'pi pi-warehouse', path: '/fleet' },
    { label: t('alerts'), icon: 'pi pi-bell', path: '/alerts' },
    { label: t('settings'), icon: 'pi pi-cog', path: '/settings' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full p-4">
      <div className="flex justify-center mb-6">
        <Image
          src="/logo.svg"
          alt={t('logoAlt')}
          width={50}
          height={20}
          priority
        />
      </div>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            onClick={() => setMobileVisible(false)}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-md transition-colors
              ${
                pathname === item.path
                  ? 'bg-primary text-primary-contrast font-medium'
                  : 'text-surface-700 hover:bg-surface-100'
              }
            `}
          >
            <i className={`${item.icon} text-xl`}></i>
            <span className="text-base">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-6 flex flex-col">
        TEMP :
       <LocaleSwitcher />
      </div>
    </div>
  );

  return (
    <>
      <Button
        icon="pi pi-bars"
        onClick={() => setMobileVisible(true)}
        className="lg:hidden fixed top-4 left-4 z-50"
        rounded
        aria-label={t('menu')}
      />
      <Sidebar
        visible={mobileVisible}
        onHide={() => setMobileVisible(false)} 
        className="lg:hidden"
        fullScreen
      >
        {sidebarContent}
      </Sidebar>
      <div className="hidden lg:block w-64 h-screen border-r border-surface-border sticky top-0">
        {sidebarContent}
      </div>
    </>
  );
}
