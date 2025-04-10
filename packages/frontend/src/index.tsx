/* @refresh reload */
import { render } from "solid-js/web"

import "./reset.css"
import "./index.css"
import { App } from "./app"
import { createSignal, onMount, Show } from "solid-js"
import { client } from "./client"

const root = document.getElementById("root")

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  )
}

render(() => {
  const [ready, setReady] = createSignal(true)
  
  // onMount(async () => {
  //   // Check if we're already authenticated with cookies
  //   try {
  //     // Make a simple API call to verify authentication
  //     const authCheckResult = await fetch(
  //       `${import.meta.env.VITE_OPENCONTROL_ENDPOINT || ""}/api/check-auth`,
  //       {
  //         method: "GET",
  //         credentials: "include", // Important: include cookies in the request
  //       }
  //     )
  //     
  //     if (authCheckResult.ok) {
  //       // We have valid cookies, proceed with the app
  //       setReady(true)
  //     } else {
  //       // If not authenticated, redirect to OAuth login
  //       window.location.href = `${import.meta.env.VITE_OPENCONTROL_ENDPOINT || ""}/api/oauth/login`
  //     }
  //   } catch (e) {
  //     console.error("Authentication check failed:", e)
  //     // If there's an error checking auth, redirect to OAuth login
  //     window.location.href = `${import.meta.env.VITE_OPENCONTROL_ENDPOINT || ""}/api/oauth/login`
  //   }
  // })
  
  return (
    <Show when={ready()}>
      <App />
    </Show>
  )
}, root!)
