function updateText(element) {
  // Select the tooltip element within the hovered circle
  const tooltip = element.querySelector(".tooltip");

  // If a tooltip exists, update the target paragraph text with its content
  if (tooltip) {
    document.getElementById("there_should_be_text").textContent =
      tooltip.textContent.trim();
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible"); // Adds the class when in view
        }
      });
    },
    { threshold: 0.2 }
  ); // Trigger when 20% of the element is visible

  const container = document.querySelector(".container_story");
  observer.observe(container);
});
