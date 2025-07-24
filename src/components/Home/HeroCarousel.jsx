import { useRef, useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { API_URL } from "../../../config";

export default function HeroCarousel({ banners }) {
  const carouselRef = useRef(null);
  const trackRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    checkArrows();
    // Add resize listener to recalculate arrows on window resize
    const handleResize = () => checkArrows();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [banners]);

  const scrollByAmount = 300; // Adjusted for larger hero items

  const checkArrows = () => {
    const el = carouselRef.current;
    if (el) {
      setShowLeftArrow(el.scrollLeft > 0);
      setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth);
    }
  };

  const handleScroll = (direction) => {
    const el = carouselRef.current;
    if (el) {
      el.scrollBy({
        left: direction === "left" ? -scrollByAmount : scrollByAmount,
        behavior: "smooth",
      });
      setTimeout(checkArrows, 300);
    }
  };

  const handleScrollEvent = () => {
    checkArrows();
  };

  // Duplicate banners for infinite scroll effect
  const duplicatedBanners = [...banners, ...banners];

  return (
    <div className="relative group">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white transition-colors duration-200 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
        </button>
      )}

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => handleScroll("right")}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white transition-colors duration-200 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRightIcon className="w-6 h-6 text-gray-700" />
        </button>
      )}
      <h2 className="text-4xl pt-5 bg-[#fea3e8] md:text-5xl font-bold bebas-neue-regular tracking-wide  text-center ">
        Campaign <span className="text-[#553194] ml-3">Highlights</span>
      </h2>
      {/* Carousel Container */}
      <div
        ref={carouselRef}
        onScroll={handleScrollEvent}
        className="carousel-container overflow-hidden py-5 relative bg-[#fea3e8] overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex gap-5 w-max" ref={trackRef}>
          {duplicatedBanners.map((banner, index) => (
            <div key={index} className="carousel-item flex-col p-5 shrink-0">
              <img
                src={`${API_URL}${banner.image}`}
                alt={`Banner ${index + 1}`}
                className="rounded-xl w-full h-[380px] object-cover pointer-events-auto"
              />
              {banner.Text && (
                <div className="mt-3 text-center">
                  <h2 className="text-black bebas-neue-regular text-lg font-bold px-4 py-2 rounded-lg backdrop-blur-sm inline-block">
                    {banner.Text}
                  </h2>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
