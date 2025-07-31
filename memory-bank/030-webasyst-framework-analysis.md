# Анализ Webasyst Framework: Структура приложений, тем и API

[Индекс проекта](010-index.md)

## 📋 Резюме по темам и API Webasyst Framework

### 🏗️ Структура приложений (wa-apps)

#### **Доступные приложения:**
- **`site/`** - Приложение для создания сайтов ✅ **НАЙДЕНО**
- **`shop/`** - Приложение для интернет-магазинов ❌ **НЕ НАЙДЕНО** (отдельный репозиторий)
- **`blog/`** - Приложение для блогов ❌ **НЕ НАЙДЕНО** (отдельный репозиторий)
- **`hub/`** - Приложение для сообществ ❌ **НЕ НАЙДЕНО** (отдельный репозиторий)
- **`mailer/`** - Приложение для email-рассылок ❌ **НЕ НАЙДЕНО** (отдельный репозиторий)
- **`helpdesk/`** - Приложение для поддержки клиентов ❌ **НЕ НАЙДЕНО** (отдельный репозиторий)

### 🎨 Структура тем в приложении Site

#### **Доступные темы:**
1. **`default/`** - Стандартная тема Webasyst
2. **`clear/`** - Чистая минималистичная тема
3. **`nifty/`** - Современная тема с расширенным функционалом

#### **Стандартная структура файлов тем:**

```
theme/
├── theme.xml                    # Конфигурация темы
├── index.html                   # Главная страница
├── head.html                    # Секция <head>
├── content.html                 # Основной контент
├── header.section.html          # Шапка сайта
├── footer.section.html          # Подвал сайта
├── blockpage.layout.html        # Макет для страниц блокировки
├── css/                         # Стили (опционально)
├── js/                          # JavaScript (опционально)
└── images/                      # Изображения (опционально)
```

### 📄 Анализ файлов конфигурации тем

#### **theme.xml структура:**

**Default Theme:**
```xml
<theme>
    <name>Default</name>
    <version>1.0</version>
    <description>Default Webasyst theme</description>
    <author>Webasyst</author>
    <settings>
        <!-- Настройки темы -->
    </settings>
</theme>
```

**Nifty Theme:**
```xml
<theme>
    <name>Nifty</name>
    <version>1.0</version>
    <description>Modern responsive theme</description>
    <author>Webasyst</author>
    <parent_theme>default</parent_theme>
    <settings>
        <!-- Расширенные настройки -->
    </settings>
</theme>
```

### 🔧 API и функции Webasyst

#### **Основные API вызовы:**

**Подключение ресурсов:**
```smarty
{$wa->head()}                    # Подключение head секции
{$wa->js()}                      # Подключение JavaScript
{$wa->css()}                     # Подключение CSS
```

**Навигация и контент:**
```smarty
{include file="template.html"}   # Включение шаблонов
{$wa->url()}                     # Генерация URL
{$wa->title()}                   # Заголовок страницы
{$wa->meta()}                    # Мета-теги
```

**Приложение Site:**
```smarty
{$wa->site->pages()}             # Страницы сайта
{$wa->site->blocks()}            # Блоки контента
{$wa->site->settings()}          # Настройки сайта
```

**Приложение Shop (отдельный репозиторий):**
```smarty
{$wa->shop->categories()}        # Категории товаров
{$wa->shop->products()}          # Товары
{$wa->shop->cart()}              # Корзина
{$wa->shop->orders()}            # Заказы
```

**Приложение Blog (отдельный репозиторий):**
```smarty
{$wa->blog->posts()}             # Посты блога
{$wa->blog->categories()}        # Категории блога
{$wa->blog->comments()}          # Комментарии
```

**Приложение Hub (отдельный репозиторий):**
```smarty
{$wa->hub->users()}              # Пользователи сообщества
{$wa->hub->groups()}             # Группы
{$wa->hub->events()}             # События
```

**Приложение Mailer (отдельный репозиторий):**
```smarty
{$wa->mailer->campaigns()}       # Email кампании
{$wa->mailer->subscribers()}     # Подписчики
{$wa->mailer->templates()}       # Шаблоны писем
```

**Приложение Helpdesk (отдельный репозиторий):**
```smarty
{$wa->helpdesk->tickets()}       # Тикеты поддержки
{$wa->helpdesk->categories()}    # Категории тикетов
{$wa->helpdesk->agents()}        # Агенты поддержки
```

### 🏛️ Архитектура наследования тем

#### **Система наследования:**
- **Родительские темы:** Базовые темы в каждом приложении
- **Дочерние темы:** Наследуют от родительских через `parent_theme` в theme.xml
- **Переопределение:** Дочерние темы могут переопределять любые файлы родительской темы

#### **Стандартные пути установки:**
```
wa-apps/site/themes/            # Темы приложения Site
wa-apps/shop/themes/            # Темы приложения Shop
wa-apps/blog/themes/            # Темы приложения Blog
wa-apps/hub/themes/             # Темы приложения Hub
wa-apps/mailer/themes/          # Темы приложения Mailer
wa-apps/helpdesk/themes/        # Темы приложения Helpdesk
```

### 🚨 Критические исправления для проекта Waboot

#### **Правильные API вызовы:**
- ❌ `{$wa->shop->header()}` → ✅ `{$wa->head()}`
- ❌ `{$wa->shop->footer()}` → ✅ `{$wa->js()}`
- ❌ `{wa_navigation}` → ✅ `{include file="navigation.html"}`

#### **Структура тем:**
- ❌ Путаница между Site и Shop темами
- ✅ Чёткое разделение: Site как родительская тема, Shop как дочерняя

#### **Отсутствующие разделы в документации:**
- ❌ Нет информации о theme.xml структуре
- ❌ Нет примеров создания дочерних тем
- ❌ Нет информации о совместимости

### 📊 Выводы

1. **Архитектура Webasyst:** Чёткое разделение приложений с отдельными репозиториями
2. **Система тем:** Стандартизированная структура с поддержкой наследования
3. **API:** Богатый набор функций для работы с контентом и настройками
4. **Документация проекта:** Требует критических исправлений для соответствия реальной архитектуре

### 🔗 Источники

- [Webasyst Framework Repository](https://github.com/webasyst/webasyst-framework)
- [Site App Themes](https://github.com/webasyst/webasyst-framework/tree/master/wa-apps/site/themes)
- Context7 MCP сервисы для актуальной документации

---

**Дата анализа:** 2025-01-16  
**Статус:** Завершён  
**Следующий шаг:** Применение исправлений в документации проекта