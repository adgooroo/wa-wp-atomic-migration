/*!
 * User Custom JavaScript - Site Application
 * Пользовательский JavaScript - Приложение Site
 * ⚠️ КРИТИЧЕСКОЕ ПРЕДУПРЕЖДЕНИЕ: Этот файл имеет ВЫСШИЙ ПРИОРИТЕТ / CRITICAL WARNING: This file has HIGHEST PRIORITY
 * 
 * Подключенные фреймворки / Connected Frameworks:
 * - Bootstrap: 5.3.2
 * - Alpine.js: 3.13.3
 * - AOS (Animate On Scroll): 2.3.4
 * - Font Awesome: 7.x
 * 
 * ⚠️ ОПАСНОСТЬ КОНФЛИКТОВ / CONFLICT DANGER:
 * Этот файл загружается ПОСЛЕ всех скриптов темы и может конфликтовать с Alpine.js 3.13.3.
 * This file loads AFTER all theme scripts and may conflict with Alpine.js 3.13.3.
 * Любые изменения следует тщательно тестировать, так как конфликты могут привести
 * Any changes should be thoroughly tested as conflicts may lead
 * к потере изначальной функциональности темы.
 * to loss of original theme functionality.
 */

/*
⚠️ ВНИМАНИЕ! Этот файл подключается глобально ко всем приложениям Webasyst. Любые изменения могут повлиять на весь проект, включая Shop, Blog, Hub, Helpdesk, Mailer.
⚠️ WARNING! This file is included globally for all Webasyst applications. Any changes may affect the entire project, including Shop, Blog, Hub, Helpdesk, Mailer.
*/

/* ==========================================================================
   USER CUSTOM JAVASCRIPT - SITE APPLICATION
   ПОЛЬЗОВАТЕЛЬСКИЙ JAVASCRIPT - ПРИЛОЖЕНИЕ SITE
   ========================================================================== */

/*
 * КРИТИЧЕСКИЕ ПРЕДУПРЕЖДЕНИЯ / CRITICAL WARNINGS:
 * 
 * 1. Этот файл имеет ВЫСШИЙ ПРИОРИТЕТ и может переопределить любые функции / This file has HIGHEST PRIORITY and can override any functions
 * 2. Конфликты с Alpine.js 3.13.3 могут нарушить работу интерактивных элементов / Conflicts with Alpine.js 3.13.3 may break interactive elements
 * 3. ОБЯЗАТЕЛЬНО тестируйте все изменения в тестовой среде / MANDATORY testing of all changes in test environment
 * 4. Не переопределяйте глобальные функции Alpine.js / Don't override Alpine.js global functions
 * 5. Используйте безопасную инициализацию с проверкой существования элементов / Use safe initialization with element existence check
 */

/*
// Безопасная инициализация пользовательского кода / Safe initialization of user code
document.addEventListener('DOMContentLoaded', function() {
    console.log('User custom JavaScript loaded for Site application');
    
    // Проверяем, что Alpine.js загружен / Check if Alpine.js is loaded
    if (typeof Alpine !== 'undefined') {
        console.log('Alpine.js detected, user custom code initialized safely');
    } else {
        console.warn('Alpine.js not detected, some functionality may not work');
    }
    
    // Пример безопасного добавления функциональности / Example of safe functionality addition
    const customButtons = document.querySelectorAll('.user-custom-button');
    customButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Ваш пользовательский код / Your custom code
            console.log('Custom button clicked');
        });
    });
});
*/

// Добавьте ваш пользовательский JavaScript код ниже / Add your custom JavaScript code below 