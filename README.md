# ODDS CONVERTER · Convertidor de momios

Convierte momios **decimales ↔ americanos** al instante. React + Vite + Tailwind CSS + Framer Motion.

🔗 **Demo:** https://raymundoht.github.io/convertidor-de-momios/

## Desarrollo

```bash
npm install
npm run dev      # servidor local
npm test         # pruebas de las fórmulas
npm run build    # genera index.html + assets/ en la raíz (GitHub Pages)
```

## Estructura

- `src/` — código fuente (componentes, lógica en `src/utils/oddsConverter.js`, `src/index.html`)
- `index.html`, `assets/`, `favicon.svg` (raíz) — **build compilado** que sirve GitHub Pages

> Después de cambiar el código, ejecuta `npm run build` y haz commit para actualizar la web.

## GitHub Pages

Settings → Pages → *Deploy from a branch* → `main` / `(root)` → Save.
