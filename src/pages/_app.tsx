import { AppProps } from 'next/app';
import { Header } from '../components/Header';
import '../styles/global.scss'
import { Provider as NextAuthProvider } from 'next-auth/client'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

const initialOptions = {
  "client-id":"AQcuvvfWjzW4BWXHLjaQKJJrls677ruwTkeiOpG2YCshd1EXknpjdPfi1uGnIPvA4xAAurtaC8yyeWt0",
  currency: "BRL",
  intent: "capture"
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <PayPalScriptProvider options={initialOptions}>
      <Header />
      <Component {...pageProps} />
      </PayPalScriptProvider>
    </NextAuthProvider>
  )
}

export default MyApp
