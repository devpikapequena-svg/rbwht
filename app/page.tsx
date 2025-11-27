"use client";
import Image from "next/image";
import FAQ from "@/components/FAQ";
import Header from "@/components/Header"; 
import Footer from "@/components/Footer";
import Beneficios from "@/components/Beneficios"; 
import Link from "next/link"; 
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const produtos = [
    { id: 1, nome: "1200 ROBUX", preco: "R$ 19,90", img: "/RxqJCQs.png", avaliacoes: 108, rating: 4 },
    { id: 2, nome: "1700 ROBUX", preco: "R$ 22.99", precoAntigo: "R$ 29.99", desconto: "-15%", img: "/Dr7tYqv.png", avaliacoes: 132, rating: 5 },
    { id: 3, nome: "2100 ROBUX", preco: "R$ 29,90", img: "/I9f8bdi.png", avaliacoes: 54, rating: 4 },
    { id: 4, nome: "3600 ROBUX", preco: "R$ 47,90", precoAntigo: "R$ 53,90", desconto: "-4%", img: "/Ov5Pi7u.png", avaliacoes: 201, rating: 4 },
    { id: 5, nome: "7000 ROBUX", preco: "R$ 79.99", precoAntigo: "R$ 159.99", desconto: "-50%", img: "/Ov5Pi7u.png", avaliacoes: 177, rating: 5 },
    { id: 6, nome: "10000 ROBUX", preco: "R$ 92.99", precoAntigo: "R$ 112.00", desconto: "-17%", img: "/Ov5Pi7u.png", avaliacoes: 177, rating: 4 },
  ];

  const gerarSlug = (nome: string) =>
    nome.toLowerCase().replace(/\./g, "").replace(/\s+/g, "-");

  // 🔹 controle do carrossel
  const [paginaAtiva, setPaginaAtiva] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const totalPaginas = Math.ceil(produtos.length / 2);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const onScroll = () => {
      const largura = el.offsetWidth;
      const pagina = Math.round(el.scrollLeft / largura);
      setPaginaAtiva(pagina);
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

    // 🔹 Função que renderiza as estrelas
  const renderStars = (rating: number) => {
    const full = "★".repeat(rating);
    const empty = "☆".repeat(5 - rating);
    return full + empty;
  };


  return (
    <div>
      <Header />

      {/* BANNER */}
      <section className="banner">
        <Image src="/hero11-BpymsbfX.jpg" alt="banner" width={1420} height={606} />
      </section>

      {/* MAIS VENDIDOS */}
      <section className="produtos">
        <h2>MAIS VENDIDOS</h2>
        <div className="grid carousel" ref={carouselRef}>
          {produtos.map((p) => (
            <Link
              key={p.id}
              href={`/product/${gerarSlug(p.nome)}`}
              className="card"
            >
              <div className="card-img">
                <Image src={p.img} alt={p.nome} fill />
                {p.desconto && <span className="badge">{p.desconto}</span>}
                <div className="reflection"></div>
              </div>

              <div className="card-info">
                <h3>
                  {p.nome}
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    className="verify-icon"
                    height="16"
                    width="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
                  </svg>
                </h3>

   <p className="stars">
                  <span className="stars-icons">{renderStars(p.rating)}</span>
                  <span className="stars-count">({p.avaliacoes} avaliações)</span>
                </p>


                <div className="price">
                  <span className={p.id === 1 || p.id === 3 ? "new white-price" : "new"}>
                    {p.preco}
                  </span>
                  {p.precoAntigo && <s>{p.precoAntigo}</s>}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 🔹 bolinhas do carrossel */}
        <div className="carousel-dots">
          {Array.from({ length: totalPaginas }).map((_, i) => (
            <span key={i} className={i === paginaAtiva ? "active" : ""}></span>
          ))}
        </div>
      </section>

      {/* 🔥 NOVA SEÇÃO DESTAQUE */}
      <section className="destaque">
        <div className="destaque-card">
          <Image
            src="/roblox-ChSClTIZ.webp"
            alt="Roblox"
            width={800}
            height={400}
            className="destaque-img"
          />
          <div className="destaque-info">
            <h3>Roblox</h3>
            <p>Explore, crie e brilhe no Roblox com estilo</p>
            <Link href="/categoria/roblox">
              <button className="btn-yellow">VER PRODUTOS</button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ e Benefícios */}
      <FAQ />
      <Beneficios />

      <Footer />
    </div>
  );
}
