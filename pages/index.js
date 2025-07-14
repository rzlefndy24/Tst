import { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useChainId, useSigner } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { getLineaSDK } from '../lib/linea'
import { ethers } from 'ethers'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()
  const { data: signer } = useSigner()
  const [messageHash, setMessageHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [chainError, setChainError] = useState(null)
  const chainId = useChainId()

  const lineaRpcUrl = "https://rpc.linea.build"
  const lineaChainId = 59144

  // Cek jika user sudah di jaringan Linea
  const isLinea = chainId === lineaChainId

  const handleClaim = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setChainError(null)

    if (!isLinea) {
      setChainError('Please switch to Linea Mainnet network!')
      setLoading(false)
      return
    }

    try {
      const l1Provider = new ethers.providers.JsonRpcProvider(lineaRpcUrl)
      const l2Provider = new ethers.providers.JsonRpcProvider(lineaRpcUrl)

      const sdk = getLineaSDK({
        l1Provider,
        l2Provider,
        l1Signer: signer,
        l2Signer: signer,
      })

      const l2Contract = sdk.getL2Contract()
      const l1ClaimingService = sdk.getL1ClaimingService()

      const message = await l2Contract.getMessageByMessageHash(messageHash)
      if (!message) throw new Error("Message tidak ditemukan di L2")

      const status = await l1ClaimingService.getMessageStatus(messageHash)

      if (status !== 2) { // 2 = CLAIMABLE
        setResult({ error: "Message belum claimable atau sudah di-claim", status })
        setLoading(false)
        return
      }

      // Transaksi klaim via wallet user
      const tx = await l1ClaimingService.claimMessage(message)
      setResult({ success: true, txHash: tx.hash })
    } catch (e) {
      setResult({ error: e.message })
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 32 }}>
      <h1>Linea Bridge – Claim Token</h1>

      {!isConnected ? (
        <button onClick={() => connect()} style={{ marginBottom: 24, width: '100%' }}>
          Connect Wallet
        </button>
      ) : (
        <>
          <div style={{ color: '#333', marginBottom: 8 }}>
            Connected: <b>{address.slice(0, 8)}...{address.slice(-6)}</b>
            <button onClick={() => disconnect()} style={{ marginLeft: 16 }}>Disconnect</button>
          </div>
          <div style={{ color: isLinea ? "green" : "red", marginBottom: 16 }}>
            Network: {isLinea ? "Linea Mainnet" : "Not Linea (Please switch to Linea Mainnet)"}
          </div>
          <form onSubmit={handleClaim} style={{ marginTop: 8 }}>
            <label>
              Message Hash:
              <input
                type="text"
                value={messageHash}
                onChange={(e) => setMessageHash(e.target.value)}
                style={{ width: "100%" }}
                required
              />
            </label>
            <button type="submit" disabled={loading} style={{ marginTop: 12, width: '100%' }}>
              {loading ? "Claiming..." : "Claim"}
            </button>
          </form>
        </>
      )}

      {chainError && (
        <div style={{ color: "red", marginTop: 16 }}>
          {chainError}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 24 }}>
          {result.success ? (
            <div>
              <strong>Claimed!</strong><br />
              Tx Hash: <a href={`https://lineascan.build/tx/${result.txHash}`} target="_blank" rel="noopener noreferrer">{result.txHash}</a>
            </div>
          ) : (
            <div style={{ color: "red" }}>
              Error: {result.error} {result.status !== undefined ? `(Status: ${result.status})` : ""}
            </div>
          )}
        </div>
      )}
      <footer style={{ marginTop: 40, fontSize: 12, color: "#888" }}>
        Powered by Linea | @rzlefndy24
      </footer>
    </div>
  )
}
