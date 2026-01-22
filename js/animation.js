
lottie.loadAnimation({
  container: document.getElementById('lottie-bg'),
  renderer: 'svg',       // 'svg' is most common
  loop: false,            // no loop
  autoplay: true,        // start automatically
  path: './animation/forest.json',  // path to Lottie JSON
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice' // this makes it cover entire container
  }
});