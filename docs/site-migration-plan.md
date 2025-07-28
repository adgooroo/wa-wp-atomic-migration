# Site Application Migration Plan

> **Project:** WordPress → Webasyst **Site** app redesign & migration  
> **Stack:** Bootstrap 5 · Alpine.js · BEM · Atomic Design · Smarty  
> **Author:** _Migration Team_  
> **Status:** Draft v0.1

---

## 1. Objectives

1. Achieve full feature-parity between the current **Site** app and the new UI built on Bootstrap 5 + Alpine.js.
2. Refactor all templates, styles, and scripts to follow **BEM** naming and **Atomic Design** hierarchy (atoms → molecules → organisms → templates → pages).
3. Remove **all external CDN** references; serve every dependency locally.
4. Deliver an accessible, performant, and easily maintainable code-base fully compatible with the latest Webasyst framework.
5. Provide exhaustive documentation and examples so that future contributors can extend the system with minimal onboarding.

---

## 2. Scope

| Area | Included | Excluded |
|------|----------|----------|
| Templates | All public-facing Site templates (index, static pages, search, sitemap, 404) | Admin backend UI |
| CSS | Global reset, utilities, components, layout grid | Third-party theme skins |
| JS | Alpine.js interactive behaviours, navigation, search, UI helpers | Heavyweight libraries (jQuery, Vue, React) |
| Assets | Bootstrap, Alpine.js, icons, fonts, illustrations | Google Fonts CDN |

---

## 3. Current Repository Snapshot

The repository already contains a fully-functional **Waboot** theme. No dedicated **Site** app folder exists yet. This plan introduces the required directory structure under `wa-apps/site/themes/waboot/`.

Proposed structure:
```
site/
└── themes/
    └── waboot-site/
        ├── theme.xml                     # Theme configuration
        ├── templates/                    # Smarty templates
        │   ├── pages/                    # Atomic: pages
        │   │   ├── home.html
        │   │   ├── 404.html
        │   │   └── search.html
        │   ├── templates/                # Atomic: templates
        │   │   └── default.html
        │   ├── organisms/
        │   │   ├── header.html
        │   │   ├── footer.html
        │   │   └── navbar.html
        │   ├── molecules/
        │   │   ├── card.html
        │   │   └── breadcrumb.html
        │   └── atoms/
        │       ├── button.html
        │       └── icon.html
        ├── css/
        │   ├── atoms.css
        │   ├── molecules.css
        │   ├── organisms.css
        │   ├── templates.css
        │   ├── pages.css
        │   └── vendor/
        │       └── bootstrap.min.css
        ├── js/
        │   ├── site.js
        │   └── vendor/
        │       ├── alpine.min.js
        │       └── bootstrap.bundle.min.js
        └── images/
```

---

## 4. Methodology

### 4.1 Bootstrap 5
- Compile **only the required modules** to keep bundle size small (`sass --style=compressed`).
- Use Bootstrap utilities when possible; extend via custom BEM classes when not.

### 4.2 Alpine.js
- Replace legacy jQuery snippets with declarative `x-data`, `x-show`, `x-transition` patterns.
- Global state stored in `Alpine.store('site', { … })` for cart, menu, etc.

### 4.3 BEM Conventions
```css
/* Block */
.site__navbar {}
/* Element */
.site__navbar__item {}
/* Modifier */
.site__navbar--sticky {}
```

### 4.4 Atomic Design Mapping
| Atomic Level | Example Components |
|--------------|-------------------|
| Atoms | Button, Icon, Input |
| Molecules | Card, Breadcrumb, Alert |
| Organisms | Navbar, Footer, Hero |
| Templates | Default Layout, Two-column Layout |
| Pages | Homepage, Article, 404 |

---

## 5. Stage Breakdown & Deliverables

| Stage | Description | PR Target |
|-------|-------------|-----------|
| 1 | **Foundation:** create `theme.xml`, directory skeleton, vendor assets | `site-foundation` |
| 2 | **Atoms:** build reusable atoms; deliver `atoms.css` & template snippets | `site-atoms` |
| 3 | **Molecules:** compose atoms into molecules (cards, breadcrumbs) | `site-molecules` |
| 4 | **Organisms:** header, footer, navigation, pagination | `site-organisms` |
| 5 | **Templates:** default, full-width, sidebar layouts | `site-templates` |
| 6 | **Pages:** home, 404, search, sitemap | `site-pages` |
| 7 | **Integration:** hook templates into Webasyst routing, QA testing | `site-integration` |
| 8 | **Docs & Readme:** update guides, screenshots, usage instructions | `site-docs` |

Each stage is delivered via **one pull request per logical unit**. CI checklist per PR:
1. Runs `php -l` against templates (basic syntax check).
2. Validates CSS with `stylelint` & HTML with `html-validator`.
3. Lighthouse performance budget (> 90).  
   *(Local GitHub Action defined later.)*

---

## 6. Asset Strategy (Local-Only)

1. Download exact versions:
   - `bootstrap@5.3.2` → `css/vendor/bootstrap.min.css`, `js/vendor/bootstrap.bundle.min.js`
   - `alpinejs@3.13.3` → `js/vendor/alpine.min.js`
2. Place fonts and icons in `fonts/` and `images/icons/`.
3. Reference assets via `{$wa_theme_url}` to respect Webasyst’s theme URL helper.

---

## 7. SASS / SCSS Workflow

Because Webasyst hosting environments often restrict Node/Gulp, we recommend **native `sass` CLI** with a tiny Bash helper:
```bash
sass --watch scss:css --style=compressed
```
Optionally commit the transpiled CSS for production; keep SCSS sources in repo for transparency.

---

## 8. Accessibility & SEO Targets
- WCAG 2.2 AA minimum.
- All pages achieve Lighthouse Accessibility score ≥ 95.
- Structured data via JSON-LD breadcrumbs & article schema.

---

## 9. Open Questions / Next Steps
1. Confirm if legacy Site templates use PHP helpers not yet ported.
2. Decide whether to include optional icon library (e.g., **Bootstrap Icons**) locally.
3. Define CI pipeline inside `.github/workflows/lint.yml`.

---

### Appendix A — Template Naming Matrix
| Legacy PHP File | New Smarty Partial | Atomic Tier |
|-----------------|--------------------|-------------|
| `index.html` | `pages/home.html` | Page |
| `header.html` | `organisms/header.html` | Organism |
| `footer.html` | `organisms/footer.html` | Organism |
| `menu.html` | `organisms/navbar.html` | Organism |
| `article.html` | `templates/default.html` | Template |
| `breadcrumb.html` | `molecules/breadcrumb.html` | Molecule |
| `button.html` | `atoms/button.html` | Atom |

---

_End of Plan_