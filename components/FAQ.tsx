"use client";
import { useState } from "react";

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

const faqData = [
  {
    question: "É seguro e confiável?",
    answer: `Aqui priorizamos a sua segurança!
Contamos com selos de criptografia, garantindo uma compra segura e totalmente confiável.
Utilizamos também uma processadora de pagamentos para proteger tanto você quanto a nossa loja.

Sendo assim, o dinheiro só é liberado pra gente depois que você recebe o seu produto! Então não se preocupe, porque aqui você está 100% seguro.

E além disso tudo, já temos mais de 100 mil seguidores no Instagram e mais de 28 mil membros em nosso servidor do Discord!`,
  },
  {
    question: "Como recebo o produto?",
    answer: "A entrega é automática e instantânea após a confirmação do pagamento. Além disso, você receberá os produtos diretamente no seu e-mail cadastrado e também poderá visualizá-los na tela de compra, garantindo total praticidade e agilidade.",
  },
  {
    question: "E se eu precisar de ajuda?",
    answer: `Se tiver qualquer dúvida ou precisar de suporte, entre em contato conosco por um dos nossos canais de atendimento:

• Discord
• Instagram

Basta clicar no ícone da rede social desejada localizado na lateral direita do site.`,
  },
];

  return (
    <section className="faq">
      <h2>Perguntas Frequentes</h2>
      {faqData.map((item, index) => (
        <div
          key={index}
          className={`faq-item ${activeIndex === index ? "active" : ""}`}
        >
          <button className="faq-question" onClick={() => toggleFAQ(index)}>
            {item.question}
            <span className="arrow">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 448 512"
                className="faq-icon"
                height="18"
                width="18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 
                  0-33.941l22.667-22.667c9.357-9.357 
                  24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 
                  24.544-9.317 33.901.04l22.667 
                  22.667c9.373 9.373 9.373 24.569 
                  0 33.941L240.971 381.476c-9.373 
                  9.372-24.569 9.372-33.942 0z" />
              </svg>
            </span>
          </button>

          <div
            className="faq-answer"
            style={{
              maxHeight: activeIndex === index ? "600px" : "0",
              padding: activeIndex === index ? "16px" : "0 16px",
            }}
          >
            {item.answer.split("\n").map(
              (line, i) =>
                line.trim() && (
                  <p key={i} className="faq-paragraph">
                    {line}
                  </p>
                )
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
