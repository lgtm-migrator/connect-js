type AuthorizationCodeCallback = (
  authorizationCode: string,
  state: string,
) => unknown;

type PopupOptions = {
  width?: number;
  height?: number;
  top?: number;
  left?: number;
};

type connectOptions = {
  providerURL: string;
  clientId: string;
  scopes: string;
};

type Options = {
  popup?: PopupOptions;
  connect: connectOptions;
  onAuthorizationCodeReceived?: AuthorizationCodeCallback;
};

class ConnectPopup {
  private popupOptions: PopupOptions = { width: 450 };
  private connectOptions: connectOptions;
  private callbacks: {
    onAuthorizationCodeReceived?: AuthorizationCodeCallback;
  } = {};
  private popup: Window;

  constructor(options: Options) {
    if (options.popup) {
      this.popupOptions = { width: 450, ...options.popup };
    }
    if (options.onAuthorizationCodeReceived) {
      this.callbacks.onAuthorizationCodeReceived =
        options.onAuthorizationCodeReceived;
    }
    this.connectOptions = options.connect;

    this.openConnectPopup = this.openConnectPopup.bind(this);

    window.addEventListener("message", this.eventListener.bind(this));
  }

  eventListener(event: MessageEvent): void {
    if (
      event.origin === this.connectOptions.providerURL &&
      event.source === this.popup
    ) {
      if (this.callbacks.onAuthorizationCodeReceived) {
        this.callbacks.onAuthorizationCodeReceived(
          event.data.code,
          event.data.state,
        );
      }
      this.popup.postMessage("destroy", this.connectOptions.providerURL);
    }
  }

  openConnectPopup({ state }: { state?: string }): () => void {
    return () => {
      const width = this.popupOptions.width || 450;
      const height = this.popupOptions.height || window.screen.height / 2;
      const top =
        this.popupOptions.top || window.screen.height / 2 - height / 2;
      const left =
        this.popupOptions.left || window.screen.width / 2 - width / 2;

      const currentUrl = window.location.protocol + "//" + window.location.host;
      let url = `${this.connectOptions.providerURL}/oauth/popup?client_id=${this.connectOptions.clientId}&scope=${this.connectOptions.scopes}&caller_uri=${currentUrl}`;
      if (state) {
        url += `&state=${state}`;
      }
      const popup = window.open(
        url,
        "connect-popup",
        `menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes,width=${width},height=${height},top=${top},left=${left}`,
      );
      this.popup = popup;
    };
  }
}

export default ConnectPopup;
