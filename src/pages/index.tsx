import { type NextPage } from "next";
import Head from "next/head";

import Image from "next/image";
import { api } from "@/utils/api";
import { useState } from "react";
import type { CurrentPassword } from "@prisma/client";

const Home: NextPage = () => {
  const [info, setInfo] = useState<Pick<
    CurrentPassword,
    "message" | "password"
  > | null>(null);

  const chamar = ({
    message,
    password,
  }: Pick<CurrentPassword, "message" | "password">) => {
    const voices = window.speechSynthesis.getVoices();
    const newSpeech = new SpeechSynthesisUtterance(
      `Número ${password}, ${message ? `guichê: ${message}` : ""}.`
    );
    newSpeech.voice = voices[0] as SpeechSynthesisVoice;
    window.speechSynthesis.speak(newSpeech);
  };

  api.password.currentPassword.useQuery(undefined, {
    onSuccess: (data) => {
      setInfo(data);
    },
  });

  api.password.wsSubscription.useSubscription(undefined, {
    onData: (data) => {
      setInfo(data);
      chamar(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <>
      <Head>
        <title>Painel</title>
        <meta name="description" content="Painel de chamada." />
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
        <h2 className="mt-auto text-center text-xl">Chamada</h2>
        <div className={`m-auto mb-0 mt-3 w-[95%] rounded rounded-b-none border-4 ${info?.message ? "border-b-2" : ""} border-indigo-800 bg-blue-300 p-4 text-center text-[160px] font-bold text-slate-800`}>
          {info?.password}
        </div>
        {info?.message &&
          <div className="mx-auto w-[95%] rounded rounded-t-none border-4 border-t-0 border-indigo-800 bg-blue-300 p-4 text-center text-[80px] font-bold text-slate-800">
            Guichê: {info?.message}
          </div>
        }
        <footer className="mt-auto bg-indigo-800 p-1 text-center text-xs text-white">
          2023 © Subsecretaria de Tecnologia da Informação — Prefeitura
          Municipal de Mesquita
        </footer>
      </div>
    </>
  );
};

export default Home;
