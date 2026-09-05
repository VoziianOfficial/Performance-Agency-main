


































(() => {
  "use strict";


  



  const doc = document;
  const html = doc.documentElement;
  const body = doc.body;

  const Config =
    window.SiteConfig || {};

  const qs = (
    selector,
    scope = doc
  ) => scope.querySelector(selector);

  const qsa = (
    selector,
    scope = doc
  ) => Array.from(
    scope.querySelectorAll(selector)
  );

  const isServicePage =
    body.classList.contains(
      "service-page"
    ) ||
    Boolean(
      body.dataset.service
    );

  if (!isServicePage) {
    return;
  }

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  const state = {
    service: null,

    heroPlayed: false,

    testimonialSwiper: null,

    marqueeInstances: [],

    processActiveIndex: 0,

    resizeTimer: null
  };


  



  const ready = (
    callback
  ) => {
    if (
      doc.readyState ===
      "loading"
    ) {
      doc.addEventListener(
        "DOMContentLoaded",
        callback,
        {
          once: true
        }
      );

      return;
    }

    callback();
  };


  



  const getCurrentService = () => {
    const id =
      body.dataset.service;

    if (!id) {
      return null;
    }

    if (
      typeof Config.getService ===
      "function"
    ) {
      return Config.getService(id);
    }

    return (
      Config.services || []
    ).find(
      (service) =>
        service.id === id
    ) || null;
  };


  



  const hydrateService = () => {
    state.service =
      getCurrentService();

    if (!state.service) {
      return;
    }

    const service =
      state.service;


    



    qsa(
      "[data-service-title]"
    ).forEach(
      (element) => {
        element.textContent =
          service.title;
      }
    );

    qsa(
      "[data-service-short-title]"
    ).forEach(
      (element) => {
        element.textContent =
          service.shortTitle ||
          service.title;
      }
    );

    qsa(
      "[data-service-description]"
    ).forEach(
      (element) => {
        element.textContent =
          service.description;
      }
    );

    qsa(
      "[data-service-hero-text]"
    ).forEach(
      (element) => {
        element.textContent =
          service.heroText ||
          service.description;
      }
    );


    






    qsa(
      "[data-capability-index]"
    ).forEach(
      (element) => {
        const index =
          Number(
            element.dataset
              .capabilityIndex
          );

        const capability =
          service.capabilities?.[
            index
          ];

        if (capability) {
          element.textContent =
            capability;
        }
      }
    );


    



    qsa(
      "[data-service-icon]"
    ).forEach(
      (element) => {
        if (!service.icon) {
          return;
        }

        element.setAttribute(
          "data-lucide",
          service.icon
        );
      }
    );


    



    window.lucide
      ?.createIcons?.({
        attrs: {
          "stroke-width": 1.7
        }
      });
  };


  



  const initGSAP = () => {
    if (!window.gsap) {
      return false;
    }

    if (
      window.ScrollTrigger
    ) {
      window.gsap
        .registerPlugin(
          window.ScrollTrigger
        );
    }

    return true;
  };


  



  const initHeroIntro = () => {
    const hero =
      qs(".service-hero");

    if (!hero) {
      return;
    }

    const kicker =
      qs(
        ".service-hero__kicker",
        hero
      );

    const title =
      qs(
        ".service-hero__title",
        hero
      );

    const copy =
      qs(
        ".service-hero__copy",
        hero
      );

    const actions =
      qs(
        ".service-hero__actions",
        hero
      );

    const side =
      qs(
        ".service-hero__side",
        hero
      );

    const metrics =
      qsa(
        ".service-hero__metric",
        hero
      );

    const lines =
      qsa(
        ".service-hero__grid-line",
        hero
      );


    let split = null;

    if (
      title &&
      window.SplitType &&
      !title.dataset.splitReady
    ) {
      try {
        split =
          new window.SplitType(
            title,
            {
              types:
                "lines,words"
            }
          );

        title.dataset.splitReady =
          "true";

        split.lines.forEach(
          (line) => {
            line.style.overflow =
              "hidden";
          }
        );
      } catch (error) {
        split = null;
      }
    }


    const play = () => {
      if (
        state.heroPlayed
      ) {
        return;
      }

      state.heroPlayed = true;


      



      if (
        reducedMotion ||
        !window.gsap
      ) {
        [
          kicker,
          title,
          copy,
          actions,
          side,
          ...metrics,
          ...lines
        ]
          .filter(Boolean)
          .forEach(
            (element) => {
              element.style.opacity =
                "1";

              element.style.transform =
                "none";
            }
          );

        return;
      }


      const gsap =
        window.gsap;

      const timeline =
        gsap.timeline({
          defaults: {
            ease:
              "power3.out"
          }
        });


      



      if (kicker) {
        gsap.set(
          kicker,
          {
            y: 14,
            opacity: 0
          }
        );
      }

      if (
        split?.words?.length
      ) {
        gsap.set(
          split.words,
          {
            yPercent: 110,
            opacity: 0
          }
        );
      } else if (title) {
        gsap.set(
          title,
          {
            y: 22,
            opacity: 0
          }
        );
      }

      if (copy) {
        gsap.set(
          copy,
          {
            y: 16,
            opacity: 0
          }
        );
      }

      if (actions) {
        gsap.set(
          actions,
          {
            y: 16,
            opacity: 0
          }
        );
      }

      if (metrics.length) {
        gsap.set(
          metrics,
          {
            x: 18,
            opacity: 0
          }
        );
      }

      if (lines.length) {
        gsap.set(
          lines,
          {
            opacity: 0
          }
        );
      }


      



      if (lines.length) {
        timeline.to(
          lines,
          {
            opacity: 1,

            duration: 0.5,

            stagger: 0.035
          },
          0
        );
      }

      if (kicker) {
        timeline.to(
          kicker,
          {
            y: 0,
            opacity: 1,

            duration: 0.4
          },
          0.06
        );
      }

      if (
        split?.words?.length
      ) {
        timeline.to(
          split.words,
          {
            yPercent: 0,
            opacity: 1,

            duration: 0.68,

            stagger: {
              each: 0.028,
              from: "start"
            }
          },
          0.1
        );
      } else if (title) {
        timeline.to(
          title,
          {
            y: 0,
            opacity: 1,

            duration: 0.68
          },
          0.1
        );
      }

      if (copy) {
        timeline.to(
          copy,
          {
            y: 0,
            opacity: 1,

            duration: 0.46
          },
          0.34
        );
      }

      if (actions) {
        timeline.to(
          actions,
          {
            y: 0,
            opacity: 1,

            duration: 0.44
          },
          0.41
        );
      }

      if (metrics.length) {
        timeline.to(
          metrics,
          {
            x: 0,
            opacity: 1,

            duration: 0.46,

            stagger: 0.07
          },
          0.28
        );
      }
    };


    



    doc.addEventListener(
      "site:revealed",
      play,
      {
        once: true
      }
    );


    



    window.setTimeout(
      () => {
        const overlay =
          qs(
            ".page-transition"
          );

        if (
          !overlay ||
          overlay.classList
            .contains(
              "is-hidden"
            )
        ) {
          play();
        }
      },
      140
    );
  };


  



  const initHeroParallax = () => {
    const hero =
      qs(".service-hero");

    const image =
      qs(
        ".service-hero__media img",
        hero || doc
      );

    if (
      !hero ||
      !image ||
      reducedMotion ||
      !window.gsap ||
      !window.ScrollTrigger
    ) {
      return;
    }

    window.gsap.fromTo(
      image,
      {
        yPercent: -3
      },
      {
        yPercent: 8,

        ease: "none",

        scrollTrigger: {
          trigger: hero,

          start:
            "top top",

          end:
            "bottom top",

          scrub: 0.85
        }
      }
    );
  };


  



  const initCapabilities =
    () => {
      const section =
        qs(
          ".service-capabilities"
        );

      if (!section) {
        return;
      }

      const cards =
        qsa(
          ".service-capability",
          section
        );

      if (!cards.length) {
        return;
      }


      



      cards.forEach(
        (card) => {
          card.setAttribute(
            "tabindex",
            "0"
          );

          card.addEventListener(
            "focus",
            () => {
              card.classList.add(
                "is-active"
              );
            }
          );

          card.addEventListener(
            "blur",
            () => {
              card.classList.remove(
                "is-active"
              );
            }
          );
        }
      );


      if (
        reducedMotion ||
        !window.gsap ||
        !window.ScrollTrigger
      ) {
        return;
      }

      window.gsap.from(
        cards,
        {
          y: 18,
          opacity: 0,

          duration: 0.52,

          stagger: 0.055,

          ease:
            "power3.out",

          scrollTrigger: {
            trigger:
              section,

            start:
              "top 82%",

            once: true
          }
        }
      );
    };


  



  const initSystem = () => {
    const section =
      qs(
        ".service-system"
      );

    if (!section) {
      return;
    }

    const nodes =
      qsa(
        ".service-system__node",
        section
      );

    if (
      !nodes.length ||
      reducedMotion ||
      !window.gsap ||
      !window.ScrollTrigger
    ) {
      return;
    }

    window.gsap.from(
      nodes,
      {
        y: 16,
        opacity: 0,

        duration: 0.52,

        stagger: 0.08,

        ease:
          "power3.out",

        scrollTrigger: {
          trigger:
            ".service-system__visual",

          start:
            "top 85%",

          once: true
        }
      }
    );
  };


  



  const initProcess = () => {
    const section =
      qs(
        ".service-process"
      );

    if (!section) {
      return;
    }

    const track =
      qs(
        ".service-process__track",
        section
      );

    const steps =
      qsa(
        ".service-process__step",
        section
      );

    if (
      !track ||
      !steps.length
    ) {
      return;
    }


    const isDesktop = () =>
      window.innerWidth > 991;


    const applyGrid = (
      activeIndex
    ) => {
      if (!isDesktop()) {
        track.style
          .gridTemplateColumns =
          "";

        return;
      }

      const columns =
        steps.map(
          (_, index) =>
            index === activeIndex
              ? "minmax(0, 1fr)"
              : "120px"
        );

      if (
        window.innerWidth <
        1400
      ) {
        columns.forEach(
          (
            value,
            index
          ) => {
            if (
              index !==
              activeIndex
            ) {
              columns[index] =
                window.innerWidth <
                1200
                  ? "90px"
                  : "105px";
            }
          }
        );
      }

      track.style
        .gridTemplateColumns =
        columns.join(" ");
    };


    const activate = (
      index,
      {
        animate = true
      } = {}
    ) => {
      if (
        index < 0 ||
        index >= steps.length
      ) {
        return;
      }

      state.processActiveIndex =
        index;

      steps.forEach(
        (step, stepIndex) => {
          const active =
            stepIndex === index;

          step.classList.toggle(
            "is-active",
            active
          );

          step.setAttribute(
            "aria-selected",
            String(active)
          );

          step.setAttribute(
            "tabindex",
            active
              ? "0"
              : "-1"
          );
        }
      );

      if (isDesktop()) {
        if (
          animate &&
          window.gsap &&
          !reducedMotion
        ) {
          window.gsap.to(
            track,
            {
              duration: 0.46,

              ease:
                "power3.out",

              onStart: () =>
                applyGrid(
                  index
                )
            }
          );
        } else {
          applyGrid(index);
        }
      }

      window.ScrollTrigger
        ?.refresh?.();
    };


    



    let initial =
      steps.findIndex(
        (step) =>
          step.classList
            .contains(
              "is-active"
            )
      );

    if (initial < 0) {
      initial =
        Math.min(
          1,
          steps.length - 1
        );
    }

    activate(
      initial,
      {
        animate: false
      }
    );


    



    steps.forEach(
      (
        step,
        index
      ) => {
        step.setAttribute(
          "role",
          "tab"
        );

        step.addEventListener(
          "mouseenter",
          () => {
            if (
              window.matchMedia(
                "(hover: hover)"
              ).matches
            ) {
              activate(index);
            }
          }
        );

        step.addEventListener(
          "click",
          () => {
            activate(index);
          }
        );

        step.addEventListener(
          "focus",
          () => {
            activate(index);
          }
        );

        step.addEventListener(
          "keydown",
          (event) => {
            let next = null;

            if (
              event.key ===
                "ArrowRight" ||
              event.key ===
                "ArrowDown"
            ) {
              next =
                (
                  index + 1
                ) %
                steps.length;
            }

            if (
              event.key ===
                "ArrowLeft" ||
              event.key ===
                "ArrowUp"
            ) {
              next =
                (
                  index -
                  1 +
                  steps.length
                ) %
                steps.length;
            }

            if (next === null) {
              return;
            }

            event.preventDefault();

            activate(next);

            steps[next]
              .focus();
          }
        );
      }
    );


    



    window.addEventListener(
      "resize",
      () => {
        applyGrid(
          state
            .processActiveIndex
        );
      },
      {
        passive: true
      }
    );


    



    if (
      !reducedMotion &&
      window.gsap &&
      window.ScrollTrigger
    ) {
      window.gsap.from(
        steps,
        {
          y: 16,
          opacity: 0,

          duration: 0.5,

          stagger: 0.06,

          ease:
            "power3.out",

          scrollTrigger: {
            trigger: track,

            start:
              "top 84%",

            once: true
          }
        }
      );
    }
  };


  



  const initWhy = () => {
    const section =
      qs(
        ".service-why"
      );

    if (!section) {
      return;
    }

    const visual =
      qs(
        ".service-why__visual img",
        section
      );

    const cards =
      qsa(
        ".service-why__card",
        section
      );


    



    if (
      visual &&
      !reducedMotion &&
      window.gsap &&
      window.ScrollTrigger
    ) {
      window.gsap.fromTo(
        visual,
        {
          yPercent: -3
        },
        {
          yPercent: 4,

          ease: "none",

          scrollTrigger: {
            trigger:
              section,

            start:
              "top bottom",

            end:
              "bottom top",

            scrub: 0.8
          }
        }
      );
    }


    



    if (
      cards.length &&
      !reducedMotion &&
      window.gsap &&
      window.ScrollTrigger
    ) {
      window.gsap.from(
        cards,
        {
          y: 18,
          opacity: 0,

          duration: 0.52,

          stagger: 0.08,

          ease:
            "power3.out",

          scrollTrigger: {
            trigger:
              ".service-why__cards",

            start:
              "top 90%",

            once: true
          }
        }
      );
    }
  };


  



  const initCounters = () => {
    const counters =
      qsa(
        "[data-count]"
      );

    counters.forEach(
      (element) => {
        if (
          element.dataset
            .countInitialized
        ) {
          return;
        }

        element.dataset
          .countInitialized =
          "true";

        const target =
          Number(
            element.dataset.count
          );

        if (
          !Number.isFinite(
            target
          )
        ) {
          return;
        }

        const decimals =
          Number(
            element.dataset
              .countDecimals
          ) || 0;

        const prefix =
          element.dataset
            .countPrefix || "";

        const suffix =
          element.dataset
            .countSuffix || "";


        const finalText = () => {
          element.textContent =
            `${prefix}${target.toLocaleString(
              undefined,
              {
                minimumFractionDigits:
                  decimals,

                maximumFractionDigits:
                  decimals
              }
            )}${suffix}`;
        };


        if (
          reducedMotion ||
          !window.gsap ||
          !window.ScrollTrigger
        ) {
          finalText();

          return;
        }

        const value = {
          current: 0
        };

        window.gsap.to(
          value,
          {
            current:
              target,

            duration: 1.25,

            ease:
              "power3.out",

            scrollTrigger: {
              trigger:
                element,

              start:
                "top 88%",

              once: true
            },

            onUpdate: () => {
              element.textContent =
                `${prefix}${value.current.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits:
                      decimals,

                    maximumFractionDigits:
                      decimals
                  }
                )}${suffix}`;
            },

            onComplete:
              finalText
          }
        );
      }
    );
  };


  



  const initMetricBars =
    () => {
      const section =
        qs(
          ".service-metrics"
        );

      if (!section) {
        return;
      }

      const bars =
        qsa(
          ".service-metric-bar",
          section
        );

      if (!bars.length) {
        return;
      }

      bars.forEach(
        (bar) => {
          const fill =
            qs(
              ".service-metric-bar__fill",
              bar
            );

          if (!fill) {
            return;
          }


          




          let height =
            Number(
              bar.dataset
                .metricHeight ||
              fill.dataset
                .metricHeight
            );

          if (
            !Number.isFinite(height)
          ) {
            height = 55;
          }

          height =
            Math.min(
              92,
              Math.max(
                25,
                height
              )
            );

          fill.style.setProperty(
            "--metric-height",
            `${height}%`
          );


          if (
            reducedMotion ||
            !window.gsap ||
            !window.ScrollTrigger
          ) {
            fill.style.height =
              `${height}%`;

            return;
          }

          window.gsap.fromTo(
            fill,
            {
              height: "0%"
            },
            {
              height:
                `${height}%`,

              duration: 1.05,

              ease:
                "power3.out",

              scrollTrigger: {
                trigger:
                  section,

                start:
                  "top 78%",

                once: true
              }
            }
          );
        }
      );
    };


  



  const initServiceList =
    () => {
      const section =
        qs(
          ".service-list"
        );

      if (!section) {
        return;
      }

      const rows =
        qsa(
          ".service-list__row",
          section
        );

      if (!rows.length) {
        return;
      }


      const activate = (
        row
      ) => {
        rows.forEach(
          (other) => {
            other.classList.toggle(
              "is-active",
              other === row
            );
          }
        );
      };


      rows.forEach(
        (row) => {
          row.setAttribute(
            "tabindex",
            "0"
          );

          row.addEventListener(
            "mouseenter",
            () =>
              activate(row)
          );

          row.addEventListener(
            "focus",
            () =>
              activate(row)
          );

          row.addEventListener(
            "mouseleave",
            () => {
              if (
                !row.matches(
                  ":focus"
                )
              ) {
                row.classList.remove(
                  "is-active"
                );
              }
            }
          );
        }
      );


      




      if (
        reducedMotion ||
        !window.gsap ||
        !window.matchMedia(
          "(hover: hover) and (pointer: fine)"
        ).matches
      ) {
        return;
      }

      rows.forEach(
        (row) => {
          const media =
            qs(
              ".service-list__hover-media",
              row
            );

          if (!media) {
            return;
          }

          const xTo =
            window.gsap.quickTo(
              media,
              "x",
              {
                duration: 0.38,
                ease:
                  "power3.out"
              }
            );

          const yTo =
            window.gsap.quickTo(
              media,
              "y",
              {
                duration: 0.38,
                ease:
                  "power3.out"
              }
            );


          row.addEventListener(
            "mousemove",
            (event) => {
              const rect =
                row
                  .getBoundingClientRect();

              const centerX =
                rect.left +
                rect.width *
                  0.62;

              const centerY =
                rect.top +
                rect.height /
                  2;

              const x =
                (
                  event.clientX -
                  centerX
                ) *
                0.12;

              const y =
                (
                  event.clientY -
                  centerY
                ) *
                0.18;

              xTo(x);
              yTo(y);
            }
          );


          row.addEventListener(
            "mouseleave",
            () => {
              xTo(0);
              yTo(0);
            }
          );
        }
      );
    };


  



  const initInsights = () => {
    const section =
      qs(
        ".service-insights"
      );

    const image =
      qs(
        ".service-insights__visual img",
        section || doc
      );

    if (
      !section ||
      !image ||
      reducedMotion ||
      !window.gsap ||
      !window.ScrollTrigger
    ) {
      return;
    }

    window.gsap.fromTo(
      image,
      {
        scale: 1.035,
        yPercent: -2
      },
      {
        scale: 1.035,
        yPercent: 3,

        ease: "none",

        scrollTrigger: {
          trigger:
            section,

          start:
            "top bottom",

          end:
            "bottom top",

          scrub: 0.9
        }
      }
    );
  };


  



  const initTestimonials =
    () => {
      const slider =
        qs(
          ".service-testimonials__slider"
        );

      if (
        !slider ||
        !window.Swiper
      ) {
        return;
      }

      const section =
        slider.closest(
          ".service-testimonials"
        ) ||
        slider.parentElement;

      const slides =
        qsa(
          ".swiper-slide",
          slider
        );

      if (!slides.length) {
        return;
      }

      const prev =
        qs(
          "[data-service-testimonials-prev]",
          section
        );

      const next =
        qs(
          "[data-service-testimonials-next]",
          section
        );

      const pagination =
        qs(
          "[data-service-testimonials-pagination]",
          section
        );


      const allowLoop =
        slides.length >= 5;

      state.testimonialSwiper =
        new window.Swiper(
          slider,
          {
            loop:
              allowLoop,

            speed: 680,

            slidesPerView:
              1,

            spaceBetween:
              14,

            grabCursor:
              true,

            observer:
              true,

            observeParents:
              true,

            watchSlidesProgress:
              true,

            navigation:
              prev && next
                ? {
                    prevEl:
                      prev,

                    nextEl:
                      next
                  }
                : undefined,

            ...(pagination
              ? {
                  pagination: {
                    el:
                      pagination,

                    clickable:
                      true
                  }
                }
              : {}),

            autoplay:
              (
                !reducedMotion &&
                slides.length > 2
              )
                ? {
                    delay: 4800,

                    disableOnInteraction:
                      false,

                    pauseOnMouseEnter:
                      true
                  }
                : false,

            breakpoints: {
              600: {
                slidesPerView:
                  1.45,

                spaceBetween:
                  16
              },

              820: {
                slidesPerView:
                  2,

                spaceBetween:
                  18
              },

              1200: {
                slidesPerView:
                  3,

                spaceBetween:
                  20
              }
            },

            on: {
              init(swiper) {
                updateTestimonialActive(
                  swiper
                );
              },

              slideChange(swiper) {
                updateTestimonialActive(
                  swiper
                );
              }
            }
          }
        );
    };


  const updateTestimonialActive =
    (
      swiper
    ) => {
      if (!swiper) {
        return;
      }

      const slides =
        Array.from(
          swiper.slides || []
        );

      slides.forEach(
        (slide) => {
          const card =
            qs(
              ".service-testimonial",
              slide
            );

          card?.classList.remove(
            "is-active"
          );
        }
      );


      



      const activeIndex =
        swiper.activeIndex;

      let targetIndex =
        activeIndex;

      if (
        window.innerWidth >=
        1200
      ) {
        targetIndex += 1;
      }

      const target =
        slides[targetIndex] ||
        slides[activeIndex];

      const card =
        target
          ? qs(
              ".service-testimonial",
              target
            )
          : null;

      card?.classList.add(
        "is-active"
      );
    };


  



  const createMarquee = (
    root,
    {
      speed = 52,
      reverse = false
    } = {}
  ) => {
    if (
      !root ||
      reducedMotion
    ) {
      return null;
    }

    const track =
      qs(
        ".marquee__track",
        root
      );

    let groups =
      qsa(
        ".marquee__group",
        track || root
      );

    if (
      !track ||
      !groups.length
    ) {
      return null;
    }


    



    if (
      groups.length === 1
    ) {
      const clone =
        groups[0]
          .cloneNode(true);

      clone.setAttribute(
        "aria-hidden",
        "true"
      );

      track.appendChild(
        clone
      );

      groups =
        qsa(
          ".marquee__group",
          track
        );
    }


    let width = 0;

    let offset = 0;

    let frame = null;

    let previous =
      performance.now();


    const measure = () => {
      width =
        groups[0]
          .getBoundingClientRect()
          .width;

      if (
        !Number.isFinite(width)
      ) {
        width = 0;
      }

      if (
        reverse &&
        offset === 0 &&
        width
      ) {
        offset =
          -width;
      }
    };


    const render = (
      time
    ) => {
      const delta =
        Math.min(
          50,
          time -
            previous
        );

      previous = time;

      if (
        !doc.hidden &&
        width > 0
      ) {
        const movement =
          speed *
          (
            delta /
            1000
          );

        if (reverse) {
          offset += movement;

          if (
            offset >= 0
          ) {
            offset -= width;
          }
        } else {
          offset -= movement;

          if (
            Math.abs(offset) >=
            width
          ) {
            offset += width;
          }
        }

        track.style.transform =
          `translate3d(${offset}px, 0, 0)`;
      }

      frame =
        requestAnimationFrame(
          render
        );
    };


    const start = () => {
      measure();

      previous =
        performance.now();

      frame =
        requestAnimationFrame(
          render
        );
    };


    const destroy = () => {
      if (frame) {
        cancelAnimationFrame(
          frame
        );
      }
    };


    if (
      "ResizeObserver" in
      window
    ) {
      const observer =
        new ResizeObserver(
          measure
        );

      observer.observe(
        groups[0]
      );
    }

    start();

    const instance = {
      measure,
      destroy
    };

    state.marqueeInstances
      .push(instance);

    return instance;
  };


  const initMarquees = () => {
    qsa(
      ".service-marquee, [data-service-marquee]"
    ).forEach(
      (
        root,
        index
      ) => {
        createMarquee(
          root,
          {
            speed:
              Number(
                root.dataset
                  .marqueeSpeed
              ) ||
              (
                window.innerWidth <=
                767
                  ? 39
                  : 54
              ),

            reverse:
              root.dataset
                .marqueeDirection ===
                "reverse" ||
              index % 2 === 1
          }
        );
      }
    );
  };


  



  const initParallaxMedia =
    () => {
      if (
        reducedMotion ||
        !window.gsap ||
        !window.ScrollTrigger
      ) {
        return;
      }

      qsa(
        ".service-page .parallax-media img," +
        ".service-page [data-service-parallax]"
      ).forEach(
        (image) => {
          const parent =
            image.closest(
              ".parallax-media"
            ) ||
            image.parentElement;

          if (!parent) {
            return;
          }

          const distance =
            Number(
              image.dataset
                .parallaxDistance
            ) || 28;

          window.gsap.fromTo(
            image,
            {
              y: -distance
            },
            {
              y: distance,

              ease: "none",

              scrollTrigger: {
                trigger:
                  parent,

                start:
                  "top bottom",

                end:
                  "bottom top",

                scrub: 0.85
              }
            }
          );
        }
      );
    };


  



  const initReveals = () => {
    if (
      reducedMotion ||
      !window.gsap ||
      !window.ScrollTrigger
    ) {
      return;
    }


    



    qsa(
      "[data-service-reveal-group]"
    ).forEach(
      (group) => {
        const items =
          qsa(
            "[data-service-reveal]",
            group
          );

        if (!items.length) {
          return;
        }

        window.gsap.from(
          items,
          {
            y: 17,
            opacity: 0,

            duration: 0.5,

            stagger: 0.05,

            ease:
              "power3.out",

            scrollTrigger: {
              trigger:
                group,

              start:
                "top 88%",

              once: true
            }
          }
        );
      }
    );


    



    qsa(
      "[data-service-reveal]"
    ).forEach(
      (element) => {
        if (
          element.closest(
            "[data-service-reveal-group]"
          )
        ) {
          return;
        }

        window.gsap.from(
          element,
          {
            y: 15,
            opacity: 0,

            duration: 0.48,

            ease:
              "power3.out",

            scrollTrigger: {
              trigger:
                element,

              start:
                "top 90%",

              once: true
            }
          }
        );
      }
    );
  };


  



  const initServiceVariant =
    () => {
      const type =
        body.dataset.service;

      if (
        !type ||
        reducedMotion ||
        !window.gsap ||
        !window.ScrollTrigger
      ) {
        return;
      }


      



      if (
        type ===
        "google-ads"
      ) {
        const nodes =
          qsa(
            ".service-system__node"
          );

        nodes.forEach(
          (
            node,
            index
          ) => {
            window.gsap.to(
              node,
              {
                y:
                  index %
                    2 ===
                  0
                    ? -5
                    : 5,

                ease: "none",

                scrollTrigger: {
                  trigger:
                    ".service-system",

                  start:
                    "top bottom",

                  end:
                    "bottom top",

                  scrub: 1.1
                }
              }
            );
          }
        );
      }


      



      if (
        type ===
        "lead-generation"
      ) {
        const dots =
          qsa(
            ".service-process__dot"
          );

        window.gsap.from(
          dots,
          {
            scale: 0,

            duration: 0.3,

            stagger: 0.08,

            ease:
              "back.out(1.5)",

            scrollTrigger: {
              trigger:
                ".service-process",

              start:
                "top 78%",

              once: true
            }
          }
        );
      }


      



      if (
        type ===
        "ecommerce"
      ) {
        const visual =
          qs(
            ".service-insights__visual"
          );

        if (visual) {
          window.gsap.from(
            visual,
            {
              y: 18,
              opacity: 0,

              duration: 0.62,

              ease:
                "power3.out",

              scrollTrigger: {
                trigger:
                  visual,

                start:
                  "top 86%",

                once: true
              }
            }
          );
        }
      }


      



      if (
        type === "tracking"
      ) {
        const bars =
          qsa(
            ".service-metric-bar"
          );

        window.gsap.from(
          bars,
          {
            opacity: 0,

            duration: 0.45,

            stagger: 0.07,

            ease:
              "power2.out",

            scrollTrigger: {
              trigger:
                ".service-metrics",

              start:
                "top 82%",

              once: true
            }
          }
        );
      }


      



      if (
        type === "automation"
      ) {
        const nodes =
          qsa(
            ".service-system__node-icon"
          );

        window.gsap.from(
          nodes,
          {
            rotate: -14,
            scale: 0.9,
            opacity: 0,

            duration: 0.45,

            stagger: 0.08,

            ease:
              "power3.out",

            scrollTrigger: {
              trigger:
                ".service-system",

              start:
                "top 82%",

              once: true
            }
          }
        );
      }
    };


  



  const initCta = () => {
    const section =
      qs(
        ".service-cta"
      );

    const image =
      qs(
        ".service-cta__visual img",
        section || doc
      );

    if (
      !section ||
      !image ||
      reducedMotion ||
      !window.gsap ||
      !window.ScrollTrigger
    ) {
      return;
    }

    window.gsap.fromTo(
      image,
      {
        scale: 1.04,
        xPercent: -2
      },
      {
        scale: 1.04,
        xPercent: 2,

        ease: "none",

        scrollTrigger: {
          trigger:
            section,

          start:
            "top bottom",

          end:
            "bottom top",

          scrub: 1
        }
      }
    );
  };


  



  const refreshLayout = () => {
    requestAnimationFrame(
      () => {
        state.testimonialSwiper
          ?.update?.();

        state.marqueeInstances
          .forEach(
            (instance) => {
              instance
                .measure?.();
            }
          );

        window.SiteMotion
          ?.refresh?.();
      }
    );
  };


  



  const initLoadRefresh =
    () => {
      if (
        doc.readyState ===
        "complete"
      ) {
        refreshLayout();

        return;
      }

      window.addEventListener(
        "load",
        refreshLayout,
        {
          once: true
        }
      );
    };


  



  const initResize = () => {
    window.addEventListener(
      "resize",
      () => {
        clearTimeout(
          state.resizeTimer
        );

        state.resizeTimer =
          window.setTimeout(
            () => {
              refreshLayout();

              updateTestimonialActive(
                state
                  .testimonialSwiper
              );
            },
            180
          );
      },
      {
        passive: true
      }
    );
  };


  



  const initPageShow = () => {
    window.addEventListener(
      "pageshow",
      () => {
        requestAnimationFrame(
          refreshLayout
        );
      }
    );
  };


  



  const init = () => {
    hydrateService();

    initGSAP();

    initHeroIntro();

    initHeroParallax();

    initCapabilities();

    initSystem();

    initProcess();

    initWhy();

    initCounters();

    initMetricBars();

    initServiceList();

    initInsights();

    initTestimonials();

    initMarquees();

    initParallaxMedia();

    initReveals();

    initServiceVariant();

    initCta();

    initResize();

    initLoadRefresh();

    initPageShow();


    window.setTimeout(
      refreshLayout,
      140
    );


    



    doc.dispatchEvent(
      new CustomEvent(
        "site:service-ready",
        {
          detail: {
            service:
              state.service,

            testimonialSwiper:
              state
                .testimonialSwiper
          }
        }
      )
    );
  };


  ready(init);

})();
