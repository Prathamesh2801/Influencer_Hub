import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  UploadIcon,
  StarIcon,
  TrophyIcon,
  EyeIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  BellIcon,
  BookOpenIcon,
  HelpCircleIcon,
  ChevronRightIcon,
  ClockIcon,
  AwardIcon,
  LinkIcon,
  BarChart3Icon,
} from "lucide-react";
import Banner from "./Banner";

const Home = () => {
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const howItWorksRef = useRef(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardHoverVariants = {
    hover: {
      y: -10,
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  // Sample data
  const stats = [
    {
      label: "Total Uploads",
      value: "127",
      icon: UploadIcon,
      color: "text-blue-600",
    },
    {
      label: "Your Score",
      value: "2,450",
      icon: StarIcon,
      color: "text-yellow-600",
    },
    {
      label: "Current Rank",
      value: "#23",
      icon: TrophyIcon,
      color: "text-purple-600",
    },
    {
      label: "Pending Reviews",
      value: "3",
      icon: ClockIcon,
      color: "text-orange-600",
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Upload Content",
      description:
        "Share your product reviews and unboxing videos with high-quality media",
      icon: UploadIcon,
      color: "from-blue-500 to-cyan-500",
    },
    {
      step: "02",
      title: "Get Reviewed",
      description:
        "Our team evaluates your content quality and engagement metrics",
      icon: EyeIcon,
      color: "from-green-500 to-emerald-500",
    },
    {
      step: "03",
      title: "Add Social URLs",
      description:
        "Connect your social media profiles and share analytics data",
      icon: LinkIcon,
      color: "from-purple-500 to-violet-500",
    },
    {
      step: "04",
      title: "Analytics Review",
      description:
        "Team analyzes your social metrics and approves qualified content",
      icon: BarChart3Icon,
      color: "from-orange-500 to-red-500",
    },
    {
      step: "05",
      title: "Earn & Climb",
      description:
        "Receive points based on quality and climb the leaderboard rankings",
      icon: TrophyIcon,
      color: "from-yellow-500 to-amber-500",
    },
  ];

  const topCreators = [
    {
      rank: 1,
      name: "Sarah Johnson",
      score: "4,890",
       avatar: `https://ui-avatars.com/api/?name=SH&background=ec4899&color=fff&size=40`,
      growth: "+120",
    },
    {
      rank: 2,
      name: "Mike Chen",
      score: "4,720",
      avatar: `https://ui-avatars.com/api/?name=MH&background=ec4899&color=fff&size=40`,
      growth: "+85",
    },
    {
      rank: 3,
      name: "Emma Davis",
      score: "4,650",
       avatar: `https://ui-avatars.com/api/?name=ED&background=ec4899&color=fff&size=40`,
      growth: "+67",
    },
    {
      rank: 4,
      name: "Alex Rivera",
      score: "4,580",
       avatar: `https://ui-avatars.com/api/?name=AR&background=ec4899&color=fff&size=40`,
      growth: "+43",
    },
    {
      rank: 5,
      name: "Lisa Park",
      score: "4,420",
       avatar: `https://ui-avatars.com/api/?name=LP&background=ec4899&color=fff&size=40`,
      growth: "+31",
    },
  ];

  const recentActivity = [
    {
      type: "approved",
      message: "Your 'Summer Skincare' review was approved",
      time: "2 hours ago",
      icon: CheckCircleIcon,
    },
    {
      type: "bonus",
      message: "New scoring bonus this week: +10 for unboxing videos!",
      time: "1 day ago",
      icon: StarIcon,
    },
    {
      type: "rank",
      message: "You moved up 3 positions in the leaderboard",
      time: "2 days ago",
      icon: TrophyIcon,
    },
  ];

  const testimonials = [
    {
      quote:
        "The Creator Hub helped me improve my content quality and connect with the Nykaa community.",
      author: "Priya Sharma",
      role: "Beauty Influencer",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      quote:
        "I love the competitive aspect. The leaderboard motivates me to create better content every day.",
      author: "Rahul Gupta",
      role: "Lifestyle Creator",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      quote:
        "The feedback system is incredible. I've learned so much about what makes content engaging.",
      author: "Anita Desai",
      role: "Skincare Expert",
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ];


  // Animated Counter Component
  const AnimatedCounter = ({ value, duration = 2 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref);

    useEffect(() => {
      if (isInView) {
        const target = parseInt(value.replace(/,/g, "").replace("#", ""));
        let current = 0;
        const increment = target / (duration * 60);

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            setCount(target);
            clearInterval(timer);
          } else {
            setCount(Math.floor(current));
          }
        }, 1000 / 60);

        return () => clearInterval(timer);
      }
    }, [isInView, value, duration]);

    return (
      <span ref={ref}>
        {value.includes("#") ? "#" : ""}
        {count.toLocaleString()}
        {value.includes(",") && count >= 1000 ? "" : ""}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden ">
      {/* Hero Section */}
      {/* <Banner/> */}
      <motion.section
        ref={heroRef}
        className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white relative overflow-hidden"
      >
        {/* Animated Background Particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-black/30"></div>

        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Welcome to
            <br />
            <motion.span
              className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              Nykaa Creator Hub
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Upload, get reviewed, earn points—and climb the leaderboard!
          </motion.p>

          <motion.button
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all inline-flex items-center space-x-2 group"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Get Started</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRightIcon className="h-5 w-5" />
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-20 w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full opacity-20"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full opacity-20"
          animate={{
            y: [0, 15, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.section>

      {/* At-a-Glance Stats */}
      <motion.section
        ref={statsRef}
        className="py-16 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
                variants={itemVariants}
                whileHover={cardHoverVariants.hover}
              >
                <div className="flex items-center space-x-4">
                  <motion.div
                    className={`p-3 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200`}
                    whileHover={{
                      scale: 1.1,
                      rotate: 5,
                      background: "linear-gradient(45deg, #f3f4f6, #e5e7eb)",
                    }}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </motion.div>
                  <div>
                    <motion.p
                      className="text-2xl font-bold text-gray-900"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                    >
                      <AnimatedCounter value={stat.value} />
                    </motion.p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        ref={howItWorksRef}
        className="py-16 bg-gradient-to-br from-gray-50 to-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started with our comprehensive five-step process to become a
              top creator
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                className="text-center group relative"
                variants={itemVariants}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
                  {/* Background gradient on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />

                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4 group-hover:from-gray-900 group-hover:to-gray-700 transition-all duration-300 relative z-10"
                    whileHover={{
                      scale: 1.1,
                      rotate: 360,
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <step.icon className="h-8 w-8 text-gray-600 group-hover:text-white transition-colors duration-300" />
                  </motion.div>

                  <div className="text-sm font-bold text-gray-400 mb-2">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>

                {/* Connecting Line */}
                {index < howItWorks.length - 1 && (
                  <motion.div
                    className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 transform -translate-y-1/2 z-0"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Leaderboard */}
      <motion.section
        className="py-16 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="flex items-center justify-between mb-8"
              variants={itemVariants}
            >
              <h2 className="text-3xl font-bold text-gray-900">Top Creators</h2>
              <motion.button
                className="text-gray-600 hover:text-gray-900 inline-flex items-center space-x-2 group"
                whileHover={{ x: 5 }}
              >
                <span>View Full Leaderboard</span>
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </motion.div>
              </motion.button>
            </motion.div>

            <motion.div
              className="bg-gray-50 rounded-xl p-6"
              variants={itemVariants}
            >
              <div className="space-y-4">
                {topCreators.map((creator, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-white rounded-lg hover:shadow-md transition-all duration-300"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                    }}
                  >
                    <motion.div
                      className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full text-sm font-bold text-gray-600"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                    >
                      {creator.rank}
                    </motion.div>
                    <motion.img
                      src={creator.avatar || "/placeholder.svg"}
                      alt={creator.name}
                      className="w-10 h-10 rounded-full"
                      whileHover={{ scale: 1.1 }}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {creator.name}
                      </p>
                      <p className="text-xs text-green-600">
                        +{creator.growth} this week
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{creator.score}</p>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Recent Activity */}
      <motion.section
        className="py-16 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="flex items-center justify-between mb-8"
              variants={itemVariants}
            >
              <h2 className="text-3xl font-bold text-gray-900">
                Recent Activity
              </h2>
              <motion.button
                className="text-gray-600 hover:text-gray-900 inline-flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <span>View All Notifications</span>
                <motion.div
                  animate={{
                    rotate: [0, 15, -15, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                >
                  <BellIcon className="h-4 w-4" />
                </motion.div>
              </motion.button>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6"
              variants={itemVariants}
            >
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <motion.div
                      className="p-2 bg-gray-100 rounded-lg"
                      whileHover={{
                        scale: 1.1,
                        background: "linear-gradient(45deg, #f3f4f6, #e5e7eb)",
                      }}
                    >
                      <activity.icon className="h-4 w-4 text-gray-600" />
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-gray-900">{activity.message}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Resources */}
      <motion.section
        className="py-16 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Resources & Best Practices
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to create amazing content and succeed on the
              platform
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            variants={containerVariants}
          >
            {[
              {
                icon: BookOpenIcon,
                title: "Upload Guidelines",
                description:
                  "Learn about file formats, sizes, and content requirements",
                link: "Read More →",
              },
              {
                icon: AwardIcon,
                title: "Scoring Rubric",
                description:
                  "Understand how your content is evaluated and scored",
                link: "Learn More →",
              },
              {
                icon: HelpCircleIcon,
                title: "Help Center",
                description: "Find answers to common questions and get support",
                link: "Get Help →",
              },
            ].map((resource, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <resource.icon className="h-8 w-8 text-gray-600 mb-4 group-hover:text-gray-900 transition-colors" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {resource.title}
                </h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <motion.button
                  className="text-gray-900 font-medium hover:underline group-hover:text-purple-600 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  {resource.link}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="bg-gray-900 text-white py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-bold mb-4">Nykaa Creator Hub</h3>
              <p className="text-gray-400">
                Empowering creators to showcase their talent and build their
                influence.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                {["Dashboard", "Upload", "Leaderboard", "Profile"].map(
                  (link, index) => (
                    <motion.a
                      key={index}
                      href="#"
                      className="block text-gray-400 hover:text-white transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      {link}
                    </motion.a>
                  )
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                {["Help Center", "Guidelines", "Contact Us", "Community"].map(
                  (link, index) => (
                    <motion.a
                      key={index}
                      href="#"
                      className="block text-gray-400 hover:text-white transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      {link}
                    </motion.a>
                  )
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {["Instagram", "YouTube", "Twitter"].map((social, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1, y: -2 }}
                  >
                    {social}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

      
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;
