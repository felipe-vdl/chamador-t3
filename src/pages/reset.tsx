import { api } from "@/utils/api";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

const ResetPage: NextPage = () => {
  const { isLoading, mutate } = api.password.reset.useMutation();

  return (
    <>
      <Head>
        <title>Reiniciar o Sistema</title>
        <meta
          name="description"
          content="Painel de reinicialização do sistema."
        />
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
        <button

          disabled={isLoading}
          className="m-auto mb-auto self-center rounded bg-red-600 p-2 px-8 text-[50px] font-bold text-white shadow-lg shadow-red-500 transition hover:scale-105 hover:bg-orange-700 hover:text-red-100 hover:shadow-yellow-300 active:bg-red-500 disabled:bg-red-300 disabled:text-slate-100"
          onClick={() => {
            mutate();
          }}
        >
          {isLoading ? "Reiniciando..." : "Reiniciar Fila"}
        </button>
        <footer className="mt-auto bg-indigo-800 p-1 text-center text-xs text-white">
          2023 © Subsecretaria de Tecnologia da Informação — Prefeitura
          Municipal de Mesquita
        </footer>
      </div>
    </>
  );
};

export default ResetPage;
