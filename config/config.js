
















(() => {
  "use strict";

  







  const currentPath = window.location.pathname
    .replace(/\\/g, "/")
    .toLowerCase();

  const isServicePage = /\/services\/[^/]+\.html$/.test(currentPath);

  const ROOT = isServicePage ? "../" : "./";

  const route = (path = "") => `${ROOT}${path}`;

  const COMPANY_NAME = "Averon Performance";

  const COMPANY_SHORT_NAME = "Averon";

  const SITE_EMAIL = "hello@averonperformance.com";


  



  window.SiteConfig = {
    



    companyName: COMPANY_NAME,

    companyShortName: COMPANY_SHORT_NAME,

    logo: route("assets/icons/logo.svg"),

    favicon: route("assets/icons/favicon.svg"),

    email: SITE_EMAIL,


    



    titleSeparator: " | ",

    browserTitle:
      `${COMPANY_NAME} | Google Ads & Performance Marketing`,

    metaDescription:
      "Performance marketing agency focused on Google Ads, lead generation, e-commerce growth, conversion tracking and marketing automation.",

    pageTitles: {
      home:
        "Google Ads & Performance Marketing",

      privacy:
        "Privacy Policy",

      terms:
        "Terms & Conditions",

      cookies:
        "Cookie Policy",

      googleAds:
        "Google Ads Management",

      leadGeneration:
        "Lead Generation",

      ecommerce:
        "E-commerce Advertising",

      tracking:
        "Tracking & Analytics",

      automation:
        "Marketing Automation"
    },


    



    positioning: {
      eyebrow:
        "Performance Marketing Agency",

      headline:
        "Advertising Built for Measurable Growth",

      shortDescription:
        "Google Ads, tracking and performance systems built around qualified leads, sales and revenue.",

      coreMessage:
        "We don't optimize for clicks. We optimize for real business outcomes.",

      secondaryMessage:
        "Less manual work. Faster decisions. Better advertising data."
    },


    



    cta: {
      primary:
        "Get a Free Google Ads Audit",

      secondary:
        "View Our Services",

      audit:
        "Request an Account Review",

      contact:
        "Start a Conversation",

      projects:
        "View Results",

      learnMore:
        "Learn More"
    },


    



    routes: {
      home:
        route("index.html"),

      about:
        route("index.html#about"),

      services:
        route("index.html#services"),

      projects:
        route("index.html#results"),

      contact:
        route("index.html#contact"),

      privacy:
        route("privacy.html"),

      terms:
        route("terms.html"),

      cookies:
        route("cookies.html"),

      googleAds:
        route("services/google-ads-management.html"),

      leadGeneration:
        route("services/lead-generation.html"),

      ecommerce:
        route("services/ecommerce-advertising.html"),

      tracking:
        route("services/tracking-analytics.html"),

      automation:
        route("services/marketing-automation.html")
    },


    



    navigation: [
      {
        label: "Home",
        key: "home"
      },

      {
        label: "About",
        key: "about"
      },

      {
        label: "Services",
        key: "services",
        dropdown: true
      },

      {
        label: "Results",
        key: "projects"
      },

      {
        label: "Contact",
        key: "contact"
      }
    ],


    













    services: [
      {
        id: "google-ads",

        number: "01",

        title:
          "Google Ads Management",

        shortTitle:
          "Google Ads",

        slug:
          "google-ads-management.html",

        routeKey:
          "googleAds",

        icon:
          "mouse-pointer-click",

        description:
          "Full-funnel Google Ads management focused on profitable acquisition, qualified demand and scalable growth.",

        heroText:
          "Build and scale campaigns around the metrics that matter to your business.",

        capabilities: [
          "Google Search Ads",
          "Performance Max",
          "Google Shopping",
          "Merchant Center",
          "Demand Gen",
          "YouTube & Display",
          "App Campaigns"
        ]
      },


      {
        id: "lead-generation",

        number: "02",

        title:
          "Lead Generation",

        shortTitle:
          "Lead Generation",

        slug:
          "lead-generation.html",

        routeKey:
          "leadGeneration",

        icon:
          "users",

        description:
          "Performance campaigns designed to generate qualified calls, enquiries, appointments and sales opportunities.",

        heroText:
          "Turn advertising demand into measurable, qualified business opportunities.",

        capabilities: [
          "Qualified Leads",
          "Form Conversions",
          "Booked Appointments",
          "Call Tracking",
          "Lead Quality",
          "CRM Feedback"
        ]
      },


      {
        id: "ecommerce",

        number: "03",

        title:
          "E-commerce Advertising",

        shortTitle:
          "E-commerce",

        slug:
          "ecommerce-advertising.html",

        routeKey:
          "ecommerce",

        icon:
          "shopping-bag",

        description:
          "Revenue-focused advertising for online stores across Search, Shopping and Performance Max.",

        heroText:
          "Connect product demand, advertising data and revenue into one scalable growth system.",

        capabilities: [
          "Google Shopping",
          "Performance Max",
          "Product Feeds",
          "Merchant Center",
          "Revenue Tracking",
          "ROAS Optimization"
        ]
      },


      {
        id: "tracking",

        number: "04",

        title:
          "Tracking & Analytics",

        shortTitle:
          "Analytics",

        slug:
          "tracking-analytics.html",

        routeKey:
          "tracking",

        icon:
          "chart-no-axes-combined",

        description:
          "Reliable conversion and revenue tracking that gives campaigns the data required to optimize intelligently.",

        heroText:
          "See what actually generates leads, customers and revenue — not just clicks.",

        capabilities: [
          "Conversion Tracking",
          "Google Analytics",
          "Google Tag Manager",
          "Offline Conversions",
          "CRM Integration",
          "Attribution",
          "Revenue Tracking"
        ]
      },


      {
        id: "automation",

        number: "05",

        title:
          "Marketing Automation",

        shortTitle:
          "Automation",

        slug:
          "marketing-automation.html",

        routeKey:
          "automation",

        icon:
          "workflow",

        description:
          "Automated monitoring, reporting and data workflows that make performance decisions faster and more reliable.",

        heroText:
          "Reduce repetitive work and turn advertising data into faster decisions.",

        capabilities: [
          "Automated Reporting",
          "Budget Monitoring",
          "Campaign Alerts",
          "Lead Tracking",
          "CRM Automation",
          "Performance Monitoring",
          "AI-assisted Analysis"
        ]
      }
    ],


    




    process: [
      {
        number: "01",
        title: "Audit",
        description:
          "We review campaigns, tracking, website performance and available advertising data."
      },

      {
        number: "02",
        title: "Strategy",
        description:
          "We define campaign structure, budgets, audiences and the business metrics that matter."
      },

      {
        number: "03",
        title: "Launch",
        description:
          "Campaigns, tracking and required integrations are prepared and launched."
      },

      {
        number: "04",
        title: "Optimize",
        description:
          "We continuously improve CPA, CPL, ROAS, conversion quality and revenue performance."
      },

      {
        number: "05",
        title: "Scale",
        description:
          "Successful campaigns are expanded where the underlying business economics support growth."
      }
    ],


    





    metrics: [
      "ROAS",
      "Revenue",
      "Qualified Leads",
      "CPA",
      "CPL",
      "Conversion Rate"
    ],


    




    contact: {
      endpoint:
        route("contact.php"),

      successMessage:
        "Thank you. Your request has been sent successfully.",

      errorMessage:
        "Something went wrong. Please try again.",

      submitLabel:
        "Request Free Audit",

      fields: {
        name:
          "Name",

        company:
          "Company",

        email:
          "Business Email",

        website:
          "Website",

        businessType:
          "Business Type",

        budget:
          "Monthly Advertising Budget",

        service:
          "What do you need help with?",

        message:
          "Main Goal / Message"
      },

      businessTypes: [
        "Lead Generation",
        "E-commerce",
        "Local Business",
        "B2B / SaaS",
        "Mobile App",
        "Other"
      ],

      serviceOptions: [
        "Google Ads Management",
        "Performance Max",
        "Shopping",
        "Lead Generation",
        "Tracking & Analytics",
        "Marketing Automation",
        "Account Audit",
        "Other"
      ]
    },


    




    cookieConsent: {
      storageKey:
        "averon-cookie-consent",

      text:
        "We use essential cookies to keep this website working properly.",

      acceptLabel:
        "Accept",

      policyLabel:
        "Cookie Policy",

      policyUrl:
        route("cookies.html")
    },


    



    preloader: {
      name:
        COMPANY_SHORT_NAME,

      label:
        "Performance",

      transitionDuration:
        520,

      minimumVisibleTime:
        320
    },


    



    footer: {
      description:
        "Performance marketing systems built around advertising data, qualified demand and measurable business growth.",

      disclaimer:
        `${COMPANY_NAME} is an independent performance marketing agency. Advertising performance varies by business, market, budget, competition, website quality and other factors. No specific advertising result, lead volume, revenue level, CPA, CPL or ROAS is guaranteed.`,

      copyright:
        `© ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.`
    },


    



    legal: {
      privacyLabel:
        "Privacy Policy",

      termsLabel:
        "Terms & Conditions",

      cookiesLabel:
        "Cookie Policy"
    }
  };


  



  window.SiteConfig.getRoute = function (key) {
    return this.routes[key] || this.routes.home;
  };


  window.SiteConfig.getService = function (id) {
    return this.services.find((service) => service.id === id) || null;
  };


  window.SiteConfig.getServiceRoute = function (service) {
    if (!service) return this.routes.home;

    return this.routes[service.routeKey] || this.routes.home;
  };


  



  window.SiteConfig.root = ROOT;

})();
