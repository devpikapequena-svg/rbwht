"use client";
import { useEffect } from "react";

export default function Beneficios() {
  useEffect(() => {
    const wrapper = document.querySelector(".beneficios-wrapper") as HTMLElement;
    const dots = document.querySelectorAll(".beneficios-dots span");

    if (!wrapper) return;

    wrapper.addEventListener("scroll", () => {
      const index = Math.round(wrapper.scrollLeft / wrapper.clientWidth);
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });
    });
  }, []);

  return (
    <section className="beneficios">
      <div className="beneficios-wrapper">
        {/* 🔐 Compra Segura */}
        <div className="beneficio">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="32"
            width="32"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: "#d0bc64" }}
          >
            <path d="M466.5 83.7l-192-80a48.15 48.15 0 0 0-36.9 0l-192 80C27.7 91.1 
              16 108.6 16 128c0 198.5 114.5 335.7 221.5 380.3 11.8 4.9 
              25.1 4.9 36.9 0C360.1 472.6 496 349.3 496 128c0-19.4-11.7-36.9-29.5-44.3zM256.1 
              446.3l-.1-381 175.9 73.3c-3.3 151.4-82.1 261.1-175.8 307.7z">
            </path>
          </svg>
          <div>
            <h3>Compra Segura</h3>
            <p>Ambiente seguro para pagamentos online</p>
          </div>
        </div>

        {/* ⚡ Envio Imediato */}
        <div className="beneficio">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 448 512"
            height="32"
            width="32"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: "#d0bc64" }}
          >
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 
              0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 
              106.1 27h.1c122.3 0 224.1-99.6 224.1-222 
              0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4 
              -69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 
              0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 
              34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 
              184.6z">
            </path>
          </svg>
          <div>
            <h3>Envio Imediato</h3>
            <p>Envio imediato via E-mail após a compra</p>
          </div>
        </div>

        {/* 🎧 Suporte Profissional */}
        <div className="beneficio">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="32"
            width="32"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: "#d0bc64" }}
          >
            <path d="M192 208c0-17.67-14.33-32-32-32h-16c-35.35 0-64 28.65-64 64v48c0 35.35 
              28.65 64 64 64h16c17.67 0 32-14.33 32-32V208zm176 144c35.35 0 
              64-28.65 64-64v-48c0-35.35-28.65-64-64-64h-16c-17.67 0-32 
              14.33-32 32v112c0 17.67 14.33 32 32 32h16zM256 0C113.18 0 
              4.58 118.83 0 256v16c0 8.84 7.16 16 16 16h16c8.84 0 
              16-7.16 16-16v-16c0-114.69 93.31-208 208-208s208 
              93.31 208 208h-.12c.08 2.43.12 165.72.12 165.72 0 
              23.35-18.93 42.28-42.28 42.28H320c0-26.51-21.49-48-48-48h-32c-26.51 
              0-48 21.49-48 48s21.49 48 48 48h181.72c49.86 0 90.28-40.42 
              90.28-90.28V256C507.42 118.83 398.82 0 256 0z">
            </path>
          </svg>
          <div>
            <h3>Suporte Profissional</h3>
            <p>Equipe de suporte das 10h às 23h diariamente</p>
          </div>
        </div>

        {/* 🔄 Entrega ou Reembolso */}
        <div className="beneficio">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="32"
            width="32"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: "#d0bc64" }}
          >
            <path d="M0 168v-16c0-13.255 10.745-24 24-24h360V80c0-21.367 
              25.899-32.042 40.971-16.971l80 80c9.372 9.373 
              9.372 24.569 0 33.941l-80 80C409.956 271.982 
              384 261.456 384 240v-48H24c-13.255 0-24-10.745-24-24zm488 
              152H128v-48c0-21.314-25.862-32.08-40.971-16.971l-80 
              80c-9.372 9.373-9.372 24.569 0 33.941l80 
              80C102.057 463.997 128 453.437 128 432v-48h360c13.255 
              0 24-10.745 24-24v-16c0-13.255-10.745-24-24-24z">
            </path>
          </svg>
          <div>
            <h3>Entrega ou Reembolso</h3>
            <p>Caso haja qualquer problema, devolvemos seu dinheiro!</p>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="beneficios-dots">
        <span className="active"></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </section>
  );
}
