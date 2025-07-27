# Руководство по семантической вёрстке для Webasyst
## Стек: Bootstrap 5 + Alpine.js + BEM + Atomic Design

### **СОДЕРЖАНИЕ**

1. [Введение и принципы](#1-введение-и-принципы)
2. [Архитектурные основы](#2-архитектурные-основы)
3. [Семантическая HTML структура](#3-семантическая-html-структура)
4. [BEM методология для Webasyst](#4-bem-методология-для-webasyst)
5. [Atomic Design в системе тем](#5-atomic-design-в-системе-тем)
6. [Bootstrap 5 интеграция](#6-bootstrap-5-интеграция)
7. [Alpine.js реактивность](#7-alpinejs-реактивность)
8. [Доступность и универсальный дизайн](#8-доступность-и-универсальный-дизайн)
9. [SEO оптимизация и JSON-LD](#9-seo-оптимизация-и-json-ld)
10. [Практические паттерны](#10-практические-паттерны)

---

## **1. ВВЕДЕНИЕ И ПРИНЦИПЫ**

### **1.1 Философия современной семантической вёрстки**

В 2025 году семантическая вёрстка переросла из рекомендации в обязательное требование для создания качественных, доступных и производительных веб-интерфейсов. Особенно это критично для CMS-систем как Webasyst, где контент создают пользователи с разным уровнем технических знаний.

**Ключевые принципы:**
- **Семантичность первична** — HTML структура должна описывать смысл, а не внешний вид
- **Доступность по умолчанию** — код должен работать для всех пользователей без дополнительных усилий
- **Прогрессивные улучшения** — базовая функциональность без JavaScript, улучшения с ним
- **Мобиль в приоритете** — mobile-first подход во всех аспектах разработки

### **1.2 Интеграция с экосистемой Webasyst**

Webasyst Framework предоставляет уникальную архитектуру наследования тем, которая требует особого подхода к организации кода:

```
Родительская тема (site:default)
├── Базовые компоненты
├── Общие стили и скрипты
├── Семантические паттерны
└── Дочерние темы (наследование)
    ├── Shop-Script
    ├── Blog
    ├── Hub
    ├── Mailer
    └── Photos
```

---

## **2. АРХИТЕКТУРНЫЕ ОСНОВЫ**

### **2.1 Принципы архитектуры**

**Иерархия приоритетов (сверху вниз):**
1. **Семантика HTML** — правильные теги для правильного контента
2. **Доступность** — WCAG 2.2 AA как минимальный стандарт
3. **Производительность** — Core Web Vitals в зелёной зоне
4. **Визуальный дизайн** — эстетика не должна нарушать функциональность

### **2.2 Технологический стек**

```html
<!-- Базовая HTML5 структура с правильной семантикой -->
<!DOCTYPE html>
<html lang="ru" itemscope itemtype="https://schema.org/WebSite">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Custom CSS (BEM + Atomic) -->
    <link href="{$wa_theme_url}css/atoms.css" rel="stylesheet">
    <link href="{$wa_theme_url}css/molecules.css" rel="stylesheet">
    <link href="{$wa_theme_url}css/organisms.css" rel="stylesheet">
    <link href="{$wa_theme_url}css/templates.css" rel="stylesheet">
    
    <!-- Preload критичных ресурсов -->
    <link rel="preload" href="{$wa_theme_url}fonts/main.woff2" as="font" type="font/woff2" crossorigin>
</head>
<body>
    <!-- Alpine.js перед закрывающим body для прогрессивных улучшений -->
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

---

## **3. СЕМАНТИЧЕСКАЯ HTML СТРУКТУРА**

### **3.1 Основные принципы семантичности**

Семантическая разметка — это использование HTML-элементов в соответствии с их смысловым назначением, а не визуальным отображением.

**Правильная иерархия заголовков:**
```html
<h1>Главный заголовок страницы (один на страницу)</h1>
  <h2>Раздел первого уровня</h2>
    <h3>Подраздел</h3>
    <h3>Ещё подраздел</h3>
  <h2>Раздел первого уровня</h2>
    <h3>Подраздел</h3>
      <h4>Под-подраздел</h4>
```

### **3.2 Семантические элементы HTML5**

**Структурные элементы:**

```html
<!-- Основная структура страницы -->
<header class="site-header" role="banner">
    <nav class="site-navigation" role="navigation" aria-label="Главная навигация">
        <!-- Навигация -->
    </nav>
</header>

<main class="site-main" role="main" id="main-content">
    <article class="content-article" itemscope itemtype="https://schema.org/Article">
        <header class="content-article__header">
            <h1 class="content-article__title" itemprop="headline">Заголовок статьи</h1>
            <time class="content-article__date" datetime="2025-07-27" itemprop="datePublished">27 июля 2025</time>
        </header>
        
        <div class="content-article__body" itemprop="articleBody">
            <!-- Основной контент -->
        </div>
        
        <footer class="content-article__footer">
            <!-- Метаинформация статьи -->
        </footer>
    </article>
    
    <aside class="site-sidebar" role="complementary" aria-label="Дополнительная информация">
        <!-- Боковая панель -->
    </aside>
</main>

<footer class="site-footer" role="contentinfo">
    <!-- Подвал сайта -->
</footer>
```

### **3.3 Интерактивные элементы**

**Кнопки и ссылки:**
```html
<!-- Кнопка для действий -->
<button type="button" class="btn btn--primary" aria-describedby="btn-help">
    Отправить форму
</button>
<div id="btn-help" class="visually-hidden">
    Отправляет форму на сервер для обработки
</div>

<!-- Ссылка для навигации -->
<a href="/products" class="link link--primary" aria-current="page">
    Каталог товаров
</a>

<!-- Ссылка, которая ведёт себя как кнопка -->
<a href="#modal" class="btn btn--secondary" role="button" 
   aria-haspopup="dialog" aria-expanded="false">
    Открыть модальное окно
</a>
```

**Формы с правильной доступностью:**
```html
<form class="form form--contact" novalidate>
    <fieldset class="form__fieldset">
        <legend class="form__legend">Контактная информация</legend>
        
        <div class="form__group">
            <label for="name" class="form__label">
                Имя <span class="form__required" aria-label="обязательное поле">*</span>
            </label>
            <input type="text" id="name" name="name" class="form__input" 
                   required aria-describedby="name-error name-help"
                   autocomplete="given-name">
            <div id="name-help" class="form__help">
                Введите ваше полное имя
            </div>
            <div id="name-error" class="form__error" role="alert" aria-live="polite">
                <!-- Ошибка появится здесь -->
            </div>
        </div>
        
        <div class="form__group">
            <label for="email" class="form__label">Email</label>
            <input type="email" id="email" name="email" class="form__input" 
                   required aria-describedby="email-error"
                   autocomplete="email">
            <div id="email-error" class="form__error" role="alert" aria-live="polite">
                <!-- Ошибка появится здесь -->
            </div>
        </div>
    </fieldset>
    
    <button type="submit" class="btn btn--primary form__submit">
        Отправить сообщение
    </button>
</form>
```

---

## **4. BEM МЕТОДОЛОГИЯ ДЛЯ WEBASYST**

### **4.1 Основы BEM**

BEM (Block Element Modifier) — методология именования CSS-классов, которая создаёт предсказуемую, понятную и масштабируемую архитектуру стилей.

**Синтаксис:**
- **Блок** — независимый компонент (`.site-header`)
- **Элемент** — часть блока (`.site-header__logo`)
- **Модификатор** — вариация блока или элемента (`.site-header--transparent`)

### **4.2 Адаптация BEM для Webasyst**

**Пространства имён для приложений:**
```css
/* Для темы Site */
.site-header { }
.site-header__logo { }
.site-header__navigation { }
.site-header--transparent { }

/* Для темы Shop-Script */
.shop-product { }
.shop-product__image { }
.shop-product__title { }
.shop-product--featured { }

/* Для темы Blog */
.blog-post { }
.blog-post__content { }
.blog-post__meta { }
.blog-post--draft { }
```

**Практические примеры для Webasyst:**

```html
<!-- Карточка товара в Shop-Script -->
<article class="shop-product" itemscope itemtype="https://schema.org/Product">
    <header class="shop-product__header">
        <img src="{$product.image}" alt="{$product.name}" 
             class="shop-product__image" itemprop="image">
        
        {if $product.badge}
        <span class="shop-product__badge shop-product__badge--{$product.badge}">
            {$product.badge_text}
        </span>
        {/if}
    </header>
    
    <div class="shop-product__content">
        <h3 class="shop-product__title" itemprop="name">
            <a href="{$product.url}" class="shop-product__link">
                {$product.name}
            </a>
        </h3>
        
        <div class="shop-product__price" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
            {if $product.compare_price}
            <span class="shop-product__price-old">
                {$product.compare_price}
            </span>
            {/if}
            <span class="shop-product__price-current" itemprop="price" content="{$product.price}">
                {$product.price_formatted}
            </span>
        </div>
    </div>
    
    <footer class="shop-product__actions">
        <button type="button" class="btn btn--primary shop-product__cart-btn"
                data-product-id="{$product.id}"
                x-data="{ loading: false }"
                x-on:click="addToCart"
                x-bind:disabled="loading">
            <span x-show="!loading">В корзину</span>
            <span x-show="loading" class="visually-hidden">Добавление...</span>
        </button>
    </footer>
</article>
```

### **4.3 Модификаторы состояний**

```css
/* Состояния элементов */
.form__input { }
.form__input--valid { }
.form__input--invalid { }
.form__input--disabled { }

/* Размеры компонентов */
.btn { }
.btn--small { }
.btn--large { }

/* Цветовые вариации */
.alert { }
.alert--success { }
.alert--warning { }
.alert--error { }
```

---

## **5. ATOMIC DESIGN В СИСТЕМЕ ТЕМ**

### **5.1 Пятиуровневая система**

Atomic Design в контексте Webasyst организует компоненты по иерархии сложности:

**Структура папок:**
```
themes/
├── atoms/          # Базовые элементы
│   ├── buttons/
│   ├── inputs/
│   ├── icons/
│   └── typography/
├── molecules/      # Простые группы атомов
│   ├── forms/
│   ├── cards/
│   └── navigation/
├── organisms/      # Сложные компоненты
│   ├── header/
│   ├── footer/
│   └── product-grid/
├── templates/      # Каркасы страниц
│   ├── layouts/
│   └── page-types/
└── pages/          # Конкретные страницы
    ├── home/
    ├── catalog/
    └── product/
```

### **5.2 Атомы (Atoms)**

**Кнопки:**
```html
<!-- atoms/buttons/button.html -->
<button type="{$type|default:'button'}" 
        class="btn {if $modifier}btn--{$modifier}{/if} {$class}"
        {if $disabled}disabled{/if}
        {if $aria_label}aria-label="{$aria_label}"{/if}>
    {if $icon_before}
        <i class="btn__icon btn__icon--before {$icon_before}" aria-hidden="true"></i>
    {/if}
    <span class="btn__text">{$text}</span>
    {if $icon_after}
        <i class="btn__icon btn__icon--after {$icon_after}" aria-hidden="true"></i>
    {/if}
</button>
```

**Поля ввода:**
```html
<!-- atoms/inputs/input.html -->
<div class="input-wrapper {if $error}input-wrapper--error{/if}">
    {if $label}
    <label for="{$id}" class="input__label">
        {$label}
        {if $required}<span class="input__required" aria-label="обязательное поле">*</span>{/if}
    </label>
    {/if}
    
    <input type="{$type|default:'text'}" 
           id="{$id}" 
           name="{$name}" 
           class="input {if $modifier}input--{$modifier}{/if}"
           {if $placeholder}placeholder="{$placeholder}"{/if}
           {if $required}required{/if}
           {if $disabled}disabled{/if}
           {if $autocomplete}autocomplete="{$autocomplete}"{/if}
           {if $aria_describedby}aria-describedby="{$aria_describedby}"{/if}
           value="{$value}">
    
    {if $help}
    <div id="{$id}-help" class="input__help">{$help}</div>
    {/if}
    
    {if $error}
    <div id="{$id}-error" class="input__error" role="alert" aria-live="polite">
        {$error}
    </div>
    {/if}
</div>
```

### **5.3 Молекулы (Molecules)**

**Форма поиска:**
```html
<!-- molecules/search/search-form.html -->
<form class="search-form" role="search" method="get" action="{$search_url}">
    <div class="search-form__wrapper">
        <label for="search-query" class="visually-hidden">Поиск по сайту</label>
        <input type="search" 
               id="search-query" 
               name="query" 
               class="search-form__input"
               placeholder="Поиск..."
               value="{$query}"
               autocomplete="off"
               x-data="{ query: '{$query}' }"
               x-model="query">
        
        <button type="submit" class="search-form__submit" aria-label="Выполнить поиск">
            <i class="icon icon--search" aria-hidden="true"></i>
        </button>
    </div>
    
    {if $suggestions}
    <div class="search-form__suggestions" 
         x-show="query.length > 2"
         x-transition:enter="transition ease-out duration-200"
         x-transition:enter-start="opacity-0 scale-95"
         x-transition:enter-end="opacity-100 scale-100">
        <!-- Автодополнение -->
    </div>
    {/if}
</form>
```

### **5.4 Организмы (Organisms)**

**Шапка сайта:**
```html
<!-- organisms/header/site-header.html -->
<header class="site-header" role="banner" 
        x-data="{ mobileMenuOpen: false, searchOpen: false }">
    
    <div class="site-header__container container">
        <!-- Логотип -->
        <div class="site-header__brand">
            <a href="{$wa->getUrl()}" class="site-header__logo" aria-label="На главную">
                {if $logo_image}
                    <img src="{$logo_image}" alt="{$site_name}" class="site-header__logo-image">
                {else}
                    <span class="site-header__logo-text">{$site_name}</span>
                {/if}
            </a>
        </div>
        
        <!-- Основная навигация -->
        <nav class="site-header__nav" role="navigation" aria-label="Основная навигация">
            <ul class="site-header__menu">
                {foreach $main_menu as $item}
                <li class="site-header__menu-item">
                    <a href="{$item.url}" 
                       class="site-header__menu-link {if $item.active}site-header__menu-link--active{/if}"
                       {if $item.active}aria-current="page"{/if}>
                        {$item.name}
                    </a>
                    
                    {if $item.children}
                    <ul class="site-header__submenu">
                        {foreach $item.children as $child}
                        <li class="site-header__submenu-item">
                            <a href="{$child.url}" class="site-header__submenu-link">
                                {$child.name}
                            </a>
                        </li>
                        {/foreach}
                    </ul>
                    {/if}
                </li>
                {/foreach}
            </ul>
        </nav>
        
        <!-- Утилиты -->
        <div class="site-header__utils">
            <!-- Поиск -->
            <button type="button" class="site-header__search-toggle"
                    x-on:click="searchOpen = !searchOpen"
                    aria-label="Открыть поиск"
                    x-bind:aria-expanded="searchOpen">
                <i class="icon icon--search" aria-hidden="true"></i>
            </button>
            
            <!-- Корзина (для Shop-Script) -->
            {if $wa->appExists('shop')}
            <a href="{$wa->getUrl('shop')}cart/" class="site-header__cart" 
               aria-label="Корзина ({$cart_count} товаров)">
                <i class="icon icon--cart" aria-hidden="true"></i>
                {if $cart_count}
                <span class="site-header__cart-count" aria-hidden="true">{$cart_count}</span>
                {/if}
            </a>
            {/if}
            
            <!-- Мобильное меню -->
            <button type="button" class="site-header__mobile-toggle d-lg-none"
                    x-on:click="mobileMenuOpen = !mobileMenuOpen"
                    aria-label="Открыть меню"
                    x-bind:aria-expanded="mobileMenuOpen">
                <span class="hamburger">
                    <span class="hamburger__line"></span>
                    <span class="hamburger__line"></span>
                    <span class="hamburger__line"></span>
                </span>
            </button>
        </div>
    </div>
    
    <!-- Мобильное меню -->
    <div class="site-header__mobile-menu d-lg-none"
         x-show="mobileMenuOpen"
         x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="opacity-0 -translate-y-4"
         x-transition:enter-end="opacity-100 translate-y-0"
         x-trap="mobileMenuOpen">
        <!-- Мобильная навигация -->
    </div>
    
    <!-- Поиск -->
    <div class="site-header__search"
         x-show="searchOpen"
         x-transition
         x-trap="searchOpen">
        {include file="molecules/search/search-form.html"}
    </div>
</header>
```

---

## **6. BOOTSTRAP 5 ИНТЕГРАЦИЯ**

### **6.1 Настройка Bootstrap для Webasyst**

**Кастомизация переменных:**
```scss
// _variables.scss
// Переопределение Bootstrap переменных для брендинга Webasyst

// Цветовая палитра
$primary: #007bff;    // Основной цвет темы
$secondary: #6c757d;  // Вторичный цвет
$success: #28a745;    // Успех
$info: #17a2b8;       // Информация
$warning: #ffc107;    // Предупреждение
$danger: #dc3545;     // Ошибка

// Типографика
$font-family-sans-serif: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-size-base: 1rem;
$line-height-base: 1.6;

// Отступы
$spacer: 1rem;
$spacers: (
  0: 0,
  1: $spacer * 0.25,
  2: $spacer * 0.5,
  3: $spacer,
  4: $spacer * 1.5,
  5: $spacer * 3,
  6: $spacer * 4
);

// Брейкпоинты
$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px
);
```

### **6.2 Компонентная архитектура с Bootstrap**

**Использование utility-классов:**
```html
<!-- Карточка продукта с Bootstrap утилитами -->
<article class="shop-product card h-100 shadow-sm">
    <div class="shop-product__image-wrapper position-relative overflow-hidden">
        <img src="{$product.image}" 
             alt="{$product.name}"
             class="shop-product__image card-img-top object-fit-cover"
             style="aspect-ratio: 1/1;">
        
        {if $product.discount}
        <span class="shop-product__badge badge bg-danger position-absolute top-0 end-0 m-2">
            -{$product.discount}%
        </span>
        {/if}
    </div>
    
    <div class="card-body d-flex flex-column">
        <h3 class="shop-product__title card-title h6 mb-2">
            <a href="{$product.url}" class="stretched-link text-decoration-none">
                {$product.name}
            </a>
        </h3>
        
        <div class="shop-product__price mt-auto">
            {if $product.compare_price}
            <span class="shop-product__price-old text-muted text-decoration-line-through small">
                {$product.compare_price}
            </span>
            {/if}
            <span class="shop-product__price-current fw-bold fs-5 text-primary">
                {$product.price_formatted}
            </span>
        </div>
    </div>
    
    <div class="card-footer bg-transparent border-0 pt-0">
        <button type="button" 
                class="btn btn-primary w-100"
                x-data="{ loading: false }"
                x-on:click="addToCart($event)"
                x-bind:disabled="loading">
            <span x-show="!loading" class="d-flex align-items-center justify-content-center">
                <i class="icon icon--cart me-2" aria-hidden="true"></i>
                В корзину
            </span>
            <span x-show="loading" class="d-flex align-items-center justify-content-center">
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Добавление...
            </span>
        </button>
    </div>
</article>
```

### **6.3 Адаптивная сетка**

```html
<!-- Отзывчивая сетка продуктов -->
<div class="shop-products row g-3 g-lg-4" 
     x-data="productGrid" 
     x-init="loadProducts">
    
    <template x-for="product in products" x-key="product.id">
        <div class="col-6 col-md-4 col-lg-3 col-xxl-2">
            <!-- Карточка продукта -->
        </div>
    </template>
    
    <!-- Состояние загрузки -->
    <template x-if="loading">
        <div class="col-12">
            <div class="d-flex justify-content-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Загрузка продуктов...</span>
                </div>
            </div>
        </div>
    </template>
    
    <!-- Пустое состояние -->
    <template x-if="!loading && products.length === 0">
        <div class="col-12">
            <div class="text-center py-5">
                <i class="icon icon--search display-1 text-muted mb-3" aria-hidden="true"></i>
                <h3 class="h4 text-muted">Товары не найдены</h3>
                <p class="text-muted">Попробуйте изменить критерии поиска</p>
            </div>
        </div>
    </template>
</div>
```

---

## **7. ALPINE.JS РЕАКТИВНОСТЬ**

### **7.1 Основы Alpine.js в контексте Webasyst**

Alpine.js обеспечивает прогрессивные улучшения без необходимости сложной сборки. Это особенно важно для Webasyst, где темы должны быть простыми в развёртывании.

**Глобальные компоненты:**
```javascript
// js/components.js
document.addEventListener('alpine:init', () => {
    // Компонент для работы с корзиной
    Alpine.data('cartManager', () => ({
        count: 0,
        loading: false,
        
        init() {
            this.updateCount();
            this.$watch('count', (value) => {
                this.updateCartIcon(value);
            });
        },
        
        async addProduct(productId, quantity = 1) {
            this.loading = true;
            
            try {
                const response = await fetch('/shop/cart/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: new URLSearchParams({
                        product_id: productId,
                        quantity: quantity
                    })
                });
                
                const data = await response.json();
                
                if (data.status === 'ok') {
                    this.count = data.count;
                    this.showNotification('Товар добавлен в корзину', 'success');
                } else {
                    this.showNotification(data.errors.join(', '), 'error');
                }
            } catch (error) {
                this.showNotification('Ошибка добавления товара', 'error');
            } finally {
                this.loading = false;
            }
        },
        
        updateCount() {
            // Получение текущего количества из Webasyst
            const cartData = window.waShopCart || {};
            this.count = cartData.count || 0;
        },
        
        updateCartIcon(count) {
            const cartIcon = document.querySelector('.site-header__cart-count');
            if (cartIcon) {
                cartIcon.textContent = count;
                cartIcon.style.display = count > 0 ? 'inline' : 'none';
            }
        },
        
        showNotification(message, type) {
            // Интеграция с системой уведомлений Webasyst
            if (window.waShowNotification) {
                window.waShowNotification(message, type);
            }
        }
    }));
    
    // Компонент модального окна
    Alpine.data('modal', (options = {}) => ({
        open: false,
        loading: false,
        
        init() {
            // Обработка ESC для закрытия
            this.$el.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.open) {
                    this.close();
                }
            });
        },
        
        show() {
            this.open = true;
            document.body.style.overflow = 'hidden';
            this.$nextTick(() => {
                this.$el.querySelector('[autofocus]')?.focus();
            });
        },
        
        close() {
            this.open = false;
            document.body.style.overflow = '';
        },
        
        async loadContent(url) {
            this.loading = true;
            
            try {
                const response = await fetch(url);
                const html = await response.text();
                
                const contentElement = this.$el.querySelector('[x-ref="content"]');
                if (contentElement) {
                    contentElement.innerHTML = html;
                }
            } catch (error) {
                console.error('Ошибка загрузки контента:', error);
            } finally {
                this.loading = false;
            }
        }
    }));
    
    // Компонент формы с валидацией
    Alpine.data('formValidator', () => ({
        errors: {},
        submitting: false,
        
        validate(field, value, rules) {
            const fieldErrors = [];
            
            rules.forEach(rule => {
                switch (rule.type) {
                    case 'required':
                        if (!value || value.trim() === '') {
                            fieldErrors.push(rule.message || 'Поле обязательно для заполнения');
                        }
                        break;
                        
                    case 'email':
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (value && !emailRegex.test(value)) {
                            fieldErrors.push(rule.message || 'Некорректный email адрес');
                        }
                        break;
                        
                    case 'minLength':
                        if (value && value.length < rule.value) {
                            fieldErrors.push(rule.message || `Минимум ${rule.value} символов`);
                        }
                        break;
                }
            });
            
            this.errors[field] = fieldErrors;
            this.updateFieldError(field, fieldErrors);
        },
        
        updateFieldError(field, errors) {
            const errorElement = document.querySelector(`#${field}-error`);
            const inputElement = document.querySelector(`#${field}`);
            
            if (errorElement) {
                errorElement.textContent = errors.join(', ');
                errorElement.style.display = errors.length > 0 ? 'block' : 'none';
            }
            
            if (inputElement) {
                inputElement.classList.toggle('is-invalid', errors.length > 0);
                inputElement.classList.toggle('is-valid', errors.length === 0 && inputElement.value);
                inputElement.setAttribute('aria-invalid', errors.length > 0);
            }
        },
        
        async submitForm(form) {
            this.submitting = true;
            
            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                const data = await response.json();
                
                if (data.status === 'ok') {
                    this.showSuccess('Форма успешно отправлена');
                    form.reset();
                    this.errors = {};
                } else {
                    this.handleServerErrors(data.errors);
                }
            } catch (error) {
                this.showError('Ошибка отправки формы');
            } finally {
                this.submitting = false;
            }
        },
        
        handleServerErrors(errors) {
            Object.keys(errors).forEach(field => {
                this.errors[field] = Array.isArray(errors[field]) ? errors[field] : [errors[field]];
                this.updateFieldError(field, this.errors[field]);
            });
        },
        
        showSuccess(message) {
            // Интеграция с системой уведомлений
            if (window.waShowNotification) {
                window.waShowNotification(message, 'success');
            }
        },
        
        showError(message) {
            if (window.waShowNotification) {
                window.waShowNotification(message, 'error');
            }
        }
    }));
});
```

### **7.2 Использование в шаблонах Webasyst**

**Интерактивная карточка товара:**
```html
<!-- Карточка товара с Alpine.js -->
<article class="shop-product" 
         x-data="{ 
             product: {$product|@json_encode},
             quantity: 1,
             selectedVariant: null,
             imageIndex: 0
         }"
         x-init="selectedVariant = product.variants?.[0] || null">
    
    <!-- Галерея изображений -->
    <div class="shop-product__gallery">
        <div class="shop-product__main-image">
            <img x-bind:src="product.images[imageIndex]?.large || product.images[0]?.large" 
                 x-bind:alt="product.name"
                 class="shop-product__image"
                 loading="lazy">
        </div>
        
        <div class="shop-product__thumbnails" x-show="product.images.length > 1">
            <template x-for="(image, index) in product.images" x-key="index">
                <button type="button" 
                        class="shop-product__thumbnail"
                        x-bind:class="{ 'shop-product__thumbnail--active': index === imageIndex }"
                        x-on:click="imageIndex = index"
                        x-bind:aria-label="`Изображение ${index + 1}`">
                    <img x-bind:src="image.thumb" x-bind:alt="`${product.name} изображение ${index + 1}`">
                </button>
            </template>
        </div>
    </div>
    
    <!-- Информация о товаре -->
    <div class="shop-product__info">
        <h1 class="shop-product__title">{$product.name}</h1>
        
        <!-- Цена -->
        <div class="shop-product__price">
            <template x-if="selectedVariant?.compare_price">
                <span class="shop-product__price-old" x-text="selectedVariant.compare_price"></span>
            </template>
            <span class="shop-product__price-current" 
                  x-text="selectedVariant?.price || product.price"></span>
        </div>
        
        <!-- Варианты товара -->
        <template x-if="product.variants && product.variants.length > 1">
            <div class="shop-product__variants">
                <fieldset>
                    <legend class="shop-product__variants-title">Выберите вариант:</legend>
                    <template x-for="variant in product.variants" x-key="variant.id">
                        <label class="shop-product__variant">
                            <input type="radio" 
                                   name="variant" 
                                   x-bind:value="variant.id"
                                   x-model="selectedVariant"
                                   class="shop-product__variant-input visually-hidden">
                            <span class="shop-product__variant-label" x-text="variant.name"></span>
                        </label>
                    </template>
                </fieldset>
            </div>
        </template>
        
        <!-- Количество -->
        <div class="shop-product__quantity">
            <label for="quantity" class="shop-product__quantity-label">Количество:</label>
            <div class="shop-product__quantity-controls">
                <button type="button" 
                        class="btn btn-outline-secondary"
                        x-on:click="quantity = Math.max(1, quantity - 1)"
                        x-bind:disabled="quantity <= 1"
                        aria-label="Уменьшить количество">−</button>
                
                <input type="number" 
                       id="quantity"
                       x-model="quantity"
                       min="1" 
                       max="999"
                       class="shop-product__quantity-input form-control">
                
                <button type="button" 
                        class="btn btn-outline-secondary"
                        x-on:click="quantity = Math.min(999, quantity + 1)"
                        x-bind:disabled="quantity >= 999"
                        aria-label="Увеличить количество">+</button>
            </div>
        </div>
        
        <!-- Действия -->
        <div class="shop-product__actions">
            <button type="button" 
                    class="btn btn-primary btn-lg w-100"
                    x-data="cartManager"
                    x-on:click="addProduct(selectedVariant?.id || product.id, quantity)"
                    x-bind:disabled="loading || !product.available">
                
                <template x-if="!loading">
                    <span class="d-flex align-items-center justify-content-center">
                        <i class="icon icon--cart me-2" aria-hidden="true"></i>
                        Добавить в корзину
                    </span>
                </template>
                
                <template x-if="loading">
                    <span class="d-flex align-items-center justify-content-center">
                        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Добавление...
                    </span>
                </template>
            </button>
        </div>
    </div>
</article>
```

---

## **8. ДОСТУПНОСТЬ И УНИВЕРСАЛЬНЫЙ ДИЗАЙН**

### **8.1 Принципы WCAG 2.2**

**Четыре основных принципа:**
1. **Воспринимаемость** — информация доступна через различные сенсорные каналы
2. **Управляемость** — элементы интерфейса доступны для всех способов навигации
3. **Понятность** — информация и управление понятны пользователю
4. **Надёжность** — контент можно интерпретировать различными пользовательскими агентами

### **8.2 Навигация с клавиатуры**

**Skip links:**
```html
<!-- Ссылки для быстрого перехода -->
<nav class="skip-links" aria-label="Навигация по странице">
    <a href="#main-content" class="skip-link">Перейти к основному содержимому</a>
    <a href="#main-nav" class="skip-link">Перейти к навигации</a>
    <a href="#search" class="skip-link">Перейти к поиску</a>
</nav>

<style>
.skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: #000;
    color: #fff;
    padding: 8px;
    text-decoration: none;
    z-index: 1000;
    border-radius: 0 0 4px 4px;
}

