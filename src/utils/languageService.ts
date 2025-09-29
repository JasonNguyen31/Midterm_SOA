import type { Language } from '../types/auth.types';

const LANGUAGE_KEY = 'app_language';

export const languageService = {
    // Lấy ngôn ngữ đã lưu, mặc định là 'vi'
    getLanguage(): Language {
        const saved = localStorage.getItem(LANGUAGE_KEY);
        return (saved === 'en' || saved === 'vi') ? saved : 'vi';
    },

    // Lưu ngôn ngữ
    setLanguage(language: Language): void {
        localStorage.setItem(LANGUAGE_KEY, language);
        // Dispatch custom event để thông báo cho các component khác
        window.dispatchEvent(new CustomEvent('languageChange', { detail: language }));
    },

    // Subscribe để lắng nghe thay đổi ngôn ngữ
    subscribe(callback: (language: Language) => void): () => void {
        const handler = (event: Event) => {
            const customEvent = event as CustomEvent<Language>;
            callback(customEvent.detail);
        };

        window.addEventListener('languageChange', handler);

        // Return unsubscribe function
        return () => {
            window.removeEventListener('languageChange', handler);
        };
    }
};