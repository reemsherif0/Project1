/* script.js - الإصدار المحسن الكامل للموقع (معدّل للـ i18n والروابط) */

document.addEventListener("DOMContentLoaded", () => {
    // Utility functions for form validation
    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const isValidPhone = (phone) => /^\+?[0-9]{8,15}$/.test(phone.replace(/\s/g, ''));
    const getProductDictKey = (productName) => {
        const map = {
            'ملح فلو': 'product_flow',
            'ملح روزابيلا': 'product_ros',
            'خل فرست': 'product_first',
            'خل أويس': 'product_oweis',
        };
        return map[productName] || productName;
    };

    // ====== YEAR ======
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    // ====== NAV TOGGLE & DROPDOWN ======
    const navToggle = document.getElementById("navToggle");
    const mainNav = document.getElementById("mainNav");
    const productsMenu = document.getElementById("productsMenu");

    if (navToggle && mainNav) {
        navToggle.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("show");
            navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
    }

    // Toggle product dropdown on click (for mobile/tablet)
    if (productsMenu) {
        const prodAnchor = productsMenu.querySelector('a');
        if (prodAnchor) {
            prodAnchor.addEventListener('click', function(e) {
                // Only prevent default on non-desktop screens
                if (window.innerWidth <= 820) {
                    e.preventDefault();
                    const dropdownMenu = productsMenu.querySelector('.dropdown-menu');
                    dropdownMenu?.classList.toggle('show');
                }
            });
        }
    }

    // Close nav on outside click
    document.addEventListener("click", (e) => {
        if (mainNav && mainNav.classList.contains('show') && !mainNav.contains(e.target) && !navToggle?.contains(e.target)) {
            mainNav.classList.remove('show');
            navToggle?.setAttribute("aria-expanded", "false");
        }
    });

    // ====== SMOOTH SCROLL (Updated to handle fragments on other pages) ======
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            if (!href || href === "#") return;

            // Check if fragment is on current page
            try {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                    if (mainNav && mainNav.classList.contains("show"))
                        mainNav.classList.remove("show");
                }
            } catch (err) {
                // invalid selector or other issue - ignore
            }
        });
    });

    // ====== INTERSECTION OBSERVER (ANIMATIONS ON SCROLL) ======
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((ent) => {
                if (ent.isIntersecting) {
                    ent.target.classList.add("is-visible");
                    observer.unobserve(ent.target);
                }
            });
        },
        { threshold: 0.15 }
    );
    document.querySelectorAll("[data-anim]").forEach((el) => observer.observe(el));

    // ====== LOGO ANIMATION ======
    const logo = document.getElementById("logoImg");
    if (logo) {
        logo.classList.add("logo-intro");
        setTimeout(() => {
            logo.classList.add("float-loop");
        }, 1000);
    }

    // ====== PRODUCT REQUEST PREFILL (Updated to link to contact.html) ======
    document.querySelectorAll('button[data-action="request"]').forEach((btn) => {
        btn.addEventListener("click", () => {
            const pname = btn.getAttribute("data-name") || "";
            const contactUrl = `contact.html?type=wholesale&product=${encodeURIComponent(pname)}`;
            window.location.href = contactUrl;
        });
    });

    // ====== LANGUAGE AND TRANSLATION LOGIC (Major Update) ======
    const langBtn = document.getElementById("langBtn");
    const site = document.getElementById("site");

    // Dictionary with ALL site translations (note: some values contain HTML intentionally)
    const dict = {
        // Global / header
        pageTitle: { ar: "المؤسسة المصرية العربية المتحدة — الصفحة الرئيسية", en: "Egyptian Arab United Foundation — Homepage" },
        pageTitleContact: { ar: "تواصل معنا — المؤسسة المصرية العربية المتحدة", en: "Contact Us — Egyptian Arab United Foundation" },

        // language toggle label
        langToggle: { ar: "English", en: "العربية" },

        brandNameAR: { ar: "المؤسسة المصرية العربية المتحدة", en: "Egyptian Arab United Foundation" },
        brandNameEN: { ar: "Egyptian Arab United Foundation", en: "Egyptian Arab United Foundation" },
        home: { ar: "الرئيسية", en: "Home" },
        about: { ar: "عنّا", en: "About Us" },
        products: { ar: "منتجاتنا", en: "Products" },
        quality: { ar: "الجودة", en: "Quality" },
        contact: { ar: "تواصل (جملة)", en: "Contact (Wholesale)" },

        // statement / hero
        statementTitle: { ar: "الاحترافية والجودة العالمية", en: "Professionalism and Global Quality" },
        statementSubtitle: { ar: "مؤسستنا توفر لكم منتجات بجودة لا مثيل لها.", en: "Our foundation provides products with unmatched quality." },
        heroTitle: { ar: "منتجات تعبئة وتجارة المواد الغذائية", en: "Foodstuff Packaging and Trading Products" },
        heroSubtitle: { ar: "جودة ومواصفات صحية تناسب التجزئة والتجار والشركات.", en: "Quality and health specifications suitable for retail, traders, and companies." },
        explore: { ar: "تعرّف على منتجاتنا", en: "Explore Products" },
        request: { ar: "اطلب عينة / طلب جملة", en: "Request Sample / Wholesale" },
        cardTitle: { ar: "طلب تجاري / جملة", en: "Wholesale / Commercial Request" },
        cardText: { ar: "لتجار التجزئة والموزعين والشركات — املأ نموذج الطلب وسيتم التواصل معك.", en: "For retailers, distributors, and companies — fill out the form and we will contact you." },
        orderNow: { ar: "اطلب الآن", en: "Order Now" },

        // About
        aboutTitle: { ar: "عن المؤسسة", en: "About the Foundation" },
        aboutText: { ar: "المؤسسة المصرية العربية المتحدة متخصصة في تعبئة وتجارة المواد الغذائية من طنطا — منتجاتنا تشمل ملح فلو، ملح روزابيلا وخلين طبيعيين: خل فرست وخل أويس. نراعي الجودة ومعايير الصحة الغذائية في كل دفعة تعبئة.", en: "The Egyptian Arab United Foundation specializes in packaging and trading foodstuff from Tanta — our products include Flow Salt, Rosabella Salt, and two natural vinegars: First Vinegar and Oweis Vinegar. We adhere to quality and food health standards in every batch." },

        // Products
        productsTitle: { ar: "منتجاتنا", en: "Our Products" },
        productsSubtitle: { ar: "اضغط 'طلب عرض سعر' لملء نموذج طلب الجملة تلقائيًا.", en: "Click 'Request Quote' to automatically pre-fill the wholesale order form." },
        product_flow: { ar: "ملح فلو", en: "Salt Flow" },
        product_ros: { ar: "ملح روزابيلا", en: "Salt Rosabella" },
        product_first: { ar: "خل فرست", en: "First Vinegar" },
        product_oweis: { ar: "خل أويس", en: "Oweis Vinegar" },
        desc_flow: { ar: "ملح مُكرر عالي النقاء، مناسب للاستهلاك الأسري والصناعي.", en: "High-purity refined salt, suitable for family and industrial consumption." },
        desc_ros: { ar: "نوع مخصوص بمعدلات معادن طبيعية لمذاق مطبخي مميز.", en: "A special type with natural mineral ratios for a distinctive kitchen taste." },
        desc_first: { ar: "خل قصب طبيعي ٥٪، مناسب للطبخ والتخليل.", en: "Natural cane vinegar 5%, suitable for cooking and pickling." },
        desc_oweis: { ar: "خل طبيعي بديل ضمن التشكيلة، جودة متسقة.", en: "Consistent quality natural vinegar as an alternative in the selection." },
        weight_flow: { ar: "أوزان: 250جم · 500جم · 1كجم · بالجملة", en: "Weights: 250g · 500g · 1kg · Wholesale" },

        // Quality
        qualityTitle: { ar: "الجودة والشهادات", en: "Quality and Certifications" },

        // Gallery
        galleryTitle: { ar: "معرض الصور", en: "Image Gallery" },
        gallerySubtitle: { ar: "لقطات من خطوط الإنتاج، التعبئة، والتخزين.", en: "Shots from production lines, packaging, and storage." },

        // Contact / quick info (these include HTML anchors)
        quickInfoTitle: { ar: "معلومات سريعة", en: "Quick Info" },
        address: {
            ar: 'العنوان: شارع أحمد كمال، <a href="https://g.co/kgs/UBNLNpj" target="_blank" rel="noopener noreferrer">طنطا</a>، محافظة الغربية',
            en: 'Address: Ahmed Kamal St., <a href="https://g.co/kgs/UBNLNpj" target="_blank" rel="noopener noreferrer">Tanta</a>, Gharbiya Governorate'
        },
        phoneLandline: {
            ar: 'هاتف أرضي: <a href="tel:0403340197">0403340197</a>',
            en: 'Landline: <a href="tel:0403340197">0403340197</a>'
        },
        phoneMobile: {
            ar: 'موبايل: <a href="tel:010228752730">010228752730</a> · <a href="tel:01220966916">01220966916</a> · <a href="tel:01150627549">01150627549</a> · <a href="tel:01551846749">01551846749</a>',
            en: 'Mobile: <a href="tel:010228752730">010228752730</a> · <a href="tel:01220966916">01220966916</a> · <a href="tel:01150627549">01150627549</a> · <a href="tel:01551846749">01551846749</a>'
        },
        websiteLink: {
            ar: 'الموقع: <a href="https://g.co/kgs/UBNLNpj" target="_blank" rel="noopener noreferrer">عرض الخريطة</a>',
            en: 'Map: <a href="https://g.co/kgs/UBNLNpj" target="_blank" rel="noopener noreferrer">Open map</a>'
        },
        facebookLink: {
            ar: 'فيسبوك: <a href="https://www.facebook.com/profile.php?id=61556167168849" target="_blank" rel="noopener noreferrer">صفحتنا</a>',
            en: 'Facebook: <a href="https://www.facebook.com/profile.php?id=61556167168849" target="_blank" rel="noopener noreferrer">Our page</a>'
        },

        // Forms & labels
        tabWholesale: { ar: "طلب عرض سعر / جملة", en: "Request Quote / Wholesale" },
        tabFeedback: { ar: "شكاوى واستفسارات", en: "Complaints & Inquiries" },
        formWholesaleTitle: { ar: "نموذج طلب تجاري / جملة", en: "Wholesale / Commercial Request Form" },

        labelClientType: { ar: "نوع العميل", en: "Client Type" },
        optionChoose: { ar: "--- اختر ---", en: "--- Choose ---" },
        optionRetailer: { ar: "تاجر تجزئة", en: "Retailer" },
        optionDistributor: { ar: "موزّع / تاجر جملة", en: "Distributor / Wholesaler" },
        optionCompany: { ar: "شركة / مطبخ صناعي", en: "Company / Industrial Kitchen" },
        optionOther: { ar: "أخرى", en: "Other" },

        labelProduct: { ar: "المنتج", en: "Product" },
        optionChooseProduct: { ar: "--- اختر منتج ---", en: "--- Choose Product ---" },

        labelQuantity: { ar: "الكمية المطلوبة (عدد باكيت / كرتون - الحد الأدنى 10)", en: "Required Quantity (Packs / Cartons - Min. 10)" },
        labelCompanyName: { ar: "اسم الشركة / المحل (إن وجد)", en: "Company / Store Name (If applicable)" },
        labelContactName: { ar: "اسم جهة الاتصال (المُرسِل)", en: "Contact Person Name (Sender)" },
        labelEmail: { ar: "البريد الإلكتروني (هام للتواصل الرسمي)", en: "Email (Important for formal contact)" },
        labelPhone: { ar: "الهاتف", en: "Phone" },
        labelNotes: { ar: "ملاحظات إضافية", en: "Additional Notes" },
        btnSendQuote: { ar: "ارسل طلب عرض سعر", en: "Send Quote Request" },

        // Alerts
        alertMissingFields: { ar: "⚠ الرجاء ملء كل الحقول المطلوبة: نوع العميل، المنتج، الكمية، الاسم، البريد، والهاتف.", en: "⚠ Please fill in all required fields: Client Type, Product, Quantity, Name, Email, and Phone." },
        alertQuantity: { ar: "❗ الكمية يجب أن تكون رقمًا لا يقل عن 10 وحدات (لطلبات الجملة).", en: "❗ Quantity must be a number greater than or equal to 10 units (for wholesale orders)." },
        alertPhone: { ar: "📞 رقم الهاتف غير صالح، يرجى إدخاله بشكل صحيح.", en: "📞 Invalid phone number, please enter it correctly." },
        alertEmail: { ar: "✉️ البريد الإلكتروني غير صالح، يرجى إدخاله بشكل صحيح.", en: "✉️ Invalid email address, please enter it correctly." },
        alertSuccessWholesale: { ar: "✅ تم إرسال طلبك بنجاح! سيتواصل معك فريق المبيعات خلال ساعات العمل.", en: "✅ Your request was sent successfully! Our sales team will contact you during business hours." },
        alertSuccessFeedback: { ar: "✅ تم إرسال طلبك بنجاح! سيتم مراجعة الشكوى/الاستفسار والرد عليك في أقرب وقت.", en: "✅ Your request was sent successfully! The complaint/inquiry will be reviewed and responded to as soon as possible." },

        // Footer
        footerCopy: { ar: "جميع الحقوق محفوظة © <span id='year'>2025</span> المؤسسة المصرية العربية المتحدة", en: "All Rights Reserved © <span id='year'>2025</span> Egyptian Arab United Foundation" },
        facebook: { ar: "فيسبوك", en: "Facebook" },
        instagram: { ar: "إنستجرام", en: "Instagram" },
        location: { ar: "الموقع الجغرافي", en: "Location" },
        backTop: { ar: "↑", en: "↑" }
    };

    function setLang(lang) {
        if (!site) return;

        // Set main attributes
        site.setAttribute("data-lang", lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
        site.dir = lang === "ar" ? "rtl" : "ltr";

        // Translate elements with data-i18n
        document.querySelectorAll("[data-i18n]").forEach((el) => {
            const key = el.getAttribute("data-i18n");
            if (key && dict[key] && dict[key][lang] !== undefined) {
                const translation = dict[key][lang];
                // OPTION elements
                if (el.tagName === 'OPTION') {
                    el.textContent = translation;
                } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    // do not overwrite input/textarea with innerHTML
                    // (placeholders handled separately)
                } else {
                    // Use innerHTML to allow anchor tags and simple markup in translations
                    el.innerHTML = translation;
                }
            }
        });

        // Placeholders: use data-i18n-placeholder if present (fallback to manual placeholders)
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const pk = el.getAttribute('data-i18n-placeholder');
            if (pk && dict[pk] && dict[pk][lang] !== undefined) {
                el.setAttribute('placeholder', dict[pk][lang]);
            }
        });

        // Update lang button text (safe fallback)
        if (langBtn) {
            const lbl = (dict.langToggle && dict.langToggle[lang]) ? dict.langToggle[lang] : (lang === 'ar' ? 'English' : 'العربية');
            langBtn.textContent = lbl;
        }

        // Re-check year if footer copy changed
        if (year) year.textContent = new Date().getFullYear();
    }

    // Set initial language from local storage or default to 'ar'
    const storedLang = localStorage.getItem('siteLang') || 'ar';
    setLang(storedLang);

    if (langBtn) {
        langBtn.addEventListener("click", () => {
            const current = site?.getAttribute("data-lang") || "ar";
            const newLang = current === "ar" ? "en" : "ar";
            localStorage.setItem('siteLang', newLang);
            setLang(newLang);
            // Scroll to top for a clean language switch view
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // ====== PARALLAX EFFECT (Fixed Template Literal Syntax) ======
    const heroWave = document.querySelector(".hero-wave");
    window.addEventListener("scroll", () => {
        if (!heroWave) return;
        const scrolled = window.scrollY;
        heroWave.style.transform = `translateY(${scrolled * -0.05}px)`;
    });

    // ====== WHOLESALE FORM (Major Update) ======
    const formWholesale = document.getElementById("wholesaleForm");
    const alertElWholesale = document.getElementById("formAlertWholesale");

    if (formWholesale && alertElWholesale) {
        formWholesale.addEventListener("submit", (e) => {
            e.preventDefault();
            const lang = site.getAttribute("data-lang");
            alertElWholesale.classList.remove("show", "success", "error");
            alertElWholesale.textContent = "";

            const clientType = document.getElementById("clientType")?.value.trim();
            const product = document.getElementById("productSelect")?.value.trim();
            const quantity = Number(document.getElementById("quantity")?.value);
            const companyName = document.getElementById("companyName")?.value.trim();
            const contactName = document.getElementById("contactName")?.value.trim();
            const email = document.getElementById("email")?.value.trim();
            const phone = document.getElementById("phone")?.value.trim();
            const notes = document.getElementById("notes")?.value.trim();

            // 1. Validation Checks
            if (!clientType || !product || !quantity || !contactName || !email || !phone) {
                alertElWholesale.textContent = dict.alertMissingFields[lang];
                alertElWholesale.classList.add("show", "error");
                return;
            }
            if (isNaN(quantity) || quantity < 10) {
                alertElWholesale.textContent = dict.alertQuantity[lang];
                alertElWholesale.classList.add("show", "error");
                return;
            }
            if (!isValidPhone(phone)) {
                alertElWholesale.textContent = dict.alertPhone[lang];
                alertElWholesale.classList.add("show", "error");
                return;
            }
            if (!isValidEmail(email)) {
                alertElWholesale.textContent = dict.alertEmail[lang];
                alertElWholesale.classList.add("show", "error");
                return;
            }

            // 2. Successful Submission Simulation
            alertElWholesale.textContent = dict.alertSuccessWholesale[lang];
            alertElWholesale.classList.add("show", "success");

            console.info("Wholesale Request (Sent):", {
                clientType, product, quantity, companyName, contactName, email, phone, notes,
            });

            // 3. Form Cleanup and Storage
            formWholesale.reset();
            localStorage.setItem('lastContactName', contactName);
            localStorage.setItem('lastContactEmail', email);

            setTimeout(() => alertElWholesale.classList.remove("show"), 8000);
        });
    }

    // ====== FEEDBACK FORM (New Form Logic) ======
    const formFeedback = document.getElementById("feedbackForm");
    const alertElFeedback = document.getElementById("formAlertFeedback");

    if (formFeedback && alertElFeedback) {
        formFeedback.addEventListener("submit", (e) => {
            e.preventDefault();
            const lang = site.getAttribute("data-lang");
            alertElFeedback.classList.remove("show", "success", "error");
            alertElFeedback.textContent = "";

            const feedbackType = document.getElementById("feedbackType")?.value.trim();
            const productRef = document.getElementById("productReference")?.value.trim();
            const details = document.getElementById("details")?.value.trim();
            const feedbackName = document.getElementById("feedbackName")?.value.trim();
            const feedbackEmail = document.getElementById("feedbackEmail")?.value.trim();
            const feedbackPhone = document.getElementById("feedbackPhone")?.value.trim();

            // Validation Checks
            if (!feedbackType || !details || !feedbackName || !feedbackEmail) {
                alertElFeedback.textContent = lang === 'ar' ? "⚠ الرجاء ملء الحقول المطلوبة (النوع، التفاصيل، الاسم، والإيميل)." : "⚠ Please fill in the required fields (Type, Details, Name, and Email).";
                alertElFeedback.classList.add("show", "error");
                return;
            }
            if (!isValidEmail(feedbackEmail)) {
                alertElFeedback.textContent = dict.alertEmail[lang];
                alertElFeedback.classList.add("show", "error");
                return;
            }

            // Successful Submission Simulation
            alertElFeedback.textContent = dict.alertSuccessFeedback[lang];
            alertElFeedback.classList.add("show", "success");

            console.info("Feedback/Inquiry (Sent):", {
                feedbackType, productRef, details, feedbackName, feedbackEmail, feedbackPhone
            });

            formFeedback.reset();
            setTimeout(() => alertElFeedback.classList.remove("show"), 8000);
        });
    }

    // ====== CONTACT PAGE TABS (New Feature) ======
    const tabButtons = document.querySelectorAll('.form-tabs .tab-btn');
    const allForms = document.querySelectorAll('.contact-page .form');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Deactivate all buttons and forms
            tabButtons.forEach(b => b.classList.remove('active'));
            allForms.forEach(f => f.classList.add('hidden'));

            // Activate target button and form
            btn.classList.add('active');
            const targetForm = document.querySelector(`[data-form-type="${targetTab}"]`);
            if (targetForm) targetForm.classList.remove('hidden');
        });
    });

    // ====== INITIAL FORM SETUP (Contact Page Only) ======
    if (document.body.classList.contains('contact-page')) {
        const urlParams = new URLSearchParams(window.location.search);
        const requestedProduct = urlParams.get('product');
        const formType = urlParams.get('type');

        if (formType === 'wholesale') {
            document.querySelector('.tab-btn[data-tab="wholesale"]')?.click();
        } else if (formType === 'feedback') {
            document.querySelector('.tab-btn[data-tab="feedback"]')?.click();
        } else {
            document.querySelector('.tab-btn[data-tab="wholesale"]')?.click();
        }

        if (requestedProduct) {
            const productSelect = document.getElementById("productSelect");
            if (productSelect) productSelect.value = requestedProduct;
        }

        const storedName = localStorage.getItem('lastContactName');
        const storedEmail = localStorage.getItem('lastContactEmail');
        if (storedName) {
            document.getElementById("contactName")?.setAttribute('value', storedName);
            document.getElementById("feedbackName")?.setAttribute('value', storedName);
        }
        if (storedEmail) {
            document.getElementById("email")?.setAttribute('value', storedEmail);
            document.getElementById("feedbackEmail")?.setAttribute('value', storedEmail);
        }
    }

    // ====== BACK TO TOP BUTTON ======
    const backTop = document.getElementById("backTop");
    window.addEventListener("scroll", () => {
        if (!backTop) return;
        backTop.style.display = window.scrollY > 500 ? "block" : "none";
    });
    if (backTop) {
        backTop.addEventListener("click", () =>
            window.scrollTo({ top: 0, behavior: "smooth" })
        );
    }

    // ====== KEYBOARD ESCAPE TO CLOSE NAV ======
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && mainNav?.classList.contains("show"))
            mainNav.classList.remove("show");
    });
});

// -------------------------------
// Safety: attach nav-toggle handler only if elements exist (prevent duplicate errors)
// -------------------------------
const navToggleButton = document.querySelector('.nav-toggle');
const navListElement = document.querySelector('.nav-list');
if (navToggleButton && navListElement) {
    navToggleButton.addEventListener('click', () => {
        navListElement.classList.toggle('show');
    });
}
// فرضًا translations.address تم تحميلها من ملف الترجمة
const el = document.querySelector('[data-i18n="address"]');
if (el && translations && translations.address) {
  el.innerHTML = translations.address; // يعرض HTML داخل النص المترجم
}
