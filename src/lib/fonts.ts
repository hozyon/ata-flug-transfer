import { Montserrat, Outfit, Playfair_Display } from 'next/font/google';

export const montserrat = Montserrat({
    subsets: ['latin', 'latin-ext'],
    variable: '--font-montserrat',
    display: 'swap',
});

export const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
    display: 'swap',
});

export const playfair = Playfair_Display({
    subsets: ['latin', 'latin-ext'],
    variable: '--font-playfair',
    display: 'swap',
});
