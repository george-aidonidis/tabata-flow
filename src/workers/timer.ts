// A simple web worker that acts as a timer.
// It sends a 'tick' message every second.

let timer: number | undefined;

self.onmessage = (e) => {
  if (e.data === "start") {
    timer = setInterval(() => {
      self.postMessage("tick");
    }, 1000);
  } else if (e.data === "stop") {
    clearInterval(timer);
    timer = undefined;
  }
};
