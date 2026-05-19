const totalCards = 28;
const track = document.getElementById("track");
const progressFill = document.getElementById("pf");
const counter = document.getElementById("cnt");
const prevButton = document.getElementById("bp");
const nextButton = document.getElementById("bn");
const dotsContainer = document.getElementById("dots");
const deck = document.getElementById("deck");

let current = 0;
let startX = 0;
let dragDistance = 0;
let dragging = false;

function updateCarousel() {
  track.style.transition = "transform 0.38s cubic-bezier(.4,0,.2,1)";
  track.style.transform = `translateX(-${current * 100}%)`;
  progressFill.style.width = `${((current + 1) / totalCards) * 100}%`;
  counter.textContent = `${current + 1} / ${totalCards}`;
  prevButton.classList.toggle("off", current === 0);
  nextButton.classList.toggle("off", current === totalCards - 1);

  document.querySelectorAll(".ndot").forEach((dot, index) => {
    dot.classList.toggle("on", index === current);
  });
}

function go(step) {
  const next = current + step;
  if (next >= 0 && next < totalCards) {
    current = next;
    updateCarousel();
  }
}

function jumpTo(index) {
  current = index;
  updateCarousel();
}

for (let index = 0; index < totalCards; index += 1) {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.className = `ndot${index === 0 ? " on" : ""}`;
  dot.setAttribute("aria-label", `Ir para slide ${index + 1}`);
  dot.addEventListener("click", () => jumpTo(index));
  dotsContainer.appendChild(dot);
}

prevButton.addEventListener("click", () => go(-1));
nextButton.addEventListener("click", () => go(1));

deck.addEventListener("touchstart", (event) => {
  startX = event.touches[0].clientX;
  dragging = true;
  track.style.transition = "none";
}, { passive: true });

deck.addEventListener("touchmove", (event) => {
  if (!dragging) {
    return;
  }

  dragDistance = event.touches[0].clientX - startX;
  track.style.transform = `translateX(calc(-${current * 100}% + ${dragDistance}px))`;
}, { passive: true });

deck.addEventListener("touchend", () => {
  dragging = false;
  const threshold = window.innerWidth * 0.25;

  if (dragDistance < -threshold && current < totalCards - 1) {
    current += 1;
  } else if (dragDistance > threshold && current > 0) {
    current -= 1;
  }

  dragDistance = 0;
  updateCarousel();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    go(1);
  }

  if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    go(-1);
  }
});

updateCarousel();
