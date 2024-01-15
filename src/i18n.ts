
import { addMessages, getLocaleFromNavigator, init } from 'svelte-i18n';

import en from './locales/en.json'
import fr from './locales/fr.json'

export function initLang() {
    addMessages('en', en);
    addMessages('fr', fr);
    init({
        fallbackLocale: 'fr',
        initialLocale: 'en', //getLocaleFromNavigator(),
    });
}