.skip-link:focus {
    top: 0;
}
</style>
```

**Фокус-менеджмент в Alpine.js:**
```html
<!-- Модальное окно с правильным управлением фокусом -->
<div class="modal" 
     x-data="modal"
     x-show="open"
     x-trap="open"
     role="dialog"
     aria-modal="true"
     aria-labelledby="modal-title"
     x-transition:enter="transition ease-out duration-300"
     x-transition:enter-start="opacity-0"
     x-transition:enter-end="opacity-100">
    
    <div class="modal__backdrop" 
         x-on:click="close()"
         aria-hidden="true"></div>
    
    <div class="modal__content">
        <header class="modal__header">
            <h2 id="modal-title" class="modal__title">{$modal_title}</h2>
            <button type="button" 
                    class="modal__close"
                    x-on:click="close()"
                    aria-label="Закрыть модальное окно">
                <i class="icon icon--close" aria-hidden="true"></i>
            </button>
        </header>
        
        <div class="modal__body" x-ref="content">
            {$modal_content}
        </div>
        
        <footer class="modal__footer">
            <button type="button" class="btn btn-secondary" x-on:click="close()">
                Отмена
            </button>
            <button type="button" class="btn btn-primary" autofocus>
                Подтвердить
            </button>
        </footer>
    </div>
