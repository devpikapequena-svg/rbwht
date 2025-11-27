"use client";
import { useRouter } from "next/navigation";
import Script from "next/script"; // 👈 importa o Script
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./sucess.css";

export default function SucessPage() {
  const router = useRouter();

  return (
    <div className="sucess-root">
      {/* 👇 Scripts de conversão do Google Ads */}
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

      {/* Resto da página */}
      <Header />
      <div className="header-spacer" />

      <main className="sucess-container">
        <h1 className="sucess-title">🎉 Pagamento aprovado!</h1>
        <p className="sucess-subtitle">
          Obrigado pela sua compra. Seu pagamento foi confirmado com sucesso.
        </p>

        <div className="sucess-card">
          <p><strong>Status:</strong> Pago ✅</p>
          <p><strong>Produto:</strong> Robux</p>
          <p><strong>Entrega:</strong> Enviada automaticamente ao seu email em até 12 horas</p>
        </div>

        <button
          className="sucess-btn"
          onClick={() => router.push("/")}
        >
          Voltar para a Loja
        </button>
      </main>

      <Footer />
    </div>
  );
}
