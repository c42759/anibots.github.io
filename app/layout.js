import './globals.css';

export const metadata = {
    title: 'AniBots | Modular Tactical RPG & Open-Source Game Project',
    description:
        'AniBots is an open-source tactical RPG built in Godot 4.x featuring modular 5-part robots, autonomous Anima Chip AI cores, and persistent hardware degradation. Calling game devs, pixel artists, 3D animators, and UI designers!',
    keywords: [
        'AniBots',
        'Godot 4',
        'Open Source Game',
        'Tactical RPG',
        'Medabots',
        'Modular Robots',
        'Pixel Art',
        '3D Animation',
        'Game Development',
        'GDScript',
    ],
    authors: [{ name: 'AniBots Team', url: 'https://github.com/c42759/AniBots' }],
    openGraph: {
        title: 'AniBots | Open-Source Modular Tactical RPG in Godot 4',
        description:
            'Assemble modular machines, command autonomous AI souls. Calling game devs, pixel artists, 3D animators, and UI designers!',
        url: 'https://github.com/c42759/AniBots',
        siteName: 'AniBots',
        locale: 'en_US',
        type: 'website',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang='en' className='h-full antialiased dark'>
            <body className='min-h-full flex flex-col bg-[#070b12] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200'>
                {children}
            </body>
        </html>
    );
}
