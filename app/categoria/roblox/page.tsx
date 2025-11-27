"use client";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../categorias.css";

export default function Home() {
  const produtos = [
    { id: 1, nome: "1.200 ROBUX", preco: "R$ 19.90", img: "/RxqJCQs.png", avaliacoes: 108, rating: 4 },
    { id: 3, nome: "1.700 ROBUX", preco: "R$ 22.00", precoAntigo: "R$ 25.99", desconto: "-15%", img: "/Dr7tYqv.png", avaliacoes: 132, rating: 5 },
    { id: 4, nome: "2.100 ROBUX", preco: "R$ 29.90", precoAntigo: "R$ 34.99", desconto: "-12%", img: "/I9f8bdi.png", avaliacoes: 54, rating: 4 },
    { id: 5, nome: "3.600 ROBUX", preco: "R$ 47.90", precoAntigo: "R$ 49.99", desconto: "-4%", img: "/Ov5Pi7u.png", avaliacoes: 201, rating: 4 },
    { id: 6, nome: "4.500 ROBUX", preco: "R$ 55.90", precoAntigo: "R$ 79.99", desconto: "-7%", img: "/4500-min.png", avaliacoes: 96, rating: 5 },
    { id: 7, nome: "7.000 ROBUX", preco: "R$ 79.99", precoAntigo: "R$ 159.99", desconto: "-50%", img: "/7000-min.png", avaliacoes: 321, rating: 5 },
    { id: 8, nome: "10.000 ROBUX", preco: "R$ 92.99", precoAntigo: "R$ 112.00", desconto: "-17%", img: "/slwoeKf.png", avaliacoes: 177, rating: 4 },
  ];

  // Função para gerar slug (transforma nome em /product/xxxx-robux)
  const gerarSlug = (nome: string) => {
    return nome.toLowerCase().replace(/\./g, "").replace(/\s+/g, "-");
  };

  // Função que gera estrelas dinâmicas
  const renderStars = (rating: number) => {
    const full = "★".repeat(rating);
    const empty = "☆".repeat(5 - rating);
    return full + empty;
  };

  return (
    <div className="home-root">
      <Header />

      <main className="home-container">
        {/* Breadcrumb acima de tudo */}
        <nav className="breadcrumb">
          <Link href="/">Página inicial</Link> / <strong>Roblox</strong>
        </nav>

        <section className="home-layout">
          {/* Sidebar Categorias */}
          <aside className="home-sidebar">
            <h3>Categorias</h3>
            <button className="categoria-btn active">Robux</button>
          </aside>

          {/* Produtos */}
          <div className="home-produtos">
            <h2>Roblox</h2>
            <div className="home-grid">
              {produtos.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${gerarSlug(p.nome)}`}
                  className="home-card"
                >
                  <div className="home-card-img">
                    <Image src={p.img} alt={p.nome} fill className="home-img" />
                    {p.desconto && <span className="home-badge">{p.desconto}</span>}
                    <div className="home-reflection"></div>
                  </div>

                  <div className="home-card-info">
                    <h3>
                      {p.nome}
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 512 512"
                        className="home-verify-icon"
                        height="16"
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
                      </svg>
                    </h3>

                    <p className="home-stars">
                      <span className="home-stars-icons">{renderStars(p.rating)}</span>
                      <span className="home-stars-count">({p.avaliacoes} avaliações)</span>
                    </p>

                    <div className="home-price">
                      <span className={p.id === 1 ? "home-new home-white-price" : "home-new"}>
                        {p.preco}
                      </span>
                      {p.precoAntigo && <s>{p.precoAntigo}</s>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
