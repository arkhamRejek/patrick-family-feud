"use client";

import { pubnubInstance } from "../app/pubnub/pubnub";
import { PubNubProvider as LibPubnubProvider } from "pubnub-react";
import { FC, PropsWithChildren, useEffect, useState } from "react";

export const PubnubProvider: FC<PropsWithChildren> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
    }
  }, [initialized]);

  if (!initialized) {
    return null;
  }

  return (
    <LibPubnubProvider client={pubnubInstance}>{children}</LibPubnubProvider>
  );
};
