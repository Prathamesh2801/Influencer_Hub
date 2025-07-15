"use client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import spotlight1 from "../../assets/vid/home/spotlight1.mp4";
import spotlight2 from "../../assets/vid/home/spotlight2.mov";
import spotlight3 from "../../assets/vid/home/spotlight3.mp4";

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

function mod(n, m) {
  return ((n % m) + m) % m;
}

export default function CreatorSpotlightCarousel() {
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
    if (!isMobile && slides.length === 3) {
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
    const activeVideoIndex = isMobile ? 0 : 1;
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
    <div className="min-h-[90vh] flex flex-col py-14 my-10 items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50  ">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Creator <span className="text-pink-500">Spotlight</span>
      </h2>
      <div className="w-full max-w-6xl px-4">
        <div className="relative overflow-hidden md:overflow-visible">
          {/* Unified Carousel Track for Mobile and Desktop */}
          <div ref={trackRef} className="flex w-full">
            {slides.map((creator, idx) => {
              const isCenter = isMobile ? idx === 0 : idx === 1;
              return (
                <div
                  key={`${creator.id}-${current}`}
                  ref={(el) => (slideRefs.current[idx] = el)}
                  className={`${
                    isMobile ? "w-full" : "w-1/3"
                  } flex-shrink-0 px-2 flex flex-col items-center transition-all duration-500`}
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
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-20 transition"
                          tabIndex={-1}
                        >
                          <span className="bg-white bg-opacity-90 rounded-full p-3 shadow-lg">
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
                    {/* <div className="p-4 text-center bg-white">
                      <h3 className="font-bold text-base text-gray-800 mb-2">
                        {creator.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-4">
                        {creator.username}
                      </p>
                      <button className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold px-4 py-2 rounded-full transition-all duration-300 text-xs">
                        Watch Full Video
                      </button>
                    </div> */}
                  </div>
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
        <div className="flex justify-center mt-10 space-x-2">
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
