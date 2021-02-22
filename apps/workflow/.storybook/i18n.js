import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import FR from '../public/static/locales/fr/common.json';
import EN from '../public/static/locales/en/common.json';
import PTBR from '../public/static/locales/pt-BR/common.json';

const resources = {
    en: {
        translation: EN,
    },
    fr: {
        translation: FR,
    },
    'pt-BR': {
        translation: PTBR,
    },
};
export default lng => {
    i18n.use(initReactI18next).init({
        resources,
        lng,
        interpolation: {
            escapeValue: false,
        },
    });
};
