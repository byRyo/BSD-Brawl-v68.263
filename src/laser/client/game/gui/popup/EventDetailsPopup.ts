// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const {
  LocationThemeSelectorPopup,
} = require("../../../../../suitcase/feature/LocationThemeSelector");
const { DropGUIContainer } = require("../../../../titan/client/common/flash/DropGUIContainer");
const { LocationInfo } = require("../../screen/home/events/LocationInfo");
const { GUI } = require("../GUI");
const { RANKED_POPUP_TYPE } = require("./RankedSeasonEndPopup");

class EventDetailsPopup {
  static EventDetailsPopup_init = new NativeFunction(Libg.offset(7339380, 7144020), "void", [
    "pointer",
    "pointer",
    "pointer",
    "pointer",
  ]);
  static locationInfo;

  static patch() {
    Interceptor.replace(
      this.EventDetailsPopup_init,
      new NativeCallback(
        (instance, location, a, b) => {
          EventDetailsPopup.EventDetailsPopup_init(instance, location, a, b);
          const rankedPopupMissing = GUI.getPopupByType(RANKED_POPUP_TYPE).isNull();
          if (!location.readPointer().isNull() && rankedPopupMissing) {
            const button = new DropGUIContainer(instance).addGameButton("tab_modifiers", 1);
            const clip = button.getMovieClip();
            clip.visibility = true;
            clip.gotoAndStopFrameIndex(0);
            button.setCustomButtonListener((_button, _event) => {
              const popup = new LocationThemeSelectorPopup(EventDetailsPopup.locationInfo);
              GUI.showPopup(popup, true, true, false);
            }, "event_details_popup_2");
            EventDetailsPopup.locationInfo = new LocationInfo(location);
          }
        },
        "void",
        ["pointer", "pointer", "pointer", "pointer"],
      ),
    );
  }
}

module.exports = { EventDetailsPopup };