</div>
```

### **8.3 ARIA атрибуты**

**Живые области (Live Regions):**
```html
<!-- Область для уведомлений -->
<div id="notifications" 
     class="notifications"
     aria-live="polite" 
     aria-atomic="false"
     role="status">
    <!-- Уведомления появляются здесь -->
</div>

<!-- Критичные уведомления -->
<div id="alerts" 
     class="alerts"
     aria-live="assertive" 
     aria-atomic="true"
     role="alert">
    <!-- Критичные сообщения -->
</div>
```

**Описательные элементы:**
```html
<!-- Сложная форма с описаниями -->
<form class="complex-form" x-data="formValidator">
    <div class="form-group">
        <label for="password" class="form-label">
            Пароль
            <span class="form-required" aria-label="обязательное поле">*</span>
        </label>
        
        <input type="password" 
               id="password" 
               name="password"
               class="form-control"
               required
               minlength="8"
               aria-describedby="password-help password-error"
               x-on:input="validate('password', $event.target.value, [
                   { type: 'required', message: 'Пароль обязателен' },
                   { type: 'minLength', value: 8, message: 'Минимум 8 символов' }
               ])">
        
        <div id="password-help" class="form-text">
            Пароль должен содержать минимум 8 символов, включая цифры и буквы
        </div>
        
        <div id="password-error" 
             class="invalid-feedback" 
             role="alert" 
             aria-live="polite"
             x-show="errors.password && errors.password.length > 0">
            <template x-for="error in (errors.password || [])" x-key="error">
                <div x-text="error"></div>
            </template>
        </div>
    </div>
