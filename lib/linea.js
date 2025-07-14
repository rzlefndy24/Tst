import { LineaSDK } from "@consensys/linea-sdk";

// Membuat instance SDK dengan signer wallet user
export function getLineaSDK({ l1Provider, l2Provider, l1Signer, l2Signer }) {
  return new LineaSDK({
    l1RpcUrlOrProvider: l1Provider,
    l2RpcUrlOrProvider: l2Provider,
    l1SignerPrivateKeyOrWallet: l1Signer,
    l2SignerPrivateKeyOrWallet: l2Signer,
    network: "linea-mainnet",
    mode: "read-write",
  });
}
