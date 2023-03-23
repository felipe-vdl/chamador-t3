import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="flex min-h-screen flex-col bg-blue-200">
      <main className="flex flex-1 flex-col text-stone-700">
        <Component {...pageProps} />
      </main>
    </div>
  );
};

export default api.withTRPC(MyApp);
