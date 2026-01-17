const screens = document.querySelectorAll(".screen");

export function showScreen(screenId) {
  screens.forEach(screen => {
    screen.classList.add("hidden");
  });

  document.getElementById(screenId).classList.remove("hidden");
}