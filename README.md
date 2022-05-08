# 👨‍👩‍👦‍👦 [modu](https://modu.vercel.app/)  <- 클릭  

![modu](https://user-images.githubusercontent.com/79053495/167311059-f9d3c49d-34ba-4d26-9ecb-b6134c0302c8.png)  

React 개발자를 위한 HOOK 공유 사이트.

modu는 리액트 개발자를 위한 커스텀 훅이나 패키지 등을 공유하기 위한 사이트 입니다.

리액트는 이미 레딧, 페이스북 , 해쉬노드 등 거대한 커뮤니티 들이 많지만

정작 필요한 훅이나 패키지에 대한 정보들을 찾기가 쉽지 않았습니다.

이 사이트는 오직 그것만을 위해 만든 저 개인의 욕심이 투영된 사이트 입니다.

여러분들이 사용한 강력한 훅이나 패키지 등을 자유롭게 공유해주세요.

투고된 게시물은 즉시 정적 사이트로 생성되며 SEO에 최적화 되어 있습니다.

***

### - dark mode  
![dark](https://user-images.githubusercontent.com/79053495/167310139-983d39b3-b075-425a-8587-734238e980ac.gif)  

### - markdown code block  
![image](https://user-images.githubusercontent.com/79053495/167311138-11b0b019-7b5d-4596-a9c6-b443c42d6566.png)  

### - profile  
![profile](https://user-images.githubusercontent.com/79053495/167310138-4ca10a12-3e62-442e-9a5e-bd4b77d539d3.gif)  

![profileEdit](https://user-images.githubusercontent.com/79053495/167310137-0c5d7b24-7fe2-4b8a-955d-d49f2c76a911.gif)  
   
### - write
![write](https://user-images.githubusercontent.com/79053495/167310134-32a8fbf8-e589-43bf-9da4-877e3ac013c1.gif)  

### - comment  
![comment](https://user-images.githubusercontent.com/79053495/167310133-0ec4ac29-2b91-44c6-9e59-6ad343b1c227.gif)  

### - delete  
![delete](https://user-images.githubusercontent.com/79053495/167310131-d73e10a1-7ee7-4924-b523-62d83e83570f.gif)  

### - like  
![favs](https://user-images.githubusercontent.com/79053495/167310132-1b36a817-8631-43d8-8ae6-22d049447e13.gif)  

### - npm chart  
![chart](https://user-images.githubusercontent.com/79053495/167310126-33a34aa6-7dbc-4b5e-8371-d3fe759e8608.gif)  

![ranking](https://user-images.githubusercontent.com/79053495/167310140-4c593e4b-9807-455f-8b5a-7f5a1dfe93b5.gif)  

### - alert  
![image](https://user-images.githubusercontent.com/79053495/167311321-26d4edf2-79fd-4f2d-971f-0c7500196780.png)  


## 📖 Docs

- [Next.js](https://nextjs.org/docs)
- [Typescript](https://www.typescriptlang.org/)
- [Tailwindcss](https://tailwindcss.com/)
- [SWR](https://swr.vercel.app/ko)
- [Prisma](https://www.prisma.io/)
- [Planet Scale](https://planetscale.com/)
- [CloudFlare](https://www.cloudflare.com/ko-kr/)
  
## 💡 Specs

- Next.js + Typescript Severless application
- Next RestAPI 구축.
- SWR data fetching
- SWR Infinite Loading.
- SSR + SSG 
- Incremental Static Regeneration
- ORM - Prisma
- Serverless DB - Planet Scale
- Next Auth
- CRUD / post, comment, reply
- CloudFlare image 저장 및 최적화.
- tailwind css -> application UI 생산성 상향.
- Dark Mode
- Skeleton UI
- Lazy loading
- markdown 지원
- recoil state 관리
- framer motion ui
- vercel 배포
- Lazy hydration

## 🛠 Vitals  
![webVitals](https://user-images.githubusercontent.com/79053495/167311081-9e016f84-bbdc-4adf-8ede-863ff6d05e03.png)

### 구성

```json
{
  "name": "modu",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@fontsource/gugi": "^4.5.8",
    "@fontsource/noto-sans-kr": "^4.5.9",
    "@next-auth/prisma-adapter": "^1.0.3",
    "@prisma/client": "^3.12.0",
    "@tailwindcss/forms": "^0.5.0",
    "@toast-ui/editor-plugin-color-syntax": "^3.0.3",
    "@toast-ui/react-editor": "^3.1.3",
    "@types/randomcolor": "^0.5.6",
    "@types/react-outside-click-handler": "^1.3.1",
    "@types/react-syntax-highlighter": "^13.5.2",
    "@types/styled-components": "^5.1.25",
    "apexcharts": "^3.35.0",
    "framer-motion": "^6.3.0",
    "intercept-stdout": "^0.1.2",
    "next": "12.1.4",
    "next-auth": "^4.3.2",
    "randomcolor": "^0.6.2",
    "react": "18.0.0",
    "react-apexcharts": "^1.4.0",
    "react-dom": "18.0.0",
    "react-hook-form": "^7.30.0",
    "react-intersection-observer": "^8.34.0",
    "react-lazy-hydration": "^0.1.0",
    "react-markdown": "^8.0.3",
    "react-outside-click-handler": "^1.3.0",
    "react-syntax-highlighter": "^15.5.0",
    "recoil": "^0.7.2",
    "rehype-raw": "^6.1.1",
    "rehype-stringify": "^9.0.3",
    "remark-gfm": "^3.0.1",
    "remark-html": "^15.0.1",
    "remark-parse": "^10.0.1",
    "remark-rehype": "^10.1.0",
    "sharp": "^0.30.4",
    "styled-components": "^5.3.5",
    "sweetalert2": "^11.4.8",
    "sweetalert2-react-content": "^5.0.0",
    "swr": "^1.3.0",
    "unified": "^10.1.2"
  },
  "devDependencies": {
    "@types/node": "17.0.23",
    "@types/react": "17.0.43",
    "@types/react-dom": "17.0.14",
    "autoprefixer": "^10.4.4",
    "eslint": "8.12.0",
    "eslint-config-next": "12.1.4",
    "postcss": "^8.4.12",
    "prettier": "^2.6.2",
    "prettier-plugin-prisma": "^3.12.0",
    "prettier-plugin-tailwindcss": "^0.1.8",
    "prisma": "^3.12.0",
    "tailwind-styled-components": "^2.1.6",
    "tailwindcss": "^3.0.23",
    "typescript": "4.6.3"
  }
}



```
