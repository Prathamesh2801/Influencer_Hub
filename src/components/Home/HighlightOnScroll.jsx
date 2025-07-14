import { useEffect, useRef, useCallback } from "react";

// For Production - Import actual GSAP
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Production GSAP implementation with real highlight/unhighlight
// const gsap = {
//   registerPlugin: (...plugins) => {
//     console.log("GSAP plugins registered:", plugins.map(p => p.name || 'Plugin'));
//   },
//   timeline: (options) => {
//     const chars = [];
//     let scrollTrigger = null;

//     const timeline = {
//       set: (target, props, position) => {
//         if (Array.isArray(target)) {
//           target.forEach((char, index) => {
//             // Set initial state
//             char.style.color = props.color || '#ffffff';
//             char.style.transition = 'color 0.3s ease-out';
//           });
//         }
//         return timeline;
//       },
//       revert: () => {
//         if (scrollTrigger) {
//           scrollTrigger.kill();
//         }
//       }
//     };

//     // Create ScrollTrigger if options provided
//     if (options?.scrollTrigger) {
//       scrollTrigger = ScrollTrigger.create({
//         trigger: options.scrollTrigger.trigger,
//         start: options.scrollTrigger.start,
//         end: options.scrollTrigger.end,
//         pin: options.scrollTrigger.pin,
//         scrub: options.scrollTrigger.scrub,
//         markers: options.scrollTrigger.markers,
//         onUpdate: (self) => {
//           const trigger = document.querySelector(options.scrollTrigger.trigger);
//           if (trigger) {
//             const chars = trigger.querySelectorAll('.split-char');
//             const progress = self.progress;

//             chars.forEach((char, index) => {
//               const charProgress = (progress * chars.length) - index;
//               const normalizedProgress = Math.max(0, Math.min(1, charProgress));

//               if (normalizedProgress > 0.1) {
//                 char.style.color = '#ffcc66';
//                 char.style.textShadow = '0 0 8px rgba(255, 204, 102, 0.5)';
//               } else {
//                 char.style.color = '#ffffff';
//                 char.style.textShadow = 'none';
//               }
//             });
//           }
//         }
//       });
//     }

//     return timeline;
//   },
//   delayedCall: (delay, callback) => ({
//     pause: () => ({
//       restart: (immediate) => {
//         if (immediate) {
//           callback();
//         } else {
//           setTimeout(callback, delay * 1000);
//         }
//       }
//     })
//   })
// };

// const SplitText = class {
//   constructor(element, options) {
//     this.element = typeof element === 'string' ? document.querySelector(element) : element;
//     this.chars = [];
//     this.originalText = '';

//     if (this.element && options.type === "chars") {
//       this.originalText = this.element.textContent;
//       this.element.innerHTML = '';

//       this.originalText.split('').forEach((char, index) => {
//         const span = document.createElement('span');
//         span.textContent = char === ' ' ? '\u00A0' : char;
//         span.className = 'split-char';
//         span.style.display = 'inline-block';
//         span.style.color = '#ffffff';
//         span.style.transition = 'color 0.3s ease-out, text-shadow 0.3s ease-out';
//         this.element.appendChild(span);
//         this.chars.push(span);
//       });
//     }
//   }

//   revert() {
//     if (this.element && this.originalText) {
//       this.element.innerHTML = this.originalText;
//       this.chars = [];
//     }
//   }
// };

// const ScrollTrigger = {
//   create: (options) => {
//     let animationId = null;
//     let isActive = false;

//     const updateProgress = () => {
//       const trigger = document.querySelector(options.trigger);
//       if (!trigger) return;

//       const rect = trigger.getBoundingClientRect();
//       const windowHeight = window.innerHeight;

//       // Calculate scroll progress
//       const start = windowHeight; // "top top" equivalent
//       const end = windowHeight * 2.5; // "+=150%" equivalent
//       const scrolled = start - rect.top;
//       const progress = Math.max(0, Math.min(1, scrolled / end));

//       // Pin the element when in range
//       if (progress > 0 && progress < 1) {
//         trigger.style.position = 'fixed';
//         trigger.style.top = '0';
//         trigger.style.left = '0';
//         trigger.style.width = '100%';
//         trigger.style.zIndex = '10';
//         isActive = true;
//       } else {
//         trigger.style.position = 'relative';
//         trigger.style.top = 'auto';
//         trigger.style.left = 'auto';
//         trigger.style.zIndex = 'auto';
//         if (isActive) {
//           isActive = false;
//         }
//       }

//       // Update callback with progress
//       if (options.onUpdate) {
//         options.onUpdate({ progress });
//       }
//     };

//     const handleScroll = () => {
//       if (animationId) {
//         cancelAnimationFrame(animationId);
//       }
//       animationId = requestAnimationFrame(updateProgress);
//     };

//     window.addEventListener('scroll', handleScroll);

//     return {
//       kill: () => {
//         window.removeEventListener('scroll', handleScroll);
//         if (animationId) {
//           cancelAnimationFrame(animationId);
//         }
//         // Reset element positioning
//         const trigger = document.querySelector(options.trigger);
//         if (trigger) {
//           trigger.style.position = 'relative';
//           trigger.style.top = 'auto';
//           trigger.style.left = 'auto';
//           trigger.style.zIndex = 'auto';
//         }
//       }
//     };
//   }
// };

export default function ScrollTextAnimation() {
  const textRef = useRef(null);
  const splitRef = useRef(null);
  const timelineRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const debouncerRef = useRef(null);

  const createSplit = useCallback(() => {
    // Clean up previous instances
    if (splitRef.current) {
      splitRef.current.revert();
    }
    if (timelineRef.current) {
      timelineRef.current.revert();
    }
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
    }

    // Create new SplitText instance
    splitRef.current = new SplitText(textRef.current, {
      type: "chars",
    });

    // Create timeline with ScrollTrigger
    timelineRef.current = gsap.timeline({
      scrollTrigger: {
        trigger: "#textSection",
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: 0.75,
        markers: false, // Set to true for debugging
      },
    });

    // Set character colors with stagger
    timelineRef.current.set(
      splitRef.current.chars,
      {
        color: "#ffcc66",
        stagger: 0.1,
      },
      0.1
    );

    // Create scroll trigger for demo
    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: "#textSection",
    });
  }, []);

  useEffect(() => {
    // Register GSAP plugins (in real implementation)
    gsap.registerPlugin(SplitText, ScrollTrigger);

    // Initial setup
    createSplit();

    // Create debounced resize handler
    debouncerRef.current = gsap.delayedCall(0.2, createSplit).pause();

    const handleResize = () => {
      if (debouncerRef.current) {
        debouncerRef.current.restart(true);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (splitRef.current) {
        splitRef.current.revert();
      }
      if (timelineRef.current) {
        timelineRef.current.revert();
      }
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
    };
  }, [createSplit]);

  return (
    <div className=" text-white text-xl">
      {/* Text Section */}
      <section id="textSection" className="w-full h-screen ">
        <div className="w-full  h-full flex items-center mx-auto px-5">
          <div className="wrapper w-full">
            <p
              ref={textRef}
              className="text-white leading-relaxed text-lg md:text-xl lg:text-2xl"
            >
            Step into the spotlight with Nykaa’s Influencer Tribe—a community of trendsetters who believe that beauty is more than skin‑deep. As a Nykaa influencer, you’ll get exclusive early access to our newest launches, hands‑on masterclasses with industry experts, and VIP invites to behind‑the‑scenes events. Share your authentic reviews, makeup tutorials, and skincare secrets with a passionate audience that trusts your voice. 
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
