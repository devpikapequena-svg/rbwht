"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import "./cart.css";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function CartPage() {
  const { cart, removeFromCart, updateQty } = useCart();
  const router = useRouter();
const [showSupportBox, setShowSupportBox] = useState(false);

  // 🔹 Troque pelo SEU número real de WhatsApp (só números, com DDI e DDD)
  const whatsappNumber = "5575920018871";

  const handleSendWhatsApp = () => {
    const defaultMessage =
      "Olá! Acabei de gerar um PIX no site, já realizei o pagamento mas o status não apareceu como confirmado. Quero enviar o comprovante para liberação do meu pedido.";
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      defaultMessage,
    )}`;
    window.open(url, "_blank");
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const [showPixModal, setShowPixModal] = useState(false);
  const [pixData, setPixData] = useState<{ code: string; qrcode_base64: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [formError, setFormError] = useState("");

  // Reinicia o timer ao abrir o modal
  useEffect(() => {
    if (showPixModal) setTimeLeft(300);
  }, [showPixModal]);

  // Contador regressivo
  useEffect(() => {
    if (!showPixModal || timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, showPixModal]);
useEffect(() => {
  if (showPixModal) {
    const timer = setTimeout(() => {
      setShowSupportBox(true);
    }, 30000); // 1 minuto

    return () => clearTimeout(timer);
  } else {
    setShowSupportBox(false);
  }
}, [showPixModal]);

  // ✅ Verifica status do pagamento apenas enquanto o modal está aberto
  useEffect(() => {
    if (!showPixModal) return;

    const extId = localStorage.getItem("external_id");
    if (!extId) return;

    console.log("⏳ Iniciando verificação de pagamento:", extId);
    let stopped = false;

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/create-payment?externalId=${extId}`);
        const data = await res.json();
        console.log("🔍 Status atual:", data.status);

    if (data.status === "PAID" || data.status === "APPROVED") {
  console.log("✅ Pagamento aprovado!");

  // 🔹 Dispara o evento de conversão (Purchase)
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "conversion", {
      send_to: "AW",
      value: subtotal, // 💰 valor real da compra
      currency: "BRL",
      transaction_id: localStorage.getItem("external_id") || "",
    });
  }

  localStorage.removeItem("external_id");
  router.push("/sucess");
        } else if (!stopped) {
          setTimeout(checkStatus, 7000); // rechecagem a cada 7s
        }
      } catch (err) {
        console.error("Erro ao verificar status:", err);
        if (!stopped) setTimeout(checkStatus, 10000); // tenta de novo após 10s
      }
    };

    checkStatus();
    return () => {
      stopped = true;
    };
  }, [showPixModal, router]);

  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleCheckout = async () => {
    if (!firstName || !lastName) {
      setFormError("Por favor, preencha nome e sobrenome");
      return;
    }
    if (!email || !validateEmail(email)) {
      setFormError("Por favor, insira um email válido");
      return;
    }
    setFormError("");

    setLoading(true);
    try {
      const externalId = `recargabux_${Date.now()}`;

      const payload = {
        name: `${firstName.trim()} ${lastName.trim()}`,
        email,
        phone: "559999999999", // telefone fixo válido (13 chars)
        amount: subtotal,
        items: cart.map((item) => ({
          title: item.name,
          unitPrice: item.price,
          quantity: item.qty,
        })),
        externalId,
      };

      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Erro Checkout:", data);
        alert("Erro ao gerar Pix: " + (data.error || "desconhecido"));
        return;
      }

      if (data.data?.pix) {
        setPixData({
          code: data.data.pix.code,
          qrcode_base64: data.data.pix.qrcode_base64,
        });
        localStorage.setItem("external_id", externalId);
        setShowPixModal(true);
      } else {
        alert("Erro ao gerar pagamento: resposta inválida da BuckPay");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar PIX");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-root">
      <Header />
      <div className="header-spacer" />

      <main className="cart-container">
        <h1 className="cart-title">Carrinho de compras</h1>
        <p className="cart-subtitle">
          Nesta página, você encontra os produtos adicionados ao seu carrinho.
        </p>

        <div className="cart-grid">
          {/* === Dados do comprador === */}
          <div className="cart-box">
            <h3>Informações de pagamento</h3>

            <label>Nome *</label>
            <input
              type="text"
              placeholder="Digite seu nome"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <label>Sobrenome *</label>
            <input
              type="text"
              placeholder="Digite seu sobrenome"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            <label>Email *</label>
            <input
              type="email"
              placeholder="Insira seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {formError && <p className="email-error">{formError}</p>}

            <button className="cart-coupon">Adicionar cupom de desconto</button>
          </div>

          {/* === Itens no carrinho === */}
          <div className="cart-box">
            <h3>Produtos no carrinho</h3>
            {cart.length === 0 ? (
              <p>Seu carrinho está vazio.</p>
            ) : (
              cart.map((item) => (
                <div className="cart-product" key={item.id}>
                  <Image src={item.image} alt={item.name} width={64} height={64} />
                  <div className="cart-prod-info">
                    <h4>{item.name}</h4>
                    <button className="cart-remove" onClick={() => removeFromCart(item.id)}>
                      Excluir
                    </button>
                  </div>
                  <div className="cart-qty">
                    <button
                      onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}
                      className="qtybtn"
                    >
                      –
                    </button>
                    <input type="text" value={item.qty} readOnly />
                    <button
                      onClick={() => updateQty(item.id, Math.min(99, item.qty + 1))}
                      className="qtybtn"
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-price">R$ {(item.price * item.qty).toFixed(2)}</div>
                </div>
              ))
            )}
          </div>

          {/* === Resumo e botão === */}
          <div className="cart-box">
            <h3>Resumo da compra</h3>
            <div className="cart-resumo">
              <p>
                Subtotal ({cart.length} item{cart.length > 1 && "s"}){" "}
                <span>R$ {subtotal.toFixed(2)}</span>
              </p>
              <hr />
              <p className="cart-total">
                Total <span>R$ {subtotal.toFixed(2)}</span>
              </p>
            </div>
            <button className="cart-continue" onClick={handleCheckout} disabled={loading}>
              {loading ? "Gerando Pix..." : "Finalizar compra"}
            </button>
          </div>
        </div>
      </main>

      {/* === Modal PIX === */}
      {showPixModal && pixData && (
        <div className="pix-overlay">
          <div className="pix-modal">
            <button className="pix-close" onClick={() => setShowPixModal(false)}>
              ×
            </button>

            {pixData.qrcode_base64 && (
              <div className="pix-qr">
                <img src={`data:image/png;base64,${pixData.qrcode_base64}`} alt="QR Code Pix" />
              </div>
            )}

            {pixData.code && (
              <div className="pix-card">
                <p className="pix-label">Código PIX:</p>
                <div className="pix-code-group">
                  <textarea value={pixData.code} readOnly />
                  <button
                    onClick={() => navigator.clipboard.writeText(pixData.code)}
                    className="btn-copy"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            )}

            <p className="pix-info">
              Escaneie o QR Code ou copie o código PIX para realizar o pagamento
            </p>

                    <div className="pix-progress">
              <div className="progress-bar"></div>
              <p className="pix-timer">{formatTime(timeLeft)}</p>
            </div>

     {/* 🔹 Suporte via WhatsApp (só aparece após 60 segundos) */}
{showSupportBox && (
  <div className="pix-whats-box">
    <div className="pix-whats-header">
      <div>
        <p className="pix-whats-title">Pagou e não confirmou ainda?</p>
        <p className="pix-whats-text">
          Fale com nosso time de suporte e enviaremos seu pedido após a conferência.
        </p>
      </div>
    </div>

    <p className="pix-whats-extra">
      Se o status não aparecer como <strong>confirmado</strong> após alguns minutos,
      você pode enviar o <strong>comprovante do PIX</strong> e o{" "}
      <strong>e-mail usado na compra</strong> pelo WhatsApp.
    </p>

    <button className="pix-whats-btn" onClick={handleSendWhatsApp}>
      <span className="pix-whats-btn-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="#25D366"
        >
          <path d="M20.52 3.48A11.8 11.8 0 0 0 12 .2 11.8 11.8 0 0 0 3.48 3.48 11.8 11.8 0 0 0 .2 12c0 2.09.54 4.13 1.57 5.94L.11 23.89l6.07-1.62A12 12 0 0 0 12 23.8h.01c6.54 0 11.8-5.26 11.8-11.8 0-3.16-1.23-6.14-3.29-8.2zm-8.51 18c-1.86 0-3.68-.5-5.27-1.46l-.38-.23-3.6.96.96-3.52-.25-.4A9.73 9.73 0 0 1 2.27 12c0-5.39 4.38-9.77 9.78-9.77 2.61 0 5.06 1.02 6.9 2.86a9.7 9.7 0 0 1 2.87 6.9c0 5.4-4.38 9.78-9.79 9.78zm5.41-7.3c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.14-.19.29-.74.94-.91 1.13-.17.19-.34.21-.63.07-.29-.14-1.22-.45-2.32-1.44-.85-.76-1.43-1.7-1.6-1.98-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.11-.23-.55-.47-.47-.64-.48-.17-.01-.36-.01-.55-.01-.19 0-.5.07-.76.36-.26.29-1 1-1 2.45 0 1.45 1.02 2.85 1.16 3.04.14.19 2 3.08 4.85 4.31.68.29 1.21.46 1.63.59.68.22 1.3.19 1.79.12.55-.08 1.7-.7 1.94-1.38.24-.67.24-1.25.17-1.38-.07-.14-.26-.21-.55-.36z"/>
        </svg>
      </span>
      Falar com suporte no WhatsApp
    </button>
  </div>
)}


          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}