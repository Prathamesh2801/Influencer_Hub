import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import CreatorSpotlightCarousel from "./CreatorSpotlightCarousel";
import { getAllHomeCreatives } from "../../api/Creatives/CreativesApi";
import { API_URL } from "../../../config";
import HoloBg from "../../assets/img/home/holoBG.png";
import Homepage_Banner_2 from "../../assets/img/home/Homepage_Banner_2.png";
import Homepage_Banner_Mob from "../../assets/img/home/Homepage_Banner_Mob.png";
import picart1 from "../../assets/img/home/picarts/Appliance.png";
import picart2 from "../../assets/img/home/picarts/Bath & Body.png";
import picart3 from "../../assets/img/home/picarts/Fragrance.png";
import picart4 from "../../assets/img/home/picarts/Hair.png";
import picart5 from "../../assets/img/home/picarts/Makeup.png";
import picart6 from "../../assets/img/home/picarts/Skincare.png";
import picart7 from "../../assets/img/home/picarts/Wellness.png";
import PicartCarousel from "./PicartCarousel";
import { useMediaQuery } from "react-responsive";
import HeroCarousel from "./HeroCarousel";

const picarts = [
  {
    id: 1,
    title: "Appliance",
    image: picart1,
  },
  {
    id: 2,
    title: "Bath & Body",
    image: picart2,
  },
  {
    id: 3,
    title: "Fragrance",
    image: picart3,
  },
  {
    id: 4,
    title: "Hair Care",
    image: picart4,
  },
  {
    id: 5,
    title: "Makeup",
    image: picart5,
  },
  {
    id: 6,
    title: "Skincare",
    image: picart6,
  },
  {
    id: 7,
    title: "Wellness",
    image: picart7,
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

const LoadingSpinner = () => (
  <div className="flex items-center justify-center  py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
  </div>
);

export default function Home() {
  const [homeData, setHomeData] = useState({
    Notification: [],
    Banner: [],
    Spotlight: [],
    Advertisement: [],
  });

  const [loading, setLoading] = useState(true);
  const highlightRef = useRef(null);
  const carouselRef = useRef(null);
  const trackRef = useRef(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    const el = highlightRef.current;
    if (!el || homeData.Notification.length === 0) return;

    // width of one pass
    const W = el.scrollWidth / 2;

    // reset start position
    gsap.set(el, { x: 0 });

    // build a looping timeline
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "none" } });

    // 1) animate left by W
    tl.to(el, { x: -W, duration: 30 });

    // 2) **snap** right back to zero **instantly** at the very end
    tl.set(el, { x: 0 });

    return () => tl.kill();
  }, [homeData.Notification]);

  async function getHomeData() {
    try {
      const response = await getAllHomeCreatives();
      // console.log("Home Creatives : ", response);
      if (response?.Status) {
        setHomeData(response.Data);
        // console.log("Homepage Data:", response.Data);
      } else {
        console.error("Failed to fetch home data", response?.Message);
      }
    } catch (error) {
      console.error("Error fetching home data:", error);
    }
  }

  useEffect(() => {
    getHomeData().finally(() => setLoading(false));
  }, []);

  const dynamicCreators = homeData.Spotlight.map((item, index) => ({
    id: index + 1,
    username: item.username,
    src: API_URL + item.video,
    link: item.link,
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto translate-y-full">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <header>
        <img
          src={isMobile ? Homepage_Banner_Mob : Homepage_Banner_2}
          alt="Homepage Banner"
          className="w-full h-auto object-cover"
        />
      </header>

      {/* Top Banner with Moving Highlights */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3">
        <div className="relative w-full overflow-hidden">
          <div
            ref={highlightRef}
            className="flex whitespace-nowrap will-change-transform"
          >
            {[...homeData.Notification, ...homeData.Notification].map(
              (h, i) => (
                <span
                  key={i}
                  className="mx-8 first:ml-0 last:mr-0 text-sm font-medium flex-shrink-0"
                >
                  {h}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/*     Spotlight Creators    */}

      <CreatorSpotlightCarousel creators={dynamicCreators} />

      <HeroCarousel banners={homeData.Banner} />
      {/* Hot Right Now */}
      <section className="px-4 md:px-8 pb-10 bg-[#ccaffd] ">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl bebas-neue-regular tracking-wide font-bold text-center pt-8 mb-8">
            Hot <span className="text-pink-500">Right Now</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {homeData.Advertisement.map((product, index) => (
              <motion.div
                key={index}
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
                        src={`${API_URL}${product.image}`}
                        alt={product.title}
                        className="w-full h-full rounded-lg object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3 mt-4  text-center">
                      <Button
                        size="sm"
                        style={{ borderRadius: "1.3rem" }}
                        onClick={() => window.open(product.link)}
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

      {/* ========================  PICARTS  =================================== */}

      <PicartCarousel picarts={picarts} />
    </div>
  );
}
