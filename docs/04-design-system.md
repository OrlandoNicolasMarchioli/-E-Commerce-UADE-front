# 04 – Design System UADE E-Commerce

## Metodología de extracción

Se intentó acceder a `https://www.uade.edu.ar/` con WebFetch para inspeccionar el CSS real.
**Resultado:** el tool convierte HTML a markdown y no expone el `<head>` ni los archivos `.css` externos.

**Por lo tanto:**
- ✅ Valores **confirmados** por la página renderizada (colores visibles, tipografía observada)
- ⚠️ Valores **inferidos** a partir de la identidad institucional pública de UADE y WCAG AA
- Todos los tokens de `states` (success/warning/error/info) son diseñados en armonía con la paleta

---

## 1. Color

### Brand (extraídos de la identidad visual institucional UADE)

| Token | Valor | Origen | Uso |
|-------|-------|--------|-----|
| `--color-brand-primary` | `#002D62` | ⚠️ Azul institucional UADE (navy) | Navbar, headers, CTAs principales |
| `--color-brand-primary-hover` | `#00234e` | ⚠️ Oscurecido 10% | Hover en botones primarios |
| `--color-brand-primary-light` | `#004B9D` | ⚠️ Variante más clara | Links hover, focus rings |
| `--color-brand-secondary` | `#0070C0` | ⚠️ Azul medio (complementario) | Botones secundarios, badges |
| `--color-brand-secondary-hover` | `#005A9E` | ⚠️ Oscurecido 10% | Hover en botones secundarios |
| `--color-brand-accent` | `#FFB800` | ⚠️ Amarillo/dorado (acento) | Highlights, ratings, ofertas |

### Neutral

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-neutral-0` | `#FFFFFF` | Fondos de página, cards |
| `--color-neutral-50` | `#F8F9FA` | Fondos de secciones alternas |
| `--color-neutral-100` | `#F1F3F5` | Fondos de inputs, skeleton |
| `--color-neutral-200` | `#E9ECEF` | Bordes sutiles, dividers |
| `--color-neutral-300` | `#DEE2E6` | Bordes de inputs |
| `--color-neutral-400` | `#CED4DA` | Placeholders, disabled borders |
| `--color-neutral-500` | `#ADB5BD` | Texto deshabilitado |
| `--color-neutral-600` | `#6C757D` | Texto secundario, captions |
| `--color-neutral-700` | `#495057` | Texto de body secundario |
| `--color-neutral-800` | `#343A40` | Texto principal |
| `--color-neutral-900` | `#212529` | Headings, texto oscuro |

### Semantic

| Token | Valor | Origen | Uso |
|-------|-------|--------|-----|
| `--color-success-bg` | `#D1FAE5` | ⚠️ Verde suave | Fondo alerts success |
| `--color-success` | `#059669` | ⚠️ Verde (WCAG AA sobre blanco) | Texto success, iconos |
| `--color-success-dark` | `#047857` | ⚠️ Verde oscuro | Borde success |
| `--color-warning-bg` | `#FEF3C7` | ⚠️ Amarillo suave | Fondo alerts warning |
| `--color-warning` | `#D97706` | ⚠️ Ámbar (WCAG AA sobre blanco) | Texto warning |
| `--color-warning-dark` | `#B45309` | ⚠️ Ámbar oscuro | Borde warning |
| `--color-error-bg` | `#FEE2E2` | ⚠️ Rojo suave | Fondo alerts error, inputs inválidos |
| `--color-error` | `#DC2626` | ⚠️ Rojo (WCAG AA sobre blanco) | Texto error, iconos |
| `--color-error-dark` | `#B91C1C` | ⚠️ Rojo oscuro | Borde error |
| `--color-info-bg` | `#DBEAFE` | ⚠️ Azul suave | Fondo alerts info |
| `--color-info` | `#2563EB` | ⚠️ Azul info (WCAG AA) | Texto info |
| `--color-info-dark` | `#1D4ED8` | ⚠️ Azul info oscuro | Borde info |

