import { MetadataRoute } from 'next';
import { getTranslations } from 'next-intl/server';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
    const t = await getTranslations('MetaData');

    return {
        name: t('title'),
        short_name: t('shortTitle'),
        description: t('description'),
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
            {
                src: 'logo.svg',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                src: 'logo.svg',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}