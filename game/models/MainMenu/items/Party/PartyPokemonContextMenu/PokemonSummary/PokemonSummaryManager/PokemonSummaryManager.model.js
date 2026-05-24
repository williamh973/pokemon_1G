import { PokemonSummaryFirst } from "./PokemonSummaryFirst.model.js";
import { PokemonSummarySecond } from "./PokemonSummarySecond.model.js";

export class PokemonSummaryManager {
  constructor(game, pokemon, onClose) {
    this.pageIndex = 0;
    this.onClose = onClose;

    this.pages = [
      new PokemonSummaryFirst(game, pokemon),
      new PokemonSummarySecond(game, pokemon),
    ];
    this.activePage = this.pages[this.pageIndex];
    this.hasFocus = false;
  }

  open() {
    this.activePage.open();
    this.hasFocus = true;
  }

  close() {
    this.pages.forEach((page) => (page.isOpen = false));
    this.hasFocus = false;

    this.pageIndex = 0;
    this.activePage = this.pages[0];

    this.onClose?.();
  }

  nextPage() {
    this.activePage.isOpen = false;

    this.pageIndex++;

    if (this.pageIndex >= this.pages.length) this.pageIndex = 0;

    this.activePage = this.pages[this.pageIndex];
    this.activePage.open();
  }

  update(context, action) {
    this.activePage?.update(context, action);

    if (this.activePage?.HPbar && this.activePage?.expBar) {
      this.activePage?.HPbar?.update(context);
      this.activePage?.expBar?.update(context);
    }

    if (!this.hasFocus) return;

    switch (action) {
      case "ACTION":
        this.nextPage();
        break;
      case "ESCAPE":
        this.close();
        break;
      default:
        break;
    }
  }
}
