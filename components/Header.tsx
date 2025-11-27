"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext"; // 👈 importa o hook

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount } = useCart(); // 👈 total de itens no carrinho

  return (
    <div className="header-wrapper">
      <header>
        <div className="container">
          {/* 🔳 HAMBURGUER — só aparece no mobile via CSS */}
          <button
            className="hamburger-btn"
            aria-label="Abrir menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              // X (fechar)
              <svg
                viewBox="0 0 384 512"
                width="18"
                height="18"
                fill="currentColor"
              >
                <path d="M231.6 256l107.7-107.7c9.4-9.4 9.4-24.6 0-33.9l-22.6-22.6c-9.4-9.4-24.6-9.4-33.9 
                0L175 199.6 67.3 91.9c-9.4-9.4-24.6-9.4-33.9 0L10.8 114.5c-9.4 9.4-9.4 24.6 0 33.9L118.5 256 
                10.8 363.7c-9.4 9.4-9.4 24.6 0 33.9l22.6 22.6c9.4 9.4 24.6 9.4 33.9 0L175 312.4l107.7 107.7c9.4 
                9.4 24.6 9.4 33.9 0l22.6-22.6c9.4-9.4 9.4-24.6 0-33.9L231.6 256z" />
              </svg>
            ) : (
              // três linhas
              <svg
                viewBox="0 0 448 512"
                width="18"
                height="18"
                fill="currentColor"
              >
                <path d="M0 88c0-13.3 10.7-24 24-24h400c13.3 0 24 10.7 24 24s-10.7 24-24 
                24H24C10.7 112 0 101.3 0 88zm0 160c0-13.3 10.7-24 24-24h400c13.3 0 24 
                10.7 24 24s-10.7 24-24 24H24c-13.3 0-24-10.7-24-24zm0 160c0-13.3 10.7-24 
                24-24h400c13.3 0 24 10.7 24 24s-10.7 24-24 24H24c-13.3 0-24-10.7-24-24z" />
              </svg>
            )}
          </button>

          {/* LOGO */}
          <div className="logo">
            <Link href="/">
              <Image
                src="/logo-DQpiEbe-.png"
                alt="RecargaBux"
                width={110}
                height={110}
                priority
              />
            </Link>
          </div>

          {/* SEARCH */}
          <div className="search">
            <input placeholder="O que está buscando?" />
            <button className="search-btn">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                height="20"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
              </svg>
            </button>
          </div>

          {/* CART */}
          <Link href="/cart" className="cart">
            <div className="cart-icon-wrapper">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 576 512"
                height="22"
                width="22"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.208l-9.166-44.81C147.758 8.021 137.93 0 126.529 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24h69.883l70.248 343.435C147.325 417.1 136 435.222 136 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-15.674-6.447-29.835-16.824-40h209.647C430.447 426.165 424 440.326 424 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-22.172-12.888-41.332-31.579-50.405l5.517-24.276c3.413-15.018-8.002-29.319-23.403-29.319H218.117l-6.545-32h293.145c11.206 0 20.92-7.754 23.403-18.681z"></path>
              </svg>
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </div>
            <span>Carrinho</span>
          </Link>
        </div>
      </header>

      {/* MENU DESKTOP */}
      <nav className="menu">
        <ul>
      <Link href="/categoria/roblox">ROBUX</Link>
        </ul>
      </nav>

{/* DROPDOWN MOBILE */}
{mobileOpen && (
  <nav className="mobile-menu">
    <ul>
      <li>
        <Link href="/categoria/roblox" onClick={() => setMobileOpen(false)}>
          ROBUX
        </Link>
      </li>
    </ul>
  </nav>
)}
    </div>
  );
}
