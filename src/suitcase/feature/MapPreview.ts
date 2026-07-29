// @ts-nocheck
const { LogicDataTables } = require("../../laser/client/logic/data/LogicDataTables");
const { LogicPlayerMap } = require("../../laser/client/logic/home/LogicPlayerMap");
const { LogicArrayList } = require("../../laser/client/logic/data/LogicArrayList");
const {
  MapPreviewMessage,
} = require("../../laser/client/game/network/messaging/message/MapPreviewMessage");
const { PlayerMapManager } = require("../../laser/client/game/network/PlayerMapManager");
const { MapEditorMode } = require("../../laser/client/game/state/MapEditorMode");
const { MapEditorScreen } = require("../../laser/client/game/screen/MapEditorScreen");
const { GUI } = require("../../laser/client/game/gui/GUI");
const { HomeMode } = require("../../laser/client/game/state/homemode/HomeMode");
const { StringTable } = require("../../laser/client/game/text/StringTable");
let pendingPreview = null;
class MapPreview {
  static patch() {
    Interceptor.attach(MapEditorScreen.enterAddr, {
      onEnter() {
        MapPreview.onMapEditorScreenEnter();
      },
    });
  }
  static show() {
    const error = this.tryShow();
    if (error !== null) GUI.showFloaterTextAtDefaultPosition(`MAP_PREVIEW: ${error}`);
  }
  static tryShow() {
    const location = this.resolveSelectedLocation();
    if (location === null) return "no selected event has a location to preview";
    const locationName = StringTable.getString(location.getTID()) || location.getName();
    pendingPreview = {
      location: location.instance,
      gameModeVariation: location.gameModeVariation.getVariation(),
      locationName,
    };
    const message = new MapPreviewMessage();
    message.setLocation(location);
    PlayerMapManager.handleMapPreview(message);
    GUI.showFloaterTextAtDefaultPosition(locationName);
    return null;
  }
  static resolveSelectedLocation() {
    return HomeMode.getSelectedEventSlot()?.getLocation() ?? null;
  }
  static onMapEditorScreenEnter() {
    const preview = pendingPreview;
    pendingPreview = null;
    if (!preview) return;
    const editor = MapEditorMode.getLogicEditor();
    if (!editor.isNull()) {
      editor.setGameModeVariation(preview.gameModeVariation);
      this.swapInFakePlayerMap(editor, preview);
    }
  }
  static swapInFakePlayerMap(editor, preview) {
    editor.initMapPreview();
    const tileMap = editor.getTileMap();
    const fake = this.buildFakePlayerMap(
      preview.gameModeVariation,
      this.pickFirstPlayerMapEnvironment(),
      preview.locationName,
    );
    fake.save(tileMap, editor.instance);
    editor.setPlayerMapsList(new LogicArrayList(1).addElement(fake.instance));
    editor.clearPreviewFlag();
  }
  static buildFakePlayerMap(variation, environment, name) {
    const map = new LogicPlayerMap();
    map.setName(name);
    map.setGameModeVariation(variation);
    map.setEnvironment(environment);
    return map;
  }
  static pickFirstPlayerMapEnvironment() {
    return (
      LogicDataTables.getTable(LogicDataTables.table.PlayerMapEnvironments).getItemAt(0)
        ?.instance ?? NULL
    );
  }
}
exports.MapPreview = MapPreview;
