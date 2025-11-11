import { useState, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';

/**
 * Transaction status
 */
export type TransactionStatus =
  | 'idle'
  | 'preparing'
  | 'signing'
  | 'sending'
  | 'confirming'
  | 'success'
  | 'error';

/**
 * Transaction result
 */
export interface TransactionResult {
  signature?: string;
  error?: Error;
  status: TransactionStatus;
}

/**
 * Custom hook for handling Solana transactions
 * Manages transaction signing, sending, and confirmation
 */
export function useTransaction() {
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [status, setStatus] = useState<TransactionStatus>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  /**
   * Reset transaction state
   */
  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setSignature(null);
  }, []);

  /**
   * Sign and send a transaction
   * @param transaction - The transaction to sign and send
   * @returns Transaction signature or null on error
   */
  const signAndSendTransaction = useCallback(
    async (transaction: Transaction): Promise<string | null> => {
      if (!publicKey || !signTransaction) {
        const err = new Error('Wallet not connected');
        setError(err);
        setStatus('error');
        return null;
      }

      try {
        reset();
        setStatus('preparing');

        // Get recent blockhash
        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash('finalized');
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = publicKey;

        setStatus('signing');

        // Sign transaction
        const signedTransaction = await signTransaction(transaction);

        setStatus('sending');

        // Send transaction
        const txSignature = await connection.sendRawTransaction(
          signedTransaction.serialize(),
          {
            skipPreflight: false,
            preflightCommitment: 'confirmed',
          }
        );

        setSignature(txSignature);
        setStatus('confirming');

        // Confirm transaction
        const confirmation = await connection.confirmTransaction(
          {
            signature: txSignature,
            blockhash,
            lastValidBlockHeight,
          },
          'confirmed'
        );

        if (confirmation.value.err) {
          throw new Error(`Transaction failed: ${confirmation.value.err}`);
        }

        setStatus('success');
        return txSignature;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        setStatus('error');
        console.error('Transaction error:', error);
        return null;
      }
    },
    [publicKey, signTransaction, connection, reset]
  );

  /**
   * Send a transaction using wallet's sendTransaction (recommended)
   * This method is simpler and handles signing internally
   * @param transaction - The transaction to send
   * @returns Transaction signature or null on error
   */
  const sendTransactionWrapper = useCallback(
    async (transaction: Transaction): Promise<string | null> => {
      if (!publicKey || !sendTransaction) {
        const err = new Error('Wallet not connected');
        setError(err);
        setStatus('error');
        return null;
      }

      try {
        reset();
        setStatus('preparing');

        // Get recent blockhash
        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash('finalized');

        setStatus('signing');

        // Send transaction (wallet handles signing)
        const txSignature = await sendTransaction(transaction, connection, {
          skipPreflight: false,
          preflightCommitment: 'confirmed',
        });

        setSignature(txSignature);
        setStatus('confirming');

        // Confirm transaction
        const confirmation = await connection.confirmTransaction(
          {
            signature: txSignature,
            blockhash,
            lastValidBlockHeight,
          },
          'confirmed'
        );

        if (confirmation.value.err) {
          throw new Error(`Transaction failed: ${confirmation.value.err}`);
        }

        setStatus('success');
        return txSignature;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        setStatus('error');
        console.error('Transaction error:', error);
        return null;
      }
    },
    [publicKey, sendTransaction, connection, reset]
  );

  /**
   * Get transaction details by signature
   */
  const getTransaction = useCallback(
    async (signature: string) => {
      try {
        const tx = await connection.getTransaction(signature, {
          maxSupportedTransactionVersion: 0,
        });
        return tx;
      } catch (err) {
        console.error('Failed to fetch transaction:', err);
        return null;
      }
    },
    [connection]
  );

  /**
   * Check if a transaction is confirmed
   */
  const isTransactionConfirmed = useCallback(
    async (signature: string): Promise<boolean> => {
      try {
        const status = await connection.getSignatureStatus(signature);
        return (
          status.value?.confirmationStatus === 'confirmed' ||
          status.value?.confirmationStatus === 'finalized'
        );
      } catch (err) {
        console.error('Failed to check transaction status:', err);
        return false;
      }
    },
    [connection]
  );

  return {
    // State
    status,
    error,
    signature,
    isLoading: ['preparing', 'signing', 'sending', 'confirming'].includes(status),
    isSuccess: status === 'success',
    isError: status === 'error',

    // Actions
    signAndSendTransaction,
    sendTransaction: sendTransactionWrapper,
    getTransaction,
    isTransactionConfirmed,
    reset,
  };
}
