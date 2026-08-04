/* ============================================================
   ECHOX — Script.js
   Navbar scroll, mobile menu, form handling (auto-reset),
   scroll animations
   ============================================================ */

(function () {
  "use strict";

  // === DOM REFERENCES ===
  var navbar = document.getElementById("navbar");
  var mobileMenuBtn = document.getElementById("mobile-menu-btn");
  var mobileMenuOverlay = document.getElementById("mobile-menu-overlay");

  // === NAVBAR SCROLL EFFECT ===
  var ticking = false;

  function updateNavbar() {
    var scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 80) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  });

  updateNavbar();

  // === MOBILE MENU ===
  function openMobileMenu() {
    mobileMenuOverlay.classList.add("active");
    mobileMenuBtn.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    mobileMenuOverlay.classList.remove("active");
    mobileMenuBtn.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      if (mobileMenuOverlay.classList.contains("active")) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Escape" &&
      mobileMenuOverlay &&
      mobileMenuOverlay.classList.contains("active")
    ) {
      closeMobileMenu();
    }
  });

  // === FORM HANDLING (Web3Forms — secure email delivery) ===
  // STEP 1: Go to https://web3forms.com
  // STEP 2: Enter aziza.cherraqi@gmail.com
  // STEP 3: Copy the access key you receive
  // STEP 4: Replace the key below
  var WEB3FORMS_KEY = "cc8a25fc-6232-4ba6-b262-e7b4dc15dc77";

  function handleFormSubmit(formId, successId, containerId, formType) {
    var form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = "SENDING...";
      submitBtn.disabled = true;

      var formData = new FormData(form);
      var data = {};
      formData.forEach(function (value, key) {
        data[key] = value;
      });

      // Subject based on form type
      var subjectMap = {
        quote: "New Quote Request — EchoX Website",
        partner: "New Partner Application — EchoX Website",
        contact: "New Contact Message — EchoX Website",
      };

      var clientEmail = data.email || "";
      var clientName = data.name || "Unknown";

      var payload = {
        access_key: WEB3FORMS_KEY,
        subject: subjectMap[formType] || "New Submission — EchoX Website",
        from_name: clientName,
        email: clientEmail,
        replyto: clientEmail,
        // Honeypot anti-spam (hidden field)
        botcheck: data._honey || "",
      };

      // Add all form fields
      Object.keys(data).forEach(function (key) {
        if (key !== "_honey" && !payload[key]) {
          payload[key] = data[key];
        }
      });

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          if (result.success) {
            showSuccess(formId, successId, containerId, originalText);
          } else {
            console.error("Web3Forms error:", result.message);
            showError(formId, submitBtn, originalText);
          }
        })
        .catch(function (error) {
          console.error("Form submission error:", error);
          showError(formId, submitBtn, originalText);
        });
    });

    function showError(formId, submitBtn, originalBtnText) {
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
      submitBtn.style.background = "#b91c1c";
      submitBtn.textContent = "SOMETHING WENT WRONG - PLEASE TRY AGAIN";
      setTimeout(function () {
        submitBtn.style.background = "";
        submitBtn.innerHTML = originalBtnText;
      }, 4000);
    }

    function showSuccess(formId, successId, containerId, originalBtnText) {
      var formEl = document.getElementById(formId);
      var successEl = document.getElementById(successId);
      var containerEl = containerId
        ? document.getElementById(containerId)
        : null;

      if (formEl) formEl.reset();

      var submitBtn = formEl
        ? formEl.querySelector('button[type="submit"]')
        : null;
      if (submitBtn) {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }

      if (containerEl) {
        containerEl.style.display = "none";
      } else if (formEl) {
        formEl.style.display = "none";
      }

      if (successEl) {
        successEl.style.display = "block";
      }

      setTimeout(function () {
        if (successEl) successEl.style.display = "none";
        if (containerEl) containerEl.style.display = "";
        else if (formEl) formEl.style.display = "";
      }, 3000);
    }
  }

  // Initialize all 3 forms
  handleFormSubmit(
    "home-quote-form",
    "home-success",
    "home-form-container",
    "quote",
  );
  handleFormSubmit(
    "partner-application-form",
    "partner-success",
    "partner-form-container",
    "partner",
  );
  handleFormSubmit(
    "contact-form",
    "contact-success",
    "contact-form-container",
    "contact",
  );

  // === SCROLL ANIMATIONS (Intersection Observer) ===
  var observerOptions = {
    root: null,
    rootMargin: "0px 0px -80px 0px",
    threshold: 0.1,
  };

  var scrollObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  function observeAnimations() {
    var animElements = document.querySelectorAll(
      ".animate-on-scroll:not(.visible)",
    );
    animElements.forEach(function (el) {
      scrollObserver.observe(el);
    });
  }

  observeAnimations();

  // === PROJECT CARDS SCROLL ANIMATION ===
  // Project cards animate in via the generic .animate-on-scroll observer above

  // === SMOOTH PAGE TRANSITION ON DOM READY ===
  document.documentElement.style.opacity = "1";
})();