</form>
```

### **8.4 Цветовой контраст и типографика**

```css
/* Обеспечение контраста WCAG AA (4.5:1) */
:root {
    /* Основные цвета с проверенным контрастом */
    --color-text-primary: #212529;      /* Контраст 16.6:1 на белом */
    --color-text-secondary: #6c757d;    /* Контраст 4.5:1 на белом */
    --color-text-light: #adb5bd;        /* Только для декоративных элементов */
    
    --color-bg-primary: #ffffff;
    --color-bg-secondary: #f8f9fa;
    --color-bg-dark: #343a40;
    
    /* Интерактивные элементы */
    --color-link: #0066cc;               /* Контраст 4.5:1 */
    --color-link-hover: #004499;         /* Контраст 7:1 */
    --color-focus: #0066cc;
    
    /* Состояния */
    --color-success: #157347;            /* Контраст 4.5:1 */
    --color-warning: #664d03;            /* Контраст 4.5:1 */
    --color-danger: #842029;             /* Контраст 4.5:1 */
}

/* Типографическая система */
.text-base {
    font-size: 1rem;
    line-height: 1.6;
    font-weight: 400;
}

.text-large {
    font-size: 1.125rem;
    line-height: 1.6;
}

.text-small {
    font-size: 0.875rem;
    line-height: 1.5;
}

