import { type NextPage } from "next";
import Head from "next/head";

import Image from "next/image";
import { api } from "@/utils/api";
import { useState } from "react";
import type { CurrentPassword } from "@prisma/client";

const Admin: NextPage = () => {
  const [messageInput, setMessageInput] = useState("");

  const [info, setInfo] = useState<Pick<
    CurrentPassword,
    "message" | "password"
  > | null>(null);

  api.password.currentPassword.useQuery(undefined, {
    onSuccess: (data) => {
      setInfo(data);
    },
  });

  api.password.wsSubscription.useSubscription(undefined, {
    onData: (data) => {
      setInfo(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const callMutation = api.password.callPassword.useMutation({});

  const handleCall = (sum: number) => {
    callMutation.mutate({
      password: info?.password ? info.password + sum : 0,
      message: messageInput,
    });
  };

  return (
    <>
      <Head>
        <title>Administração</title>
        <meta name="description" content="Painel de administração." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen flex-col">
        <Image
          width={250}
          height={83}
          alt="Logotipo da Prefeitura de Mesquita"
          src="/logo.png"
          className="mb-3 mt-5 ml-5 w-[250px] self-center sm:self-center md:self-start"
        />
        <div className="m-auto rounded border-8 border-indigo-800 bg-blue-300 p-8 text-center font-bold text-slate-800 shadow-md shadow-blue-800">
          <p className="text-3xl">Painel</p>
          <span className="text-[96px]">{info?.password}</span>
          {info?.message && <p className="text-xl">Guichê: {info?.message}</p>}
        </div>
        <div className="mx-auto flex flex-col gap-8 px-4 text-white">
          <div className="mx-auto">
            <input
              name="message"
              type="text"
              value={messageInput}
              onChange={(evt) => setMessageInput(evt.target.value)}
              placeholder="Número do Guichê"
              className="ouline-none rounded border-2 border-indigo-800 bg-blue-50 p-2 text-slate-800"
            />
          </div>
          <div className="flex gap-8">
            <button
              className="mb-auto self-center rounded bg-indigo-800 p-2 px-8 font-bold text-white shadow-lg shadow-indigo-500 transition hover:scale-105 hover:bg-blue-900 hover:text-blue-100 hover:shadow-blue-500 active:bg-blue-700 disabled:bg-indigo-300 disabled:text-slate-100"
              disabled={callMutation.isLoading}
              onClick={() => handleCall(-1)}
            >
              {callMutation.isLoading ? "Chamando..." : "Chamar Anterior"}
            </button>
            <button
              className="mb-auto self-center rounded bg-indigo-800 p-2 px-8 font-bold text-white shadow-lg shadow-indigo-500 transition hover:scale-105 hover:bg-blue-900 hover:text-blue-100 hover:shadow-blue-500 active:bg-blue-700 disabled:bg-indigo-300 disabled:text-slate-100"
              disabled={callMutation.isLoading}
              onClick={() => handleCall(0)}
            >
              {callMutation.isLoading ? "Chamando..." : "Chamar Atual"}
            </button>
            <button
              className="mb-auto self-center rounded bg-indigo-800 p-2 px-8 font-bold text-white shadow-lg shadow-indigo-500 transition hover:scale-105 hover:bg-blue-900 hover:text-blue-100 hover:shadow-blue-500 active:bg-blue-700 disabled:bg-indigo-300 disabled:text-slate-100"
              disabled={callMutation.isLoading}
              onClick={() => handleCall(1)}
            >
              {callMutation.isLoading ? "Chamando..." : "Chamar Próximo"}
            </button>
          </div>
        </div>
        <footer className="mt-auto bg-indigo-800 p-1 text-center text-xs text-white">
          2023 © Subsecretaria de Tecnologia da Informação — Prefeitura
          Municipal de Mesquita
        </footer>
      </div>
    </>
  );
};

export default Admin;
