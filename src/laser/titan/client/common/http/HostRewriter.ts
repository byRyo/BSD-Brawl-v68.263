// @ts-nocheck
const { InitState } = require("../../../../client/game/state/InitState"),
  { NativeDialog } = require("../../native/NativeDialog"),
  { Breadcrumbs } = require("../../../../../suitcase/debug/Breadcrumbs");
class HostRewriter {
  static rewrite(url) {
    this.maybeBreadcrumbGameAssets(url);
    for (const rule of this.rules)
      if (url.includes(rule.from) && (!rule.conditional || rule.conditional())) {
        if (rule.showReserveDialog) this.showReserveDialogOnce();
        return url.replace(rule.from, rule.to);
      }
    return null;
  }
  static maybeBreadcrumbGameAssets(url) {
    if (url.includes("game-assets.brawlstarsgame.com"))
      Breadcrumbs.push(
        `gameAssets: useHost=${InitState.useGameAssetsToHost} url=${url.substring(0, 60)}`,
      );
  }
  static showReserveDialogOnce() {
    if (!this.reserveDialogShown) {
      this.reserveDialogShown = true;
      NativeDialog.show("Info", "Using reserve host\nИспользуем резервный хост", "OK");
    }
  }
}
HostRewriter.reserveDialogShown = false;
HostRewriter.rules = [
  {
    from: "game-assets.brawlstarsgame.com",
    to: "game-assets.meowfox.net",
    conditional: () => InitState.useGameAssetsToHost,
    showReserveDialog: true,
  },
  { from: "event-assets.brawlstars.com", to: "event-assets.meowfox.net" },
  { from: "brawlstars.inbox.supercell.com", to: "inbox.bsd.meowfox.net" },
  { from: "inventory.mtech.supercell.com", to: "inventory.bsd.meowfox.net" },
];
module.exports = { HostRewriter };