/* Фокус-индикаторы */
*:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
    border-radius: 2px;
}

/* Анимации для пользователей без предпочтения движения */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

---

## **9. SEO ОПТИМИЗАЦИЯ И JSON-LD**

### **9.1 Структурированные данные для Webasyst**

**Базовая структура сайта:**
```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "{$site_name|escape}",
    "url": "{$wa->getUrl()}",
    "description": "{$site_description|escape}",
    "publisher": {
        "@type": "Organization",
        "name": "{$site_name|escape}",
        "logo": {
            "@type": "ImageObject",
            "url": "{$site_logo_url}"
        }
    },
    "potentialAction": {
        "@type": "SearchAction",
        "target": {
            "@type": "EntryPoint",
            "urlTemplate": "{$wa->getUrl()}search/?query={literal}{search_term_string}{/literal}"
        },
        "query-input": "required name=search_term_string"
    }
}
</script>
```

**Товар в Shop-Script:**
```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "{$product.name|escape}",
    "description": "{$product.summary|escape}",
    "sku": "{$product.sku}",
    "gtin": "{$product.gtin}",
    "brand": {
        "@type": "Brand",
        "name": "{$product.brand|escape}"
    },
    "image": [
        {foreach $product.images as $image}
        "{$image.url}"{if !$image@last},{/if}
        {/foreach}
    ],
    "offers": {
        "@type": "Offer",
        "url": "{$product.url}",
        "priceCurrency": "{$product.currency}",
        "price": "{$product.price}",
        "priceValidUntil": "{$smarty.now|date_format:'Y-m-d'|date_modify:'+1 year'}",
        "availability": "{if $product.available}https://schema.org/InStock{else}https://schema.org/OutOfStock{/if}",
        "seller": {
            "@type": "Organization",
            "name": "{$shop.name|escape}"
        }
    },
    {if $product.reviews}
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "{$product.rating}",
        "reviewCount": "{$product.reviews_count}",
        "bestRating": "5",
        "worstRating": "1"
    },
    "review": [
        {foreach $product.reviews as $review}
        {
            "@type": "Review",
            "author": {
                "@type": "Person",
                "name": "{$review.author|escape}"
            },
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": "{$review.rating}",
                "bestRating": "5",
                "worstRating": "1"
            },
            "reviewBody": "{$review.text|escape}",
            "datePublished": "{$review.date}"
        }{if !$review@last},{/if}
        {/foreach}
    ],
    {/if}
    "category": "{$product.category.name|escape}"
}
</script>
```

**Статья в Blog:**
```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "{$post.title|escape}",
    "description": "{$post.summary|escape}",
    "image": "{$post.image}",
    "author": {
        "@type": "Person",
        "name": "{$post.author.name|escape}",
        "url": "{$post.author.url}"
    },
    "publisher": {
        "@type": "Organization",
        "name": "{$site_name|escape}",
        "logo": {
            "@type": "ImageObject",
            "url": "{$site_logo_url}"
        }
    },
    "datePublished": "{$post.datetime}",
    "dateModified": "{$post.update_datetime|default:$post.datetime}",
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "{$post.url}"
    },
    "wordCount": "{$post.text|strip_tags|str_word_count}",
    "timeRequired": "PT{$post.text|strip_tags|str_word_count/200|round}M",
    "keywords": "{if $post.tags}{foreach $post.tags as $tag}{$tag.name}{if !$tag@last}, {/if}{/foreach}{/if}"
}
</script>
```

### **9.2 Хлебные крошки (Breadcrumbs)**

```html
<!-- Навигационные хлебные крошки -->
<nav class="breadcrumbs" aria-label="Хлебные крошки">
    <ol class="breadcrumbs__list" itemscope itemtype="https://schema.org/BreadcrumbList">
        {foreach $breadcrumbs as $index => $crumb}
        <li class="breadcrumbs__item" 
            itemprop="itemListElement" 
            itemscope 
            itemtype="https://schema.org/ListItem">
            
            {if $crumb.url && !$crumb@last}
                <a href="{$crumb.url}" 
                   class="breadcrumbs__link"
                   itemprop="item">
                    <span itemprop="name">{$crumb.name}</span>
                </a>
            {else}
                <span class="breadcrumbs__current" 
                      itemprop="name" 
                      aria-current="page">{$crumb.name}</span>
            {/if}
            
            <meta itemprop="position" content="{$index + 1}">
        </li>
        {/foreach}
    </ol>
</nav>

<!-- JSON-LD для хлебных крошек -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        {foreach $breadcrumbs as $index => $crumb}
        {
            "@type": "ListItem",
            "position": {$index + 1},
            "name": "{$crumb.name|escape}",
            {if $crumb.url}"item": "{$crumb.url}"{/if}
        }{if !$crumb@last},{/if}
        {/foreach}
    ]
}
</script>
```

