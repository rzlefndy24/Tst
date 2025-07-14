import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { linea } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'

const { chains, publicClient } = configureChains(
  [linea],
  [publicProvider()],
)

const config = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true }
    }),
  ],
  publicClient,
})

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={config}>
      <Component {...pageProps} />
    </WagmiConfig>
  )
}
