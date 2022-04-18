module.exports = {
  // tailwind에게 [페이지] 폴더에 있는 모든 폴더 안의 모든 파일명.js.jsx.ts.tsx에서 tailwind를 사용하겠다는 명시
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
