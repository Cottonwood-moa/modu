import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { SessionProvider } from "next-auth/react";
const fetcher = (url: string) => fetch(url).then((response) => response.json());

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider
      // Provider options are not required but can be useful in situations where
      // you have a short session maxAge time. Shown here with default values.
      session={pageProps?.session}
    >
      <SWRConfig value={{ fetcher }}>
        <Component {...pageProps} />
      </SWRConfig>
    </SessionProvider>
  );
}

export default MyApp;
