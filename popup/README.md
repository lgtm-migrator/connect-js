# Connect JS Popup

This package allow the use of Connect inside the browser via a popup window. That way, the authentication of the User can be done without leaving the website where they are.

## Usage

This package can be used either as a classical package or directly in the browser as a `<script>`.

You need to create a new `ConnectPopup` instance with the options your want and then you can add `openConnectPopup({state: string})` as a listener on a click event on the HTML element you want.

> ⚠️ You need to associate the `openConnectPopup` function to a User action. Trying to call the function automatically will result in a blocked popup from the browser.

### Package usage

```
yarn add @fewlines/connect-popup
```

```javascript
import ConnectPopup from "@fewlines/connect-popup";

const login = new ConnectPopup({
  connect: {
    providerURL: YOUR_PROVIDER_URL,
    clientId: YOUR_CLIENT_ID,
    scopes: "email phone",
  },
  onAuthorizationCodeReceived: (code, state) => {
    // Do something with the Authorization Code and State
  },
});

document
  .getElementById("login") // Assuming you have a button with id `login`
  .addEventListener(
    "click",
    login.openConnectPopup({ state: "Anything you want as a state" })
  );
```

### Script usage

You could use unpkg or host the library yourself.

```html
<button id="login">Connect with your Provider Account</button>

<script
  type="text/javascript"
  src="https://unpkg.com/@fewlines/connect-popup@latest/dist/connect-popup.min.js"
></script>
<script type="text/javascript">
  const login = new ConnectPopup({
    connect: {
      providerURL: YOUR_PROVIDER_URL,
      clientId: YOUR_CLIENT_ID,
      scopes: "email phone",
    },
    onAuthorizationCodeReceived: (code, state) => {
      // Do something with the Authorization Code and State
    },
  });
  document
    .getElementById("login")
    .addEventListener(
      "click",
      login.openConnectPopup({ state: "Anything you want as a state" })
    );
</script>
```

## Options

When initializing `ConnectPopup` you can customize those options:

- `connect`, **required** an object containing:
  - `providerURL`, **required**, the URL of your Connect Provider. It **must** start with the protocol and **must** not end with a path.
  - `clientId`, **required**, the client ID of your Connect Application.
  - `scopes`, **required**, the space-separated list of scopes for your Connect Application.
- `popup`, an optional object containing:
  - `width`, the width of the popup window (default: 450px).
  - `height`, the height of the popup window (defaults to half of the screen).
  - `top`, the distance from the top of the screen to the popup window (defaults to the value that make the popup centered relative to the screen).
  - `left`, the distance from the left of the screen to the popup window (defaults to the value that make the popup centered relative to the screen).
- `onAuthorizationCodeReceived`, a callback that will be called once the Authorization Code and State are received. This is called just before closing the popup.
