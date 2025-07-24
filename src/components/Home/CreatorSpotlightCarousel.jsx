"use client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

function mod(n, m) {
  return ((n % m) + m) % m;
}

export default function CreatorSpotlightCarousel({ creators }) {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const videoRefs = useRef([]);
  const slideRefs = useRef([]);
  const trackRef = useRef(null);
  const autoPlayTimeout = useRef(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Infinite carousel logic: for desktop show 3 videos, for mobile show 1
  const getSlides = () => {
    // 1 creator: just show that one
    if (creators.length === 1) {
      return [creators[0]];
    }
    // 2 creators: show current + next (desktop), or just current (mobile)
    if (creators.length === 2) {
      if (isMobile) {
        return [creators[mod(current, 2)]];
      }
      return [creators[mod(current, 2)], creators[mod(current + 1, 2)]];
    }
    // 3+ creators: your original infinite‑loop logic
    if (isMobile) {
      return [creators[mod(current, creators.length)]];
    }
    return [
      creators[mod(current - 1, creators.length)],
      creators[mod(current, creators.length)],
      creators[mod(current + 1, creators.length)],
    ];
  };

  const slides = getSlides();

  // Smooth slide animation with GSAP
  useEffect(() => {
    if (!trackRef.current) return;

    // No translation needed for either mobile or desktop now
    gsap.to(trackRef.current, {
      x: "0%",
      duration: 1,
      ease: "power4.out",
    });

    // Scale and opacity animation for desktop only
    if (!isMobile && creators.length > 2) {
      slideRefs.current.forEach((slide, idx) => {
        if (!slide) return;
        const isCenter = idx === 1;
        gsap.to(slide, {
          scale: isCenter ? 1.05 : 0.92,
          opacity: isCenter ? 1 : 0.5,
          zIndex: isCenter ? 2 : 1,
          duration: 0.8,
          ease: "power2.out",
        });
      });
    } else {
      // Reset styles for mobile or single slide
      slideRefs.current.forEach((slide) => {
        if (!slide) return;
        gsap.set(slide, {
          scale: 1,
          opacity: 1,
          zIndex: 1,
        });
      });
    }
  }, [current, isMobile, slides.length]);

  // Video play/pause logic
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (v) v.pause();
    });

    // For mobile, the active video is at index 0; for desktop, it's at index 1
    const activeVideoIndex = isMobile ? 0 : Math.floor(slides.length / 2);
    const activeVideo = videoRefs.current[activeVideoIndex];

    if (activeVideo && isPlaying) {
      activeVideo.currentTime = 0;
      activeVideo.play().catch(() => {});
      const update = () => {
        setProgress(
          activeVideo.duration
            ? (activeVideo.currentTime / activeVideo.duration) * 100
            : 0
        );
      };
      activeVideo.addEventListener("timeupdate", update);

      const onEnd = () => {
        setProgress(0);
        autoPlayTimeout.current = setTimeout(() => {
          handleNext();
        }, 400);
      };
      activeVideo.addEventListener("ended", onEnd);

      return () => {
        activeVideo.removeEventListener("timeupdate", update);
        activeVideo.removeEventListener("ended", onEnd);
        clearTimeout(autoPlayTimeout.current);
      };
    }
  }, [current, isPlaying, isMobile]);

  useEffect(() => () => clearTimeout(autoPlayTimeout.current), []);

  const handleNext = () => {
    setCurrent((c) => mod(c + 1, creators.length));
    setProgress(0);
  };
  const handlePrev = () => {
    setCurrent((c) => mod(c - 1, creators.length));
    setProgress(0);
  };
  const togglePlay = () => setIsPlaying((p) => !p);

  return (
    <div className="min-h-[90vh] flex flex-col  items-center justify-center bg-[#c2e4e6] py-5  ">
      <h2 className="text-4xl md:text-5xl font-bold bebas-neue-regular tracking-wide  text-center mb-10">
        Creator <span className="text-pink-500 ml-3">Spotlights</span>
      </h2>
      <div className="w-full max-w-6xl px-4">
        <div className="relative overflow-hidden md:overflow-visible">
          {/* Unified Carousel Track for Mobile and Desktop */}
          <div
            ref={trackRef}
            className={`
    flex w-full
    ${!isMobile && slides.length < 3 ? "justify-center" : ""}
  `}
          >
            {slides.map((creator, idx) => {
              const isCenter = isMobile ? idx === 0 : idx === 1;
              return (
                <div
                  key={`${creator.id}-${current}`}
                  ref={(el) => (slideRefs.current[idx] = el)}
                  className={`${
                    isMobile
                      ? "w-full"
                      : slides.length === 1
                      ? "w-1/3"
                      : slides.length === 2
                      ? "w-1/3"
                      : "w-1/3"
                  }  flex-shrink-0 px-2 flex flex-col items-center transition-all duration-500`}
                  style={{
                    pointerEvents: isCenter ? "auto" : "none",
                  }}
                >
                  <div
                    className={`rounded-lg border bg-white shadow-lg overflow-hidden transition-all duration-500 ${
                      isCenter
                        ? "ring-2 ring-pink-300 ring-opacity-50 shadow-2xl"
                        : ""
                    } ${isMobile ? "w-full max-w-sm mx-auto" : ""}`}
                  >
                    <div
                      className="relative bg-gradient-to-br from-pink-100 to-purple-100"
                      style={{
                        aspectRatio: isMobile ? "9/16" : "4/5", // Reduced height for desktop
                      }}
                    >
                      <video
                        ref={(el) => (videoRefs.current[idx] = el)}
                        src={creator.src}
                        muted
                        playsInline
                        preload="metadata"
                        loop={false}
                        className="w-full h-full object-cover"
                        style={{
                          pointerEvents: isCenter ? "auto" : "none",
                        }}
                      />

                      {/* Play/Pause Overlay */}
                      {isCenter && (
                        <button
                          onClick={togglePlay}
                          className="group absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-20 transition"
                          tabIndex={-1}
                        >
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-3 shadow-lg">
                            {isPlaying ? (
                              <Pause className="w-7 h-7 text-pink-500" />
                            ) : (
                              <Play className="w-7 h-7 text-pink-500" />
                            )}
                          </span>
                        </button>
                      )}

                      {/* Progress bar */}
                      {isCenter && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-black bg-opacity-30">
                          <div
                            className="h-full bg-gradient-to-r from-pink-400 to-pink-600 transition-all duration-100"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                      {/* Creator Badge */}
                      <div className="absolute top-3 left-3 bg-white bg-opacity-90 rounded-full px-3 py-1">
                        <span className="text-xs font-semibold text-gray-800">
                          {creator.username}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Watch Now Button */}

                  <a
                    href={creator.link}
                    target="__blank"
                    // rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Watch Now
                  </a>
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-300 transform hover:scale-110 z-10"
            style={{ marginLeft: isMobile ? "0.5rem" : "-2rem" }}
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-300 transform hover:scale-110 z-10"
            style={{ marginRight: isMobile ? "0.5rem" : "-2rem" }}
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-5 md:mt-10 space-x-2">
          {creators.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                current === idx
                  ? "bg-pink-500 scale-125 shadow-lg"
                  : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
