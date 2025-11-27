"use client";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./styles.css";

export default function TermosPage() {
  return (
    <div>
      <Header />
      <div className="header-spacer" /> {/* espaço do header fixo */}

      {/* 👇 main agora controla a altura */}
      <main className="termos container">

        <div className="termos-card">
          <h1>Termos e Condições</h1>

          <div className="termos-section">
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar este website, você aceita e concorda em cumprir estes termos e condições de uso.
              Se você não concordar com qualquer parte destes termos, não deverá usar nosso website.
            </p>
          </div>

          <div className="termos-section">
            <h2>2. Produtos e Serviços</h2>
            <p>
              Todos os produtos e serviços oferecidos em nossa plataforma são destinados exclusivamente para uso pessoal.
              A revenda não autorizada de nossos produtos é estritamente proibida.
            </p>
          </div>

          <div className="termos-section">
            <h2>3. Preços e Pagamentos</h2>
            <ul>
              <li>Todos os preços estão em Reais (BRL)</li>
              <li>Aceitamos apenas pagamentos via PIX</li>
              <li>Os preços podem ser alterados sem aviso prévio</li>
              <li>A confirmação da compra será enviada após a confirmação do pagamento</li>
            </ul>
          </div>

          <div className="termos-section">
            <h2>4. Entrega Digital</h2>
            <p>
              Nossos produtos são entregues digitalmente após a confirmação do pagamento. 
              O prazo de entrega pode variar de acordo com o produto adquirido.
            </p>
          </div>

          <div className="termos-section">
            <h2>5. Política de Privacidade</h2>
            <p>
              Respeitamos sua privacidade e protegemos seus dados pessoais. Todas as informações coletadas são utilizadas
              apenas para processar seu pedido e melhorar sua experiência em nossa plataforma.
            </p>
          </div>

          <div className="termos-section">
            <h2>6. Responsabilidades</h2>
            <p>A RecargaBux não se responsabiliza por:</p>
            <ul>
              <li>Uso indevido dos produtos adquiridos</li>
              <li>Problemas técnicos fora de nosso controle</li>
              <li>Informações incorretas fornecidas pelo usuário</li>
            </ul>
          </div>

          <div className="termos-section">
            <h2>7. Suporte ao Cliente</h2>
            <p>
              Oferecemos suporte através de nosso Discord oficial e e-mail. 
              Nosso time está disponível para ajudar com quaisquer dúvidas ou problemas relacionados aos nossos produtos e serviços.
            </p>
          </div>

          <div className="termos-footer">
            <p><strong>Última atualização:</strong> 03/09/2025</p>
            <p>Em caso de dúvidas, entre em contato conosco através do Discord ou e-mail.</p>
          </div>
        </div>
      </main>

      {/* FOOTER FIXO */}
      <Footer />
    </div>
  );
}
