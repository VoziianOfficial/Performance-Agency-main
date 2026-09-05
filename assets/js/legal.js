
























(() => {
  "use strict";


  



  const doc = document;
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

  const isLegalPage =
    body.classList.contains(
      "legal-page"
    ) ||
    ["privacy", "terms", "cookies"]
      .includes(
        body.dataset.page
      );

  if (!isLegalPage) {
    return;
  }

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  const state = {
    observer: null,

    activeId: "",

    programmaticScroll: false,

    scrollTimer: null,

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


  



  const getHeaderHeight = () => {
    const header =
      qs(".site-header");

    if (!header) {
      return 0;
    }

    return header
      .getBoundingClientRect()
      .height;
  };


  const getSectionIdFromLink = (
    link
  ) => {
    if (!link) {
      return "";
    }

    const href =
      link.getAttribute(
        "href"
      );

    if (
      !href ||
      !href.includes("#")
    ) {
      return "";
    }

    try {
      const url =
        new URL(
          link.href,
          window.location.href
        );

      return decodeURIComponent(
        url.hash.slice(1)
      );
    } catch (error) {
      return "";
    }
  };


  const getTarget = (
    id
  ) => {
    if (!id) {
      return null;
    }

    return doc.getElementById(
      id
    );
  };


  



  const initLegalPageNav = () => {
    const page =
      body.dataset.page;

    qsa(
      ".legal-page-nav__link"
    ).forEach(
      (link) => {
        link.classList.remove(
          "is-active"
        );

        link.removeAttribute(
          "aria-current"
        );


        const key =
          link.dataset
            .legalPage ||
          link.dataset.route ||
          "";

        if (
          key === page
        ) {
          link.classList.add(
            "is-active"
          );

          link.setAttribute(
            "aria-current",
            "page"
          );
        }
      }
    );
  };


  



  const getTocLinks = () =>
    qsa(
      ".legal-sidebar__link[href*='#']"
    );


  const getLegalSections = () =>
    qsa(
      ".legal-section[id]"
    );


  const setActiveSection = (
    id,
    {
      updateHash = false
    } = {}
  ) => {
    if (!id) {
      return;
    }

    const links =
      getTocLinks();

    const current =
      links.find(
        (link) =>
          getSectionIdFromLink(
            link
          ) === id
      );

    if (!current) {
      return;
    }

    state.activeId = id;


    links.forEach(
      (link) => {
        const active =
          link === current;

        link.classList.toggle(
          "is-active",
          active
        );

        if (active) {
          link.setAttribute(
            "aria-current",
            "location"
          );
        } else {
          link.removeAttribute(
            "aria-current"
          );
        }
      }
    );


    



    if (
      window.innerWidth <= 991
    ) {
      const nav =
        current.closest(
          ".legal-sidebar__nav"
        );

      if (nav) {
        const navRect =
          nav.getBoundingClientRect();

        const linkRect =
          current
            .getBoundingClientRect();

        const left =
          current.offsetLeft -
          (
            navRect.width -
            linkRect.width
          ) /
          2;

        nav.scrollTo({
          left:
            Math.max(
              0,
              left
            ),

          behavior:
            reducedMotion
              ? "auto"
              : "smooth"
        });
      }
    }


    



    if (
      updateHash &&
      window.location.hash !==
        `#${id}`
    ) {
      history.replaceState(
        null,
        "",
        `#${encodeURIComponent(id)}`
      );
    }
  };


  



  const scrollToSection = (
    target
  ) => {
    if (!target) {
      return;
    }

    state.programmaticScroll =
      true;

    clearTimeout(
      state.scrollTimer
    );


    if (
      window.SiteMotion
        ?.scrollTo
    ) {
      window.SiteMotion
        .scrollTo(
          target,
          {
            offset:
              -(
                getHeaderHeight() +
                22
              ),

            duration:
              0.8
          }
        );
    } else {
      const top =
        target
          .getBoundingClientRect()
          .top +
        window.scrollY -
        getHeaderHeight() -
        22;

      window.scrollTo({
        top,

        behavior:
          reducedMotion
            ? "auto"
            : "smooth"
      });
    }


    state.scrollTimer =
      window.setTimeout(
        () => {
          state.programmaticScroll =
            false;
        },
        reducedMotion
          ? 50
          : 900
      );
  };


  



  const initTocClicks = () => {
    const links =
      getTocLinks();

    links.forEach(
      (link) => {
        link.addEventListener(
          "click",
          (event) => {
            const id =
              getSectionIdFromLink(
                link
              );

            const target =
              getTarget(id);

            if (!target) {
              return;
            }

            event.preventDefault();

            setActiveSection(
              id
            );


            history.pushState(
              null,
              "",
              `#${encodeURIComponent(id)}`
            );


            requestAnimationFrame(
              () => {
                scrollToSection(
                  target
                );
              }
            );
          }
        );
      }
    );
  };


  



  const initSectionObserver = () => {
    const sections =
      getLegalSections();

    if (!sections.length) {
      return;
    }


    state.observer
      ?.disconnect?.();


    if (
      !(
        "IntersectionObserver" in
        window
      )
    ) {
      initScrollFallback();

      return;
    }


    const headerOffset =
      getHeaderHeight() +
      40;


    state.observer =
      new IntersectionObserver(
        (entries) => {
          if (
            state.programmaticScroll
          ) {
            return;
          }


          const visible =
            entries
              .filter(
                (entry) =>
                  entry.isIntersecting
              )
              .sort(
                (a, b) =>
                  a.boundingClientRect
                    .top -
                  b.boundingClientRect
                    .top
              );


          if (!visible.length) {
            return;
          }


          




          let current =
            visible[0];

          visible.forEach(
            (entry) => {
              if (
                entry.boundingClientRect
                  .top <=
                headerOffset + 90
              ) {
                current =
                  entry;
              }
            }
          );


          const id =
            current.target.id;

          if (
            id &&
            id !==
              state.activeId
          ) {
            setActiveSection(
              id,
              {
                updateHash:
                  false
              }
            );
          }
        },
        {
          root: null,

          rootMargin:
            `-${headerOffset}px 0px -56% 0px`,

          threshold: [
            0,
            0.08,
            0.2,
            0.45
          ]
        }
      );


    sections.forEach(
      (section) => {
        state.observer
          .observe(section);
      }
    );
  };


  



  const initScrollFallback = () => {
    const sections =
      getLegalSections();

    if (!sections.length) {
      return;
    }


    let ticking =
      false;


    const update = () => {
      const marker =
        window.scrollY +
        getHeaderHeight() +
        100;

      let current =
        sections[0];


      sections.forEach(
        (section) => {
          if (
            section.offsetTop <=
            marker
          ) {
            current =
              section;
          }
        }
      );


      if (
        current &&
        current.id !==
          state.activeId
      ) {
        setActiveSection(
          current.id
        );
      }

      ticking = false;
    };


    window.addEventListener(
      "scroll",
      () => {
        if (
          ticking ||
          state.programmaticScroll
        ) {
          return;
        }

        ticking = true;

        requestAnimationFrame(
          update
        );
      },
      {
        passive: true
      }
    );


    update();
  };


  



  const initInitialSection = () => {
    const links =
      getTocLinks();

    if (!links.length) {
      return;
    }

    const hash =
      decodeURIComponent(
        window.location.hash
          .slice(1)
      );


    if (
      hash &&
      getTarget(hash)
    ) {
      setActiveSection(
        hash
      );

      




      if (
        !window.SiteMotion
          ?.scrollTo
      ) {
        window.setTimeout(
          () => {
            scrollToSection(
              getTarget(hash)
            );
          },
          120
        );
      }

      return;
    }


    const firstId =
      getSectionIdFromLink(
        links[0]
      );

    if (firstId) {
      setActiveSection(
        firstId
      );
    }
  };


  



  const initHashChange = () => {
    window.addEventListener(
      "hashchange",
      () => {
        const id =
          decodeURIComponent(
            window.location.hash
              .slice(1)
          );

        const target =
          getTarget(id);

        if (!target) {
          return;
        }

        setActiveSection(
          id
        );

        scrollToSection(
          target
        );
      }
    );
  };


  





  const initArticleAnchors = () => {
    qsa(
      ".legal-article a[href^='#']"
    ).forEach(
      (link) => {
        link.addEventListener(
          "click",
          (event) => {
            const id =
              decodeURIComponent(
                (
                  link.getAttribute(
                    "href"
                  ) || ""
                ).replace(
                  /^#/,
                  ""
                )
              );

            const target =
              getTarget(id);

            if (!target) {
              return;
            }

            event.preventDefault();

            history.pushState(
              null,
              "",
              `#${encodeURIComponent(id)}`
            );

            setActiveSection(
              id
            );

            scrollToSection(
              target
            );
          }
        );
      }
    );
  };


  





  const hydrateUpdatedDate = () => {
    const value =
      body.dataset
        .legalUpdated;

    if (!value) {
      return;
    }

    qsa(
      "[data-legal-updated]"
    ).forEach(
      (element) => {
        element.textContent =
          value;
      }
    );
  };


  



  const hydrateLegalEmail = () => {
    if (!Config.email) {
      return;
    }

    qsa(
      "[data-legal-email]"
    ).forEach(
      (element) => {
        element.textContent =
          Config.email;

        if (
          element.tagName ===
          "A"
        ) {
          element.href =
            `mailto:${Config.email}`;
        }
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
              initSectionObserver();


              if (
                state.activeId
              ) {
                setActiveSection(
                  state.activeId
                );
              }


              window.SiteMotion
                ?.refresh?.();
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
        state.programmaticScroll =
          false;


        requestAnimationFrame(
          () => {
            initSectionObserver();


            const hash =
              decodeURIComponent(
                window.location.hash
                  .slice(1)
              );


            if (
              hash &&
              getTarget(hash)
            ) {
              setActiveSection(
                hash
              );
            }
          }
        );
      }
    );
  };


  



  const initTables = () => {
    qsa(
      ".legal-table-wrap"
    ).forEach(
      (wrapper) => {
        if (
          !wrapper.hasAttribute(
            "tabindex"
          )
        ) {
          wrapper.setAttribute(
            "tabindex",
            "0"
          );
        }

        if (
          !wrapper.hasAttribute(
            "role"
          )
        ) {
          wrapper.setAttribute(
            "role",
            "region"
          );
        }

        if (
          !wrapper.hasAttribute(
            "aria-label"
          )
        ) {
          wrapper.setAttribute(
            "aria-label",
            "Scrollable information table"
          );
        }
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
      ".legal-section"
    ).forEach(
      (section) => {
        const title =
          qs(
            ".legal-section__title, h2",
            section
          );

        const number =
          qs(
            ".legal-section__number",
            section
          );


        const targets =
          [
            number,
            title
          ].filter(Boolean);


        if (!targets.length) {
          return;
        }


        window.gsap.from(
          targets,
          {
            y: 13,

            opacity: 0,

            duration: 0.44,

            stagger: 0.045,

            ease:
              "power3.out",

            scrollTrigger: {
              trigger:
                section,

              start:
                "top 91%",

              once: true
            }
          }
        );
      }
    );
  };


  



  const init = () => {
    initLegalPageNav();

    hydrateUpdatedDate();

    hydrateLegalEmail();

    initTocClicks();

    initArticleAnchors();

    initInitialSection();

    initSectionObserver();

    initHashChange();

    initTables();

    initReveals();

    initResize();

    initPageShow();


    



    window.setTimeout(
      () => {
        window.SiteMotion
          ?.refresh?.();
      },
      120
    );


    doc.dispatchEvent(
      new CustomEvent(
        "site:legal-ready",
        {
          detail: {
            page:
              body.dataset.page
          }
        }
      )
    );
  };


  ready(init);

})();
