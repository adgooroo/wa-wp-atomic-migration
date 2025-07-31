# User Theme Customization - Site Application
# Пользовательская настройка темы - Приложение Site

This directory contains user-customizable files for the Waboot theme in the **Site application**.
Эта папка содержит пользовательские настройки темы для **приложения Site**.

⚠️ **КРИТИЧЕСКОЕ ПРЕДУПРЕЖДЕНИЕ О ГЛОБАЛЬНОМ ВЛИЯНИИ / CRITICAL GLOBAL IMPACT WARNING**

🚨 **ПРИЛОЖЕНИЕ SITE ЯВЛЯЕТСЯ РОДИТЕЛЬСКОЙ ТЕМОЙ! / SITE APPLICATION IS THE PARENT THEME!**

Эта папка содержит пользовательские настройки темы для приложения Site. **ПРИЛОЖЕНИЕ SITE СОДЕРЖИТ ГЛОБАЛЬНЫЕ СТИЛИ И НАСТРОЙКИ, КОТОРЫЕ МОГУТ ПОВЛИЯТЬ НА ВЕСЬ ПРОЕКТ И ВСЕ ЕГО ПРИЛОЖЕНИЯ.**

This folder contains user theme customizations for the Site application. **THE SITE APPLICATION CONTAINS GLOBAL STYLES AND SETTINGS THAT CAN AFFECT THE ENTIRE PROJECT AND ALL ITS APPLICATIONS.**

**АРХИТЕКТУРА ТЕМ / THEME ARCHITECTURE:**
- **Site** = Родительская тема (Parent Theme) - влияет на весь проект / affects entire project
- **Shop, Blog, Hub, Helpdesk, Mailer** = Дочерние темы (Child Themes) - наследуют от Site / inherit from Site

**ПРЕДУПРЕЖДЕНИЕ:** Поскольку тема приложения Site является родительской темой, а все остальные - дочерними, внесенные изменения в Site могут привести к непредсказуемым последствиям в магазине, блоге, поддержке и других приложениях.

**WARNING:** Since the Site application theme is the parent theme, and all others are child themes, changes made to Site can lead to unpredictable consequences in the shop, blog, support, and other applications.

⚠️ **РЕКОМЕНДАЦИЯ:** Используйте пользовательские настройки внутри нужного приложения, только в крайнем случае в приложении Site!

⚠️ **RECOMMENDATION:** Use user customizations within the specific application, only use Site application as a last resort!

## Подключенные фреймворки и версии / Connected Frameworks and Versions

- **Bootstrap**: 5.3.2
- **Alpine.js**: 3.13.3
- **AOS (Animate On Scroll)**: 2.3.4
- **Font Awesome**: 7.x

## Изоляция настроек по приложениям / Application-Specific Customization

**Каждое приложение Webasyst имеет свою собственную папку user_theme:**
**Each Webasyst application has its own user_theme folder:**

- `wa-apps/site/themes/waboot/user_theme/` - **ГЛОБАЛЬНЫЕ настройки (влияют на весь проект) / GLOBAL settings (affect entire project)**
- `wa-apps/shop/themes/waboot/user_theme/` - **ЛОКАЛЬНЫЕ настройки только для магазина / LOCAL settings for shop only**
- `wa-apps/blog/themes/waboot/user_theme/` - **ЛОКАЛЬНЫЕ настройки только для блога / LOCAL settings for blog only**
- `wa-apps/hub/themes/waboot/user_theme/` - **ЛОКАЛЬНЫЕ настройки только для сообщества / LOCAL settings for community only**
- `wa-apps/helpdesk/themes/waboot/user_theme/` - **ЛОКАЛЬНЫЕ настройки только для поддержки / LOCAL settings for support only**
- `wa-apps/mailer/themes/waboot/user_theme/` - **ЛОКАЛЬНЫЕ настройки только для рассылок / LOCAL settings for email only**

**🚨 КРИТИЧЕСКАЯ РЕКОМЕНДАЦИЯ / CRITICAL RECOMMENDATION:**
**Если вы не хотите вносить изменения на весь проект, а только в какую-то его часть, например в блог или магазин, то ОБЯЗАТЕЛЬНО изменяйте файлы внутри этого приложения, НЕ в приложении Site!**

**If you don't want to make changes to the entire project, but only to a specific part, such as the blog or shop, then DEFINITELY modify files within that specific application, NOT in the Site application!**

**Почему это важно / Why this is important:**
- Изменения в Site влияют на ВСЕ приложения / Changes in Site affect ALL applications
- Изменения в дочерних темах влияют только на конкретное приложение / Changes in child themes affect only the specific application
- Это предотвращает непредсказуемые последствия / This prevents unpredictable consequences

## Структура файлов / File Structure

```
user_theme/
├── css/
│   └── user-custom.css      # Пользовательские CSS стили (ВЫСШИЙ ПРИОРИТЕТ) / User CSS styles (HIGHEST PRIORITY)
├── js/
│   └── user-custom.js       # Пользовательский JavaScript (ВЫСШИЙ ПРИОРИТЕТ) / User JavaScript (HIGHEST PRIORITY)
├── scss/
│   └── user-custom.scss     # Пользовательский SCSS (автокомпиляция) / User SCSS (auto-compilation)
└── README.md                # Этот файл / This file
```

## ⚠️ КРИТИЧЕСКИЕ ПРЕДУПРЕЖДЕНИЯ / CRITICAL WARNINGS