### **9.3 FAQ Schema для поддержки**

```html
<!-- FAQ секция с структурированными данными -->
<section class="faq" itemscope itemtype="https://schema.org/FAQPage">
    <h2 class="faq__title">Часто задаваемые вопросы</h2>
    
    <div class="faq__list" x-data="{ openItems: new Set() }">
        {foreach $faq_items as $index => $item}
        <div class="faq__item" 
             itemscope 
             itemtype="https://schema.org/Question"
             x-data="{ isOpen: false }"
             x-init="$watch('isOpen', value => {
                 if (value) openItems.add({$index}); 
                 else openItems.delete({$index});
             })">
            
            <h3 class="faq__question">
                <button type="button" 
                        class="faq__question-button"
                        x-on:click="isOpen = !isOpen"
                        x-bind:aria-expanded="isOpen"
                        aria-controls="faq-answer-{$index}">
                    <span itemprop="name">{$item.question}</span>
                    <i class="faq__icon" 
                       x-bind:class="{ 'faq__icon--open': isOpen }"
                       aria-hidden="true"></i>
                </button>
            </h3>
            
            <div id="faq-answer-{$index}"
                 class="faq__answer"
                 x-show="isOpen"
                 x-transition:enter="transition ease-out duration-200"
                 x-transition:enter-start="opacity-0 max-h-0"
                 x-transition:enter-end="opacity-100 max-h-screen"
                 itemscope 
                 itemtype="https://schema.org/Answer">
                <div class="faq__answer-content" itemprop="text">
                    {$item.answer}
                </div>
            </div>
        </div>
        {/foreach}
    </div>
</section>

<!-- JSON-LD для FAQ -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {foreach $faq_items as $item}
        {
            "@type": "Question",
            "name": "{$item.question|escape}",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "{$item.answer|strip_tags|escape}"
            }
        }{if !$item@last},{/if}
        {/foreach}
    ]
}
</script>
```

---

## **10. ПРАКТИЧЕСКИЕ ПАТТЕРНЫ**

### **10.1 Паттерн: Карусель продуктов**

```html
<!-- Доступная карусель с клавиатурной навигацией -->
<section class="product-carousel" 
         x-data="carousel"
         aria-label="Рекомендуемые товары">
    
    <header class="product-carousel__header">
        <h2 class="product-carousel__title">Рекомендуемые товары</h2>
        
        <div class="product-carousel__controls">
            <button type="button" 
                    class="product-carousel__control product-carousel__control--prev"
                    x-on:click="prev()"
                    x-bind:disabled="currentIndex === 0"
                    aria-label="Предыдущие товары">
                <i class="icon icon--chevron-left" aria-hidden="true"></i>
            </button>
            
            <button type="button" 
                    class="product-carousel__control product-carousel__control--next"
                    x-on:click="next()"
                    x-bind:disabled="currentIndex >= maxIndex"
                    aria-label="Следующие товары">
                <i class="icon icon--chevron-right" aria-hidden="true"></i>
            </button>
        </div>
    </header>
    
    <div class="product-carousel__viewport" 
         x-ref="viewport"
         role="region"
         aria-live="polite"
         aria-atomic="false">
        
        <div class="product-carousel__track"
             x-bind:style="`transform: translateX(-${currentIndex * itemWidth}px)`"
             x-on:keydown.arrow-left.prevent="prev()"
             x-on:keydown.arrow-right.prevent="next()">
            
            {foreach $recommended_products as $product}
            <div class="product-carousel__item">
                <!-- Используем атом карточки товара -->
                {include file="atoms/product-card.html" product=$product}
            </div>
            {/foreach}
        </div>
    </div>
    
    <!-- Индикаторы позиции -->
    <div class="product-carousel__indicators" role="tablist" aria-label="Позиция в карусели">
        <template x-for="(page, index) in pages" x-key="index">
            <button type="button"
                    class="product-carousel__indicator"
                    x-bind:class="{ 'product-carousel__indicator--active': index === currentPage }"
                    x-on:click="goToPage(index)"
                    x-bind:aria-label="`Страница ${index + 1} из ${pages.length}`"
                    role="tab"
                    x-bind:aria-selected="index === currentPage"
                    x-bind:tabindex="index === currentPage ? '0' : '-1'">
            </button>
        </template>
    </div>
</section>

<script>
// Компонент карусели
Alpine.data('carousel', () => ({
    currentIndex: 0,
    itemWidth: 0,
    itemsPerPage: 4,
    totalItems: 0,
    
    get maxIndex() {
        return Math.max(0, this.totalItems - this.itemsPerPage);
    },
    
    get currentPage() {
        return Math.floor(this.currentIndex / this.itemsPerPage);
    },
    
    get pages() {
        return Array.from({ length: Math.ceil(this.totalItems / this.itemsPerPage) }, (_, i) => i);
    },
    
    init() {
        this.calculateDimensions();
        this.totalItems = this.$el.querySelectorAll('.product-carousel__item').length;
        
        window.addEventListener('resize', () => {
            this.calculateDimensions();
        });
        
        // Поддержка touch-жестов
        this.initTouchEvents();
    },
    
    calculateDimensions() {
        const viewport = this.$refs.viewport;
        const firstItem = this.$el.querySelector('.product-carousel__item');
        
        if (viewport && firstItem) {
            const viewportWidth = viewport.offsetWidth;
            const gap = 16; // Отступ между элементами
            
            // Адаптивное количество элементов
            if (viewportWidth < 576) {
                this.itemsPerPage = 1;
            } else if (viewportWidth < 768) {
                this.itemsPerPage = 2;
            } else if (viewportWidth < 992) {
                this.itemsPerPage = 3;
            } else {
                this.itemsPerPage = 4;
            }
            
            this.itemWidth = (viewportWidth - (gap * (this.itemsPerPage - 1))) / this.itemsPerPage;
        }
    },
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex = Math.max(0, this.currentIndex - this.itemsPerPage);
            this.announceChange();
        }
    },
    
    next() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex = Math.min(this.maxIndex, this.currentIndex + this.itemsPerPage);
            this.announceChange();
        }
    },
    
    goToPage(pageIndex) {
        this.currentIndex = pageIndex * this.itemsPerPage;
        this.announceChange();
    },
    
    announceChange() {
        // Объявляем изменение для screen readers
        const start = this.currentIndex + 1;
        const end = Math.min(this.currentIndex + this.itemsPerPage, this.totalItems);
        const announcement = `Показаны товары ${start}-${end} из ${this.totalItems}`;
        
        this.$refs.viewport.setAttribute('aria-label', announcement);
    },
    
    initTouchEvents() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        this.$refs.viewport.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });
        
        this.$refs.viewport.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });
        
        this.$refs.viewport.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const diffX = startX - currentX;
            const threshold = 50;
            
            if (diffX > threshold) {
                this.next();
            } else if (diffX < -threshold) {
                this.prev();
            }
            
            isDragging = false;
        });
    }
}));
</script>
```

### **10.2 Паттерн: Фильтры каталога**

