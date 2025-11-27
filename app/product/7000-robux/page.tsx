"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReviewsSlider from "@/components/ReviewsSlider";
import { useCart } from "@/context/CartContext"; // 👈 importa o contexto

import "../product.css";

export default function ProductPage() {
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart(); // 👈 função do contexto
  const router = useRouter();

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));

  // 🔥 dados do produto desta página
  const product = {
    id: "robux-4500-b",
    name: "4500 ROBUX",
    price: 79.90,
    image: "/I9f8bdi.png",
  };

  const handleBuyNow = () => {
    addToCart({ ...product, qty });
    router.push("/cart"); // redireciona para o carrinho
  };

  const handleAddToCart = () => {
    addToCart({ ...product, qty }); // só adiciona
  };

  return (
    <div className="product-root">
      <Header />
      <div className="header-spacer" />

      <main className="product-container">
        {/* breadcrumb */}
        <nav className="product-breadcrumb">
          <Link href="/">Página inicial</Link> / <strong>ROBLOX</strong> /{" "}
          <span>{product.name}</span>
        </nav>

        {/* GRID 2 colunas */}
        <section className="product-frame">
          {/* COLUNA ESQUERDA */}
          <div className="product-left">
            <div className="product-media">
              <div className="product-media-inner">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={900}
                  height={1200}
                  priority
                  className="product-mainimg"
                />
              </div>
            </div>

            <div className="pl-section">
              <h2 className="pl-title">Descrição</h2>
              <p>📌 <strong>Como resgatar seus robux</strong> ❓</p>
              <ol className="pl-list">
                <li>Receba seu produto no E-MAIL ou tela de compra;</li>
                <li>Acesse o site https://roblox.com e clique em Entrar;</li>
                <li>Clique no ícone <em>Resgatar</em> e insira o PIN recebido;</li>
                <li>Após aparecer o saldo, é só usar e ser feliz!</li>
              </ol>
              <div className="pl-media">
                <Image
                  src="/17-roblox.webp"
                  alt="Banner Roblox"
                  width={1200}
                  height={600}
                  quality={100}
                  className="pl-img"
                />
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA */}
          <aside className="product-buy">
            <p className="product-sold">+442 Vendidos</p>

            <div className="product-titleline">
              <img
                src="/Robloxi_valuuta__Robux__Ikoon.png"
                alt="Robux Ícone"
                width={22}
                height={22}
                style={{ margin: "0 4px" }}
              />
              <h1 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {product.name}
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 512 512"
                  className="verify-icon"
                  height="20"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
                </svg>
              </h1>
            </div>

            <div className="product-badges">
              <span className="badge-green">Entrega Automática</span>
            </div>

            <div className="product-stars">
              <div className="stars">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="star full">★</span>
                ))}
              </div>
              <span className="muted">321 avaliações</span>
            </div>

            <div className="product-price">
              <span className="rs">R$</span>
              <span className="num">{product.price.toFixed(2)}</span>
            </div>
            <div className="product-stock"><span className="dot" /> Disponível</div>

            <div className="product-qtyrow">
              <button onClick={dec} className="qtybtn">–</button>
              <input
                className="qtyinput"
                value={qty}
                onChange={(e) => {
                  const v = parseInt(e.target.value || "1", 10);
                  if (!Number.isNaN(v)) setQty(Math.min(99, Math.max(1, v)));
                }}
              />
              <button onClick={inc} className="qtybtn">+</button>
            </div>

            <button onClick={handleBuyNow} className="btn-buy">
              COMPRAR AGORA
            </button>
            <button onClick={handleAddToCart} className="btn-cart">
              ADICIONAR AO CARRINHO
            </button>

            <div className="product-payblock">
              <h4>Meios de pagamentos</h4>
              <div className="pay-select">
                À vista
                <span className="pay-icon">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    className="pix-icon"
                    height="20"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M242.4 292.5C247.8 287.1 257.1 287.1 262.5 292.5L339.5 369.5C353.7 383.7 372.6 391.5 392.6 391.5H407.7L310.6 488.6C280.3 518.1 231.1 518.1 200.8 488.6L103.3 391.2H112.6C132.6 391.2 151.5 383.4 165.7 369.2L242.4 292.5zM262.5 218.9C256.1 224.4 247.9 224.5 242.4 218.9L165.7 142.2C151.5 127.1 132.6 120.2 112.6 120.2H103.3L200.7 22.76C231.1-7.586 280.3-7.586 310.6 22.76L407.8 119.9H392.6C372.6 119.9 353.7 127.7 339.5 141.9L262.5 218.9zM112.6 142.7C126.4 142.7 139.1 148.3 149.7 158.1L226.4 234.8C233.6 241.1 243 245.6 252.5 245.6C261.9 245.6 271.3 241.1 278.5 234.8L355.5 157.8C365.3 148.1 378.8 142.5 392.6 142.5H430.3L488.6 200.8C518.9 231.1 518.9 280.3 488.6 310.6L430.3 368.9H392.6C378.8 368.9 365.3 363.3 355.5 353.5L278.5 276.5C264.6 262.6 240.3 262.6 226.4 276.6L149.7 353.2C139.1 363 126.4 368.6 112.6 368.6H80.78L22.76 310.6C-7.586 280.3-7.586 231.1 22.76 200.8L80.78 142.7H112.6z"></path>
                  </svg>
                </span>
              </div>
            </div>
          </aside>
        </section>

        <ReviewsSlider />
      </main>

      <Footer />
    </div>
  );
}
