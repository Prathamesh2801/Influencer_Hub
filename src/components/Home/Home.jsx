"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import banner1 from "../../assets/img/home/banner1.jpg";
import banner2 from "../../assets/img/home/banner2.jpg";
import banner3 from "../../assets/img/home/banner3.jpg";
import banner4 from "../../assets/img/home/banner4.jpg";
import banner5 from "../../assets/img/home/banner5.jpg";
import banner6 from "../../assets/img/home/banner6.jpg";
import trendy1 from "../../assets/img/home/trendy.png";
import trendy2 from "../../assets/img/home/trendy1.png";
import trendy3 from "../../assets/img/home/trendy2.png";
import trendy4 from "../../assets/img/home/trendy3.png";
import spotlight1 from "../../assets/vid/home/spotlight1.mp4";
import spotlight2 from "../../assets/vid/home/spotlight2.mov";
import spotlight3 from "../../assets/vid/home/spotlight3.mp4";
import CreatorSpotlightCarousel from "./CreatorSpotlightCarousel";

const highlights = [
  "Save Your Skin, Get 30% Off ",
  "Latest New Makeup",
  "Glow-Up Your Skin Today",
  "Expert Your Hair On Style",
  "Latest New Skin Care",
];

const heroBannners = [banner1, banner2, banner3, banner4, banner5, banner6];

const creators = [
  {
    id: 1,
    username: "@beautyQueen23",
    src: spotlight1,
    title: "Glowing Skin Routine",
  },
  {
    id: 2,
    username: "@GlowUpGuru",
    src: spotlight2,
    title: "Perfect Makeup Tutorial",
  },
  {
    id: 3,
    username: "@TrendSetter",
    src: spotlight3,
    title: "Bold Look Creation",
  },
];

const hotProducts = [
  {
    id: 1,
    image: trendy1,
    title: "Liquid Lipstick Set",
  },
  {
    id: 2,
    image: trendy2,
    title: "Trendy Eyeliner",
  },
  {
    id: 3,
    image: trendy3,
    title: "Trendy Foundation",
  },
  {
    id: 4,
    image: trendy4,
    title: "Trendy Eye Shadow",
  },
];

const Button = ({
  children,
  className = "",
  size = "default",
  onClick,
  ...props
}) => {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    >
      {children}
    </div>
  );
};

const CardContent = ({ children, className = "" }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

export default function Home() {
  const highlightRef = useRef(null);
  const carouselRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const el = highlightRef.current;
      // total scrollable width of the duplicated list
      const fullWidth = el.scrollWidth;
      // width of one set = half of that
      const singleWidth = fullWidth / 2;

      // start at x = 0
      gsap.set(el, { x: 0 });

      // animate leftward by the pixel width of one set
      const tween = gsap.to(el, {
        x: -singleWidth,
        duration: 10, // tweak to control speed
        ease: "none", // "none" avoids any easing bumps
        repeat: -1,
      });

      return () => {
        tween.kill();
      };
    }, highlightRef);
    return () => ctx.revert();
  }, []);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Position track half‑offscreen left
      gsap.set(trackRef.current, { x: "-50%" });
      // Infinite left-to-right scroll
      const scrollTween = gsap.to(trackRef.current, {
        x: "0%",
        duration: 15,
        ease: "none",
        repeat: -1,
      });

      // Grab all banner items
      const items = trackRef.current.querySelectorAll(".carousel-item");

      // Handlers
      function handleScrollPause() {
        scrollTween.pause();
      }
      function handleScrollPlay() {
        scrollTween.play();
      }
      function handleScaleUp(e) {
        gsap.to(e.currentTarget, { scale: 1.1, duration: 0.3 });
      }
      function handleScaleDown(e) {
        gsap.to(e.currentTarget, { scale: 1.0, duration: 0.3 });
      }

      // Bind events on the container
      const container = carouselRef.current;
      container.addEventListener("mouseenter", handleScrollPause);
      container.addEventListener("mouseleave", handleScrollPlay);

      // Bind scale events on each item
      items.forEach((item) => {
        item.style.transformOrigin = "center center"; // set transform origin
        item.addEventListener("mouseenter", handleScaleUp);
        item.addEventListener("mouseleave", handleScaleDown);
      });

      // Cleanup
      return () => {
        scrollTween.kill();
        container.removeEventListener("mouseenter", handleScrollPause);
        container.removeEventListener("mouseleave", handleScrollPlay);
        items.forEach((item) => {
          item.removeEventListener("mouseenter", handleScaleUp);
          item.removeEventListener("mouseleave", handleScaleDown);
        });
      };
    }, carouselRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#FFE6F0]  from-70% to-white">
      {/* Header */}
      <header className="text-center py-8 pb-6 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
          Welcome to the <span className="text-pink-500">Nykaa Core Microsite</span>
        </h1>
        <p className="text-gray-600 text-lg md:text-xl">
          Where beauty meets creativity! Discover trending products and connect
          with
        </p>
        <p className="text-gray-600 text-sm md:text-base">
          top beauty influencers sharing their latest tips.
        </p>
      </header>

      {/* Top Banner with Moving Highlights */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 my-4 text-white py-3 overflow-hidden">
        <div ref={highlightRef} className="flex whitespace-nowrap">
          {[...highlights, ...highlights].map((h, i) => (
            <span key={i} className="mx-8 text-sm font-medium">
              {h}
            </span>
          ))}
        </div>
      </div>

      {/* Hero Carousel Section */}
      <div
        ref={carouselRef}
        className="carousel-container overflow-hidden  relative group"
      >
        <div className="flex gap-5 w-max" ref={trackRef}>
          {[...heroBannners, ...heroBannners].map((banner, index) => (
            <div key={index} className="carousel-item p-5 shrink-0">
              <img
                src={banner}
                alt={`Banner ${index + 1}`}
                className="rounded-xl shadow-lg w-full h-[300px] object-cover pointer-events-auto"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Creator Spotlight */}
      {/* <section className="px-4 md:px-8 mb-16 bg-white p-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Creator <span className="text-pink-500">Spotlight</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {creators.map((creator, index) => (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <Button
                      size="lg"
                      className=" p-4"
                      onClick={() => {
                        const video = document.querySelector(
                          `video[src="${creator.src}"]`
                        );
                        if (video) {
                          if (video.paused) {
                            video.play();
                          } else {
                            video.pause();
                          }
                        }
                      }}
                    >
                      <div className="relative aspect-square bg-gradient-to-br from-pink-100 to-purple-100">
                        <video
                          src={creator.src}
                          muted
                          loop
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Button>
                    <div className="p-4 text-center">
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {creator.username}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {creator.title}
                      </p>
                      <Button
                          size="sm"
                          className="bg-pink-500 hover:bg-pink-600 text-white"
                        >
                          Watch Now
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}
      {/* <section>
        <HighlightOnScroll />
      </section> */}

      <CreatorSpotlightCarousel/>

      {/* Hot Right Now */}
      <section className="px-4 md:px-8 pb-10 ">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center my-8">
            Hot <span className="text-pink-500">Right Now</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {hotProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group cursor-pointer"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-white ">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-gradient-to-br from-pink-50 to-purple-50">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-full rounded-lg object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3 mt-4  text-center">
                      <Button
                        size="sm"
                        style={{ borderRadius: "1.3rem" }}
                        className="bg-pink-500  hover:bg-pink-600 text-white rounded-2xl"
                      >
                        {product.title}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
