# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Mobile Responsive Features

This application includes mobile-friendly optimizations:
- Responsive layout for different screen sizes
- Mobile-optimized touch targets (44px minimum)
- Proper iOS form handling
- Home screen app capabilities

## Generating App Icons

To generate proper PNG icons from the SVG template:

1. Install the required dependency:
   ```
   npm install sharp
   ```

2. Run the icon generation script:
   ```
   node public/generate-icons.js
   ```

This will create all the necessary icon sizes for web and mobile platforms.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
