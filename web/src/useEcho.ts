import Echo from "laravel-echo";
import Pusher from "pusher-js";
(window as any).Pusher = Pusher;
const echo = new Echo({
  broadcaster: "pusher",
  id: "app-id", //import.meta.env.VITE_APP_ID,
  key: "app-key", //import.meta.env.VITE_APP_KEY,
  wsHost: "127.0.0.1", //import.meta.env.VITE_APP_HOST,
  wsPort: "6001", //import.meta.env.VITE_APP_PORT,
  cluster: "mt1", //import.meta.env.VITE_APP_CLUSTER,
  forceTLS: false,
  encrypted: true,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
});
export default echo;
