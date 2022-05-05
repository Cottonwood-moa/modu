import "../styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot, useRecoilValue } from "recoil";
import { SWRConfig } from "swr";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import "@fontsource/gugi";
import "@fontsource/noto-sans-kr";
const fetcher = (url: string) => fetch(url).then((response) => response.json());

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>modu</title>
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="modu" />
        <meta property="og:title" content="modu" />
        <meta property="og:description" content="블라블라" />
        <meta property="og:image" content="/images/modu.png" />
        <meta property="og:url" content="https://modu.vercel.app" />
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:site" content="modu" />
        <meta property="twitter:title" content="modu" />
        <meta property="twitter:description" content="블라블라" />
        <meta property="twitter:image" content="/images/modu.png" />
        <meta property="twitter:url" content="https://modu.vercel.app" />
        <meta
          name="google-site-verification"
          content="jP_LRgp2ourifn-dveaqSx3v-cBhd7cwuHbUlM6bsA4"
        />
      </Head>
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
    </>
  );
}

export default MyApp;
