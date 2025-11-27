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
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