```html
<!-- Панель фильтров с сохранением состояния -->
<aside class="catalog-filters" 
       x-data="catalogFilters"
       x-init="initFromUrl()"
       role="complementary"
       aria-label="Фильтры товаров">
    
    <header class="catalog-filters__header">
        <h2 class="catalog-filters__title">Фильтры</h2>
        
        <button type="button" 
                class="catalog-filters__reset"
                x-show="hasActiveFilters"
                x-on:click="resetFilters()"
                x-transition>
            Сбросить все
        </button>
    </header>
    
    <form class="catalog-filters__form" 
          x-on:change="updateFilters()"
          x-on:submit.prevent>
        
        <!-- Фильтр по цене -->
        <fieldset class="filter-group">
            <legend class="filter-group__title">Цена</legend>
            
            <div class="price-range">
                <div class="price-range__inputs">
                    <label for="price-min" class="visually-hidden">Минимальная цена</label>
                    <input type="number" 
                           id="price-min"
                           name="price_min"
                           class="price-range__input"
                           placeholder="От"
                           x-model="filters.price_min"
                           x-on:input.debounce.500ms="updateProducts()">
                    
                    <span class="price-range__separator">—</span>
                    
                    <label for="price-max" class="visually-hidden">Максимальная цена</label>
                    <input type="number" 
                           id="price-max"
                           name="price_max"
                           class="price-range__input"
                           placeholder="До"
                           x-model="filters.price_max"
                           x-on:input.debounce.500ms="updateProducts()">
                </div>
                
                <!-- Слайдер цены -->
                <div class="price-range__slider" 
                     x-data="priceSlider"
                     x-init="init($el, filters.price_min, filters.price_max)">
                    <div class="price-range__track">
                        <div class="price-range__range" 
                             x-bind:style="rangeStyle"></div>
                    </div>
                    
                    <input type="range" 
                           class="price-range__thumb price-range__thumb--min"
                           x-bind:min="minPrice"
                           x-bind:max="maxPrice"
                           x-model="filters.price_min"
                           aria-label="Минимальная цена">
                    
                    <input type="range" 
                           class="price-range__thumb price-range__thumb--max"
                           x-bind:min="minPrice"
                           x-bind:max="maxPrice"
                           x-model="filters.price_max"
                           aria-label="Максимальная цена">
                </div>
            </div>
        </fieldset>
        
        <!-- Фильтры по категориям -->
        <fieldset class="filter-group">
            <legend class="filter-group__title">Категории</legend>
            
            <div class="checkbox-list" role="group">
                {foreach $categories as $category}
                <label class="checkbox-item">
                    <input type="checkbox" 
                           name="categories[]"
                           value="{$category.id}"
                           class="checkbox-item__input"
                           x-model="filters.categories">
                    <span class="checkbox-item__label">{$category.name}</span>
                    <span class="checkbox-item__count">({$category.count})</span>
                </label>
                {/foreach}
            </div>
        </fieldset>
        
        <!-- Фильтр по брендам -->
        <fieldset class="filter-group">
            <legend class="filter-group__title">Бренды</legend>
            
            <!-- Поиск по брендам -->
            <div class="filter-search">
                <label for="brand-search" class="visually-hidden">Поиск брендов</label>
                <input type="search" 
                       id="brand-search"
                       class="filter-search__input"
                       placeholder="Поиск брендов..."
                       x-model="brandSearch"
                       x-on:input.debounce.300ms="filterBrands()">
            </div>
            
            <div class="checkbox-list checkbox-list--scrollable" 
                 role="group"
                 x-show="filteredBrands.length > 0"
                 x-transition>
                <template x-for="brand in filteredBrands" x-key="brand.id">
                    <label class="checkbox-item">
                        <input type="checkbox" 
                               name="brands[]"
                               x-bind:value="brand.id"
                               class="checkbox-item__input"
                               x-model="filters.brands">
                        <span class="checkbox-item__label" x-text="brand.name"></span>
                        <span class="checkbox-item__count" x-text="`(${brand.count})`"></span>
                    </label>
                </template>
            </div>
            
            <div x-show="filteredBrands.length === 0 && brandSearch.length > 0"
                 class="filter-empty">
                Бренды не найдены
            </div>
        </fieldset>
        
        <!-- Активные фильтры -->
        <div class="active-filters" 
             x-show="hasActiveFilters"
             x-transition>
            <h3 class="active-filters__title">Активные фильтры:</h3>
            
            <div class="active-filters__list">
                <template x-for="filter in activeFiltersList" x-key="filter.key">
                    <button type="button" 
                            class="active-filters__item"
                            x-on:click="removeFilter(filter.key, filter.value)"
                            x-bind:aria-label="`Убрать фильтр ${filter.label}`">
                        <span x-text="filter.label"></span>
                        <i class="icon icon--close" aria-hidden="true"></i>
                    </button>
                </template>
            </div>
        </div>
    </form>
</aside>

<script>
// Компонент фильтров каталога
Alpine.data('catalogFilters', () => ({
    filters: {
        price_min: null,
        price_max: null,
        categories: [],
        brands: []
    },
    brandSearch: '',
    allBrands: [],
    filteredBrands: [],
    
    get hasActiveFilters() {
        return this.filters.price_min || 
               this.filters.price_max || 
               this.filters.categories.length > 0 || 
               this.filters.brands.length > 0;
    },
    
    get activeFiltersList() {
        const list = [];
        
        if (this.filters.price_min || this.filters.price_max) {
            const min = this.filters.price_min || 'любая';
            const max = this.filters.price_max || 'любая';
            list.push({
                key: 'price',
                value: null,
                label: `Цена: ${min} - ${max}`
            });
        }
        
        this.filters.categories.forEach(id => {
            const category = this.findCategoryById(id);
            if (category) {
                list.push({
                    key: 'categories',
                    value: id,
                    label: category.name
                });
            }
        });
        
        this.filters.brands.forEach(id => {
            const brand = this.findBrandById(id);
            if (brand) {
                list.push({
                    key: 'brands',
                    value: id,
                    label: brand.name
                });
            }
        });
        
        return list;
    },
    
    init() {
        this.allBrands = window.catalogBrands || [];
        this.filteredBrands = [...this.allBrands];
        
        // Дебаунс для обновления продуктов
        this.updateProducts = this.debounce(this.updateProducts.bind(this), 300);
    },
    
    initFromUrl() {
        const params = new URLSearchParams(window.location.search);
        
        this.filters.price_min = params.get('price_min') || null;
        this.filters.price_max = params.get('price_max') || null;
        this.filters.categories = params.getAll('categories[]').map(Number);
        this.filters.brands = params.getAll('brands[]').map(Number);
    },
    
    updateFilters() {
        this.updateUrl();
        this.updateProducts();
    },
    
    updateUrl() {
        const params = new URLSearchParams();
        
        if (this.filters.price_min) params.set('price_min', this.filters.price_min);
        if (this.filters.price_max) params.set('price_max', this.filters.price_max);
        
        this.filters.categories.forEach(cat => {
            params.append('categories[]', cat);
        });
        
        this.filters.brands.forEach(brand => {
            params.append('brands[]', brand);
        });
        
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        history.replaceState(null, '', newUrl);
    },
    
    async updateProducts() {
        const catalog = this.$el.closest('.catalog-page')?.querySelector('.product-grid');
        if (!catalog) return;
        
        try {
            catalog.style.opacity = '0.7';
            
            const params = new URLSearchParams();
            Object.keys(this.filters).forEach(key => {
                const value = this.filters[key];
                if (Array.isArray(value)) {
                    value.forEach(v => params.append(`${key}[]`, v));
                } else if (value) {
                    params.set(key, value);
                }
            });
            
            const response = await fetch(`${window.location.pathname}?ajax=1&${params.toString()}`);
            const data = await response.json();
            
            if (data.products_html) {
                catalog.innerHTML = data.products_html;
            }
            
            // Обновляем счетчики в фильтрах
            if (data.filter_counts) {
                this.updateFilterCounts(data.filter_counts);
            }
            
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
        } finally {
            catalog.style.opacity = '';
        }
    },
    
    resetFilters() {
        this.filters = {
            price_min: null,
            price_max: null,
            categories: [],
            brands: []
        };
        this.updateFilters();
    },
    
    removeFilter(key, value) {
        if (key === 'price') {
            this.filters.price_min = null;
            this.filters.price_max = null;
        } else if (Array.isArray(this.filters[key])) {
            const index = this.filters[key].indexOf(value);
            if (index > -1) {
                this.filters[key].splice(index, 1);
            }
        }
        this.updateFilters();
    },
    
    filterBrands() {
        if (!this.brandSearch) {
            this.filteredBrands = [...this.allBrands];
        } else {
            const search = this.brandSearch.toLowerCase();
            this.filteredBrands = this.allBrands.filter(brand => 
                brand.name.toLowerCase().includes(search)
            );
        }
    },
    
    findCategoryById(id) {
        return window.catalogCategories?.find(cat => cat.id === id);
    },
    
    findBrandById(id) {
        return this.allBrands.find(brand => brand.id === id);
    },
    
    updateFilterCounts(counts) {
        // Обновляем счетчики доступных товаров в фильтрах
        this.allBrands.forEach(brand => {
            if (counts.brands && counts.brands[brand.id] !== undefined) {
                brand.count = counts.brands[brand.id];
            }
        });
    },
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}));

// Компонент слайдера цены
Alpine.data('priceSlider', () => ({
    minPrice: 0,
    maxPrice: 100000,
    
    get rangeStyle() {
        const min = ((this.filters.price_min - this.minPrice) / (this.maxPrice - this.minPrice)) * 100;
        const max = ((this.filters.price_max - this.minPrice) / (this.maxPrice - this.minPrice)) * 100;
        
        return `left: ${min}%; width: ${max - min}%`;
    },
    
    init(element, minValue, maxValue) {
        this.minPrice = window.catalogPriceRange?.min || 0;
        this.maxPrice = window.catalogPriceRange?.max || 100000;
        
        if (minValue) this.$root.filters.price_min = minValue;
        if (maxValue) this.$root.filters.price_max = maxValue;
    }
}));
</script>
```

