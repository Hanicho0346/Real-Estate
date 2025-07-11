# 🏡 Real Estate Web App – React + TypeScript + Vite

This project is a Real Estate Web Application built with **React**, **TypeScript**, and **Vite** for fast development and great developer experience. It supports hot module replacement (HMR), optimized build process, and includes linting configurations for clean and scalable code.

---

## ⚙️ Tech Stack

* **React** – UI library
* **TypeScript** – Static typing
* **Vite** – Lightning-fast bundler and dev server
* **ESLint** – Linting and code quality
* **React Router** – Routing between pages
* **Tailwind CSS** (optional) – Utility-first styling (if used)
* **Nodejs** For backend
* **Express**

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Hanicho0346/Real-Estate.git
cd HOUSE-RENT
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## ✅ ESLint Configuration

This project includes a TypeScript-aware ESLint setup. For production-level applications, we recommend using stricter and stylistic rules.

### Recommended ESLint config

```ts
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

### Optional Plugins

Add these plugins for React-specific best practices:

```ts
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
  plugins: {
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```



## 📦 Build

```bash
npm run build
```

---

## ✨ Features

* Property Listings and Details
* Search and Filter Functionality
* Responsive Design
* Clean Code with ESLint and TypeScript
* Fast Refresh with Vite

---


