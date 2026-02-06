import { MetadataRoute } from 'next';
import { getTranslations } from 'next-intl/server';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
    const t = await getTranslations('MetaData');

    return {
        name: t('title'),
        short_name: t('shortTitle'),
        description: t('description'),
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
            {
                "src": "icons/icon.svg",
                "sizes": "any",
                "type": "image/svg+xml"
            }
        ],
    };
}