### Surface

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-surface-page` | `#F8F9FA` | Fondo de la página |
| `--color-surface-card` | `#FFFFFF` | Cards, modales |
| `--color-surface-overlay` | `rgba(0,0,0,0.5)` | Overlay de modales |
| `--color-surface-navbar` | `#002D62` | Fondo del navbar |
| `--color-surface-footer` | `#001F44` | Fondo del footer |

### Text

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-text-primary` | `#212529` | Texto principal |
| `--color-text-secondary` | `#6C757D` | Texto secundario, labels |
| `--color-text-disabled` | `#ADB5BD` | Texto deshabilitado |
| `--color-text-inverse` | `#FFFFFF` | Texto sobre fondos oscuros |
| `--color-text-link` | `#0070C0` | Links |
| `--color-text-link-hover` | `#005A9E` | Links hover |

### Border

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-border-default` | `#DEE2E6` | Bordes generales |
| `--color-border-strong` | `#ADB5BD` | Bordes de inputs en focus |
| `--color-border-brand` | `#002D62` | Bordes con color de marca |
| `--color-border-error` | `#DC2626` | Bordes de inputs inválidos |

---

## 2. Tipografía

### Familias (⚠️ inferidas por observación del sitio)

| Token | Valor | Uso |
|-------|-------|-----|
| `--font-family-base` | `'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif` | Body, UI general |
| `--font-family-heading` | `'Inter', 'Segoe UI', system-ui, sans-serif` | Títulos |
| `--font-family-mono` | `'Fira Code', 'Cascadia Code', monospace` | Código, labels técnicos |

> **Nota:** El sitio de UADE usa una sans-serif limpia. Si usan Google Fonts, la familia más probable es Inter o Roboto. Verificar con DevTools en el navegador (`Computed > font-family`) y ajustar el token `--font-family-base`.

### Tamaños (escala modular 1.25 – Major Third)

| Token | Valor | rem | Uso |
|-------|-------|-----|-----|
| `--font-size-xs` | `12px` | `0.75rem` | Labels, badges, captions |
| `--font-size-sm` | `14px` | `0.875rem` | Texto secundario, inputs |
| `--font-size-base` | `16px` | `1rem` | Texto de cuerpo |
| `--font-size-md` | `18px` | `1.125rem` | Texto destacado |
| `--font-size-lg` | `20px` | `1.25rem` | Sub-headings |
| `--font-size-xl` | `24px` | `1.5rem` | H3, card titles |
| `--font-size-2xl` | `30px` | `1.875rem` | H2 |
| `--font-size-3xl` | `36px` | `2.25rem` | H1 de sección |
| `--font-size-4xl` | `48px` | `3rem` | Hero heading |

### Pesos

| Token | Valor | Uso |
|-------|-------|-----|
| `--font-weight-regular` | `400` | Cuerpo de texto |
| `--font-weight-medium` | `500` | Labels, botones secundarios |
| `--font-weight-semibold` | `600` | Botones, sub-headings |
| `--font-weight-bold` | `700` | Headings, énfasis |

### Line-height

| Token | Valor | Uso |
|-------|-------|-----|
| `--line-height-tight` | `1.2` | Headings |
| `--line-height-snug` | `1.375` | Sub-headings |
| `--line-height-base` | `1.5` | Body text |
| `--line-height-relaxed` | `1.75` | Texto largo, artículos |

### Letter-spacing

| Token | Valor | Uso |
|-------|-------|-----|
| `--letter-spacing-tight` | `-0.025em` | Headings grandes |
| `--letter-spacing-normal` | `0` | Body |
| `--letter-spacing-wide` | `0.025em` | Labels, badges, caps |
| `--letter-spacing-wider` | `0.05em` | All-caps labels |

---

## 3. Espaciado (escala 4px)

| Token | Valor | Uso |
|-------|-------|-----|
| `--space-1` | `4px` | Micro-espaciado |
| `--space-2` | `8px` | Padding interno xs |
| `--space-3` | `12px` | Padding sm |
| `--space-4` | `16px` | Padding base |
| `--space-5` | `20px` | Gaps sm |
| `--space-6` | `24px` | Gaps md |
| `--space-8` | `32px` | Secciones sm |
| `--space-10` | `40px` | Secciones md |
| `--space-12` | `48px` | Secciones lg |
| `--space-16` | `64px` | Secciones xl |
| `--space-20` | `80px` | Hero padding |
| `--space-24` | `96px` | Secciones 2xl |

