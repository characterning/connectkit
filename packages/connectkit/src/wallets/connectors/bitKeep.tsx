import {
  WalletProps,
  WalletOptions,
  getDefaultWalletConnectConnector,
  getProviderUri,
} from '../wallet';
import { InjectedConnector } from 'wagmi/connectors/injected';

import { isMobile, isBitKeep, isAndroid } from '../../utils';
import Logos from '../../assets/logos';

declare global {
  interface Window {
    bitkeep: any;
  }
}
export  class  BitkeepConnector extends InjectedConnector {
  id: string;
  ready: boolean;
  provider: any;
  constructor({ chains, options = {} }) {
    const _options = {
      name: 'BitKeep',
      ...options,
    };
    super({ chains, options: _options });

    this.id = 'Bitkeep';
    this.ready =
      typeof window != 'undefined' &&
      !!this.findProvider(window?.bitkeep?.ethereum);
  }

  async getProvider() {
    if (typeof window !== 'undefined') {
      // TODO: Fallback to `ethereum#initialized` event for async injection
      // https://github.com/BitKeep/detect-provider#synchronous-and-asynchronous-injection=
      this.provider = window.bitkeep?.ethereum;
    }
    return this.provider;
  }
  getReady(ethereum: NonNullable<typeof window['ethereum']>) {
    if (!ethereum || !ethereum.isBitKeep) return;
    // Brave tries to make itself look like BitKeep
    // Could also try RPC `web3_clientVersion` if following is unreliable
    if (ethereum.isBraveWallet && !ethereum._events && !ethereum._state) return;
    if (ethereum.isTokenPocket) return;
    if (ethereum.isTokenary) return;
    return ethereum;
  }
  findProvider(ethereum: NonNullable<typeof window['ethereum']>) {
    if (ethereum?.providers) return ethereum.providers.find(this.getReady);
    return this.getReady(ethereum);
  }
}

export const bitKeep = ({ chains }: WalletOptions): WalletProps => {
  const isInstalled = isBitKeep();
  const shouldUseWalletConnect = isMobile() && !isInstalled;

  return {
    id: 'bitKeep',
    name: 'BitKeep',
    logos: {
      default: <Logos.BitKeep background />,
      mobile: <Logos.BitKeep background />,
      transparent: (
        <div
          style={{
            transform: 'scale(0.86)',
            position: 'relative',
            width: '100%',
          }}
        >
          <Logos.BitKeep />
        </div>
      ),
      connectorButton: (
        <div
          style={{
            transform: 'scale(1.1)',
          }}
        >
          <Logos.BitKeep />
        </div>
      ),
    },
    logoBackground:
      'linear-gradient(0deg, var(--ck-brand-metamask-12), var(--ck-brand-metamask-11))',
    scannable: false,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/bitkeep',
      website: 'https://bitkeep.io/en/download',
      android: 'https://play.google.com/store/apps/details?id=com.bitkeep.wallet',
      ios: 'https://apps.apple.com/app/bitkeep/id1395301115',
    },
    installed: Boolean(!shouldUseWalletConnect ? isInstalled : false),
    createConnector: () => {
      const connector = shouldUseWalletConnect
        ? getDefaultWalletConnectConnector(chains)
        : new BitkeepConnector({
            chains,
            options: {
              shimDisconnect: true,
              shimChainChangedDisconnect: true,
              UNSTABLE_shimOnConnectSelectAccount: true,
            },
          });
      return {
        connector,
        getUri: async () => {},
        getMobileConnector: shouldUseWalletConnect
          ? async () => {
              connector.on('error', (err) => {
                console.log('onError', err);
              });
              connector.on('message', async ({ type }) => {
                console.log('onMessage: BitKeep', type);
                if (type === 'connecting') {
                  let uriString = '';
                  try {
                    const uri = await getProviderUri(connector);
                    uriString = isAndroid()
                    ? `bitkeep://?action=connect&connectType=wc&value=${encodeURIComponent(
                      uri
                      )}`
                    : `https://bkcode.vip?value=${encodeURIComponent(uri)}`;

                    window.location.href = uriString;
                  } catch {
                    console.log('catch bad URI', uriString);
                  }
                }
              });

              return connector;
            }
          : undefined,
      };
    },
  };
};