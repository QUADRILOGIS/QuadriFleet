'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
    const t = useTranslations('InstallPrompt');
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        setIsIOS(iOS);

        // Détecte si c'est un ordinateur (pas mobile/tablette)
        const desktop = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        setIsDesktop(desktop);

        const standalone = window.matchMedia('(display-mode: standalone)').matches;
        setIsStandalone(standalone);

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            // Si l'événement est disponible, utilise-le
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setShowInstructions(false);
            }
            setDeferredPrompt(null);
        } else {
            // Sinon, affiche les instructions
            setShowInstructions(true);
        }
    };

    // Ne rien afficher si déjà installé
    if (isStandalone) return null;

    return (
        <>
            {/* Bouton flottant toujours visible */}
            <button
                onClick={handleInstall}
                className="fixed bottom-20 right-4 lg:bottom-4 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-900 cursor-pointer transition-all z-50 flex items-center gap-2"
                aria-label={t('install')}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="hidden lg:inline">{t('install')}</span>
            </button>

            {/* Popup d'instructions */}
            {showInstructions && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {t('title')}
                            </h3>
                            <button
                                onClick={() => setShowInstructions(false)}
                                className="hover:text-red-500 cursor-pointer"
                            >
                                <X />
                            </button>
                        </div>

                        {isIOS ? (
                            // Instructions iOS
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600">{t('iosInstructions')}</p>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                                    <li>{t('iosStep1')}</li>
                                    <li>{t('iosStep2')}</li>
                                    <li>{t('iosStep3')}</li>
                                </ol>
                            </div>
                        ) : isDesktop ? (
                            // Instructions Desktop (Chrome/Edge/Brave)
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600">{t('desktopInstructions')}</p>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                                    <li>{t('desktopStep1')}</li>
                                    <li>{t('desktopStep2')}</li>
                                </ol>
                                <p className="text-xs text-gray-500 italic">
                                    {t('visitHint')}
                                </p>
                            </div>
                        ) : (
                            // Instructions Chrome/Android (Mobile)
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600">{t('chromeInstructions')}</p>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                                    <li>{t('chromeStep1')}</li>
                                    <li>{t('chromeStep2')}</li>
                                    <li>{t('chromeStep3')}</li>
                                </ol>
                                <p className="text-xs text-gray-500 italic">
                                    {t('visitHint')}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={() => setShowInstructions(false)}
                            className="mt-6 w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
                        >
                            {t('understood')}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}