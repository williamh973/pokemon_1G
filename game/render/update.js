import { keys } from "../logic/gameplay/player/keyboard.js";

const dialogBox = (game) => {
  if (game.dialogBox?.isOpen) {
    game.dialogBox.update(game.canvas.context);

    if (keys.action) game.dialogBox.nextPage();
    keys.action = false; // on garde
  }
};

const handleOpenClose = (game) => {
  if (keys.menu) {
    game.toggleMenu();
    keys.menu = false;
  }
};

const handleIndex = (menu) => {
  if (menu.isOpen && keys.up && menu.currentIndex > 0) {
    menu.currentIndex--;
    keys.up = false;
  }
  if (menu.isOpen && keys.down && menu.currentIndex < menu.items.length - 1) {
    menu.currentIndex++;
    keys.down = false;
  }
};

const handleItems = (menu) => {
  if (menu.isOpen && keys.action) {
    menu.openItem();
    keys.action = false;
  }
};

const menu = (game) => {
  const menu = game.menu;
  if (menu.isOpen) menu.update(game.canvas.context);

  handleOpenClose(game);
  handleIndex(menu);
  handleItems(menu);
};

const pokedex = (game) => {
  const currentScreen = game.currentScreen;
  if (currentScreen?.name !== "POKEDEX") return;

  const pokedex = currentScreen;
  const pokemonList = pokedex?.pokemonList;
  if (pokedex) {
    pokedex.update(game.canvas.context);
    pokemonList.update(game.canvas.context);
  }

  if (keys.up && pokemonList.currentIndex > 0) {
    pokemonList.currentIndex--;
    keys.up = false;
  }

  if (
    keys.down &&
    pokemonList.currentIndex < pokemonList.databases.length - 1
  ) {
    console.log(pokemonList.currentIndex);
    pokemonList.currentIndex++;
    keys.down = false;
  }
};

export const update = (game) => {
  game.player.update(game.canvas);
  game.tileManager.update();

  dialogBox(game);
  menu(game);
  pokedex(game);

  game.transition.update();
};
