import { type NextPage } from "next";
import Head from "next/head";

import Image from "next/image";
import { api } from "@/utils/api";

const SenhaPage: NextPage = () => {
  const { isLoading, mutate } = api.password.newPassword.useMutation({
    onSuccess: (data) => {
      const win = window.open();
      if (win) {
        win.blur();
        window.focus();
        win.document.write(
          '<html><head><title>Senha</title></head><body style="line-height: 3.5rem; margin: 0; padding: 0; display: flex; flex-direction: column; justify-content: flex-start;">'
        );
        win.document.write(
          `<p style="font-size: 12px; text-align: center; margin: 0; padding: 0;">${new Date(
            data.createdAt
          ).toLocaleDateString("pt-br", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}<p>`
        );
        win.document.write(
          `<h1 style="font-size: 120px; text-align: center; margin: 0; padding: 0;">${data.id}<h1>`
        );
        win.document.write(
          `<p style="font-size: 12px; font-weight: normal; text-align: center; margin: 0; padding: 0;">Retire o seu IPTU também pelo WhatsApp: (21) 99529-1297<p>`
        );
        win.document.write("</body></html>");
        win.print();
        win.close();
      }
    },
  });

  return (
    <>
      <Head>
        <title>Impressão de Senhas</title>
        <meta name="description" content="Impressão de senhas." />
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
        <h1 className="mt-auto mb-5 self-center bg-blue-100 px-12 py-2 text-center text-3xl shadow">
          Clique no botão para imprimir uma senha
        </h1>
        <button
          onClick={() => mutate()}
          className="mb-auto self-center rounded bg-indigo-800 p-2 px-8 text-[86px] font-bold text-white shadow-lg shadow-indigo-500 transition hover:scale-105 hover:bg-blue-900 hover:text-blue-100 hover:shadow-blue-500 active:bg-blue-700 disabled:bg-indigo-300 disabled:text-slate-100"
          disabled={isLoading}
        >
          {!isLoading ? "Imprimir" : "Imprimindo..."}
        </button>
        <footer className="mt-auto bg-indigo-800 p-1 text-center text-xs text-white shadow-inner shadow-indigo-800">
          2023 © Subsecretaria de Tecnologia da Informação — Prefeitura
          Municipal de Mesquita
        </footer>
      </div>
    </>
  );
};

export default SenhaPage;
