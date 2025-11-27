"use client";
import { useEffect, useState } from "react";

export default function ReviewsSlider() {
  const [index, setIndex] = useState(0);
  const totalGroups = 3; // 9 cards / 3 por vez = 3 grupos

useEffect(() => {
  const interval = setInterval(() => {
    setIndex((prev) => (prev + 1) % totalGroups);
  }, 5000); // 1.5s animação + 2.5s pausa
  return () => clearInterval(interval);
}, []);


  const reviews = [
    { user: "Mr_Batman", txt: "entrega imediata e confiável, mt bom", stars: 5 },
    { user: "yasmimwhyszx", txt: "Bom", stars: 4 },
    { user: "xuxtzy420", txt: "Ótimo vendedor", stars: 4 },
    { user: "martinha", txt: "Muito rápido, gostei", stars: 5 },
    { user: "ghostzin", txt: "Topzera", stars: 4 },
    { user: "lordfoda", txt: "Confiança 100%", stars: 5 },
    { user: "cristal", txt: "chegou certinho", stars: 4 },
    { user: "d4rk", txt: "ótimo atendimento", stars: 5 },
    { user: "pik4chu", txt: "Recomendo demais", stars: 5 },
  ];

  return (
    <section className="product-reviews">
      <div className="reviews-card">
        <h2 className="reviews-title">Últimas avaliações</h2>
        <div className="review-carousel">
          <div
            className="review-track"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {reviews.map((r, i) => (
              <div className="review-card" key={i}>
                <div className="review-head">
                  <strong>{r.user}</strong>
                <div className="stars">
  {Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < r.stars ? "star full" : "star"}>★</span>
  ))}
</div>
                </div>
                <p>{r.txt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
