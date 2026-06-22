import { useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";

const initialNews = [
  {
    id: 1,
    title: "Preparatius per l'edició 2024 a tota màquina",
    desc: "L'equip organitzador ja té gairebé enllestits tots els detalls pel gran torneig d'enguany.",
    img: "https://aimtsdmsojunxazbxfue.supabase.co/storage/v1/object/public/NoticiasIMG/un-pas-endavant-cap-a-una-competicio-mes-justa-i-equilibrada.png",
  },
  {
    id: 2,
    title: "Noves samarretes oficials revelades",
    desc: "Nova equipació del torneig presentada avui als equips participants.",
    img: "https://aimtsdmsojunxazbxfue.supabase.co/storage/v1/object/public/NoticiasIMG/img_galeria_brillo.png",
  },
  {
    id: 3,
    title: "Reunió de voluntaris: Pròxim dimarts",
    desc: "Es convoca tots els voluntaris per preparar l'esdeveniment.",
    img: "https://aimtsdmsojunxazbxfue.supabase.co/storage/v1/object/public/NoticiasIMG/nou-sistema-de-visualitzacio-de-partits-1781524851749.webp",
  },
  {
    id: 4,
    title: "Obertura del termini de reclamacions",
    desc: "Ja està obert el període oficial per incidències i reclamacions.",
    img: "https://aimtsdmsojunxazbxfue.supabase.co/storage/v1/object/public/NoticiasIMG/important-canvi-en-el-torneig-1781524731385.webp",
  },
];

export default function NoticiasReact() {
  const [news, setNews] = useState(initialNews);

  const heroRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isAnimating = useRef(false);
  const cardHeight = useRef(0);

  useLayoutEffect(() => {
    const firstCard =
      wrapperRef.current?.querySelector<HTMLElement>(".card");

    if (firstCard) {
      cardHeight.current = firstCard.offsetHeight + 16; // gap-4
    }
  }, [news]);

  const animateHero = () => {
    const tl = gsap.timeline();

    gsap.set(".hero-badge", {
      y: 10,
      opacity: 0,
      scale: 0.9,
    });

    gsap.set(".hero-title", {
      y: 40,
      opacity: 0,
    });

    gsap.set(".hero-desc", {
      y: 30,
      opacity: 0,
    });

    tl.to(".hero-badge", {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.3,
    })
      .to(
        ".hero-title",
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
        },
        "-=0.15"
      )
      .to(
        ".hero-desc",
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
        },
        "-=0.2"
      );
  };

  const changeNews = (dir: "next" | "prev") => {
    if (isAnimating.current) return;

    isAnimating.current = true;

    const distance = cardHeight.current;

    gsap.to(wrapperRef.current, {
      y: dir === "next" ? -distance : distance,
      duration: 0.55,
      ease: "power3.inOut",
      onComplete: () => {
        const updated = [...news];

        if (dir === "next") {
          const first = updated.shift();
          if (first) updated.push(first);
        } else {
          const last = updated.pop();
          if (last) updated.unshift(last);
        }

        setNews(updated);

        requestAnimationFrame(() => {
          gsap.set(wrapperRef.current, {
            y: dir === "next" ? distance : -distance,
          });

          gsap.to(wrapperRef.current, {
            y: 0,
            duration: 0.55,
            ease: "power3.inOut",
            onComplete: () => {
              animateHero();
              isAnimating.current = false;
            },
          });
        });
      },
    });
  };

  const sideNews = [
    news[1],
    news[2],
    news[3],
    news[0], // extra para que entre desde abajo
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto">
      {/* HERO */}
      <div className="md:col-span-8 relative rounded-2xl overflow-hidden">
        <img
          src={news[0].img}
          className="w-full h-[500px] object-cover"
          alt={news[0].title}
        />

        <div
          ref={heroRef}
          className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/70"
        >
          <span className="hero-badge bg-yellow-400 text-black px-3 py-1 rounded-full w-fit mb-4 text-sm uppercase">
            Destacat
          </span>

          <h2 className="hero-title text-white text-3xl font-bold mb-2">
            {news[0].title}
          </h2>

          <p className="hero-desc text-white/80 max-w-xl">
            {news[0].desc}
          </p>
        </div>

        <div className="absolute bottom-6 right-6 flex gap-3">
          <button
            onClick={() => changeNews("prev")}
            className="w-10 h-10 rounded-full bg-black/40 text-white backdrop-blur"
          >
            ‹
          </button>

          <button
            onClick={() => changeNews("next")}
            className="w-10 h-10 rounded-full bg-black/40 text-white backdrop-blur"
          >
            ›
          </button>
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="md:col-span-4">
        <div
          className="overflow-hidden"
          style={{
            height: cardHeight.current
              ? `${cardHeight.current * 3 - 16}px`
              : "420px",
          }}
        >
          <div
            ref={wrapperRef}
            className="flex flex-col gap-4"
          >
            {sideNews.map((item) => (
              <div
                key={`${item.id}-${item.title}`}
                className="card flex gap-4 p-4 rounded-2xl bg-gris-claro shadow"
              >
                <img
                  src={item.img}
                  className="w-24 h-24 object-cover rounded-xl"
                  alt={item.title}
                />

                <div>
                  <span className="text-xs text-gray-500">
                    Notícia
                  </span>

                  <h3 className="font-bold text-sm leading-tight mt-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}