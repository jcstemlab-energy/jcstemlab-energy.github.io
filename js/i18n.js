/* Shared, reversible localisation for static text and asynchronously loaded content. */
(function () {
    'use strict';

    const languages = ['en', 'zh-Hans', 'zh-Hant'];
    const normalize = value => String(value).replace(/\s+/g, ' ').trim();

    function fingerprint(text) {
        let hash = 2166136261;
        for (const character of text) {
            hash ^= character.charCodeAt(0);
            hash = Math.imul(hash, 16777619);
        }
        return (hash >>> 0).toString(16);
    }

    function createTranslator(content) {
        const dictionary = new Map();
        for (const [english, simplified, traditional] of content.strings) {
            dictionary.set(normalize(english), { 'zh-Hans': simplified, 'zh-Hant': traditional });
        }

        function translate(source, language) {
            if (language === 'en' || !languages.includes(language)) return source;
            const key = normalize(source);
            const entry = dictionary.get(key);
            let translated = entry && entry[language];
            if (!translated) {
                const cohort = key.match(/^PhD Student @ (\d{2}) (Spring|Summer|Fall|Winter)$/);
                const qualification = key.match(/^(.+?) @ (.+)$/);
                const yearRange = key.match(/^(\d{4}(?:\.\d{2})?)\s*-\s*Now$/i);
                const publications = key.match(/^Accepted Papers in (\d{4})$/);
                const research = key.match(/^Explore our cutting-edge research in (.+)$/);
                const profileLink = key.match(/^View profile: (.+)$/);
                if (cohort) {
                    translated = `博士生 · 20${cohort[1]}年${translate(cohort[2], language)}`;
                } else if (qualification && dictionary.has(qualification[1]) && dictionary.has(qualification[2])) {
                    translated = `${translate(qualification[1], language)} · ${translate(qualification[2], language)}`;
                } else if (yearRange) {
                    translated = `${yearRange[1]} - 至今`;
                } else if (publications) {
                    translated = `${publications[1]}${language === 'zh-Hant' ? '年已錄用論文' : '年已录用论文'}`;
                } else if (research) {
                    const category = content.strings.find(row => row[0].toLowerCase() === research[1]);
                    if (category) translated = `${language === 'zh-Hant' ? '探索我們在以下領域的前沿研究：' : '探索我们在以下领域的前沿研究：'}${translate(category[0], language)}`;
                } else if (profileLink) {
                    translated = `${language === 'zh-Hant' ? '查看個人資料：' : '查看个人资料：'}${profileLink[1]}`;
                } else if (key.includes(' | ') || key.includes(' - ')) {
                    translated = key.split(/( \| | - )/).map(part => translate(part, language)).join('');
                    if (translated === key) translated = undefined;
                }
            }
            if (!translated) return source;
            // Keep whitespace around inline links and icons so layout and spacing survive switching.
            const leading = source.match(/^\s*/)[0];
            const trailing = source.match(/\s*$/)[0];
            return leading + translated + trailing;
        }

        function registerProfiles(data) {
            for (const category of data.categories || []) {
                for (const subcategory of category.subcategories || []) {
                    for (const member of subcategory.members || []) {
                        const translated = content.biographies[member.id];
                        if (!translated || fingerprint(member.biography || '') !== translated.fingerprint) continue;
                        const paragraphs = member.biography.split(/\n\n+/).filter(p => p.trim());
                        if (paragraphs.length !== translated['zh-Hans'].length || paragraphs.length !== translated['zh-Hant'].length) continue;
                        paragraphs.forEach((paragraph, index) => {
                            dictionary.set(normalize(paragraph), {
                                'zh-Hans': translated['zh-Hans'][index],
                                'zh-Hant': translated['zh-Hant'][index]
                            });
                        });
                    }
                }
            }
        }

        return { translate, registerProfiles };
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { createTranslator, fingerprint, languages };
        return;
    }

    const translator = createTranslator(window.JCLabTranslations);
    const originals = new WeakMap();
    const storageKey = 'jcstemlab-language';
    const scriptUrl = document.currentScript.src;
    let language = 'en';
    let scheduled = false;

    function storedLanguage() {
        try { return localStorage.getItem(storageKey); } catch { return null; }
    }

    const requested = new URL(window.location.href).searchParams.get('lang');
    const preferred = languages.includes(requested) ? requested : storedLanguage();
    if (languages.includes(preferred)) language = preferred;
    if (languages.includes(requested)) {
        try { localStorage.setItem(storageKey, language); } catch { /* Direct language links also work without storage. */ }
    }
    document.documentElement.lang = language;

    function excluded(element) {
        return !element || element.closest('script, style, noscript, code, pre, textarea, [data-language-switch], [translate="no"], .pub-content, .pub-venue-label');
    }

    function translateValue(owner, property, read, write) {
        let entries = originals.get(owner);
        if (!entries) { entries = {}; originals.set(owner, entries); }
        const current = read();
        if (!current || !current.trim()) return;
        let entry = entries[property];
        if (!entry || current !== entry.output) entry = { source: current, output: current };
        const output = translator.translate(entry.source, language);
        entries[property] = { source: entry.source, output };
        if (current !== output) write(output);
    }

    function apply() {
        document.documentElement.lang = language;
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (!excluded(node.parentElement)) {
                translateValue(node, 'text', () => node.data, value => { node.data = value; });
            }
        }
        document.querySelectorAll('[title], [alt], [aria-label], [placeholder]').forEach(element => {
            if (excluded(element)) return;
            for (const attribute of ['title', 'alt', 'aria-label', 'placeholder']) {
                if (element.hasAttribute(attribute)) {
                    translateValue(element, attribute, () => element.getAttribute(attribute), value => element.setAttribute(attribute, value));
                }
            }
        });
        translateValue(document, 'title', () => document.title, value => { document.title = value; });
        document.querySelectorAll('[data-language-switch] button').forEach(button => {
            const active = button.dataset.language === language;
            if (button.getAttribute('aria-pressed') !== String(active)) button.setAttribute('aria-pressed', String(active));
        });
    }

    function schedule() {
        if (scheduled) return;
        scheduled = true;
        queueMicrotask(() => { scheduled = false; apply(); });
    }

    function setLanguage(next) {
        if (!languages.includes(next)) return;
        language = next;
        try { localStorage.setItem(storageKey, language); } catch { /* Switching also works with storage disabled. */ }
        // Preserve profile IDs, research category parameters, and the current section anchor.
        const url = new URL(window.location.href);
        url.searchParams.set('lang', language);
        try { history.replaceState(history.state, '', url); } catch { /* Local file previews may disallow this. */ }
        apply();
    }

    function initialize() {
        const switcher = document.createElement('div');
        switcher.className = 'language-switch';
        switcher.dataset.languageSwitch = '';
        switcher.setAttribute('role', 'group');
        switcher.setAttribute('aria-label', 'Language / 语言 / 語言');
        for (const [code, label, description] of [['zh-Hans', '简体', '简体中文'], ['en', 'EN', 'English'], ['zh-Hant', '繁體', '繁體中文']]) {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = label;
            button.lang = code;
            button.dataset.language = code;
            button.setAttribute('aria-label', description);
            button.addEventListener('click', () => setLanguage(code));
            button.addEventListener('keydown', event => event.stopPropagation());
            switcher.appendChild(button);
        }
        const navigation = document.querySelector('.nav-container');
        if (navigation) navigation.insertBefore(switcher, navigation.querySelector('.mobile-toggle'));
        else { switcher.classList.add('language-switch-floating'); document.body.appendChild(switcher); }
        apply();
        new MutationObserver(schedule).observe(document.documentElement, {
            childList: true, subtree: true, characterData: true,
            attributes: true, attributeFilter: ['title', 'alt', 'aria-label', 'placeholder']
        });
        fetch(new URL('../data/team-members.json', scriptUrl)).then(response => {
            if (!response.ok) throw new Error('Translation source unavailable');
            return response.json();
        }).then(data => { translator.registerProfiles(data); apply(); }).catch(error => console.warn(error.message));
    }

    window.JCLabI18n = { setLanguage, getLanguage: () => language, translate: text => translator.translate(text, language) };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize);
    else initialize();
})();
