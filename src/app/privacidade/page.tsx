import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacidade" };
export default function Privacy() {
  return (
    <main id="conteudo" className="legal section-pad">
      <p className="eyebrow">VALETTO / TRANSPARÊNCIA</p>
      <h1>Privacidade.</h1>
      <p>
        Esta versão de apresentação não possui formulário de cadastro,
        ferramentas de análise ou cookies de marketing adicionados pela Valetto.
      </p>
      <h2>Links externos</h2>
      <p>
        Ao acessar nosso perfil no Instagram, você passa a utilizar um serviço
        externo, sujeito às políticas de privacidade da própria plataforma.
      </p>
      <h2>Contato</h2>
      <p>
        Para falar com a marca, utilize o perfil oficial{" "}
        <a
          className="text-link"
          href="https://www.instagram.com/valettomotos/"
          target="_blank"
          rel="noreferrer"
        >
          @valettomotos
        </a>
        . Não envie informações sensíveis por mensagem.
      </p>
      <h2>Próximas etapas</h2>
      <p>
        Antes da disponibilização de qualquer formulário, esta página deverá
        informar como os dados serão tratados, a finalidade, a retenção e os
        canais para exercer seus direitos.
      </p>
    </main>
  );
}
