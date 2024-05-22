export const languages = {
    en: 'English',
    es: 'Español',
};

export const defaultLang = 'es';

export const ui = {
    // English
    en: {
        // Navbar
        'Nav.Index': 'Home',
        'Nav.About': 'About',
        'Nav.Posts': 'Posts',
        'Nav.Projects': 'Projects',
        'Nav.Contact': 'Contact',
        'Nav.Theme': 'Theme',
        'Nav.OpenMenu': 'Open menu',

        //Footer
        'Footer.Copyright': '©️ All rights reserved',

        // Errors
        'Error.Title.404': 'Error 404',
        'Error.Message.404': 'Sorry, the page you are looking for does not exist.',
        'Error.Button.404': 'Go back to home',
    },
    // Español
    es: {
        // Navbar
        'Nav.Index': 'Inicio',
        'Nav.About': 'Conoceme',
        'Nav.Posts': 'Publicaciones',
        'Nav.Projects': 'Proyectos',
        'Nav.Contact': 'Contactame',
        'Nav.Theme': 'Tema',
        'Nav.OpenMenu': 'Abrir menú',
        
        //Footer
        'Footer.Copyright': '©️ Todos los derechos reservados',

        //Errores
        'Error.Title.404': 'Error 404',
        'Error.Message.404': 'Lo siento, la página que buscas no existe.',
        'Error.Button.404': 'Volver al inicio',
    }
} as const;