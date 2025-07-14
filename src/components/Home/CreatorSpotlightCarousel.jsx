"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"

// Mock video data
const creators = [
  {
    id: 1,
    username: "@beautyQueen23",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    title: "Glowing Skin Routine",
  },
  {
    id: 2,
    username: "@GlowUpGuru",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    title: "Perfect Makeup Tutorial",
  },
  {
    id: 3,
    username: "@TrendSetter",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    title: "Bold Look Creation",
  },
  {
    id: 4,
    username: "@StyleIcon",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    title: "Evening Glam Look",
  },
  {
    id: 5,
    username: "@MakeupMaster",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    title: "Natural Beauty Tips",
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

export default function CreatorSpotlightCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const carouselRef = useRef(null);
  const trackRef = useRef(null);
  const videoRefs = useRef([]);
  const timelineRef = useRef(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Initialize GSAP timeline
  useEffect(() => {
    timelineRef.current = gsap.timeline();
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  // Handle video animations and playback
  useEffect(() => {
    if (!trackRef.current || !videoRefs.current.length) return;

    const tl = timelineRef.current;
    if (tl) {
      tl.clear();
    }

    // Calculate positions
    const slideWidth = carouselRef.current.offsetWidth / (isMobile ? 1 : 3);
    // const offset = isMobile
    //   ? currentIndex * slideWidth
    //   : (currentIndex - 1) * slideWidth;

    // Animate carousel position
    if (tl && trackRef.current) {
      tl.to(trackRef.current, {
        x: -currentIndex * slideWidth,
        duration: 0.6,
        ease: "power2.out",
      });
    }

    // Handle video scaling and playback
    videoRefs.current.forEach((videoContainer, index) => {
      if (!videoContainer) return;

      const videoElement = videoContainer.querySelector("video");
      const isCenter = isMobile
        ? index === currentIndex
        : index === currentIndex;

      // Scale animation
      if (tl) {
        tl.to(
          videoContainer,
          {
            scale: isCenter ? 1.05 : 0.95,
            duration: 0.6,
            ease: "power2.out",
          },
          0
        );
      }

      // Video playback control
      if (videoElement) {
        if (isCenter && isAutoPlaying) {
          videoElement.currentTime = 0;
          videoElement.play().catch(console.error);

          // Add ended event listener
          const handleVideoEnd = () => {
            if (isAutoPlaying) {
              nextSlide();
            }
            videoElement.removeEventListener("ended", handleVideoEnd);
          };
          videoElement.addEventListener("ended", handleVideoEnd);
        } else {
          videoElement.pause();
        }
      }
    });
  }, [currentIndex, isMobile, isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % creators.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + creators.length) % creators.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="text-center py-12 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
          Welcome to the <span className="text-pink-500">Nykaa Microsite</span>
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
          Where beauty meets creativity! Discover trending products and connect
          with top beauty influencers sharing their latest tips.
        </p>
      </header>

      {/* Creator Spotlight Carousel */}
      <section className="px-4 md:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Creator <span className="text-pink-500">Spotlight</span>
          </h2>

          <div
            ref={carouselRef}
            className="relative overflow-hidden"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Carousel Track */}
            <div
              ref={trackRef}
              className="flex"
              style={{
                width: isMobile ? `${creators.length * 100}%` : "100%",
                transform: isMobile ? "translateX(0)" : "translateX(0)",
              }}
            >
              {creators.map((creator, index) => (
                <div
                  key={creator.id}
                  ref={(el) => (videoRefs.current[index] = el)}
                  className={`${
                    isMobile ? "w-full flex-shrink-0" : "w-1/3"
                  } px-4 transition-all duration-300`}
                  //   style={{
                  //     display: isMobile ? "block" : Math.abs(index - currentIndex) <= 1 ? "block" : "none",
                  //   }}
                >
                  <Card
                    className={`overflow-hidden transition-all duration-500 ${
                      index === currentIndex
                        ? "shadow-2xl ring-4 ring-pink-300 ring-opacity-50"
                        : "shadow-lg hover:shadow-xl"
                    }`}
                  >
                    <CardContent className="p-0">
                      <div
                        className="relative bg-gradient-to-br from-pink-100 to-purple-100 overflow-hidden max-h-[80vh] md:max-h-none"
                        style={{ aspectRatio: "9/16" }}
                      >
                        <video
                          src={creator.src}
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                          preload="metadata"
                        />

                        {/* Play/Pause Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white bg-opacity-90 rounded-full p-4 transform hover:scale-110 transition-transform">
                            <Play className="w-8 h-8 text-pink-500" />
                          </div>
                        </div>

                        {/* Video Progress Indicator */}
                        {index === currentIndex && (
                          <div className="absolute bottom-0 left-0 w-full h-1 bg-black bg-opacity-30">
                            <div className="h-full bg-gradient-to-r from-pink-400 to-pink-600 transition-all duration-100 progress-bar" />
                          </div>
                        )}

                        {/* Creator Badge */}
                        <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-full px-3 py-1">
                          <span className="text-sm font-semibold text-gray-800">
                            {creator.username}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 text-center bg-white">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">
                          {creator.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          {creator.username}
                        </p>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
                        >
                          Watch Full Video
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Navigation Arrows - Desktop Only */}
            {!isMobile && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-300 transform hover:scale-110 z-10"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-300 transform hover:scale-110 z-10"
                >
                  <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
              </>
            )}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-3">
            {creators.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "bg-pink-500 scale-125 shadow-lg"
                    : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
                }`}
              />
            ))}
          </div>

          {/* Auto-play Control */}
          <div className="flex justify-center mt-6">
            <Button
              size="sm"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-full transition-all duration-300"
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause Auto-advance
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Enable Auto-advance
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Info */}
      <div className="text-center px-4 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="hidden md:block">
            <p className="text-sm text-gray-600 bg-pink-50 p-4 rounded-lg border border-pink-100">
              🎬 Videos auto-advance when completed • Middle video plays and
              scales up for focus • Hover to pause auto-advance
            </p>
          </div>
          <div className="md:hidden">
            <p className="text-sm text-gray-600 bg-pink-50 p-4 rounded-lg border border-pink-100">
              💡 Tap dots to navigate between creators • Videos auto-advance
              when completed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
