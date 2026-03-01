/**
 * Stellar Sentry — Freighter Wallet Integration Service
 *
 * Provides wallet connectivity and TTL extension capabilities
 * via the Freighter browser extension.
 *
 * Prerequisites:
 *  - User must have Freighter wallet extension installed
 *  - @stellar/freighter-api must be installed
 */

import {
    isConnected,
    isAllowed,
    requestAccess,
    getPublicKey,
    signTransaction,
} from '@stellar/freighter-api';

import {
    TransactionBuilder,
    Networks,
    Operation,
    rpc,
    xdr,
    Address,
} from '@stellar/stellar-sdk';

import { RPC_URL, NETWORK_PASSPHRASE } from './stellarService.js';

/**
 * Check if the Freighter extension is installed and available.
 * @returns {Promise<boolean>}
 */
export async function isFreighterInstalled() {
    try {
        const connected = await isConnected();
        return connected;
    } catch {
        return false;
    }
}

/**
 * Connect to Freighter and retrieve the user's public key.
 * @returns {Promise<{publicKey: string|null, error: string|null}>}
 */
export async function connectWallet() {
    try {
        const installed = await isFreighterInstalled();
        if (!installed) {
            return {
                publicKey: null,
                error: 'Freighter wallet extension is not installed. Please install it from freighter.app',
            };
        }

        // Check if the app is already allowed
        const allowed = await isAllowed();
        if (!allowed) {
            await requestAccess();
        }

        const publicKey = await getPublicKey();
        return { publicKey, error: null };
    } catch (err) {
        return {
            publicKey: null,
            error: err.message || 'Failed to connect to Freighter wallet',
        };
    }
}

/**
 * Build and sign a transaction to extend the TTL of a contract instance.
 *
 * This function:
 * 1. Builds a transaction with Operation.extendFootprintTtl
 * 2. Simulates it via the Soroban RPC to calculate resource fees
 * 3. Sends it to Freighter for the user to sign
 * 4. Submits the signed transaction to the network
 *
 * @param {string} contractId — The contract whose TTL to extend
 * @param {number} extendToLedgers — Number of ledgers to extend to
 * @param {string} signerPublicKey — The user's public key (from Freighter)
 * @returns {Promise<{success: boolean, txHash: string|null, error: string|null}>}
 */
export async function extendContractTTL(contractId, extendToLedgers, signerPublicKey) {
    try {
        const server = new rpc.Server(RPC_URL, { allowHttp: false });
        const account = await server.getAccount(signerPublicKey);

        // Build the contract instance ledger key for the footprint
        const contractAddress = new Address(contractId);
        const ledgerKey = xdr.LedgerKey.contractData(
            new xdr.LedgerKeyContractData({
                contract: contractAddress.toScAddress(),
                key: xdr.ScVal.scvLedgerKeyContractInstance(),
                durability: xdr.ContractDataDurability.persistent(),
            })
        );

        // Build the transaction
        const tx = new TransactionBuilder(account, {
            fee: '100000', // 0.01 XLM base fee — simulation will adjust
            networkPassphrase: NETWORK_PASSPHRASE,
        })
            .addOperation(
                Operation.extendFootprintTtl({
                    extendTo: extendToLedgers,
                })
            )
            .setSorobanData(
                new xdr.SorobanTransactionData({
                    resources: new xdr.SorobanResources({
                        footprint: new xdr.LedgerFootprint({
                            readOnly: [ledgerKey],
                            readWrite: [],
                        }),
                        instructions: 0,
                        readBytes: 0,
                        writeBytes: 0,
                    }),
                    resourceFee: xdr.Int64.fromString('0'),
                    ext: xdr.ExtensionPoint.void0(),
                })
            )
            .setTimeout(300)
            .build();

        // Simulate to get the proper resource fees
        const simulated = await server.simulateTransaction(tx);

        if (simulated.error) {
            throw new Error(`Simulation failed: ${simulated.error}`);
        }

        // Assemble the transaction with proper fees from simulation
        const preparedTx = rpc.assembleTransaction(tx, simulated).build();

        // Send to Freighter for signing
        const signedXdr = await signTransaction(preparedTx.toXDR(), {
            networkPassphrase: NETWORK_PASSPHRASE,
        });

        // Submit the signed transaction
        const signedTx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
        const sendResponse = await server.sendTransaction(signedTx);

        if (sendResponse.status === 'ERROR') {
            throw new Error(`Transaction submission failed: ${sendResponse.errorResult}`);
        }

        // Poll for completion
        let result = sendResponse;
        while (result.status === 'PENDING') {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            result = await server.getTransaction(sendResponse.hash);
        }

        if (result.status === 'SUCCESS') {
            return { success: true, txHash: sendResponse.hash, error: null };
        } else {
            throw new Error(`Transaction failed with status: ${result.status}`);
        }
    } catch (err) {
        return {
            success: false,
            txHash: null,
            error: err.message || 'Failed to extend contract TTL',
        };
    }
}
