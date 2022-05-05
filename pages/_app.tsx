import "../styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot, useRecoilValue } from "recoil";
import { SWRConfig } from "swr";
import { SessionProvider } from "next-auth/react";
import "@fontsource/gugi";
import "@fontsource/noto-sans-kr";
const fetcher = (url: string) => fetch(url).then((response) => response.json());

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider
      // Provider options are not required but can be useful in situations where
      // you have a short session maxAge time. Shown here with default values.
      session={pageProps?.session}
    >
      <SWRConfig value={{ fetcher }}>
        <RecoilRoot>
          <div>
            <Component {...pageProps} />
          </div>
        </RecoilRoot>
      </SWRConfig>
    </SessionProvider>
  );
}

export default MyApp;