### **10.3 Паттерн: Адаптивная навигация**

```html
<!-- Многоуровневая адаптивная навигация -->
<nav class="main-navigation" 
     x-data="navigation"
     role="navigation"
     aria-label="Основная навигация">
    
    <!-- Десктопная навигация -->
    <ul class="main-navigation__list d-none d-lg-flex">
        {foreach $navigation_items as $item}
        <li class="main-navigation__item"
            x-data="{ open: false }"
            x-on:mouseenter="open = true"
            x-on:mouseleave="open = false"
            x-on:keydown.escape="open = false">
            
            <a href="{$item.url}" 
               class="main-navigation__link {if $item.active}main-navigation__link--active{/if}"
               {if $item.active}aria-current="page"{/if}
               {if $item.children}
               x-bind:aria-expanded="open"
               aria-haspopup="true"
               x-on:click.prevent="open = !open"
               {/if}>
                {$item.name}
                {if $item.children}
                <i class="main-navigation__arrow icon icon--chevron-down" aria-hidden="true"></i>
                {/if}
            </a>
            
            {if $item.children}
            <ul class="main-navigation__submenu"
                x-show="open"
                x-transition:enter="transition ease-out duration-200"
                x-transition:enter-start="opacity-0 scale-95"
                x-transition:enter-end="opacity-100 scale-100"
                x-trap="open">
                
                {foreach $item.children as $child}
                <li class="main-navigation__submenu-item">
                    <a href="{$child.url}" 
                       class="main-navigation__submenu-link"
                       {if $child.active}aria-current="page"{/if}>
                        {$child.name}
                    </a>
                </li>
                {/foreach}
            </ul>
            {/if}
        </li>
        {/foreach}
    </ul>
    
    <!-- Мобильная навигация -->
    <div class="main-navigation__mobile d-lg-none">
        <button type="button" 
                class="main-navigation__toggle"
                x-on:click="mobileOpen = !mobileOpen"
                x-bind:aria-expanded="mobileOpen"
                aria-controls="mobile-menu"
                aria-label="Открыть меню">
            <span class="hamburger" x-bind:class="{ 'hamburger--active': mobileOpen }">
                <span class="hamburger__line"></span>
                <span class="hamburger__line"></span>
                <span class="hamburger__line"></span>
            </span>
            <span class="main-navigation__toggle-text">Меню</span>
        </button>
        
        <div id="mobile-menu"
             class="main-navigation__mobile-menu"
             x-show="mobileOpen"
             x-transition:enter="transition ease-out duration-300"
             x-transition:enter-start="opacity-0 -translate-y-4"
             x-transition:enter-end="opacity-100 translate-y-0"
             x-trap="mobileOpen"
             x-on:click.outside="mobileOpen = false">
            
            <div class="main-navigation__mobile-header">
                <span class="main-navigation__mobile-title">Навигация</span>
                <button type="button" 
                        class="main-navigation__close"
                        x-on:click="mobileOpen = false"
                        aria-label="Закрыть меню">
                    <i class="icon icon--close" aria-hidden="true"></i>
                </button>
            </div>
            
            <ul class="main-navigation__mobile-list">
                {foreach $navigation_items as $item}
                <li class="main-navigation__mobile-item"
                    x-data="{ open: false }">
                    
                    <div class="main-navigation__mobile-link-wrapper">
                        <a href="{$item.url}" 
                           class="main-navigation__mobile-link {if $item.active}main-navigation__mobile-link--active{/if}"
                           {if $item.active}aria-current="page"{/if}>
                            {$item.name}
                        </a>
                        
                        {if $item.children}
                        <button type="button" 
                                class="main-navigation__mobile-toggle"
                                x-on:click="open = !open"
                                x-bind:aria-expanded="open"
                                x-bind:aria-label="`${open ? 'Скрыть' : 'Показать'} подменю ${item.name}`">
                            <i class="icon icon--chevron-down" 
                               x-bind:class="{ 'rotate-180': open }"
                               aria-hidden="true"></i>
                        </button>
                        {/if}
                    </div>
                    
                    {if $item.children}
                    <ul class="main-navigation__mobile-submenu"
                        x-show="open"
                        x-collapse>
                        {foreach $item.children as $child}
                        <li class="main-navigation__mobile-submenu-item">
                            <a href="{$child.url}" 
                               class="main-navigation__mobile-submenu-link"
                               {if $child.active}aria-current="page"{/if}>
                                {$child.name}
                            </a>
                        </li>
                        {/foreach}
                    </ul>
                    {/if}
                </li>
                {/foreach}
            </ul>
        </div>
        
        <!-- Overlay -->
        <div class="main-navigation__overlay"
             x-show="mobileOpen"
             x-transition:enter="transition-opacity ease-out duration-300"
             x-transition:enter-start="opacity-0"
             x-transition:enter-end="opacity-100"
             x-on:click="mobileOpen = false"
             aria-hidden="true"></div>
    </div>
</nav>

<script>
Alpine.data('navigation', () => ({
    mobileOpen: false,
    
    init() {
        // Закрываем мобильное меню при изменении размера экрана
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 992) {
                this.mobileOpen = false;
            }
        });
        
        // Управление overflow для body при открытом меню
        this.$watch('mobileOpen', (value) => {
            document.body.style.overflow = value ? 'hidden' : '';
        });
    }
}));
</script>
```

---

## **11. ИНСТРУМЕНТЫ И ВАЛИДАЦИЯ**

### **11.1 Автоматизированная проверка доступности**

**Настройка axe-core для автоматических тестов:**
```javascript
// tests/accessibility.test.js
import { injectAxe, checkA11y, configureAxe } from 'axe-playwright';

describe('Accessibility Tests', () => {
    beforeEach(async () => {
        await page.goto('http://localhost/webasyst/');
        await injectAxe(page);
        
        // Настройка правил axe
        await configureAxe(page, {
            rules: {
                'color-contrast': { enabled: true },
                'keyboard-navigation': { enabled: true },
                'aria-labels': { enabled: true },
                'semantic-markup': { enabled: true }
            }
        });
    });
    
    test('Главная страница доступна', async () => {
        await checkA11y(page, null, {
            detailedReport: true,
            detailedReportOptions: { html: true }
        });
    });
    
    test('Каталог товаров доступен', async () => {
        await page.goto('http://localhost/webasyst/shop/');
        await checkA11y(page, '.shop-catalog');
    });
    
    test('Форма обратной связи доступна', async () => {
        await page.goto('http://localhost/webasyst/contacts/');
        await checkA11y(page, '.contact-form');
    });
});
```
