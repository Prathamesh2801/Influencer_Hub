import { useRef, useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function PicartCarousel({ picarts }) {
  const carouselRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    checkArrows();
  }, []);

  const scrollByAmount = 220;

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
      setTimeout(checkArrows, 300); // Allow scroll to finish updating
    }
  };

  return (
    <div className="relative">
      {showLeftArrow && (
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md"
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
        </button>
      )}
      {showRightArrow && (
        <button
          onClick={() => handleScroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md"
        >
          <ChevronRightIcon className="h-6 w-6 text-gray-700" />
        </button>
      )}

      <div
        ref={carouselRef}
        onScroll={checkArrows}
        className="flex overflow-x-auto gap-4 bg-[#faf7cc] p-4 rounded-lg no-scrollbar scroll-smooth"
      >
        {picarts.map((picart, index) => (
          <div
            key={index}
            className="flex-shrink-0 flex flex-col justify-between items-center p-3 w-[180px] sm:w-[214px] h-[240px] sm:h-[270px] "
          >
            <img
              src={picart.image}
              alt={`Picart ${index + 1}`}
              className="w-full h-[180px] object-cover rounded-lg"
            />
            <h3 className="font-bold text-center text-xs sm:text-sm mt-2">
              {picart.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
