import { PokemonSummaryInfos } from "./PokemonSummaryInfos.model.js";
import { PokemonSummaryMoves } from "./PokemonSummaryMoves.model.js";
import { PokemonSummaryStats } from "./PokemonSummaryStats.model.js";

export class PokemonSummaryManager {
  constructor(game, pokemon, onClose) {
    this.pageIndex = 0;
    this.onClose = onClose;

    this.pages = [
      new PokemonSummaryInfos(game, pokemon),
      new PokemonSummaryStats(game, pokemon),
      new PokemonSummaryMoves(game, pokemon),
    ];
    this.activePage = this.pages[this.pageIndex];
    this.hasFocus = false;
  }

  open() {
    this.activePage.open();
    this.hasFocus = true;
  }

  close() {
    this.pages.forEach((page) => {
      page.isOpen = false;
      page.hasFocus = false;
    });

    this.hasFocus = false;

    this.pageIndex = 0;
    this.activePage = this.pages[0];

    this.onClose?.();
  }

  nextPage(action) {
    this.activePage.isOpen = false;

    if (action === "RIGHT") this.pageIndex++;
    else this.pageIndex--;

    if (action === "LEFT" && this.pageIndex < 0)
      this.pageIndex = this.pages.length - 1;

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
      case "RIGHT":
        this.nextPage("RIGHT");
        break;
      case "LEFT":
        this.nextPage("LEFT");
        break;
      case "ACTION":
        break;
      case "CANCEL":
        this.close();
        break;
      default:
        break;
    }
  }
}
