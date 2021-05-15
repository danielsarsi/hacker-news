import '../styles/globals.css'

import { AppProps } from 'next/app'

function HackerNews({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default HackerNews
