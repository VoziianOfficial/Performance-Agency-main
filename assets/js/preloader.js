

























(() => {
  "use strict";


  



  const Config =
    window.SiteConfig || {};

  const settings =
    Config.preloader || {};

  const transitionDuration =
    Number(
      settings.transitionDuration
    ) || 520;

  const minimumVisibleTime =
    Number(
      settings.minimumVisibleTime
    ) || 320;

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  



  const doc =
    document;

  const html =
    doc.documentElement;

  const body =
    doc.body;

  const qs = (
    selector,
    scope = doc
  ) =>
    scope.querySelector(
      selector
    );


  const sleep = (
    duration
  ) =>
    new Promise(
      (resolve) =>
        window.setTimeout(
          resolve,
          duration
        )
    );


  const normalizePath = (
    pathname
  ) => {
    let path =
      pathname
        .replace(/\\/g, "/")
        .replace(/\/+/g, "/");

    if (
      path.endsWith(
        "/index.html"
      )
    ) {
      path =
        path.slice(
          0,
          -"index.html".length
        );
    }

    if (
      path.length > 1 &&
      path.endsWith("/")
    ) {
      path =
        path.slice(0, -1);
    }

    return path || "/";
  };


  



  const createTransition =
    () => {
      const existing =
        qs(
          ".page-transition"
        );

      if (existing) {
        return existing;
      }

      const transition =
        doc.createElement(
          "div"
        );

      transition.className =
        "page-transition";

      transition.setAttribute(
        "aria-hidden",
        "true"
      );

      transition.innerHTML = `
        <div class="page-transition__inner">

          <div class="page-transition__brand">

            <img
              class="page-transition__logo"
              src="${Config.logo || ""}"
              alt=""
              aria-hidden="true"
              data-transition-logo
            >

            <span
              class="page-transition__name"
              data-transition-name
            >
              ${
                settings.name ||
                Config.companyShortName ||
                Config.companyName ||
                ""
              }
            </span>

          </div>

          <div
            class="page-transition__line"
            aria-hidden="true"
          ></div>

        </div>
      `;

      




      body.appendChild(
        transition
      );

      return transition;
    };


  const overlay =
    createTransition();

  const inner =
    qs(
      ".page-transition__inner",
      overlay
    );

  const brand =
    qs(
      ".page-transition__brand",
      overlay
    );

  const logo =
    qs(
      "[data-transition-logo]",
      overlay
    );

  const name =
    qs(
      "[data-transition-name]",
      overlay
    );

  const line =
    qs(
      ".page-transition__line",
      overlay
    );


  



  const hydrate = () => {
    if (
      logo &&
      Config.logo
    ) {
      logo.src =
        Config.logo;
    }

    if (name) {
      name.textContent =
        settings.name ||
        Config.companyShortName ||
        Config.companyName ||
        "";
    }
  };


  hydrate();


  



  const lockPage = () => {
    html.classList.add(
      "is-transitioning"
    );

    




    window.SiteMotion
      ?.stop?.();
  };


  const unlockPage = () => {
    html.classList.remove(
      "is-transitioning"
    );

    window.SiteMotion
      ?.start?.();
  };


  



  const state = {
    active: false,

    leaving: false,

    initialRevealDone:
      false,

    navigationTimer:
      null,

    clickedUrl:
      null
  };


  



  const canUseGSAP = () =>
    Boolean(
      window.gsap &&
      !reducedMotion
    );


  



  const resetInner = () => {
    if (!canUseGSAP()) {
      return;
    }

    window.gsap.killTweensOf([
      overlay,
      inner,
      brand,
      logo,
      name,
      line
    ]);

    window.gsap.set(
      overlay,
      {
        clearProps:
          "transform"
      }
    );

    if (brand) {
      window.gsap.set(
        brand,
        {
          y: 12,
          opacity: 0
        }
      );
    }

    if (line) {
      window.gsap.set(
        line,
        {
          opacity: 0
        }
      );
    }
  };


  



  const showOverlay =
    async ({
      instant = false
    } = {}) => {
      if (
        state.active &&
        !instant
      ) {
        return;
      }

      state.active = true;

      lockPage();

      overlay.classList.remove(
        "is-hidden"
      );

      overlay.classList.add(
        "is-entering"
      );

      overlay.setAttribute(
        "aria-hidden",
        "false"
      );


      



      if (
        reducedMotion ||
        instant ||
        !canUseGSAP()
      ) {
        if (brand) {
          brand.style.opacity =
            "1";
        }

        if (line) {
          line.style.opacity =
            "1";
        }

        await sleep(
          instant
            ? 0
            : 120
        );

        return;
      }


      



      resetInner();

      await new Promise(
        (resolve) => {
          const timeline =
            window.gsap.timeline({
              defaults: {
                ease:
                  "power3.out"
              },

              onComplete:
                resolve
            });

          timeline
            .fromTo(
              overlay,
              {
                opacity: 0
              },
              {
                opacity: 1,
                duration: 0.2
              }
            )

            .to(
              brand,
              {
                y: 0,
                opacity: 1,
                duration: 0.32
              },
              0.04
            )

            .to(
              line,
              {
                opacity: 1,
                duration: 0.22
              },
              0.12
            );
        }
      );
    };


  



  const hideOverlay =
    async ({
      delay = 0
    } = {}) => {
      if (delay > 0) {
        await sleep(delay);
      }

      overlay.classList.remove(
        "is-entering"
      );


      



      if (
        reducedMotion ||
        !canUseGSAP()
      ) {
        overlay.classList.add(
          "is-hidden"
        );

        overlay.setAttribute(
          "aria-hidden",
          "true"
        );

        state.active = false;

        unlockPage();

        return;
      }


      



      await new Promise(
        (resolve) => {
          const timeline =
            window.gsap.timeline({
              defaults: {
                ease:
                  "power3.inOut"
              },

              onComplete:
                resolve
            });

          timeline
            .to(
              line,
              {
                opacity: 0,
                duration: 0.14
              }
            )

            .to(
              brand,
              {
                y: -10,
                opacity: 0,
                duration: 0.22
              },
              0.02
            )

            .to(
              overlay,
              {
                opacity: 0,
                duration: 0.34
              },
              0.08
            );
        }
      );

      overlay.classList.add(
        "is-hidden"
      );

      overlay.setAttribute(
        "aria-hidden",
        "true"
      );

      




      window.gsap.set(
        overlay,
        {
          clearProps:
            "opacity,transform"
        }
      );

      if (brand) {
        window.gsap.set(
          brand,
          {
            clearProps:
              "opacity,transform"
          }
        );
      }

      if (line) {
        window.gsap.set(
          line,
          {
            clearProps:
              "opacity"
          }
        );
      }

      state.active = false;

      unlockPage();
    };


  



  const revealInitialPage =
    async () => {
      if (
        state.initialRevealDone
      ) {
        return;
      }

      state.initialRevealDone =
        true;

      const startedAt =
        performance.now();

      





      overlay.classList.remove(
        "is-hidden"
      );

      overlay.classList.add(
        "is-entering"
      );

      overlay.setAttribute(
        "aria-hidden",
        "false"
      );

      lockPage();


      



      if (canUseGSAP()) {
        window.gsap.set(
          brand,
          {
            y: 10,
            opacity: 0
          }
        );

        window.gsap.set(
          line,
          {
            opacity: 0
          }
        );

        window.gsap.to(
          brand,
          {
            y: 0,
            opacity: 1,

            duration: 0.32,

            ease:
              "power3.out"
          }
        );

        window.gsap.to(
          line,
          {
            opacity: 1,

            duration: 0.2,

            delay: 0.08
          }
        );
      }


      



      if (
        doc.readyState !==
        "complete"
      ) {
        await Promise.race([
          new Promise(
            (resolve) => {
              window.addEventListener(
                "load",
                resolve,
                {
                  once: true
                }
              );
            }
          ),

          sleep(1100)
        ]);
      }


      



      const elapsed =
        performance.now() -
        startedAt;

      const remaining =
        Math.max(
          0,
          minimumVisibleTime -
            elapsed
        );

      if (remaining > 0) {
        await sleep(
          remaining
        );
      }

      await hideOverlay();

      doc.dispatchEvent(
        new CustomEvent(
          "site:revealed"
        )
      );
    };


  



  const shouldTransition = (
    link
  ) => {
    if (!link) {
      return false;
    }

    const href =
      link.getAttribute(
        "href"
      );

    if (
      !href ||
      href === "#" ||
      href.startsWith(
        "javascript:"
      ) ||
      href.startsWith(
        "mailto:"
      ) ||
      href.startsWith(
        "tel:"
      )
    ) {
      return false;
    }

    if (
      link.hasAttribute(
        "download"
      )
    ) {
      return false;
    }

    if (
      link.target &&
      link.target !==
        "_self"
    ) {
      return false;
    }

    if (
      link.hasAttribute(
        "data-no-transition"
      )
    ) {
      return false;
    }

    let destination;

    try {
      destination =
        new URL(
          link.href,
          window.location.href
        );
    } catch (error) {
      return false;
    }

    const current =
      new URL(
        window.location.href
      );


    



    if (
      destination.origin !==
      current.origin
    ) {
      return false;
    }


    



    const samePath =
      normalizePath(
        destination.pathname
      ) ===
      normalizePath(
        current.pathname
      );

    const sameSearch =
      destination.search ===
      current.search;

    if (
      samePath &&
      sameSearch
    ) {
      




      if (
        destination.hash
      ) {
        return false;
      }

      



      return false;
    }


    return true;
  };


  



  const navigateTo =
    async (
      url
    ) => {
      if (
        state.leaving
      ) {
        return;
      }

      state.leaving = true;

      state.clickedUrl =
        url;

      



      window.SiteMenu
        ?.close?.({
          restoreFocus:
            false
        });

      const startedAt =
        performance.now();

      await showOverlay();


      




      const elapsed =
        performance.now() -
        startedAt;

      const targetVisible =
        Math.min(
          Math.max(
            220,
            minimumVisibleTime
          ),
          430
        );

      const remaining =
        Math.max(
          0,
          targetVisible -
            elapsed
        );

      if (remaining > 0) {
        await sleep(
          remaining
        );
      }


      



      window.location.assign(
        url
      );


      





      clearTimeout(
        state.navigationTimer
      );

      state.navigationTimer =
        window.setTimeout(
          async () => {
            if (
              doc.visibilityState ===
              "visible"
            ) {
              state.leaving =
                false;

              await hideOverlay();
            }
          },
          transitionDuration +
            1400
        );
    };


  



  const initLinkTransitions =
    () => {
      doc.addEventListener(
        "click",
        (event) => {
          if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          ) {
            return;
          }

          const link =
            event.target.closest(
              "a[href]"
            );

          if (
            !shouldTransition(
              link
            )
          ) {
            return;
          }

          event.preventDefault();

          navigateTo(
            link.href
          );
        },
        false
      );
    };


  



  const resetAfterBFCache =
    () => {
      clearTimeout(
        state.navigationTimer
      );

      state.navigationTimer =
        null;

      state.leaving = false;

      state.clickedUrl = null;

      overlay.classList.add(
        "is-hidden"
      );

      overlay.classList.remove(
        "is-entering"
      );

      overlay.setAttribute(
        "aria-hidden",
        "true"
      );

      if (canUseGSAP()) {
        window.gsap.killTweensOf([
          overlay,
          inner,
          brand,
          logo,
          name,
          line
        ]);

        window.gsap.set(
          overlay,
          {
            clearProps:
              "all"
          }
        );

        window.gsap.set(
          brand,
          {
            clearProps:
              "all"
          }
        );

        window.gsap.set(
          line,
          {
            clearProps:
              "all"
          }
        );
      }

      state.active = false;

      unlockPage();
    };


  window.addEventListener(
    "pageshow",
    (event) => {
      




      if (
        event.persisted
      ) {
        resetAfterBFCache();
      }
    }
  );


  



  window.addEventListener(
    "pagehide",
    () => {
      clearTimeout(
        state.navigationTimer
      );
    }
  );


  



  window.SiteTransition = {
    show:
      showOverlay,

    hide:
      hideOverlay,

    navigate:
      navigateTo,

    get isActive() {
      return state.active;
    },

    get isLeaving() {
      return state.leaving;
    }
  };


  



  initLinkTransitions();

  





  revealInitialPage();

})();
