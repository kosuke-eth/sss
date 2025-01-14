import { useCallback, useEffect, useMemo, useState } from "react";
import type { Hex } from "viem";
import { useAccount, usePublicClient, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import StyledButton from "../styles/StyledButton";

import Image from "next/image";

export function SignMessage() {
  const account = useAccount();
  const client = usePublicClient();
  const [signature, setSignature] = useState<Hex | undefined>(undefined);
  const { signMessage } = useSignMessage({
    mutation: { onSuccess: (sig) => setSignature(sig) },
  });
  const message = useMemo(() => {
    return new SiweMessage({
      domain: document.location.host,
      address: account.address,
      chainId: account.chainId,
      uri: document.location.origin,
      version: "1",
      statement: "Coinbase Smart Wallet Sign Message Example",
      nonce: "12345678",
    });
  }, [account.address]);

  const [valid, setValid] = useState<boolean | undefined>(undefined);

  const checkValid = useCallback(async () => {
    if (!signature || !account.address) return;

    client
      .verifyMessage({
        address: account.address,
        message: message.prepareMessage(),
        signature,
      })
      .then((v) => setValid(v));
  }, [signature, account]);

  useEffect(() => {
    checkValid();
  }, [signature, account]);

  return (
    <div>
      <StyledButton
        onClick={() => signMessage({ message: message.prepareMessage() })}
      >
        <Image
         
        />
        Sign the message
      </StyledButton>
      <div style={{ textAlign: "center", marginTop: "5px" }}>
        Is valid:{" "}
        {valid !== undefined && (
          <span
            style={{
              color: valid === true ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {valid.toString()}
          </span>
        )}
      </div>
    </div>
  );
}
