export const keys = {
  left: false,
  right: false,
  up: false,
  down: false,
  action: false,
  menu: false,
  escape: false,
};

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "q":
      keys.left = true;
      break;
    case "d":
      keys.right = true;
      break;
    case "z":
      keys.up = true;
      break;
    case "s":
      keys.down = true;
      break;
    case "a":
      keys.action = true;
      break;
    case "c":
      keys.menu = true;
      break;
    case "e":
      keys.escape = true;
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "q":
      keys.left = false;
      break;
    case "d":
      keys.right = false;
      break;
    case "z":
      keys.up = false;
      break;
    case "s":
      keys.down = false;
      break;
    case "a":
      keys.action = false;
      break;
    case "c":
      keys.menu = false;
      break;
    case "e":
      keys.escape = false;
      break;
  }
});
