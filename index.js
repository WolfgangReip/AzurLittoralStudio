// Function to fetch translations from JSON files
async function fetchTranslations(lang) {
    try {
        const response = await fetch(`./languages/${lang}.json`);
        const translations = await response.json();
        return translations;
    } catch (error) {
        console.error('Error fetching translations:', error);
        return null;
    }
}

// Function to translate the page
async function translatePage(lang) {
    const translations = await fetchTranslations(lang);
    if (!translations) return;

    document.querySelectorAll('[data-translate]').forEach((el) => {
        const key = el.getAttribute('data-translate');
        el.innerText = translations[key];
    });
}

// Event listener for language switch
document.querySelectorAll('.lang-switch').forEach((btn) => {
    btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        translatePage(lang);
    });
});

// Function to toggle full screen for videos
let isFullscreen = false;
let scrollPosition = 0;

function openFullscreen(elem) {
    if (isFullscreen) return;

    isFullscreen = true;
    scrollPosition = window.scrollY;

    const clone = elem.cloneNode(true);
    clone.classList.add('fullscreen');
    const video = clone.querySelector('.card-video');
    video.controls = true;
    clone.querySelector('.close-btn').style.display = 'block';
    video.play();
    clone.querySelector('.close-btn').onclick = function (event) {
        closeFullscreen(event, clone);
    };

    document.body.appendChild(clone);
    document.body.classList.add('fullscreen-active');
    document.body.classList.add('no-scroll');
}

function closeFullscreen(event, clone) {
    event.stopPropagation();
    const video = clone.querySelector('.card-video');
    video.pause();
    video.controls = false;
    clone.remove();

    isFullscreen = false;
    document.body.classList.remove('fullscreen-active');
    document.body.classList.remove('no-scroll');
    window.scrollTo(0, scrollPosition);
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isFullscreen) {
        const fullscreenElement = document.querySelector('.fullscreen');
        if (fullscreenElement) {
            closeFullscreen(event, fullscreenElement);
        }
    }
});

document.addEventListener('fullscreenchange', function () {
    if (!document.fullscreenElement && isFullscreen) {
        const fullscreenElement = document.querySelector('.fullscreen');
        if (fullscreenElement) {
            closeFullscreen(new Event('fullscreenchange'), fullscreenElement);
        }
    }
});

window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 0) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

var acc = document.getElementsByClassName('faq-question');
for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener('click', function () {
        var faqItem = this.parentElement;
        faqItem.classList.toggle('active');
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + 'px';
        }
    });
}

document
    .getElementById('contact-form')
    .addEventListener('submit', function (event) {
        event.preventDefault();
        const form = event.target;
        const loaderContainer = document.getElementById('loader-container');
        const errorMessage = document.getElementById('error-message');
        const successMessage = document.getElementById('success-message');

        form.style.display = 'none';
        loaderContainer.classList.add('active');

        emailjs.sendForm('service_l8qzb9o', 'template_isnztj5', form).then(
            function (response) {
                console.log('Email sent!', response.status, response.text);
                loaderContainer.classList.remove('active');
                successMessage.style.display = 'flex';
            },
            function (error) {
                console.error('Error sending email:', error);
                loaderContainer.classList.remove('active');
                errorMessage.style.display = 'flex';
            }
        );
    });

document.getElementById('toggle').addEventListener('click', function () {
    this.classList.toggle('active');
    document.getElementById('overlay').classList.toggle('open');
});

const menuLinks = document.querySelectorAll('.overlay-menu ul li a');
menuLinks.forEach((link) => {
    link.addEventListener('click', function () {
        document.getElementById('toggle').classList.remove('active');
        document.getElementById('overlay').classList.remove('open');
    });
});

// Language Selection
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.language-button');
    const elementsToTranslate = document.querySelectorAll('[data-translate]');
    const placeholdersToTranslate = document.querySelectorAll(
        '[data-translate-placeholder]'
    );
    const translations = {
        en: {}, // Empty object to store the translations later
    };

    // Fetch the translations from the JSON file
    const loadTranslations = async () => {
        try {
            const response = await fetch('./languages/en.json');
            const data = await response.json();
            translations.en = data;

            // Apply saved language if it exists in session storage
            const savedLang = sessionStorage.getItem('lang');
            if (savedLang) {
                setLanguage(savedLang);
            } else {
                // Default language is French
                document.querySelector('.language-button.FR').style.color =
                    'cyan';
            }
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    };

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const lang = button.dataset.lang;
            setLanguage(lang);
            sessionStorage.setItem('lang', lang);
        });
    });

    const setLanguage = (lang) => {
        buttons.forEach((btn) => (btn.style.color = 'white'));
        document.querySelector(
            `.language-button.${lang.toUpperCase()}`
        ).style.color = 'cyan';

        if (lang === 'fr') {
            elementsToTranslate.forEach((el) => {
                el.innerHTML = el.dataset.originalText;
            });
            placeholdersToTranslate.forEach((el) => {
                el.placeholder = el.dataset.originalPlaceholder;
            });
        } else {
            elementsToTranslate.forEach((el) => {
                const key = el.dataset.translate;
                const translatedText = translations[lang][key];
                if (translatedText) {
                    el.innerHTML = translatedText;
                }
            });
            placeholdersToTranslate.forEach((el) => {
                const key = el.dataset.translatePlaceholder;
                const translatedPlaceholder = translations[lang][key];
                if (translatedPlaceholder) {
                    el.placeholder = translatedPlaceholder;
                }
            });
        }
    };

    // Store original French text content for fallback
    elementsToTranslate.forEach((el) => {
        el.dataset.originalText = el.innerHTML;
    });
    placeholdersToTranslate.forEach((el) => {
        el.dataset.originalPlaceholder = el.placeholder;
    });

    loadTranslations();
});
