// main.js

// 1. Chat Widget Logic
const chatToggle = document.getElementById("chatToggle");
const chatWidget = document.getElementById("chatWidget");

if (chatToggle && chatWidget) {
  chatToggle.addEventListener("click", () => {
    const isHidden = getComputedStyle(chatWidget).display === "none";

    if (isHidden) {
      chatWidget.style.display = "block";
      // Simple entrance animation
      chatWidget.style.opacity = "0";
      chatWidget.style.transform = "translateY(10px)";
      requestAnimationFrame(() => {
        chatWidget.style.transition = "all 0.3s ease";
        chatWidget.style.opacity = "1";
        chatWidget.style.transform = "translateY(0)";
      });
    } else {
      chatWidget.style.display = "none";
    }

    // Toggle Icon
    chatToggle.textContent = isHidden ? "×" : "?";
  });
}

// 2. Smooth Scroll Reveal (Intersection Observer)
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.15, // Trigger when 15% visible
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Add the class to animate in
      entry.target.classList.add("visible");

      // STOP observing. This keeps the element visible and prevents flickering.
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Select elements to animate
const animatedElements = document.querySelectorAll(
  ".fade-in-up, .stagger-item, .glass-card, .stat-card"
);

// Add base class and observe
animatedElements.forEach((el) => {
  el.classList.add("fade-in-up"); // Ensure base state is set
  observer.observe(el);
});
