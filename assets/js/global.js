



























(() => {
  "use strict";


  



  const Config = window.SiteConfig || {};

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

  const state = {
    lenis: null,
    lenisTicker: null,

    menuOpen: false,
    menuLastFocus: null,

    reducedMotion:
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
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


  



  const getHeaderHeight = () => {
    const header = qs(".site-header");

    if (!header) {
      return 0;
    }

    return header
      .getBoundingClientRect()
      .height;
  };


  const safeStorageGet = (
    storage,
    key
  ) => {
    try {
      return storage.getItem(key);
    } catch (error) {
      return null;
    }
  };


  const safeStorageSet = (
    storage,
    key,
    value
  ) => {
    try {
      storage.setItem(key, value);

      return true;
    } catch (error) {
      return false;
    }
  };


  const normalizePath = (
    pathname
  ) => {
    let value = pathname
      .replace(/\\/g, "/")
      .replace(/\/+/g, "/");

    if (
      value.endsWith("/index.html")
    ) {
      value = value.slice(
        0,
        -"index.html".length
      );
    }

    if (
      value.length > 1 &&
      value.endsWith("/")
    ) {
      value = value.slice(0, -1);
    }

    return value || "/";
  };


  const isSamePageUrl = (
    url
  ) => {
    const current =
      new URL(
        window.location.href
      );

    return (
      url.origin === current.origin &&
      normalizePath(url.pathname) ===
        normalizePath(current.pathname)
    );
  };


  const getService = (
    id
  ) => {
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


  const getServiceRoute = (
    service
  ) => {
    if (!service) {
      return "#";
    }

    if (
      typeof Config.getServiceRoute ===
      "function"
    ) {
      return Config
        .getServiceRoute(service);
    }

    return (
      Config.routes?.[
        service.routeKey
      ] ||
      service.slug ||
      "#"
    );
  };


  



  const setDocumentMeta = () => {
    if (!Config) {
      return;
    }

    const page =
      body?.dataset.page ||
      "home";

    const serviceId =
      body?.dataset.service ||
      "";

    let title = "";

    if (
      page === "home"
    ) {
      title =
        Config.browserTitle ||
        [
          Config.pageTitles?.home,
          Config.companyName
        ]
          .filter(Boolean)
          .join(
            Config.titleSeparator ||
            " | "
          );
    } else if (
      serviceId
    ) {
      const service =
        getService(serviceId);

      const pageTitle =
        service &&
        Config.pageTitles?.[
          service.routeKey
        ]
          ? Config.pageTitles[
              service.routeKey
            ]
          : service?.title;

      title = [
        pageTitle,
        Config.companyName
      ]
        .filter(Boolean)
        .join(
          Config.titleSeparator ||
          " | "
        );
    } else {
      const pageTitle =
        Config.pageTitles?.[page];

      title = [
        pageTitle,
        Config.companyName
      ]
        .filter(Boolean)
        .join(
          Config.titleSeparator ||
          " | "
        );
    }

    if (title) {
      doc.title = title;
    }


    



    if (
      Config.metaDescription
    ) {
      let meta = qs(
        'meta[name="description"]'
      );

      if (!meta) {
        meta =
          doc.createElement("meta");

        meta.setAttribute(
          "name",
          "description"
        );

        doc.head.appendChild(meta);
      }

      if (
        !meta
          .getAttribute("content")
          ?.trim()
      ) {
        meta.setAttribute(
          "content",
          Config.metaDescription
        );
      }
    }


    



    if (Config.favicon) {
      let favicon = qs(
        'link[rel="icon"]'
      );

      if (!favicon) {
        favicon =
          doc.createElement("link");

        favicon.setAttribute(
          "rel",
          "icon"
        );

        favicon.setAttribute(
          "type",
          "image/svg+xml"
        );

        doc.head.appendChild(
          favicon
        );
      }

      favicon.setAttribute(
        "href",
        Config.favicon
      );
    }
  };


  



  const setText = (
    selector,
    value
  ) => {
    if (
      value === undefined ||
      value === null
    ) {
      return;
    }

    qsa(selector).forEach(
      (element) => {
        element.textContent =
          String(value);
      }
    );
  };


  const hydrateGlobalContent = () => {
    setText(
      "[data-company-name]",
      Config.companyName
    );

    setText(
      "[data-company-short-name]",
      Config.companyShortName ||
        Config.companyName
    );

    setText(
      "[data-site-email]",
      Config.email
    );

    setText(
      "[data-disclaimer]",
      Config.footer?.disclaimer ||
        Config.disclaimer
    );

    setText(
      "[data-footer-description]",
      Config.footer?.description
    );

    setText(
      "[data-copyright]",
      Config.footer?.copyright
    );

    setText(
      "[data-current-year]",
      new Date().getFullYear()
    );


    



    qsa(
      "[data-site-email-link]"
    ).forEach((link) => {
      link.textContent =
        Config.email || "";

      link.href =
        Config.email
          ? `mailto:${Config.email}`
          : "#";
    });


    



    qsa("[data-site-logo]")
      .forEach((image) => {
        if (Config.logo) {
          image.src = Config.logo;
        }

        image.alt = "";
      });


    





    qsa("[data-route]")
      .forEach((link) => {
        const key =
          link.dataset.route;

        const route =
          Config.routes?.[key];

        if (route) {
          link.href = route;
        }
      });


    





    qsa(
      "[data-cta-label]"
    ).forEach((element) => {
      const key =
        element.dataset.ctaLabel;

      const label =
        Config.cta?.[key];

      if (label) {
        element.textContent =
          label;
      }
    });


    



    qsa(
      "[data-service-route]"
    ).forEach((link) => {
      const id =
        link.dataset.serviceRoute;

      const service =
        getService(id);

      if (service) {
        link.href =
          getServiceRoute(
            service
          );
      }
    });


    



    qsa(
      "[data-contact-form]"
    ).forEach((form) => {
      if (
        Config.contact?.endpoint
      ) {
        form.action =
          Config.contact.endpoint;
      }

      form.method = "post";
    });
  };


  



  const createServiceLink = (
    service,
    variant
  ) => {
    const href =
      getServiceRoute(service);

    if (
      variant === "dropdown"
    ) {
      return `
        <li>
          <a
            class="site-dropdown__link"
            href="${href}"
            data-service-nav="${service.id}"
          >
            <span>${service.title}</span>

            <i
              data-lucide="arrow-up-right"
              aria-hidden="true"
            ></i>
          </a>
        </li>
      `;
    }

    if (
      variant === "mobile"
    ) {
      return `
        <a
          class="mobile-menu__service"
          href="${href}"
          data-service-nav="${service.id}"
        >
          <span>${service.title}</span>

          <i
            data-lucide="arrow-up-right"
            aria-hidden="true"
          ></i>
        </a>
      `;
    }

    if (
      variant === "footer"
    ) {
      return `
        <li>
          <a
            class="site-footer__link"
            href="${href}"
            data-service-nav="${service.id}"
          >
            ${service.shortTitle || service.title}
          </a>
        </li>
      `;
    }

    return `
      <a
        href="${href}"
        data-service-nav="${service.id}"
      >
        ${service.title}
      </a>
    `;
  };


  const buildServiceNavigation =
    () => {
      const services =
        Config.services || [];

      if (!services.length) {
        return;
      }

      qsa(
        "[data-service-menu]"
      ).forEach((container) => {
        const variant =
          container.dataset
            .serviceMenu ||
          "default";

        container.innerHTML =
          services
            .map(
              (service) =>
                createServiceLink(
                  service,
                  variant
                )
            )
            .join("");
      });
    };


  



  const updateActiveNavigation =
    () => {
      const page =
        body.dataset.page ||
        "";

      const serviceId =
        body.dataset.service ||
        "";

      qsa(
        ".site-nav__link"
      ).forEach((link) => {
        link.classList.remove(
          "is-active"
        );

        link.removeAttribute(
          "aria-current"
        );
      });


      



      if (serviceId) {
        const servicesLink =
          qs(
            '.site-nav__link[data-route-key="services"],' +
            '.site-nav__link[data-route="services"]'
          );

        if (servicesLink) {
          servicesLink.classList.add(
            "is-active"
          );
        }

        qsa(
          `[data-service-nav="${serviceId}"]`
        ).forEach((link) => {
          link.classList.add(
            "is-active"
          );

          link.setAttribute(
            "aria-current",
            "page"
          );
        });

        return;
      }


      



      const key =
        page === "home"
          ? "home"
          : page;

      const currentLink =
        qs(
          `.site-nav__link[data-route-key="${key}"],` +
          `.site-nav__link[data-route="${key}"]`
        );

      if (currentLink) {
        currentLink.classList.add(
          "is-active"
        );

        currentLink.setAttribute(
          "aria-current",
          "page"
        );
      }
    };


  



  const initLucide = () => {
    if (
      !window.lucide ||
      typeof window.lucide
        .createIcons !== "function"
    ) {
      return;
    }

    window.lucide.createIcons({
      attrs: {
        "stroke-width": 1.7
      }
    });
  };


  



  const shouldUseLenis = () => {
    if (
      state.reducedMotion
    ) {
      return false;
    }

    if (!window.Lenis) {
      return false;
    }

    




    if (
      body.classList.contains(
        "legal-page"
      ) &&
      window.innerWidth <= 991
    ) {
      return false;
    }

    return true;
  };


  const initLenis = () => {
    if (!shouldUseLenis()) {
      return;
    }

    state.lenis =
      new window.Lenis({
        duration: 1.05,

        easing: (t) =>
          Math.min(
            1,
            1.001 -
              Math.pow(
                2,
                -10 * t
              )
          ),

        smoothWheel: true,

        wheelMultiplier: 0.9,

        touchMultiplier: 1,

        syncTouch: false,

        infinite: false
      });


    



    if (
      window.gsap &&
      window.ScrollTrigger
    ) {
      state.lenis.on(
        "scroll",
        window.ScrollTrigger
          .update
      );

      state.lenisTicker = (
        time
      ) => {
        state.lenis?.raf(
          time * 1000
        );
      };

      window.gsap.ticker.add(
        state.lenisTicker
      );

      window.gsap.ticker
        .lagSmoothing(0);

      return;
    }


    



    const raf = (time) => {
      if (!state.lenis) {
        return;
      }

      state.lenis.raf(time);

      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
  };


  const scrollToElement = (
    target,
    options = {}
  ) => {
    if (!target) {
      return;
    }

    const offset =
      options.offset ??
      -(
        getHeaderHeight() +
        16
      );

    if (state.lenis) {
      state.lenis.scrollTo(
        target,
        {
          offset,
          duration:
            options.duration ||
            1.05,

          immediate:
            state.reducedMotion
        }
      );

      return;
    }

    const top =
      target
        .getBoundingClientRect()
        .top +
      window.scrollY +
      offset;

    window.scrollTo({
      top,
      behavior:
        state.reducedMotion
          ? "auto"
          : "smooth"
    });
  };


  



  const exposeMotionApi = () => {
    window.SiteMotion = {
      get lenis() {
        return state.lenis;
      },

      stop() {
        state.lenis?.stop();
      },

      start() {
        state.lenis?.start();
      },

      scrollTo(
        target,
        options = {}
      ) {
        if (
          typeof target === "string"
        ) {
          const element =
            qs(target);

          scrollToElement(
            element,
            options
          );

          return;
        }

        scrollToElement(
          target,
          options
        );
      },

      refresh() {
        state.lenis?.resize?.();

        window.ScrollTrigger
          ?.refresh?.();

        window.AOS
          ?.refreshHard?.();
      }
    };
  };


  



  const initAOS = () => {
    if (
      !window.AOS ||
      state.reducedMotion
    ) {
      return;
    }

    window.AOS.init({
      once: true,

      mirror: false,

      duration: 560,

      offset: 52,

      delay: 0,

      easing:
        "ease-out-cubic",

      anchorPlacement:
        "top-bottom"
    });


    window.addEventListener(
      "load",
      () => {
        window.AOS
          ?.refreshHard?.();
      },
      {
        once: true
      }
    );
  };


  



  const initHeader = () => {
    const header =
      qs(".site-header");

    if (!header) {
      return;
    }

    




    let ticking = false;

    const update = () => {
      header.classList.toggle(
        "is-scrolled",
        window.scrollY > 18
      );

      ticking = false;
    };

    const requestUpdate = () => {
      if (ticking) {
        return;
      }

      ticking = true;

      requestAnimationFrame(
        update
      );
    };

    update();

    window.addEventListener(
      "scroll",
      requestUpdate,
      {
        passive: true
      }
    );

    state.lenis?.on(
      "scroll",
      requestUpdate
    );
  };


  



  const initMobileMenu = () => {
    const menu =
      qs(".mobile-menu");

    if (!menu) {
      return;
    }

    const toggles =
      qsa(
        "[data-menu-toggle], .header-menu-toggle"
      );

    const closeButtons =
      qsa(
        "[data-menu-close]",
        menu
      );

    const focusableSelector = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])'
    ].join(",");


    const setToggleState = (
      expanded
    ) => {
      toggles.forEach(
        (toggle) => {
          toggle.setAttribute(
            "aria-expanded",
            String(expanded)
          );
        }
      );
    };


    const open = () => {
      if (state.menuOpen) {
        return;
      }

      state.menuOpen = true;

      state.menuLastFocus =
        doc.activeElement;

      menu.classList.add(
        "is-open"
      );

      menu.setAttribute(
        "aria-hidden",
        "false"
      );

      html.classList.add(
        "is-locked"
      );

      body.classList.add(
        "is-locked"
      );

      setToggleState(true);

      state.lenis?.stop();

      requestAnimationFrame(
        () => {
          const close =
            qs(
              "[data-menu-close]",
              menu
            );

          const first =
            close ||
            qs(
              focusableSelector,
              menu
            );

          first?.focus?.();
        }
      );
    };


    const close = ({
      restoreFocus = true
    } = {}) => {
      if (!state.menuOpen) {
        return;
      }

      state.menuOpen = false;

      menu.classList.remove(
        "is-open"
      );

      menu.setAttribute(
        "aria-hidden",
        "true"
      );

      html.classList.remove(
        "is-locked"
      );

      body.classList.remove(
        "is-locked"
      );

      setToggleState(false);

      state.lenis?.start();

      if (
        restoreFocus &&
        state.menuLastFocus
      ) {
        state.menuLastFocus
          .focus?.();
      }
    };


    toggles.forEach(
      (toggle) => {
        toggle.setAttribute(
          "aria-expanded",
          "false"
        );

        toggle.addEventListener(
          "click",
          () => {
            if (state.menuOpen) {
              close();

              return;
            }

            open();
          }
        );
      }
    );


    closeButtons.forEach(
      (button) => {
        button.addEventListener(
          "click",
          () => close()
        );
      }
    );


    



    menu.addEventListener(
      "click",
      (event) => {
        const link =
          event.target.closest(
            "a[href]"
          );

        if (!link) {
          return;
        }

        close({
          restoreFocus: false
        });
      }
    );


    



    doc.addEventListener(
      "keydown",
      (event) => {
        if (!state.menuOpen) {
          return;
        }

        if (
          event.key === "Escape"
        ) {
          event.preventDefault();

          close();

          return;
        }

        if (
          event.key !== "Tab"
        ) {
          return;
        }

        const focusables =
          qsa(
            focusableSelector,
            menu
          ).filter(
            (element) =>
              element.offsetParent !==
              null
          );

        if (!focusables.length) {
          return;
        }

        const first =
          focusables[0];

        const last =
          focusables[
            focusables.length - 1
          ];

        if (
          event.shiftKey &&
          doc.activeElement === first
        ) {
          event.preventDefault();

          last.focus();

          return;
        }

        if (
          !event.shiftKey &&
          doc.activeElement === last
        ) {
          event.preventDefault();

          first.focus();
        }
      }
    );


    



    window.SiteMenu = {
      open,
      close,

      get isOpen() {
        return state.menuOpen;
      }
    };
  };


  



  const initSmoothAnchors = () => {
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

        if (!link) {
          return;
        }

        if (
          link.hasAttribute(
            "download"
          ) ||
          link.target === "_blank"
        ) {
          return;
        }

        const raw =
          link.getAttribute(
            "href"
          );

        if (
          !raw ||
          raw.startsWith(
            "mailto:"
          ) ||
          raw.startsWith(
            "javascript:"
          )
        ) {
          return;
        }

        let url;

        try {
          url = new URL(
            link.href,
            window.location.href
          );
        } catch (error) {
          return;
        }

        if (
          !url.hash ||
          !isSamePageUrl(url)
        ) {
          return;
        }

        const hash =
          decodeURIComponent(
            url.hash.slice(1)
          );

        if (!hash) {
          return;
        }

        const target =
          doc.getElementById(
            hash
          );

        if (!target) {
          return;
        }

        event.preventDefault();

        window.SiteMenu
          ?.close?.({
            restoreFocus: false
          });

        const nextUrl =
          `${window.location.pathname}${window.location.search}#${encodeURIComponent(hash)}`;

        if (
          window.location.hash !==
          url.hash
        ) {
          history.pushState(
            null,
            "",
            nextUrl
          );
        }

        requestAnimationFrame(
          () => {
            scrollToElement(
              target
            );
          }
        );
      }
    );


    



    window.addEventListener(
      "popstate",
      () => {
        const hash =
          window.location.hash
            .slice(1);

        if (!hash) {
          return;
        }

        const target =
          doc.getElementById(
            decodeURIComponent(hash)
          );

        if (target) {
          scrollToElement(
            target
          );
        }
      }
    );
  };


  



  const initAccordions = () => {
    const roots =
      qsa(
        "[data-accordion], .accordion"
      );

    roots.forEach((root) => {
      const items =
        qsa(
          ".accordion-item",
          root
        ).filter(
          (item) => {
            const closestRoot =
              item.closest(
                "[data-accordion], .accordion"
              );

            return (
              closestRoot === root
            );
          }
        );

      if (!items.length) {
        return;
      }

      const single =
        root.dataset
          .accordionSingle !==
        "false";


      const closeItem = (
        item
      ) => {
        const trigger =
          qs(
            ".accordion-trigger",
            item
          );

        const panel =
          qs(
            ".accordion-panel",
            item
          );

        if (
          !trigger ||
          !panel
        ) {
          return;
        }

        item.classList.remove(
          "is-open"
        );

        trigger.setAttribute(
          "aria-expanded",
          "false"
        );

        if (
          panel.style.height ===
          "auto"
        ) {
          panel.style.height =
            `${panel.scrollHeight}px`;

          panel.offsetHeight;
        }

        requestAnimationFrame(
          () => {
            panel.style.height =
              "0px";
          }
        );
      };


      const openItem = (
        item
      ) => {
        const trigger =
          qs(
            ".accordion-trigger",
            item
          );

        const panel =
          qs(
            ".accordion-panel",
            item
          );

        if (
          !trigger ||
          !panel
        ) {
          return;
        }

        if (single) {
          items.forEach(
            (other) => {
              if (
                other !== item &&
                other.classList
                  .contains(
                    "is-open"
                  )
              ) {
                closeItem(
                  other
                );
              }
            }
          );
        }

        item.classList.add(
          "is-open"
        );

        trigger.setAttribute(
          "aria-expanded",
          "true"
        );

        panel.style.height =
          `${panel.scrollHeight}px`;

        const onEnd = (
          event
        ) => {
          if (
            event.propertyName !==
            "height"
          ) {
            return;
          }

          if (
            item.classList
              .contains(
                "is-open"
              )
          ) {
            panel.style.height =
              "auto";
          }

          panel.removeEventListener(
            "transitionend",
            onEnd
          );
        };

        panel.addEventListener(
          "transitionend",
          onEnd
        );
      };


      items.forEach(
        (item, index) => {
          const trigger =
            qs(
              ".accordion-trigger",
              item
            );

          const panel =
            qs(
              ".accordion-panel",
              item
            );

          if (
            !trigger ||
            !panel
          ) {
            return;
          }

          const triggerId =
            trigger.id ||
            `accordion-trigger-${index}-${Math.random()
              .toString(36)
              .slice(2, 7)}`;

          const panelId =
            panel.id ||
            `accordion-panel-${index}-${Math.random()
              .toString(36)
              .slice(2, 7)}`;

          trigger.id =
            triggerId;

          panel.id =
            panelId;

          trigger.setAttribute(
            "aria-controls",
            panelId
          );

          panel.setAttribute(
            "aria-labelledby",
            triggerId
          );

          const isOpen =
            item.classList
              .contains(
                "is-open"
              );

          trigger.setAttribute(
            "aria-expanded",
            String(isOpen)
          );

          panel.style.height =
            isOpen
              ? "auto"
              : "0px";

          trigger.addEventListener(
            "click",
            () => {
              if (
                item.classList
                  .contains(
                    "is-open"
                  )
              ) {
                closeItem(
                  item
                );

                return;
              }

              openItem(
                item
              );
            }
          );
        }
      );


      



      let resizeTimer;

      window.addEventListener(
        "resize",
        () => {
          clearTimeout(
            resizeTimer
          );

          resizeTimer =
            window.setTimeout(
              () => {
                items.forEach(
                  (item) => {
                    if (
                      !item.classList
                        .contains(
                          "is-open"
                        )
                    ) {
                      return;
                    }

                    const panel =
                      qs(
                        ".accordion-panel",
                        item
                      );

                    if (panel) {
                      panel.style.height =
                        "auto";
                    }
                  }
                );
              },
              120
            );
        }
      );
    });
  };


  



  const initCookieConsent =
    () => {
      const card =
        qs(
          ".cookie-consent"
        );

      if (!card) {
        return;
      }

      const settings =
        Config.cookieConsent ||
        {};

      const storageKey =
        settings.storageKey ||
        "site-cookie-consent";

      const accepted =
        safeStorageGet(
          localStorage,
          storageKey
        ) === "accepted";

      const dismissed =
        safeStorageGet(
          sessionStorage,
          `${storageKey}-dismissed`
        ) === "true";


      



      const text =
        qs(
          "[data-cookie-text]",
          card
        );

      if (
        text &&
        settings.text
      ) {
        text.textContent =
          settings.text;
      }

      const policy =
        qs(
          "[data-cookie-policy]",
          card
        );

      if (policy) {
        if (
          settings.policyLabel
        ) {
          policy.textContent =
            settings.policyLabel;
        }

        if (
          settings.policyUrl
        ) {
          policy.href =
            settings.policyUrl;
        }
      }

      const accept =
        qs(
          "[data-cookie-accept], .cookie-consent__accept",
          card
        );

      if (
        accept &&
        settings.acceptLabel
      ) {
        accept.textContent =
          settings.acceptLabel;
      }

      const close =
        qs(
          "[data-cookie-close], .cookie-consent__close",
          card
        );


      const hide = () => {
        card.classList.remove(
          "is-visible"
        );

        card.setAttribute(
          "aria-hidden",
          "true"
        );
      };


      const show = () => {
        card.classList.add(
          "is-visible"
        );

        card.setAttribute(
          "aria-hidden",
          "false"
        );
      };


      if (
        !accepted &&
        !dismissed
      ) {
        window.setTimeout(
          show,
          state.reducedMotion
            ? 0
            : 650
        );
      } else {
        hide();
      }


      accept?.addEventListener(
        "click",
        () => {
          safeStorageSet(
            localStorage,
            storageKey,
            "accepted"
          );

          hide();
        }
      );


      close?.addEventListener(
        "click",
        () => {
          safeStorageSet(
            sessionStorage,
            `${storageKey}-dismissed`,
            "true"
          );

          hide();
        }
      );
    };


  



  const setFieldState = (
    field,
    valid
  ) => {
    if (!field) {
      return;
    }

    field.classList.toggle(
      "is-invalid",
      !valid
    );

    field.setAttribute(
      "aria-invalid",
      String(!valid)
    );
  };

  const contactFieldRules = {
    name: {
      minLength: 2,
      message:
        "Please enter a valid name."
    },
    message: {
      minLength: 10,
      message:
        "Please add a little more detail about your goal."
    }
  };

  const validateContactField =
    (field) => {
      const rule =
        contactFieldRules[field?.name];

      if (!rule) {
        return;
      }

      const value =
        field.value.trim();

      if (
        value !== ""
        && value.length <
          rule.minLength
      ) {
        field.setCustomValidity(
          rule.message
        );
      }
    };

  const findFieldError =
    (field) =>
      field?.parentElement
        ? qs(
            ".form-error",
            field.parentElement
          )
        : null;

  const ensureFieldError =
    (field) => {
      if (!field?.parentElement) {
        return null;
      }

      let error =
        findFieldError(field);

      if (!error) {
        error =
          doc.createElement("div");

        error.className =
          "form-error";

        if (field.id) {
          error.id =
            `${field.id}-error`;

          const describedBy =
            (
              field.getAttribute(
                "aria-describedby"
              ) || ""
            )
              .split(/\s+/)
              .filter(Boolean);

          if (
            !describedBy.includes(
              error.id
            )
          ) {
            describedBy.push(
              error.id
            );

            field.setAttribute(
              "aria-describedby",
              describedBy.join(" ")
            );
          }
        }

        field.insertAdjacentElement(
          "afterend",
          error
        );
      }

      return error;
    };

  const setFieldError = (
    field,
    message = ""
  ) => {
    const error = message
      ? ensureFieldError(field)
      : findFieldError(field);

    if (error) {
      error.textContent =
        message;
    }

    setFieldState(
      field,
      !message && field.validity.valid
    );
  };

  const clearFieldError =
    (field) => {
      field.setCustomValidity("");

      const error =
        findFieldError(field);

      if (error) {
        error.textContent = "";
      }
    };


  const initFormFieldStates =
    () => {
      qsa(
        ".form-control"
      ).forEach((field) => {
        field.addEventListener(
          "input",
          () => {
            clearFieldError(field);
            validateContactField(field);

            setFieldState(
              field,
              field.validity.valid
            );
          }
        );

        field.addEventListener(
          "invalid",
          () => {
            setFieldState(
              field,
              false
            );
          }
        );
      });
    };


  



  const initContactForms = () => {
    const forms =
      qsa(
        "[data-contact-form]"
      );

    forms.forEach((form) => {
      const status =
        qs(
          ".form-status",
          form
        ) ||
        qs(
          "[data-form-status]"
        );

      const submit =
        qs(
          '[type="submit"]',
          form
        );

      let busy = false;


      const showStatus = (
        type,
        message
      ) => {
        if (!status) {
          return;
        }

        status.textContent =
          message;

        status.classList.add(
          "is-visible"
        );

        status.classList.toggle(
          "is-success",
          type === "success"
        );

        status.classList.toggle(
          "is-error",
          type === "error"
        );

        status.setAttribute(
          "role",
          type === "error"
            ? "alert"
            : "status"
        );
      };


      const clearStatus = () => {
        if (!status) {
          return;
        }

        status.classList.remove(
          "is-visible",
          "is-success",
          "is-error"
        );

        status.textContent = "";
      };


      form.addEventListener(
        "submit",
        async (event) => {
          event.preventDefault();

          if (busy) {
            return;
          }

          clearStatus();

          const fields =
            qsa(
              ".form-control",
              form
            );

          fields.forEach(
            (field) => {
              clearFieldError(field);
              validateContactField(field);

              setFieldState(
                field,
                field.validity.valid
              )
            }
          );

          if (
            !form.checkValidity()
          ) {
            form.reportValidity();

            const invalid =
              qs(
                ":invalid",
                form
              );

            invalid?.focus();

            return;
          }


          



          busy = true;

          const originalText =
            submit
              ? submit.textContent
              : "";

          if (submit) {
            submit.disabled = true;

            submit.setAttribute(
              "aria-busy",
              "true"
            );

            submit.textContent =
              "Sending…";
          }

          try {
            const response =
              await fetch(
                form.action ||
                  Config.contact
                    ?.endpoint ||
                  "contact.php",
                {
                  method: "POST",

                  body:
                    new FormData(
                      form
                    ),

                  headers: {
                    "X-Requested-With":
                      "XMLHttpRequest"
                  }
                }
              );

            let data = null;

            const contentType =
              response.headers.get(
                "content-type"
              ) || "";

            if (
              contentType.includes(
                "application/json"
              )
            ) {
              data =
                await response.json();
            } else {
              const text =
                await response.text();

              data = {
                success:
                  response.ok,
                message: text
              };
            }

            const explicitFailure =
              data?.success ===
                false ||
              data?.status ===
                "error";

            if (
              !response.ok ||
              explicitFailure
            ) {
              if (
                response.status === 422
                && data?.errors
              ) {
                Object.entries(
                  data.errors
                ).forEach(
                  ([
                    name,
                    message
                  ]) => {
                    const field =
                      fields.find(
                        (item) =>
                          item.name ===
                          name
                      );

                    if (!field) {
                      return;
                    }

                    field.setCustomValidity(
                      String(message)
                    );

                    setFieldError(
                      field,
                      String(message)
                    );
                  }
                );

                const invalid =
                  fields.find(
                    (field) =>
                      !field.validity.valid
                  );

                invalid?.focus();
                invalid?.reportValidity();
              }

              throw new Error(
                data?.message ||
                Config.contact
                  ?.errorMessage ||
                "Something went wrong."
              );
            }

            showStatus(
              "success",
              data?.message ||
                Config.contact
                  ?.successMessage ||
                "Thank you. Your request has been sent successfully."
            );

            form.reset();

            fields.forEach(
              (field) => {
                setFieldState(
                  field,
                  true
                );
              }
            );
          } catch (error) {
            showStatus(
              "error",
              error?.message ||
                Config.contact
                  ?.errorMessage ||
                "Something went wrong. Please try again."
            );
          } finally {
            busy = false;

            if (submit) {
              submit.disabled =
                false;

              submit.removeAttribute(
                "aria-busy"
              );

              submit.textContent =
                originalText;
            }
          }
        }
      );
    });
  };


  



  const secureExternalLinks =
    () => {
      qsa(
        'a[target="_blank"]'
      ).forEach((link) => {
        const rel =
          new Set(
            (
              link.getAttribute(
                "rel"
              ) || ""
            )
              .split(/\s+/)
              .filter(Boolean)
          );

        rel.add("noopener");
        rel.add("noreferrer");

        link.setAttribute(
          "rel",
          Array.from(rel).join(" ")
        );
      });
    };


  



  const handleInitialHash =
    () => {
      if (
        !window.location.hash
      ) {
        return;
      }

      const id =
        decodeURIComponent(
          window.location.hash
            .slice(1)
        );

      const target =
        doc.getElementById(id);

      if (!target) {
        return;
      }

      




      window.setTimeout(
        () => {
          scrollToElement(
            target,
            {
              duration: 0.8
            }
          );
        },
        160
      );
    };


  



  const initImageRefresh =
    () => {
      const images =
        qsa("img");

      let remaining =
        images.filter(
          (image) =>
            !image.complete
        ).length;

      if (!remaining) {
        return;
      }

      const refresh = () => {
        remaining -= 1;

        if (
          remaining <= 0
        ) {
          requestAnimationFrame(
            () => {
              state.lenis
                ?.resize?.();

              window.ScrollTrigger
                ?.refresh?.();

              window.AOS
                ?.refreshHard?.();
            }
          );
        }
      };

      images.forEach(
        (image) => {
          if (image.complete) {
            return;
          }

          image.addEventListener(
            "load",
            refresh,
            {
              once: true
            }
          );

          image.addEventListener(
            "error",
            refresh,
            {
              once: true
            }
          );
        }
      );
    };


  




  const initPageShowSafety =
    () => {
      window.addEventListener(
        "pageshow",
        () => {
          html.classList.remove(
            "is-locked"
          );

          body.classList.remove(
            "is-locked"
          );

          state.lenis?.start();

          const header =
            qs(".site-header");

          header?.classList.remove(
            "is-hidden"
          );

          requestAnimationFrame(
            () => {
              state.lenis
                ?.resize?.();

              window.ScrollTrigger
                ?.refresh?.();
            }
          );
        }
      );
    };


  



  const initResize = () => {
    let timer = null;

    window.addEventListener(
      "resize",
      () => {
        clearTimeout(timer);

        timer =
          window.setTimeout(
            () => {
              state.lenis
                ?.resize?.();

              window.ScrollTrigger
                ?.refresh?.();
            },
            140
          );
      },
      {
        passive: true
      }
    );
  };


  



  const init = () => {
    html.classList.remove(
      "no-js"
    );

    setDocumentMeta();

    hydrateGlobalContent();

    buildServiceNavigation();

    updateActiveNavigation();

    initLucide();

    initLenis();

    exposeMotionApi();

    initHeader();

    initMobileMenu();

    initSmoothAnchors();

    initAccordions();

    initAOS();

    initCookieConsent();

    initFormFieldStates();

    initContactForms();

    secureExternalLinks();

    initImageRefresh();

    initResize();

    initPageShowSafety();

    handleInitialHash();


    



    html.classList.add(
      "site-ready"
    );

    doc.dispatchEvent(
      new CustomEvent(
        "site:global-ready",
        {
          detail: {
            config: Config,

            lenis:
              state.lenis
          }
        }
      )
    );
  };


  ready(init);

})();
