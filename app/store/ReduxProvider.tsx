"use client";

import { Provider } from "react-redux";
import { store } from ".";
import { persistStore } from "redux-persist";
import { CookiesProvider } from "react-cookie";
import { PersistGate } from "redux-persist/integration/react";

const persistor = persistStore(store);

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CookiesProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    </CookiesProvider>
  );
}