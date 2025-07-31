# Спецификации миграции Webasyst тем

[Индекс проекта](010-index.md)

## Детальные спецификации

### 1. Структура каталогов

#### Текущая неправильная структура:
```
wa-wp-atomic-migration/
├── waboot/
│   ├── theme.xml
│   ├── css/
│   ├── js/
│   ├── templates/
│   └── locale/
├── shop-themes/waboot-child/
│   ├── theme.xml
│   ├── css/
│   ├── js/
│   └── templates/
├── site-app/
│   ├── lib/
│   ├── themes/default/
│   └── locale/
└── docs/
```

#### Целевая правильная структура:
```
wa-apps/
├── site/
│   ├── themes/
│   │   └── waboot/           # Родительская тема
│   │       ├── theme.xml
│   │       ├── css/
│   │       ├── js/
│   │       ├── templates/
│   │       └── locale/
│   ├── lib/
│   └── locale/
├── shop/
│   ├── themes/
│   │   └── waboot/           # Наследует от site:waboot
│   │       ├── theme.xml
│   │       ├── css/
│   │       ├── js/
│   │       ├── templates/
│   │       └── locale/
│   ├── lib/
│   └── locale/
├── blog/
│   ├── themes/
│   │   └── waboot/           # Наследует от site:waboot
│   ├── lib/
│   └── locale/
├── hub/
│   ├── themes/
│   │   └── waboot/           # Наследует от site:waboot
│   ├── lib/
│   └── locale/
└── mailer/
    ├── themes/
    │   └── waboot/           # Наследует от site:waboot
    ├── lib/
    └── locale/
```

### 2. Наследование тем

#### wa-apps/site/themes/waboot/theme.xml (родительская тема):
```xml
<?xml version="1.0" encoding="utf-8"?>
<theme>
    <name>Waboot</name>
    <version>1.0.0</version>
    <description>Base theme for all Webasyst applications</description>
    <author>Webasyst Team</author>
    <system>1</system>
    <parent_theme></parent_theme>
    <locales>
        <locale>en_US</locale>
        <locale>ru_RU</locale>
    </locales>
</theme>
```

#### wa-apps/shop/themes/waboot/theme.xml (дочерняя тема):
```xml
<?xml version="1.0" encoding="utf-8"?>
<theme>
    <name>Waboot Shop</name>
    <version>1.0.0</version>
    <description>Shop theme inheriting from site:waboot</description>
    <author>Webasyst Team</author>
    <system>1</system>
    <parent_theme>site:waboot</parent_theme>
    <locales>
        <locale>en_US</locale>
        <locale>ru_RU</locale>
    </locales>
</theme>
```

### 3. Принципы устранения дублирования

#### Базовые компоненты (в родительской теме):
- CSS: atoms, molecules, organisms (общие)
- JS: базовые компоненты и утилиты
- Шаблоны: общие атомы, молекулы, организмы

#### Специфичные компоненты (в дочерних темах):
- CSS: специфичные для приложения стили
- JS: специфичная для приложения логика
- Шаблоны: специфичные для приложения шаблоны

### 4. Правила миграции

1. **Сохранение функциональности** - все существующие функции должны работать
2. **Совместимость** - структура должна соответствовать Webasyst Framework
3. **Производительность** - устранение дублирования для оптимизации
4. **Поддерживаемость** - упрощение структуры для легкой поддержки