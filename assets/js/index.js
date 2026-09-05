
































(() => {
  "use strict";


  



  const doc = document;
  const html = doc.documentElement;
  const body = doc.body;

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

  const isHomePage =
    body.classList.contains("home-page") ||
    body.dataset.page === "home";

  if (!isHomePage) {
    return;
  }

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  const state = {
    heroPlayed: false,

    projectSwiper: null,
    testimonialSwiper: null,

    marqueeInstances: [],

    resizeTimer: null
  };


  



  const ready = (callback) => {
    if (
      doc.readyState === "loading"
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


  



  const initGSAP = () => {
    if (!window.gsap) {
      return false;
    }

    if (window.ScrollTrigger) {
      window.gsap.registerPlugin(
        window.ScrollTrigger
      );
    }

    if (
      window.MotionPathPlugin
    ) {
      window.gsap.registerPlugin(
        window.MotionPathPlugin
      );
    }

    return true;
  };


  



  const initHeroIntro = () => {
    const hero =
      qs(".home-hero");

    if (!hero) {
      return;
    }

    const kicker =
      qs(
        ".home-hero__kicker",
        hero
      );

    const title =
      qs(
        ".home-hero__title",
        hero
      );

    const intro =
      qs(
        ".home-hero__intro",
        hero
      );

    const actions =
      qs(
        ".home-hero__actions",
        hero
      );

    const proof =
      qs(
        ".home-hero__proof",
        hero
      );

    const scroll =
      qs(
        ".home-hero__scroll",
        hero
      );

    const points =
      qsa(
        ".home-hero__point",
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
          intro,
          actions,
          proof,
          scroll,
          ...points
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

      [
        intro,
        actions,
        proof
      ]
        .filter(Boolean)
        .forEach(
          (element) => {
            gsap.set(
              element,
              {
                y: 16,
                opacity: 0
              }
            );
          }
        );

      if (scroll) {
        gsap.set(
          scroll,
          {
            scale: 0.86,
            opacity: 0
          }
        );
      }

      if (points.length) {
        gsap.set(
          points,
          {
            scale: 0,
            opacity: 0
          }
        );
      }


      



      if (kicker) {
        timeline.to(
          kicker,
          {
            y: 0,
            opacity: 1,
            duration: 0.42
          },
          0
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

            duration: 0.72,

            stagger: {
              each: 0.028,
              from: "start"
            }
          },
          0.08
        );
      } else if (title) {
        timeline.to(
          title,
          {
            y: 0,
            opacity: 1,
            duration: 0.7
          },
          0.08
        );
      }

      if (intro) {
        timeline.to(
          intro,
          {
            y: 0,
            opacity: 1,
            duration: 0.48
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
            duration: 0.45
          },
          0.41
        );
      }

      if (proof) {
        timeline.to(
          proof,
          {
            y: 0,
            opacity: 1,
            duration: 0.44
          },
          0.48
        );
      }

      if (scroll) {
        timeline.to(
          scroll,
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,

            ease:
              "back.out(1.3)"
          },
          0.5
        );
      }

      if (points.length) {
        timeline.to(
          points,
          {
            scale: 1,
            opacity: 1,

            duration: 0.3,

            stagger: 0.05
          },
          0.3
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
        const transition =
          qs(
            ".page-transition"
          );

        if (
          !transition ||
          transition.classList
            .contains(
              "is-hidden"
            )
        ) {
          play();
        }
      },
      120
    );
  };


  



  const initHeroParallax = () => {
    const image =
      qs(
        ".home-hero__media img"
      );

    const hero =
      qs(
        ".home-hero"
      );

    if (
      !image ||
      !hero ||
      reducedMotion ||
      !window.gsap ||
      !window.ScrollTrigger
    ) {
      return;
    }

    window.gsap.fromTo(
      image,
      {
        yPercent: -2
      },
      {
        yPercent: 7,

        ease: "none",

        scrollTrigger: {
          trigger: hero,

          start:
            "top top",

          end:
            "bottom top",

          scrub: 0.8
        }
      }
    );
  };


  



  const initHeroScroll = () => {
    const button =
      qs(
        ".home-hero__scroll"
      );

    if (!button) {
      return;
    }

    button.addEventListener(
      "click",
      () => {
        const target =
          qs(
            "#about, .home-about"
          );

        if (!target) {
          return;
        }

        if (
          window.SiteMotion
            ?.scrollTo
        ) {
          window.SiteMotion
            .scrollTo(
              target
            );

          return;
        }

        target.scrollIntoView({
          behavior:
            reducedMotion
              ? "auto"
              : "smooth"
        });
      }
    );
  };


  



  const initPhotoArc = () => {
    const root =
      qs(
        ".hero-photo-arc"
      );

    if (!root) {
      return;
    }

    const track =
      qs(
        ".hero-photo-arc__track",
        root
      );

    let groups =
      qsa(
        ".hero-photo-arc__group",
        track || root
      );

    if (
      !track ||
      !groups.length
    ) {
      return;
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

      clone
        .querySelectorAll(
          "img"
        )
        .forEach(
          (image) => {
            image.alt = "";
          }
        );

      track.appendChild(
        clone
      );

      groups =
        qsa(
          ".hero-photo-arc__group",
          track
        );
    }


    if (reducedMotion) {
      return;
    }

    let offset = 0;
    let width = 0;
    let lastTime =
      performance.now();

    const speed =
      window.innerWidth <= 767
        ? 26
        : 38;


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
    };


    const render = (
      time
    ) => {
      const delta =
        Math.min(
          50,
          time - lastTime
        );

      lastTime = time;

      if (
        !doc.hidden &&
        width > 0
      ) {
        offset -=
          speed *
          (delta / 1000);

        if (
          Math.abs(offset) >=
          width
        ) {
          offset += width;
        }

        track.style.transform =
          `translate3d(calc(-50% + ${offset}px), 0, 0)`;
      }

      frameId =
        requestAnimationFrame(
          render
        );
    };


    let frameId = 0;

    const start = () => {
      measure();

      lastTime =
        performance.now();

      frameId =
        requestAnimationFrame(
          render
        );
    };


    window.addEventListener(
      "load",
      measure,
      {
        once: true
      }
    );

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
    } else {
      window.addEventListener(
        "resize",
        measure,
        {
          passive: true
        }
      );
    }

    start();


    



    if (
      window.gsap &&
      window.ScrollTrigger
    ) {
      qsa(
        ".hero-photo-arc__item img",
        root
      ).forEach(
        (image, index) => {
          window.gsap.fromTo(
            image,
            {
              yPercent:
                index % 2
                  ? -2
                  : 2
            },
            {
              yPercent:
                index % 2
                  ? 2
                  : -2,

              ease: "none",

              scrollTrigger: {
                trigger: root,

                start:
                  "top bottom",

                end:
                  "bottom top",

                scrub: 1
              }
            }
          );
        }
      );
    }
  };


  



  const createServiceStars =
    () => {
      const layer =
        qs(
          ".home-services__stars"
        );

      if (
        !layer ||
        layer.children.length
      ) {
        return;
      }

      const count =
        window.innerWidth <= 767
          ? 28
          : 52;


      





      for (
        let index = 0;
        index < count;
        index += 1
      ) {
        const star =
          doc.createElement(
            "span"
          );

        const x =
          (
            index * 37 +
            11
          ) % 97;

        const y =
          (
            index * 53 +
            17
          ) % 88;

        const scale =
          0.55 +
          (
            (
              index * 7
            ) % 10
          ) /
          20;

        star.style.left =
          `${x}%`;

        star.style.top =
          `${y}%`;

        star.style.transform =
          `scale(${scale})`;

        star.style.opacity =
          String(
            0.28 +
            (
              (
                index * 11
              ) % 7
            ) /
            16
          );

        layer.appendChild(
          star
        );
      }
    };


  



  const initRocket = () => {
    const section =
      qs(
        ".home-services"
      );

    const wrap =
      qs(
        ".home-services__rocket-wrap",
        section || doc
      );

    if (
      !section ||
      !wrap ||
      reducedMotion ||
      !window.gsap
    ) {
      return;
    }

    const gsap =
      window.gsap;


    



    gsap.to(
      wrap,
      {
        y: -13,

        duration: 2.15,

        ease:
          "sine.inOut",

        repeat: -1,

        yoyo: true
      }
    );


    



    const halo =
      qs(
        ".home-services__rocket-halo",
        wrap.parentElement ||
        section
      );

    if (halo) {
      gsap.to(
        halo,
        {
          scale: 1.08,
          opacity: 0.62,

          duration: 1.65,

          ease:
            "sine.inOut",

          repeat: -1,

          yoyo: true
        }
      );
    }


    




    const flame =
      qs(
        ".rocket-flame",
        wrap
      );

    if (flame) {
      gsap.to(
        flame,
        {
          scaleY: 1.1,

          transformOrigin:
            "50% 0%",

          duration: 0.2,

          ease:
            "sine.inOut",

          repeat: -1,

          yoyo: true
        }
      );
    }

    const particles =
      qsa(
        ".rocket-particles circle",
        wrap
      );

    if (particles.length) {
      gsap.to(
        particles,
        {
          y: 8,
          opacity: 0.25,

          duration: 1,

          stagger: {
            each: 0.12,
            repeat: -1,
            yoyo: true
          },

          ease:
            "sine.inOut"
        }
      );
    }


    



    if (
      window.ScrollTrigger
    ) {
      gsap.fromTo(
        wrap,
        {
          rotate: -1
        },
        {
          rotate: 1,

          ease: "none",

          scrollTrigger: {
            trigger: section,

            start:
              "top bottom",

            end:
              "bottom top",

            scrub: 1
          }
        }
      );
    }
  };


  



  const initServiceCards =
    () => {
      const cards =
        qsa(
          ".home-services__card"
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

          duration: 0.55,

          stagger: 0.07,

          ease:
            "power3.out",

          scrollTrigger: {
            trigger:
              ".home-services__stage",

            start:
              "top 84%",

            once: true
          }
        }
      );
    };


  



  const initFeatures = () => {
    const section =
      qs(
        ".home-features"
      );

    if (!section) {
      return;
    }

    const items =
      qsa(
        ".home-features__item",
        section
      );

    const preview =
      qs(
        "[data-feature-preview]",
        section
      ) ||
      qs(
        ".home-features__image img",
        section
      );

    if (!items.length) {
      return;
    }


    const activate = (
      item
    ) => {
      if (!item) {
        return;
      }

      items.forEach(
        (other) => {
          const active =
            other === item;

          other.classList.toggle(
            "is-active",
            active
          );

          other.setAttribute(
            "aria-selected",
            String(active)
          );
        }
      );


      




      const nextImage =
        item.dataset
          .featureImage;

      if (
        !preview ||
        !nextImage ||
        preview.src.endsWith(
          nextImage
        )
      ) {
        return;
      }

      const preload =
        new Image();

      preload.onload = () => {
        if (
          reducedMotion ||
          !window.gsap
        ) {
          preview.src =
            nextImage;

          return;
        }

        window.gsap.to(
          preview,
          {
            opacity: 0,
            y: 5,

            duration: 0.2,

            ease:
              "power2.in",

            onComplete: () => {
              preview.src =
                nextImage;

              window.gsap.fromTo(
                preview,
                {
                  opacity: 0,
                  y: -5
                },
                {
                  opacity: 1,
                  y: 0,

                  duration: 0.36,

                  ease:
                    "power3.out"
                }
              );
            }
          }
        );
      };

      preload.src =
        nextImage;
    };


    items.forEach(
      (item) => {
        item.setAttribute(
          "tabindex",
          "0"
        );

        item.setAttribute(
          "role",
          "button"
        );

        item.addEventListener(
          "mouseenter",
          () =>
            activate(item)
        );

        item.addEventListener(
          "focus",
          () =>
            activate(item)
        );

        item.addEventListener(
          "click",
          () =>
            activate(item)
        );

        item.addEventListener(
          "keydown",
          (event) => {
            if (
              event.key ===
                "Enter" ||
              event.key === " "
            ) {
              event.preventDefault();

              activate(item);
            }
          }
        );
      }
    );


    const initial =
      qs(
        ".home-features__item.is-active",
        section
      ) ||
      items[0];

    activate(initial);
  };


  



  const initProjectSwiper =
    () => {
      const slider =
        qs(
          ".home-projects__slider"
        );

      if (
        !slider ||
        !window.Swiper
      ) {
        return;
      }

      const section =
        slider.closest(
          ".home-projects"
        ) || slider.parentElement;

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
          "[data-projects-prev]",
          section
        );

      const next =
        qs(
          "[data-projects-next]",
          section
        );

      const pagination =
        qs(
          "[data-projects-pagination]",
          section
        );

      const allowLoop =
        slides.length >= 4;

      state.projectSwiper =
        new window.Swiper(
          slider,
          {
            loop:
              allowLoop,

            speed: 720,

            grabCursor: true,

            watchSlidesProgress:
              true,

            observer: true,

            observeParents: true,

            slidesPerView: 1,

            spaceBetween: 18,

            navigation:
              prev && next
                ? {
                    prevEl:
                      prev,

                    nextEl:
                      next
                  }
                : undefined,

            pagination:
              pagination
                ? {
                    el:
                      pagination,

                    clickable:
                      true
                  }
                : undefined,

            breakpoints: {
              640: {
                slidesPerView:
                  1.12,

                spaceBetween:
                  18
              },

              768: {
                slidesPerView:
                  1.25,

                spaceBetween:
                  22
              },

              1100: {
                slidesPerView:
                  1.55,

                spaceBetween:
                  24
              },

              1400: {
                slidesPerView:
                  1.72,

                spaceBetween:
                  28
              }
            }
          }
        );
    };


  



  const initProjectTabs =
    () => {
      const section =
        qs(
          ".home-projects"
        );

      if (!section) {
        return;
      }

      const tabs =
        qsa(
          ".home-projects__tab",
          section
        );

      if (!tabs.length) {
        return;
      }


      const activateTab = (
        tab
      ) => {
        tabs.forEach(
          (other) => {
            const active =
              other === tab;

            other.classList.toggle(
              "is-active",
              active
            );

            other.setAttribute(
              "aria-selected",
              String(active)
            );
          }
        );

        const filter =
          tab.dataset
            .projectFilter;

        if (
          !filter ||
          filter === "all" ||
          !state.projectSwiper
        ) {
          return;
        }

        const slides =
          qsa(
            ".swiper-slide",
            section
          );

        const index =
          slides.findIndex(
            (slide) => {
              const categories =
                (
                  slide.dataset
                    .projectCategory ||
                  ""
                )
                  .split(",")
                  .map(
                    (value) =>
                      value
                        .trim()
                        .toLowerCase()
                  );

              return categories
                .includes(
                  filter.toLowerCase()
                );
            }
          );

        if (index < 0) {
          return;
        }

        if (
          state.projectSwiper
            .params.loop
        ) {
          state.projectSwiper
            .slideToLoop(
              index,
              650
            );
        } else {
          state.projectSwiper
            .slideTo(
              index,
              650
            );
        }
      };


      tabs.forEach(
        (tab) => {
          tab.setAttribute(
            "role",
            "tab"
          );

          tab.addEventListener(
            "click",
            () =>
              activateTab(tab)
          );
        }
      );

      activateTab(
        qs(
          ".home-projects__tab.is-active",
          section
        ) ||
        tabs[0]
      );
    };


  



  const initTestimonials =
    () => {
      const slider =
        qs(
          ".home-testimonials__slider"
        );

      if (
        !slider ||
        !window.Swiper
      ) {
        return;
      }

      const section =
        slider.closest(
          ".home-testimonials"
        ) || slider.parentElement;

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
          "[data-testimonials-prev]",
          section
        );

      const next =
        qs(
          "[data-testimonials-next]",
          section
        );

      const allowLoop =
        slides.length >= 4;

      state.testimonialSwiper =
        new window.Swiper(
          slider,
          {
            loop:
              allowLoop,

            speed: 700,

            grabCursor: true,

            slidesPerView: 1,

            spaceBetween: 18,

            observer: true,

            observeParents: true,

            navigation:
              prev && next
                ? {
                    prevEl:
                      prev,

                    nextEl:
                      next
                  }
                : undefined,

            autoplay:
              (
                !reducedMotion &&
                slides.length > 1
              )
                ? {
                    delay: 5200,

                    disableOnInteraction:
                      false,

                    pauseOnMouseEnter:
                      true
                  }
                : false,

            breakpoints: {
              700: {
                slidesPerView:
                  1.15,

                spaceBetween:
                  18
              },

              992: {
                slidesPerView:
                  1.6,

                spaceBetween:
                  22
              },

              1350: {
                slidesPerView:
                  2,

                spaceBetween:
                  24
              }
            }
          }
        );
    };


  



  const initProcess = () => {
    const section =
      qs(
        ".home-process"
      );

    if (!section) {
      return;
    }

    const steps =
      qsa(
        ".home-process__step",
        section
      );

    if (!steps.length) {
      return;
    }


    const activate = (
      current
    ) => {
      steps.forEach(
        (step) => {
          const active =
            step === current;

          step.classList.toggle(
            "is-active",
            active
          );

          step.setAttribute(
            "aria-selected",
            String(active)
          );
        }
      );
    };


    steps.forEach(
      (step) => {
        step.setAttribute(
          "tabindex",
          "0"
        );

        step.setAttribute(
          "role",
          "button"
        );

        step.addEventListener(
          "mouseenter",
          () =>
            activate(step)
        );

        step.addEventListener(
          "focus",
          () =>
            activate(step)
        );

        step.addEventListener(
          "click",
          () =>
            activate(step)
        );
      }
    );

    activate(
      qs(
        ".home-process__step.is-active",
        section
      ) ||
      steps[
        Math.min(
          1,
          steps.length - 1
        )
      ]
    );
  };


  



  const initCounters = () => {
    const counters =
      qsa(
        "[data-count]"
      );

    if (!counters.length) {
      return;
    }


    const renderFinal = (
      element
    ) => {
      const target =
        Number(
          element.dataset.count
        );

      if (
        !Number.isFinite(target)
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
          !Number.isFinite(target)
        ) {
          return;
        }

        if (
          reducedMotion ||
          !window.gsap ||
          !window.ScrollTrigger
        ) {
          renderFinal(element);

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

        const value = {
          current: 0
        };

        window.gsap.to(
          value,
          {
            current:
              target,

            duration: 1.35,

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

            onComplete: () =>
              renderFinal(
                element
              )
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
        ".parallax-media img, [data-home-parallax]"
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
            ) || 34;

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

                scrub: 0.8
              }
            }
          );
        }
      );
    };


  



  const initHomeReveals =
    () => {
      if (
        reducedMotion ||
        !window.gsap ||
        !window.ScrollTrigger
      ) {
        return;
      }

      const groups =
        qsa(
          "[data-home-reveal-group]"
        );

      groups.forEach(
        (group) => {
          const children =
            qsa(
              "[data-home-reveal]",
              group
            );

          if (!children.length) {
            return;
          }

          window.gsap.from(
            children,
            {
              y: 18,
              opacity: 0,

              duration: 0.52,

              stagger: 0.055,

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
        "[data-home-reveal]:not([data-home-reveal-group] [data-home-reveal])"
      ).forEach(
        (element) => {
          window.gsap.from(
            element,
            {
              y: 16,
              opacity: 0,

              duration: 0.5,

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


  



  const createMarquee = (
    root,
    {
      speed = 54,
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


    let groupWidth = 0;

    let offset =
      reverse
        ? -1
        : 0;

    let last =
      performance.now();

    let frame = null;


    const measure = () => {
      groupWidth =
        groups[0]
          .getBoundingClientRect()
          .width;

      if (
        !Number.isFinite(
          groupWidth
        )
      ) {
        groupWidth = 0;
      }
    };


    const tick = (
      time
    ) => {
      const delta =
        Math.min(
          50,
          time - last
        );

      last = time;

      if (
        !doc.hidden &&
        groupWidth > 0
      ) {
        const movement =
          speed *
          (
            delta /
            1000
          );

        offset +=
          reverse
            ? movement
            : -movement;


        if (!reverse) {
          if (
            Math.abs(offset) >=
            groupWidth
          ) {
            offset +=
              groupWidth;
          }
        } else if (
          offset >= 0
        ) {
          offset -=
            groupWidth;
        }

        track.style.transform =
          `translate3d(${offset}px, 0, 0)`;
      }

      frame =
        requestAnimationFrame(
          tick
        );
    };


    const start = () => {
      measure();

      if (
        reverse &&
        groupWidth
      ) {
        offset =
          -groupWidth;
      }

      last =
        performance.now();

      frame =
        requestAnimationFrame(
          tick
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
    const statement =
      qs(
        ".home-statement"
      );

    const final =
      qs(
        ".home-final-marquee"
      );

    if (statement) {
      createMarquee(
        statement,
        {
          speed:
            window.innerWidth <= 767
              ? 38
              : 54,

          reverse: false
        }
      );
    }

    if (final) {
      createMarquee(
        final,
        {
          speed:
            window.innerWidth <= 767
              ? 42
              : 60,

          reverse: true
        }
      );
    }


    



    qsa(
      "[data-home-marquee]"
    ).forEach(
      (root) => {
        if (
          root === statement ||
          root === final
        ) {
          return;
        }

        createMarquee(
          root,
          {
            speed:
              Number(
                root.dataset
                  .marqueeSpeed
              ) || 50,

            reverse:
              root.dataset
                .marqueeDirection ===
              "reverse"
          }
        );
      }
    );
  };


  





  const initFaq = () => {
    const section =
      qs(
        ".home-faq"
      );

    if (!section) {
      return;
    }

    const items =
      qsa(
        ".home-faq__item",
        section
      );

    if (!items.length) {
      return;
    }

    const observer =
      new MutationObserver(
        () => {
          items.forEach(
            (item) => {
              item.classList.toggle(
                "is-active",
                item.classList
                  .contains(
                    "is-open"
                  )
              );
            }
          );
        }
      );

    items.forEach(
      (item) => {
        observer.observe(
          item,
          {
            attributes: true,

            attributeFilter: [
              "class"
            ]
          }
        );
      }
    );
  };


  




  const initProjectHover =
    () => {
      if (
        reducedMotion ||
        !window.gsap ||
        window.matchMedia(
          "(hover: none)"
        ).matches
      ) {
        return;
      }

      const cards =
        qsa(
          ".home-projects__card"
        );

      cards.forEach(
        (card) => {
          const button =
            qs(
              ".home-projects__view",
              card
            );

          const media =
            qs(
              ".home-projects__media",
              card
            );

          if (
            !button ||
            !media
          ) {
            return;
          }

          const xTo =
            window.gsap.quickTo(
              button,
              "x",
              {
                duration: 0.32,
                ease:
                  "power3.out"
              }
            );

          const yTo =
            window.gsap.quickTo(
              button,
              "y",
              {
                duration: 0.32,
                ease:
                  "power3.out"
              }
            );


          media.addEventListener(
            "mousemove",
            (event) => {
              const rect =
                media
                  .getBoundingClientRect();

              const x =
                event.clientX -
                rect.left -
                rect.width / 2;

              const y =
                event.clientY -
                rect.top -
                rect.height / 2;

              xTo(
                x * 0.22
              );

              yTo(
                y * 0.22
              );
            }
          );


          media.addEventListener(
            "mouseleave",
            () => {
              xTo(0);
              yTo(0);
            }
          );
        }
      );
    };


  



  const refreshLayout = () => {
    requestAnimationFrame(
      () => {
        window.SiteMotion
          ?.refresh?.();

        state.projectSwiper
          ?.update?.();

        state.testimonialSwiper
          ?.update?.();

        state.marqueeInstances
          .forEach(
            (instance) =>
              instance
                .measure?.()
          );
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
            refreshLayout,
            180
          );
      },
      {
        passive: true
      }
    );
  };


  



  const initLoadRefresh = () => {
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


  



  const init = () => {
    initGSAP();

    initHeroIntro();

    initHeroParallax();

    initHeroScroll();

    initPhotoArc();

    createServiceStars();

    initRocket();

    initServiceCards();

    initFeatures();

    initProjectSwiper();

    initProjectTabs();

    initTestimonials();

    initProcess();

    initCounters();

    initParallaxMedia();

    initHomeReveals();

    initMarquees();

    initFaq();

    initProjectHover();

    initResize();

    initLoadRefresh();


    



    window.setTimeout(
      refreshLayout,
      120
    );


    



    doc.dispatchEvent(
      new CustomEvent(
        "site:home-ready",
        {
          detail: {
            projectSwiper:
              state.projectSwiper,

            testimonialSwiper:
              state.testimonialSwiper
          }
        }
      )
    );
  };


  ready(init);

})();
