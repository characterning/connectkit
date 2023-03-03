import {
  WalletProps,
  WalletOptions,
  getDefaultWalletConnectConnector,
  getProviderUri,
} from '../wallet';
import { BitKeepConnector } from '../walletConnectors/bitKeepWallet/bitKeepWallet';

import { isMobile, isBitKeep, isAndroid } from '../../utils';
import Logos from '../../assets/logos';
declare global {
  interface Window {
    bitkeep: any;
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
        : new BitKeepConnector({
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
