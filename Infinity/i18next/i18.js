import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import en from "./locales/en"
import fr from "./locales/fr"
import de from "./locales/de"
import tr from "./locales/tr"
import ru from "./locales/ru"
import nl from "./locales/nl"

i18n    
    .use(initReactI18next)
    .init({
        debug: false,
        resources: {
            en: { translation: en },
            fr: { translation: fr },
            de: { translation: de },
            tr: { translation: tr },
            ru: { translation: ru },
            nl: { translation: nl }
            
        },
        lng: "fr",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        },
        react: {
            useSuspense: false 
        }
    });
export default i18n;