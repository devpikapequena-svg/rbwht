// src/app/sucess/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./sucess.css";

export default function SucessPage() {
  const router = useRouter();

  // TROQUE PELO SEU WHATSAPP AQUI (somente números, com DDI e DDD)
  const whatsappNumber = "5562999999999";

  const handleSendWhatsApp = () => {
    const defaultMessage =
      "Olá! Acabei de fazer uma compra na loja e gostaria de enviar o comprovante de pagamento para agilizar o envio do meu pedido.";
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      defaultMessage,
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="sucess-root">
      <Script id="google-purchase-conversion" strategy="afterInteractive">
        {`
          gtag('event', 'conversion', {
            'send_to': 'AW-',
            'value': 1.0,
            'currency': 'BRL',
            'transaction_id': ''
          });
        `}
      </Script>

      <Header />
      <div className="header-spacer" />

      <main className="sucess-container">
        {/* Cabeçalho principal */}
        <div className="sucess-header">
          <span className="sucess-pill">
            <span className="sucess-pill-dot" /> Pedido #{/* ID opcional aqui */}
          </span>
          <h1 className="sucess-title">🎉 Pagamento aprovado!</h1>
          <p className="sucess-subtitle">
            Obrigado pela sua compra. Seu pagamento foi confirmado com sucesso.
          </p>
        </div>

        {/* Card de detalhes do pedido */}
        <div className="sucess-card">
          <div className="sucess-card-top">
            <div>
              <p className="sucess-card-label">Status do pagamento</p>
              <p className="sucess-status">
                <span className="sucess-status-dot" /> Pago
              </p>
            </div>
            <div className="sucess-badge">Robux</div>
          </div>

          <div className="sucess-divider" />

          <div className="sucess-info-grid">
            <div>
              <p className="sucess-info-label">Produto</p>
              <p className="sucess-info-value">Robux</p>
            </div>
            <div>
<p className="sucess-info-label">Entrega padrão</p>
<p className="sucess-info-value">
  Envio realizado entre <strong>12 a 24 horas</strong> após a confirmação.
</p>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
