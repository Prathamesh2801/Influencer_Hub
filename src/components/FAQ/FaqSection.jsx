"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { motion } from "framer-motion";
import {
  UploadIcon,
  TrophyIcon,
  EyeIcon,
  LinkIcon,
  BarChart3Icon,
  MinusIcon,
  PlusIcon,
} from "lucide-react";
import { useRef } from "react";
import { faqs } from "../../../public/faqConfig";
import bgbanner from "../../assets/img/reelsBanner3.png";
import faqHeader from "../../assets/img/utils/HelpDesk.png";

export default function FaqSection() {
  const howItWorksRef = useRef(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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

  const howItWorks = [
    {
      step: "01",
      title: "Upload Content",
      description: "Submit your video for quality check",
      icon: UploadIcon,
    },
    {
      step: "02",
      title: "Content Evaluation",
      description:
        "Incorporate feedback shared and publish the video on your Instagram handle once it’s approved.",
      icon: EyeIcon,
    },
    {
      step: "03",
      title: "Share Content link",
      description:
        "After your video is approved and uploaded on your Instagram handle, add the video link and a story screenshot to mark your task complete. Please make sure that you publish the story with the UTM link shared with you.",
      icon: LinkIcon,
    },
    {
      step: "04",
      title: "Share insights",
      description:
        "Upload screenshot of the analytics of your reel - this should cover impressions, reach, views, likes, shares, saves, comments.",
      icon: BarChart3Icon,
    },
    {
      step: "05",
      title: "Earn & Climb",
      description: "Receive points post task completion and get a rank!",
      icon: TrophyIcon,
    },
  ];

  return (
    <div
      style={{
        background: `url(${bgbanner}) center/contain`,
        position: "relative",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-600 bg-opacity-20 z-0" />
      {/* How It Works Section */}
      <motion.section
        ref={howItWorksRef}
        className="py-5 lg:py-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}

          <div className="flex flex-col md:flex-row items-center   md:justify-between  px-4 py-5 space-y-4">
            <img src={faqHeader} alt="" className="h-24" />
            <button
              onClick={() => {
                window.open(
                  "https://zeal.eventsongo.com/API/Guidelines.pdf",
                  "_blank"
                );
              }}
              className="bg-gradient-to-r from-pink-700 via-pink-600 to-pink-500 font-semibold px-4 py-3 text-white rounded-md shadow-md hover:bg-gradient-to-r hover:from-pink-500 hover:via-pink-600 hover:to-pink-700 transition-all duration-300"
            >
              Content Guidelines
            </button>
          </div>

          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl bungee-regular font-bold tracking-tight text-[#E4007C] mb-4">
              How It Works
            </h2>
            <p className="text-xl font-semibold text-[#F06292] max-w-3xl mx-auto">
              Get started with our comprehensive five-step process to become a
              top creator
            </p>
          </motion.div>

          {/* Desktop: 2 rows layout, Mobile: single column */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 mb-8">
            {/* First row - 3 items */}
            {howItWorks.slice(0, 3).map((step, index) => (
              <motion.div
                key={index}
                className="group relative"
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border border-[#FACCE0] relative overflow-hidden h-full">
                  {/* Gradient overlay on hover */}
                  <motion.div className="absolute inset-0 bg-gradient-to-br from-[#E4007C]/5 to-[#F06292]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    <motion.div
                      className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#E4007C] to-[#F06292] rounded-2xl mb-6 shadow-lg"
                      whileHover={{
                        scale: 1.1,
                        rotate: 5,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <step.icon className="h-8 w-8 text-white" />
                    </motion.div>

                    <div className="text-sm font-bold text-[#E4007C] mb-3 tracking-wider">
                      STEP {step.step}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connecting arrow for desktop */}
                {index < 2 && (
                  <motion.div
                    className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#E4007C] to-[#F06292] transform -translate-y-1/2 z-10"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Second row - 2 items centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {howItWorks.slice(3).map((step, index) => (
              <motion.div
                key={index + 3}
                className="group relative"
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border border-[#FACCE0] relative overflow-hidden h-full">
                  {/* Gradient overlay on hover */}
                  <motion.div className="absolute inset-0 bg-gradient-to-br from-[#E4007C]/5 to-[#F06292]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    <motion.div
                      className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#E4007C] to-[#F06292] rounded-2xl mb-6 shadow-lg"
                      whileHover={{
                        scale: 1.1,
                        rotate: 5,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <step.icon className="h-8 w-8 text-white" />
                    </motion.div>

                    <div className="text-sm font-bold text-[#E4007C] mb-3 tracking-wider">
                      STEP {step.step}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connecting arrow between the two bottom items */}
                {index === 0 && (
                  <motion.div
                    className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#E4007C] to-[#F06292] transform -translate-y-1/2 z-10"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <section className="relative py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#E4007C] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-[#F06292] max-w-3xl mx-auto">
              Find answers to common questions about the creator flow, video
              submissions, and more
            </p>
          </motion.div>

          <motion.div
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#FACCE0]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <dl className="space-y-6 divide-y divide-[#FACCE0]">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Disclosure as="div" className="pt-6 first:pt-0">
                    {({ open }) => (
                      <>
                        <dt>
                          <DisclosureButton className="group flex w-full items-start justify-between text-left hover:bg-[#FFF1F7]/50 rounded-xl p-4 -m-4 transition-colors duration-200">
                            <span className="text-base sm:text-lg font-semibold text-gray-900 pr-4">
                              {faq.question}
                            </span>
                            <span className="ml-6 flex h-7 items-center flex-shrink-0">
                              <motion.div
                                animate={{ rotate: open ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                {open ? (
                                  <MinusIcon
                                    className="h-6 w-6 text-[#E4007C]"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="h-6 w-6 text-[#E4007C]"
                                    aria-hidden="true"
                                  />
                                )}
                              </motion.div>
                            </span>
                          </DisclosureButton>
                        </dt>
                        <DisclosurePanel
                          as={motion.dd}
                          className="mt-4 pr-0 sm:pr-12 pl-4"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p
                            className="text-base text-gray-600 leading-relaxed pb-4"
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                          />
                        </DisclosurePanel>
                      </>
                    )}
                  </Disclosure>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
