import Pubnub from "pubnub";

export const pubnubInstance = new Pubnub({
  publishKey: process.env.NEXT_PUBLIC_PUBNUB_PUBLISH_KEY || "demo",
  subscribeKey: process.env.NEXT_PUBLIC_PUBNUB_SUBSCRIBE_KEY || "demo",
  userId: "family-feud-client",
});
