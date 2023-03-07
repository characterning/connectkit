import { Chain } from '@wagmi/core/chains';
// import { InjectedConnectorOptions, InjectedConnector } from './injected.js';
import { InjectedConnector } from 'wagmi/connectors/injected';
import type { InjectedConnectorOptions } from '@wagmi/core';
import { E as Ethereum } from './types-86dbb446';
import '@wagmi/core';
import 'ethers';
import './base-84a689bb';
import 'eventemitter3';
import 'abitype';

type BitKeepConnectorOptions = Pick<InjectedConnectorOptions, 'shimChainChangedDisconnect' | 'shimDisconnect'> & {
    /**
     * While "disconnected" with `shimDisconnect`, allows user to select a different MetaMask account (than the currently connected account) when trying to connect.
     */
    UNSTABLE_shimOnConnectSelectAccount?: boolean;
};
declare class BitKeepConnector extends InjectedConnector {
    #private;
    readonly id = "bitKeep";
    protected shimDisconnectKey: string;
    constructor({ chains,  options_, }?: {
        chains?: Chain[];
        options?: BitKeepConnectorOptions;
    });
    connect({ chainId }?: {
        chainId?: number;
    }): Promise<{
        account: `0x${string}`;
        chain: {
            id: number;
            unsupported: boolean;
        };
        provider: Ethereum;
    }>;
}

export { BitKeepConnector, BitKeepConnectorOptions };