### CSS файлы (css/user-custom.css) / CSS Files
- **Приоритет / Priority**: ВЫСШИЙ - загружаются после всех стилей темы / HIGHEST - loaded after all theme styles
- **Влияние / Impact**: Могут переопределить любые стили темы / Can override any theme styles
- **Рекомендация / Recommendation**: Используйте специфичные селекторы для избежания конфликтов / Use specific selectors to avoid conflicts

### JavaScript файлы (js/user-custom.js) / JavaScript Files
- **Приоритет / Priority**: ВЫСШИЙ - загружаются после всех скриптов темы / HIGHEST - loaded after all theme scripts
- **ОПАСНОСТЬ / DANGER**: Могут конфликтовать с Alpine.js 3.13.3 и другими скриптами / May conflict with Alpine.js 3.13.3 and other scripts
- **Требование / Requirement**: ОБЯЗАТЕЛЬНОЕ тестирование всех изменений / MANDATORY testing of all changes
- **Рекомендация / Recommendation**: Используйте `document.addEventListener('DOMContentLoaded')` для безопасной инициализации / Use `document.addEventListener('DOMContentLoaded')` for safe initialization

### SCSS файлы (scss/user-custom.scss) / SCSS Files
- **Автокомпиляция / Auto-compilation**: Файл автоматически компилируется в CSS / File is automatically compiled to CSS
- **Приоритет / Priority**: ВЫСШИЙ - компилированный CSS загружается с высоким приоритетом / HIGHEST - compiled CSS loads with high priority
- **Преимущество / Advantage**: Доступ к переменным Bootstrap 5.3.2 и миксинам / Access to Bootstrap 5.3.2 variables and mixins

## Рекомендации по использованию / Usage Recommendations

1. **Всегда тестируйте изменения** в тестовой среде перед применением / **Always test changes** in a test environment before applying
2. **Делайте резервные копии** перед внесением изменений / **Make backups** before making changes
3. **Используйте специфичные селекторы** для избежания конфликтов / **Use specific selectors** to avoid conflicts
4. **Проверяйте совместимость** с Alpine.js 3.13.3 при написании JavaScript / **Check compatibility** with Alpine.js 3.13.3 when writing JavaScript
5. **Следите за производительностью** - избыточные стили могут замедлить загрузку / **Monitor performance** - excessive styles can slow down loading

## Примеры безопасного использования / Safe Usage Examples

### CSS (css/user-custom.css)
```css
/* Используйте специфичные селекторы / Use specific selectors */
.waboot-site .user-custom-button {
    background-color: #your-color;
    border-radius: 25px;
}

.waboot-site .user-custom-header {
    background: linear-gradient(45deg, #ff6b6b, #ee5a24);
}

/* Избегайте общих селекторов / Avoid generic selectors */
/* .btn { ... } - НЕ РЕКОМЕНДУЕТСЯ / NOT RECOMMENDED */
```

### JavaScript (js/user-custom.js)
```javascript
// Безопасная инициализация / Safe initialization
document.addEventListener('DOMContentLoaded', function() {
    // Проверяйте существование элементов / Check element existence
    const customElement = document.querySelector('.user-custom-element');
    if (customElement) {
        // Ваш код / Your code
    }
});

// Избегайте конфликтов с Alpine.js / Avoid conflicts with Alpine.js
// Не переопределяйте глобальные функции Alpine / Don't override Alpine global functions
```

### SCSS (scss/user-custom.scss)
```scss
// Используйте переменные Bootstrap / Use Bootstrap variables
$custom-primary: #your-color;

.user-custom-component {
    background-color: $custom-primary;
    border-radius: $border-radius;
    
    &:hover {
        background-color: darken($custom-primary, 10%);
    }
}
```

## 🚨 КРИТИЧЕСКИЕ ЗАМЕЧАНИЯ / CRITICAL NOTES

- **🚨 ИЗМЕНЕНИЯ В SITE ВЛИЯЮТ НА ВЕСЬ ПРОЕКТ! / CHANGES IN SITE AFFECT THE ENTIRE PROJECT!**
- **Любые изменения могут привести к потере функциональности темы / Any changes may lead to loss of theme functionality**
- **Конфликты с Alpine.js 3.13.3 могут нарушить работу интерактивных элементов / Conflicts with Alpine.js 3.13.3 may break interactive elements**
- **Переопределение стилей Bootstrap 5.3.2 может нарушить адаптивность / Overriding Bootstrap 5.3.2 styles may break responsiveness**
- **Всегда проверяйте работу на мобильных устройствах / Always check functionality on mobile devices**
- **Перед внесением изменений в Site ОБЯЗАТЕЛЬНО протестируйте на всех приложениях / Before making changes to Site, MANDATORILY test on all applications**

## Поддержка / Support

При возникновении проблем / When problems occur:
1. **Проверьте, не связана ли проблема с изменениями в Site / Check if the problem is related to changes in Site**
2. Проверьте консоль браузера на наличие ошибок / Check browser console for errors
3. Временно отключите пользовательские файлы для диагностики / Temporarily disable user files for diagnostics
4. Используйте инструменты разработчика для анализа конфликтов / Use developer tools to analyze conflicts
5. **Если проблема в Site, проверьте все приложения на наличие конфликтов / If the problem is in Site, check all applications for conflicts**

## 🎯 Лучшие практики для Site Application / Best Practices for Site Application

1. **Используйте Site только для глобальных изменений / Use Site only for global changes**
2. **Всегда тестируйте изменения на всех приложениях / Always test changes on all applications**
3. **Документируйте все изменения в Site / Document all changes in Site**
4. **Создавайте резервные копии перед изменениями / Create backups before changes**
5. **Рассмотрите возможность создания дочерней темы / Consider creating a child theme** 