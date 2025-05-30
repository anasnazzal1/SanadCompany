// assets/lang-toggle.js
document.addEventListener("DOMContentLoaded", function () {
  const langToggle = document.getElementById("langToggle");
  const path = window.location.pathname;

  // تحديد اللغة الحالية من الرابط
  const currentLang = path.includes("/en/") ? "en" : "ar";
  const newLang = currentLang === "en" ? "ar" : "en";

  // تحديث نص الكبسة
  langToggle.textContent = currentLang === "en" ? "العربية" : "English";

  langToggle.addEventListener("click", () => {
    // تحويل المسار للغة الجديدة
    const newPath = path.replace(`/${currentLang}/`, `/${newLang}/`);
    window.location.href = newPath;
  });
});

// assets/lang-toggle.js to small screen
document.addEventListener("DOMContentLoaded", function () {
  const langToggle = document.getElementById("langToggle1");
  const path = window.location.pathname;

  // تحديد اللغة الحالية من الرابط
  const currentLang = path.includes("/en/") ? "en" : "ar";
  const newLang = currentLang === "en" ? "ar" : "en";

  // تحديث نص الكبسة
  langToggle.textContent = currentLang === "en" ? "العربية" : "English";

  langToggle.addEventListener("click", () => {
    // تحويل المسار للغة الجديدة
    const newPath = path.replace(`/${currentLang}/`, `/${newLang}/`);
    window.location.href = newPath;
  });
});
