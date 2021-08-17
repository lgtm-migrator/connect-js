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

function utf8_to_b64(str: string): string {
  return window.btoa(unescape(encodeURIComponent(str)));
}

class ConnectPopup {
  private popupOptions: PopupOptions = { width: 450 };
  private connectOptions: connectOptions;
  private callbacks: {
    onAuthorizationCodeReceived?: AuthorizationCodeCallback;
  } = {};
  private popup: Window;
  private version = 1;

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

      const connectUrl = new URL(
        this.connectOptions.providerURL + "/oauth/authorize",
      );
      connectUrl.searchParams.append("client_id", this.connectOptions.clientId);
      connectUrl.searchParams.append(
        "redirect_uri",
        this.connectOptions.providerURL + "/oauth/popup/callback",
      );
      connectUrl.searchParams.append("scope", this.connectOptions.scopes);
      connectUrl.searchParams.append("response_type", "code");
      const newState = utf8_to_b64(
        JSON.stringify({
          state: state || "",
          current_url: currentUrl,
          v: this.version,
        }),
      );
      connectUrl.searchParams.append("state", newState);

      const popup = window.open(
        connectUrl.toString(),
        "connect-popup",
        `menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes,width=${width},height=${height},top=${top},left=${left}`,
      );
      this.popup = popup;
    };
  }
}

export default ConnectPopup;
