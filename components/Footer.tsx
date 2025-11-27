"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const [active, setActive] = useState<number | null>(null);

  const toggle = (index: number) => {
    setActive(active === index ? null : index);
  };

  return (
    <footer className="footer">
      {/* Botão voltar ao topo */}
      <div className="footer-top">
        <button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 448 512"
            height="14"
            width="14"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: "8px" }}
          >
            <path d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 
              0-33.9L207 39c9.4-9.4 24.6-9.4 
              33.9 0l194.3 194.3c9.4 9.4 
              9.4 24.6 0 33.9L413 289.4c-9.5 
              9.5-25 9.3-34.3-.4L264 168.6V456c0 
              13.3-10.7 24-24 24h-32c-13.3 
              0-24-10.7-24-24V168.6L69.2 
              289.1c-9.3 9.8-24.8 10-34.3.4z"
            />
          </svg>
          Voltar ao topo
        </button>
      </div>

      {/* Main grid / mobile vira acordeão */}
      <div className="footer-main">
        {/* Atendimento */}
        <div className={`footer-col ${active === 0 ? "open" : ""}`}>
          <h4 onClick={() => toggle(0)}>ATENDIMENTO AO CLIENTE</h4>
          <div className="footer-panel">
            <p>
              <svg
                stroke="currentColor"
                fill="currentColor"
                viewBox="0 0 512 512"
                height="15"
                width="15"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: "8px" }}
              >
                <path d="M502.3 190.8c3.9-3.1 9.7-.2 
                  9.7 4.7V400c0 26.5-21.5 48-48 
                  48H48c-26.5 0-48-21.5-48-48V195.6c0-5 
                  5.7-7.8 9.7-4.7 22.4 17.4 52.1 
                  39.5 154.1 113.6 21.1 15.4 
                  56.7 47.8 92.2 47.6 35.7.3 
                  72-32.8 92.3-47.6 102-74.1 
                  131.6-96.3 154-113.7zM256 
                  320c23.2.4 56.6-29.2 73.4-41.4 
                  132.7-96.3 142.8-104.7 
                  173.4-128.7 5.8-4.5 9.2-11.5 
                  9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 
                  64 0 85.5 0 112v19c0 7.4 3.4 
                  14.3 9.2 18.9 30.6 23.9 40.7 
                  32.4 173.4 128.7 16.8 12.2 
                  50.2 41.8 73.4 41.4z"
                />
              </svg>
              suporte@recargabux.com
            </p>
          </div>
        </div>

        {/* Políticas */}
        <div className={`footer-col ${active === 1 ? "open" : ""}`}>
          <h4 onClick={() => toggle(1)}>POLÍTICAS</h4>
          <div className="footer-panel">
            <ul>
              <li>Sobre Nós</li>
              <li>
                <Link href="/termos">Termos e Condições</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Categorias */}
        <div className={`footer-col ${active === 2 ? "open" : ""}`}>
          <h4 onClick={() => toggle(2)}>CATEGORIAS</h4>
          <div className="footer-panel">
            <ul>
              <li>ROBUX</li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className={`footer-col ${active === 3 ? "open" : ""}`}>
          <h4 onClick={() => toggle(3)}>NEWSLETTER</h4>
          <div className="footer-panel">
            <p>Assine nossa newsletter e receba as melhores ofertas DE GRAÇA!</p>
            <div className="newsletter">
              <input type="email" placeholder="Seu e-mail" />
              <button>Enviar</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <div className="footer-warning">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="32"
            width="32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M466.5 83.7l-192-80a48.15 
              48.15 0 0 0-36.9 0l-192 
              80C27.7 91.1 16 108.6 16 
              128c0 198.5 114.5 335.7 
              221.5 380.3 11.8 4.9 25.1 
              4.9 36.9 0C360.1 472.6 
              496 349.3 496 128c0-19.4-11.7-36.9-29.5-44.3zM256.1 
              446.3l-.1-381 175.9 
              73.3c-3.3 151.4-82.1 
              261.1-175.8 307.7z"
            />
          </svg>
          <p>
            Preços e condições de pagamento exclusivos para compras neste site oficial, podendo variar com o tempo da oferta.
            Evite comprar produtos mais baratos ou de outras lojas, pois você pode estar sendo enganado(a) por um golpista.
            Caso você compre os mesmos produtos em outras lojas, não nos responsabilizamos por quaisquer problemas.
          </p>
        </div>

        <div className="footer-payments">
          <span><strong>Forma de Pagamento:</strong></span>
          <Image src="/payments-Qw_EF4cK.png" alt="Pix" width={120} height={40} />
        </div>
      </div>

      {/* Copy */}
      <div className="footer-copy">
        <Image src="/download.webp" alt="Norton Secured" width={80} height={24} />
        <Image src="/download (1).webp" alt="Google Site Seguro" width={80} height={24} />
        <p>© 2021-2025 Recarrega Bux - Todos os direitos reservados</p>
      </div>
    </footer>
  );
}
