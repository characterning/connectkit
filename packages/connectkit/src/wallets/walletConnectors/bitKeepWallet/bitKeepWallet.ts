import { Chain } from '@wagmi/core/chains';
import type { InjectedConnectorOptions } from '@wagmi/core';
import { InjectedConnector } from 'wagmi/connectors/injected';
import '@wagmi/core';
import 'ethers';
import 'eventemitter3';
import 'abitype';

type BitKeepConnectorOptions = Pick<InjectedConnectorOptions, 'shimChainChangedDisconnect' | 'shimDisconnect'> & {

    UNSTABLE_shimOnConnectSelectAccount?: boolean;
};
declare class BitKeepConnector extends InjectedConnector {
    #private;
    readonly id = "bitKeep";
    constructor({ chains, options }?: {
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
        provider: NonNullable<typeof window['ethereum']>;
    }>;
}

export { BitKeepConnector };
