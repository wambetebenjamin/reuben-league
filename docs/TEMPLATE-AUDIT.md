# Template audit: Stamina by Free-Template.co

Reference copy of the uploaded archive: `stamina-master.zip` (179 files, 7.4 MB). Nothing in the zip was renamed,
removed or moved. The Next.js application is built on top of the same structure and keeps the template's CSS values,
type stack and section patterns.

## 1. ZIP structure (read only reference)

```
stamina-master/
├── .DS_Store
├── css/
│   ├── aos.css
│   ├── bootstrap-datepicker.css
│   ├── bootstrap.min.css
│   ├── bootstrap.min.css.map
│   ├── bootstrap/
│   │   ├── bootstrap-grid.css
│   │   └── bootstrap-reboot.css
│   ├── jquery-ui.css
│   ├── jquery.fancybox.min.css
│   ├── jquery.mb.YTPlayer.min.css
│   ├── magnific-popup.css
│   ├── mediaelementplayer.css
│   ├── owl.carousel.min.css
│   ├── owl.theme.default.min.css
│   └── style.css
├── fonts/
│   ├── flaticon/
│   │   ├── backup.txt
│   │   ├── font/ (Flaticon.eot, .svg, .ttf, .woff, .woff2, _flaticon.css, _flaticon.scss,
│   │   │           flaticon.css, flaticon.html)
│   │   └── license/license.pdf
│   └── icomoon/
│       ├── Read Me.txt
│       ├── demo-files/ (demo.css, demo.js)
│       ├── demo.html
│       ├── fonts/ (icomoon.eot, .svg, .ttf, .woff)
│       ├── selection.json
│       └── style.css
├── images/
│   ├── bg_1.jpg, bg_2.jpg, bg_3.jpg
│   ├── img_1.jpg, img_2.jpg, img_3.jpg, img_4.jpg, img_5.jpg
│   └── person_1.jpg, person_2.jpg, person_3.jpg, person_4.jpg
├── js/ (aos, bootstrap-datepicker, bootstrap.min, jquery-3.3.1.min, jquery-migrate-3.0.1.min, jquery-ui,
│        jquery.countdown.min, jquery.easing.1.3, jquery.fancybox.min, jquery.magnific-popup.min,
│        jquery.mb.YTPlayer.min, jquery.stellar.min, jquery.sticky, main, mediaelement-and-player.min,
│        owl.carousel.min, popper.min, slick.min, typed)
├── scss/
│   ├── _site-base.scss, _site-blocks.scss, _site-navbar.scss, style.scss
│   └── bootstrap/ (full Bootstrap 4 Sass source plus mixins and utilities)
├── ftco-32x32.png
├── index.html
├── prepros-6.config
└── single.html
```

## 2. Audit checklist

| Item | Where it lives in the zip | Status in this build |
| --- | --- | --- |
| CSS custom properties | None. `css/style.css` and `scss/_site-base.scss` use literal hex values and Bootstrap Sass variables only. | Token layer created in `app/globals.css` with every template hex value, see below. |
| `@font-face` rules | 4 in total: Flaticon (`fonts/flaticon/font/_flaticon.css` lines 5 and 13 media query), icomoon (`fonts/icomoon/style.css` line 1), YTP regular (`css/jquery.mb.YTPlayer.min.css`, embedded base64). Muli itself is loaded from Google Fonts in `index.html`, with no local `@font-face`. | Flaticon, icomoon and the Muli weights are declared verbatim in `app/globals.css`; Muli is self hosted in `public/fonts/muli/`. YTP is a player asset and is not loaded. |
| Loading screen | Absent | Built: `components/layout/LoadingScreen.tsx` (rolling football, wordmark, percentage, skip after 3s, reduced motion fallback). |
| Cookie consent banner | Absent | Built: `components/layout/CookieConsent.tsx` with `reuben-league-cookie-consent` in local storage. |
| CAPTCHA integration | Absent | Built: reCAPTCHA v3 invisible plus visible v2 fallback, `components/forms/recaptcha.tsx`, verified in `lib/recaptcha.ts`. |
| `/legal/privacy-policy` | Absent | Built (KDPA 2019 compliant). |
| `/legal/terms` | Absent | Built. |
| `/legal/cookie-policy` | Absent | Built. |
| 404 page | Absent | Built: `app/not-found.tsx`. |
| 500 page | Absent | Built: `app/(site)/500/page.tsx`, plus `app/error.tsx` and `app/global-error.tsx`. |
| API routes | None, the template is static HTML | Added under `app/api/` (see README). |
| `.env` variables | None, no build step or server in the template | Added in `.env.example` and Step 10 of the brief. |

## 3. Template tokens kept

### Colours (literal values from `css/style.css`)

| Token | Value | Source rule |
| --- | --- | --- |
| `--rl-primary` | `#f23a2e` | `.btn.btn-primary:hover`, `.site-logo a span`, `.schedule-wrap`, `.days li a.active` |
| `--rl-primary-soft` | `#ff7c67` | `.class-item:hover p` |
| `--rl-accent` | `#f89d13` | `.schedule-wrap .cta a` |
| `--rl-green` | `#8bc34a` | Bootstrap `$green` used by the template |
| `--rl-black` | `#000000` | `h1`-`h5`, `.bg-black`, `::selection` |
| `--rl-ink-soft` | `#25262a` | dropdown hover text |
| `--rl-ink-muted` | `#343a40` | dropdown links |
| `--rl-body` | `#989898` | `body` colour |
| `--rl-muted` | `#ababab` | `.section-heading .subheading` |
| `--rl-muted-2` | `#aeaeae` | `.class-item-text span` |
| `--rl-silver` | `#999999` | `.site-footer a` |
| `--rl-line` | `#edf0f5` | `.border-top`, table borders |
| `--rl-line-soft` | `#f3f3f4` | navbar border |
| `--rl-surface` | `#f4f5f9` | dropdown hover background |
| `--rl-surface-2` | `#f8f9fa` | Bootstrap light surface |
| `--rl-chip` | `#cccccc` | `.block-14 .owl-dots .owl-dot > span` |
| `--rl-white` | `#ffffff` | `.btn.btn-white`, hero text |

No gold, no gradients, no dark chrome beyond the template's own black sections.

### Type

```
--font-sans: 'Muli', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
  sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
```

Weights loaded: 300 (body), 400, 700, 900. The template heading treatment, uppercase 900 button labels
(`.btn` rules) and 1.7 body line height are carried over.

### Section patterns reused

- Full bleed dark opener: `.intro-section` (hero treatment adapted into an ink section so the 2026 photos stay sharp).
- Skewed red strip: `.schedule-wrap` and `.schedule-wrap:before` with `transform: skew(-12deg, 0deg)`.
- Photo band: `.bgimg` with `rgba(0,0,0,0.4)` overlay and white 900 heading.
- Cards: `.class-item` shadow `0 5px 20px 0 rgba(0,0,0,.1)` and 4px radius, now `.rl-card`.
- Feature blocks: `.ftco-feature-1` hover shadow, now `.rl-feature`.
- Forms: `.form-control` 2px border, square corners, red focus border, now `.rl-input`.
- Footer: `.site-footer` black surface with 16px uppercase 900 headings.

## 4. What changed for Reuben League

Content, imagery and branding only. The template's Bootstrap and jQuery bundles are not used at runtime, because
the brief requires Next.js, Tailwind v4 and React components; the CSS values, type stack and section patterns are
reproduced instead. Template photographs are archived in `public/images/template/` and are not rendered.