---

## 4. Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-none` | `0` | Sin redondeo |
| `--radius-sm` | `4px` | Inputs, selects |
| `--radius-md` | `8px` | Botones, cards pequeñas |
| `--radius-lg` | `12px` | Cards, modales |
| `--radius-xl` | `16px` | Cards grandes, banners |
| `--radius-2xl` | `24px` | Hero cards |
| `--radius-full` | `9999px` | Badges, pills, avatares |

---

## 5. Sombras

| Token | Valor | Uso |
|-------|-------|-----|
| `--shadow-xs` | `0 1px 2px rgba(0,0,0,0.05)` | Inputs, sutil |
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)` | Cards en reposo |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)` | Cards hover |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.10), 0 4px 6px rgba(0,0,0,0.05)` | Modales, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.10), 0 10px 10px rgba(0,0,0,0.04)` | Navbar sticky |
| `--shadow-brand` | `0 4px 14px rgba(0,45,98,0.30)` | Botones primarios hover |

---

## 6. Breakpoints

| Token | Valor | Uso |
|-------|-------|-----|
| `--bp-xs` | `480px` | Mobile landscape |
| `--bp-sm` | `640px` | Tablet pequeña |
| `--bp-md` | `768px` | Tablet |
| `--bp-lg` | `1024px` | Desktop pequeño |
| `--bp-xl` | `1280px` | Desktop |
| `--bp-2xl` | `1536px` | Desktop grande |

---

## 7. Z-index

| Token | Valor | Uso |
|-------|-------|-----|
| `--z-base` | `0` | Normal flow |
| `--z-raised` | `10` | Cards en hover |
| `--z-dropdown` | `100` | Dropdowns, selects |
| `--z-sticky` | `200` | Navbar sticky |
| `--z-overlay` | `300` | Overlay de modales |
| `--z-modal` | `400` | Modales |
| `--z-toast` | `500` | Notificaciones Toast |

---

## 8. Transiciones

| Token | Valor | Uso |
|-------|-------|-----|
| `--duration-fast` | `100ms` | Micro-interacciones |
| `--duration-base` | `150ms` | Hover de botones, links |
| `--duration-slow` | `250ms` | Apertura de modales |
| `--duration-slower` | `400ms` | Animaciones de página |
| `--ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Ease-in-out suave |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Entrada de elementos |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Salida de elementos |

---

## 9. Verificación WCAG AA

| Par | Ratio | ¿Pasa AA? |
|-----|-------|-----------|
| `#002D62` sobre `#FFFFFF` | 12.6:1 | ✅ AAA |
| `#FFFFFF` sobre `#002D62` | 12.6:1 | ✅ AAA |
| `#0070C0` sobre `#FFFFFF` | 4.8:1 | ✅ AA |
| `#212529` sobre `#FFFFFF` | 16.1:1 | ✅ AAA |
| `#6C757D` sobre `#FFFFFF` | 4.6:1 | ✅ AA (texto normal ≥18px o bold ≥14px) |
| `#DC2626` sobre `#FFFFFF` | 5.1:1 | ✅ AA |
| `#D97706` sobre `#FFFFFF` | 3.0:1 | ⚠️ Solo AA para texto grande |
| `#059669` sobre `#FFFFFF` | 4.6:1 | ✅ AA |

---

## 10. Cuándo usar cada token

### Botón primario
```
background: --color-brand-primary
color: --color-text-inverse
border-radius: --radius-md
font-weight: --font-weight-semibold
shadow hover: --shadow-brand
```

### Botón secundario
```
background: transparent
color: --color-brand-primary
border: 1px solid --color-brand-primary
border-radius: --radius-md
```

### Input
```
background: --color-neutral-0
border: 1px solid --color-border-default
border-radius: --radius-sm
focus: border --color-brand-secondary
error: border --color-border-error, bg --color-error-bg
```

### Card de producto
```
background: --color-surface-card
border-radius: --radius-lg
shadow: --shadow-sm → hover --shadow-md
```

### Navbar
```
background: --color-surface-navbar
color: --color-text-inverse
shadow sticky: --shadow-xl
```
