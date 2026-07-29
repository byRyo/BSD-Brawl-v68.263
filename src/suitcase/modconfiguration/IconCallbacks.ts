// @ts-nocheck
const { StringTable } = require("../../laser/client/game/text/StringTable");
const { ColorTransform } = require("../../laser/titan/client/common/flash/ColorTransform");
const { MovieClipHelper } = require("../../laser/titan/client/common/flash/MovieClipHelper");
const { Sprite } = require("../../laser/titan/client/common/flash/Sprite");
const { TeammateHpIndicator } = require("../feature/TeammateHpIndicator");
const { LogicRandom } = require("../logic/LogicRandom");
const { GameMain } = require("../../laser/client/GameMain");

const randomPinFrames = {
  emoji_colette: 159,
  emoji_piper: 72,
  emoji_bea: 109,
  emoji_bibi: 109,
  emoji_crow: 99,
};

const friendItemChildren = [
  "hidden_hero",
  "icon_roomleader",
  "invite_player",
  "invite_pending",
  "player_dot",
  "swap_hilite",
  "slot_off_indicator",
  "button_slot_switch",
  "temp_brawler_mode",
];

const friendItemLoadoutChildren = [
  "star_power_ph",
  "item_ph",
  "gear1_ph",
  "gear2_ph",
  "overcharge_ph",
];

function VisualChromaticNamePinCallback() {
  return StringTable.getMovieClip("sc/ui.sc", "icon_resource_chromatic_coin");
}

function DisablePinAnimationCallback() {
  const sprite = new Sprite(true);
  const grin = StringTable.getMovieClip("sc/emoji_1.sc", "emoji_grin");
  const stop = StringTable.getMovieClip("sc/emoji_1.sc", "emoji_stop");
  stop.gotoAndStopFrameIndex(209);
  stop.scale = 0.65;
  stop.x = grin.width / 3;
  stop.y = grin.height / 3.3;
  sprite.addChild(grin);
  sprite.addChild(stop);
  return sprite;
}

function SharedBackgroundCallback() {
  return StringTable.getMovieClip("sc/ui.sc", "icon_skins_city");
}

function RandomThemesCallback() {
  const sprite = new Sprite(true);
  const background = VisualChromaticNamePinCallback();
  const random = StringTable.getMovieClip("sc/ui.sc", "event_icon_random").getChildById(1);
  random.x = background.width / 3;
  random.y = background.height / 3.5;
  random.scale = 0.7;
  sprite.addChild(background);
  sprite.addChild(random);
  return sprite;
}

function RandomThemesAfterBattleCallback() {
  const sprite = new Sprite(true);
  const background = VisualChromaticNamePinCallback();
  const random = StringTable.getMovieClip("sc/ui.sc", "event_icon_random").getChildById(1);
  const theme = StringTable.getMovieClip("sc/ui.sc", "icon_skins_outlaws");
  random.x = background.width / 3;
  random.y = background.height / 3.5;
  random.scale = 0.7;
  theme.x = -random.x;
  theme.y = -random.y;
  theme.scale = 0.7;
  sprite.addChild(background);
  sprite.addChild(random);
  sprite.addChild(theme);
  return sprite;
}

function RandomThemesMusicIndependencyCallback() {
  const sprite = new Sprite(true);
  const background = VisualChromaticNamePinCallback();
  const random = StringTable.getMovieClip("sc/ui.sc", "event_icon_random").getChildById(1);
  const music = StringTable.getMovieClip("sc/ui.sc", "icon_skins_music");
  random.x = background.width / 3;
  random.y = background.height / 3.5;
  random.scale = 0.7;
  music.x = -random.x;
  music.y = -random.y;
  music.scale = 0.7;
  sprite.addChild(background);
  sprite.addChild(random);
  sprite.addChild(music);
  return sprite;
}

function ShowFPSCounterCallback() {
  const sprite = new Sprite(true);
  const text = ShowOwnPlayerCoordinatesText();
  text.fontSize = 12;
  text.text = "FPS: 120";
  text.x = -18.5;
  text.y = -5.5;
  sprite.addChild(text);
  sprite.scale = 1.65;
  return sprite;
}

function HideHomeScreenTextCallback() {
  const sprite = new Sprite(true);
  const text = ShowOwnPlayerCoordinatesText();
  const [x, y] = [-29, -56];
  text.fontSize = 96;
  text.text = "A";
  text.x = x;
  text.y = y;
  const denied = StringTable.getMovieClip("sc/sprays_1.sc", "spray_denied");
  denied.visibility = true;
  denied.setXY(text.textWidth / 2 + x, text.textHeight / 2 + y);
  denied.scale = 1.1;
  sprite.addChild(text);
  sprite.addChild(denied);
  sprite.scale = 1.2;
  return sprite;
}

function EnforceOldFriendsListCallback() {
  const icon = StringTable.getMovieClip("sc/ui.sc", "mainscreen_hud_right")
    .getChildByName("button_navi_friends")
    .getChildById(1);
  icon.scale = 1.25;
  return icon;
}

function ShowSkinNamesInProfileCallback() {
  const icon = StringTable.getMovieClip("sc/ui.sc", "mainscreen_center")
    .getChildByName("player_1_area")
    .getChildByName("button_skin_selector")
    .getChildByName("icon_skin_selector");
  icon.gotoAndStopFrameIndex(1);
  icon.scale = 1.25;
  return icon;
}

function BattleTextChatCallback() {
  const button = StringTable.getMovieClip("sc/ui.sc", "team_chat_footer").getChildByName(
    "chat_button",
  );
  const icon = StringTable.getMovieClip("sc/ui.sc", "icon_skins_outlaws");
  button.scale = 1;
  icon.x = button.width / 3;
  icon.y = button.height / 3.5;
  icon.scale = 0.37;
  button.addChild(icon);
  return button;
}

function ShowEnemyAmmoStatusCallback() {
  const sprite = new Sprite(true);
  const ammo = StringTable.getMovieClip("sc/ui.sc", "enemy_info_badge").getChildByName(
    "reload_own",
  );
  const angry = StringTable.getMovieClip("sc/emoji_1.sc", "emoji_shelly_angry");
  angry.y = 20;
  angry.scale = 1.8;
  ammo.visibility = true;
  ammo.y = -40;
  ammo.scale = 1.1;
  for (let i = 1; i <= 3; i++) {
    const attack = ammo.getChildByName("attack_" + i);
    if (i === 1) {
      attack.gotoAndStopFrameIndex(38);
    } else {
      attack.gotoAndStopFrameIndex(0);
      attack.getChildById(1).visibility = false;
    }
  }
  angry.gotoAndStopFrameIndex(99);
  sprite.addChild(angry);
  sprite.addChild(ammo);
  return sprite;
}

function ShowTrophiesAboveHeadCallback() {
  const sprite = new Sprite(true);
  const trophy = StringTable.getMovieClip("sc/ui.sc", "icon_trophy");
  const popover = StringTable.getMovieClip("sc/ui.sc", "popover_text_left");
  const gunner = randomCharacterPin();
  const text = popover.getTextFieldByName("text");
  text.color = 4294956800;
  text.fontOutline = true;
  text.text = "50000 | 1000";
  text.fontSize = 28;
  text.x += -55;
  text.y = -90;
  trophy.x = -90;
  trophy.y = -75;
  trophy.scale = 0.35;
  gunner.scale = 3;
  gunner.y = 25;
  sprite.addChild(trophy);
  sprite.addChild(gunner);
  sprite.addChild(text);
  return sprite;
}

function ShowCameraButtonCallback() {
  const icon = StringTable.getMovieClip("sc/ui_achievements.sc", "icon_resource_records_point");
  icon.scale = 1.25;
  icon.x -= 15;
  return icon;
}

function randomCharacterPin() {
  const names = Object.keys(randomPinFrames);
  const name = names[LogicRandom.random(0, names.length - 1)];
  const frame = randomPinFrames[name];
  const pin = StringTable.getMovieClip("sc/emoji_1.sc", name);
  pin.gotoAndStopFrameIndex(frame);
  if (name === "emoji_bibi" || name === "emoji_crow") {
    pin.getChildById(1).gotoAndStopFrameIndex(frame);
  }
  return pin;
}

function HideUltiAimingCallback() {
  const stick = StringTable.getMovieClip("sc/ui.sc", "ulti_stick");
  const child = stick.getChildById(1);
  stick.gotoAndStopFrameIndex(0);
  child.gotoAndStopFrameIndex(0);
  return stick;
}

function ShowFastPlayAgainButtonCallback() {
  return StringTable.getMovieClip("sc/ui.sc", "icon_quest_play_again");
}

function ShowAutoPlayAgainRadioButtonCallback() {
  const icon = ShowFastPlayAgainButtonCallback();
  const button = StringTable.getMovieClip(
    "sc/ui.sc",
    "edit_controls_ui_screen_hud_top",
  ).getChildByName("locked_movement_controls_button");
  if (button) {
    button.x = icon.width / 3;
    button.y = icon.height / 3.5;
    const state = button.getChildByName("state");
    if (state) state.gotoAndStopFrameIndex(0);
    icon.addChild(button);
  }
  return icon;
}

function HideBattleBlackBarsCallback() {
  const icon = StringTable.getMovieClip("sc/ui.sc", "ingame_hud_top")
    .getChildByName("spectate_count")
    .getChildById(1);
  icon.scale = 1;
  return icon;
}

function BattleEndInstantExitCallback() {
  const sprite = new Sprite(true);
  const home = StringTable.getMovieClip("sc/ui.sc", "screen_header")
    .getChildByName("button_home")
    .getChildById(1);
  home.x = 0;
  home.y = 0;
  home.scale = 0.4;
  const speed = StringTable.getMovieClip("sc/ui.sc", "icon_gear_speed").getChildById(2);
  speed.colorTransform.c1r = 255;
  speed.colorTransform.c2r = 255;
  speed.colorTransform.c1g = 255;
  speed.colorTransform.c2g = 255;
  speed.x = home.width / 3;
  speed.y = home.height / 3.3;
  speed.scale = 0.21;
  sprite.addChild(home);
  sprite.addChild(speed);
  return sprite;
}

function BackgroundMatchmakingCallback() {
  return StringTable.getMovieClip("sc/ui.sc", "matchmaking_popup").getChildByName("loop");
}

function AntiAfkKickCallback() {
  const sprite = new Sprite(true);
  const sandy = StringTable.getMovieClip("sc/emoji_1.sc", "emoji_sandy");
  const shield = StringTable.getMovieClip("sc/ui.sc", "icon_gear_shield").getChildById(2);
  sandy.gotoAndStopFrameIndex(223);
  shield.colorTransform.c1g = 255;
  shield.colorTransform.alpha = 127;
  shield.x = sandy.width / 3;
  shield.y = sandy.height / 3.3;
  shield.scale = 0.5;
  sprite.addChild(sandy);
  sprite.addChild(shield);
  return sprite;
}

function ColoredDamageCallback() {
  return StringTable.getMovieClip("sc/ui.sc", "icon_club_quest_damage");
}

function DoNotShowBattleHighlightCallback() {
  const sprite = new Sprite(true);
  const watch = StringTable.getMovieClip("sc/ui.sc", "chat_entry_replay_others")
    .getChildByName("watch_button")
    .getChildById(1);
  watch.x = 0;
  watch.y = 0;
  const speed = StringTable.getMovieClip("sc/ui.sc", "icon_gear_speed").getChildById(2);
  speed.colorTransform.c1r = 255;
  speed.colorTransform.c2r = 255;
  speed.colorTransform.c1g = 255;
  speed.colorTransform.c2g = 255;
  speed.x = watch.width / 3;
  speed.y = watch.height / 3.3;
  speed.scale = 0.33;
  sprite.addChild(watch);
  sprite.addChild(speed);
  return sprite;
}

function ShowBattleConnectionIndicatorCallback() {
  const sprite = new Sprite(true);
  const indicator = StringTable.getMovieClip("sc/ui.sc", "ingame_hud_top").getChildByName(
    "connection_indicator",
  );
  if (indicator) {
    indicator.gotoAndStopFrameIndex(5);
    indicator.x = 0;
    indicator.y = 0;
    sprite.addChild(indicator);
    sprite.scale = 1.85;
    return sprite;
  }
  return sprite;
}

function ShowOwnPlayerCoordinatesText() {
  const text = StringTable.getMovieClip("sc/ui.sc", "popover_text_left").getTextFieldByName("text");
  text.color = 4294967295;
  text.fontOutline = true;
  return text;
}

function ShowOwnPlayerCoordinatesCallback() {
  const sprite = new Sprite(true);
  const x = ShowOwnPlayerCoordinatesText();
  x.fontSize = 12;
  x.text = "X: 10";
  const y = ShowOwnPlayerCoordinatesText();
  y.fontSize = 12;
  y.text = "Y: 15";
  x.x = -12;
  x.y = -12;
  y.x = -11;
  y.y = 0;
  sprite.addChild(x);
  sprite.addChild(y);
  return sprite;
}

function ShowCharactersInNamesCallback() {
  const sprite = new Sprite(true);
  const popover = StringTable.getMovieClip("sc/ui.sc", "popover_text_left");
  const colt = StringTable.getMovieClip("sc/emoji_1.sc", "emoji_colt");
  colt.getChildById(1).gotoAndStopFrameIndex(99);
  const text = popover.getTextFieldByName("text");
  text.color = 4294967295;
  text.fontOutline = true;
  text.text = "... (".concat(StringTable.getString("TID_GUNSLINGER"), ")");
  text.fontSize = 30;
  text.x += -55;
  text.y = -90;
  colt.scale = 3;
  colt.y = 25;
  sprite.addChild(colt);
  sprite.addChild(text);
  return sprite;
}

function ShamePlayersWithThumbsdownPinCallback() {
  const pin = StringTable.getMovieClip("sc/emoji_1.sc", "emoji_thumbsdown");
  pin.gotoAndStopFrameIndex(109);
  return pin;
}

function ShowFriendsInBattleCallback() {
  const icon = StringTable.getMovieClip("sc/ui.sc", "mainscreen_hud_right")
    .getChildByName("button_navi_friends")
    .getChildById(1);
  icon.scale = 1.33;
  return icon;
}

function ShowAllianceMembersInBattleCallback() {
  const icon = StringTable.getMovieClip("sc/ui.sc", "mainscreen_hud_right")
    .getChildByName("button_navi_clan")
    .getChildById(1);
  icon.scale = 1.33;
  return icon;
}

function UseBattleProxyCallback() {
  const sprite = new Sprite(true);
  const outlaws = StringTable.getMovieClip("sc/ui.sc", "icon_skins_outlaws");
  const connection = StringTable.getMovieClip("sc/ui.sc", "bad_conection_icon");
  connection.gotoAndStopFrameIndex(0);
  const denied = StringTable.getMovieClip("sc/sprays_1.sc", "spray_denied");
  denied.visibility = true;
  denied.setXY(0, 0);
  denied.scale = 1.1;
  outlaws.x = connection.width / 3.6;
  outlaws.y = connection.height / 3.3;
  outlaws.scale = 0.6;
  sprite.addChild(connection);
  sprite.addChild(outlaws);
  sprite.addChild(denied);
  return sprite;
}

function DisableShakeCallback() {
  const sprite = new Sprite(true);
  const ball = StringTable.getMovieClip("sc/emoji_1.sc", "emoji_cartoon_ball").getChildById(1);
  ball.gotoAndStopFrameIndex(180);
  const denied = StringTable.getMovieClip("sc/sprays_1.sc", "spray_denied");
  denied.visibility = true;
  denied.setXY(0, 0);
  denied.scale = 0.75;
  sprite.addChild(ball);
  sprite.addChild(denied);
  return sprite;
}

function ExtendedTrajectoryCallback() {
  return StringTable.getMovieClip("sc/ui.sc", "event_icon_brawlball");
}

function coloredRectangle(scaleX, scaleY) {
  const rectangle = StringTable.getMovieClip("sc/ui.sc", "map_editor_ui_darkening");
  rectangle.visibility = true;
  rectangle.colorTransform.r = 66;
  rectangle.colorTransform.g = 215;
  rectangle.colorTransform.b = 115;
  rectangle.scaleX = scaleX;
  rectangle.scaleY = scaleY;
  return rectangle;
}

function HitboxRendererCallback() {
  const sprite = new Sprite(true);
  const ball = ExtendedTrajectoryCallback();
  const width = ball.width / 100;
  const height = ball.height / 100;
  const top = coloredRectangle(width, 0.03);
  top.x = 0;
  top.y = -ball.height / 2;
  const bottom = coloredRectangle(width, 0.03);
  bottom.x = 0;
  bottom.y = ball.height / 2;
  const left = coloredRectangle(0.03, height);
  left.x = -ball.width / 2 + 1;
  left.y = 0;
  const right = coloredRectangle(0.03, height);
  right.x = ball.height / 2 - 1;
  right.y = 0;
  sprite.addChild(top);
  sprite.addChild(bottom);
  sprite.addChild(left);
  sprite.addChild(right);
  sprite.addChild(ball);
  return sprite;
}

function selectPinFrame(pin, frame) {
  let target = pin.getChildById(1);
  if (target.totalFramesAmount < 2) target = pin;
  target.gotoAndStopFrameIndex(frame);
  return target;
}

function EnemyTracerCallback() {
  const sprite = new Sprite(true);
  const left = selectPinFrame(StringTable.getMovieClip("sc/emoji_1.sc", "emoji_lilt"), 132);
  const right = selectPinFrame(StringTable.getMovieClip("sc/emoji_65.sc", "emoji_glowbert"), 167);
  right.x = right.width / 2.5;
  right.scale = 0.2;
  left.x = -left.width / 2.5;
  left.scale = 0.2;
  const dx = right.x - left.x;
  const dy = right.y - left.y;
  const tracer = coloredRectangle(Math.sqrt(dx * dx + dy * dy) / 100, 0.03);
  tracer.colorTransform.r = 255;
  tracer.colorTransform.g = 0;
  tracer.colorTransform.b = 0;
  sprite.addChild(tracer);
  sprite.addChild(left);
  sprite.addChild(right);
  sprite.scale = 1.8;
  return sprite;
}

function AttackRangeIndicatorCallback() {
  const sprite = new Sprite(true);
  const circle = StringTable.getMovieClip("sc/ui.sc", "player_info_badge_btm").getChildByName(
    "player_circle",
  );
  const ball = ExtendedTrajectoryCallback();
  ball.scale = 0.9;
  sprite.addChild(circle);
  sprite.addChild(ball);
  return sprite;
}

function HighlightLeonCloneCallback() {
  const sprite = new Sprite(true);
  const leon = StringTable.getMovieClip("sc/emoji_1.sc", "emoji_leon").getChildById(1);
  leon.gotoAndStopFrameIndex(99);
  leon.scale = 1.5;
  sprite.addChild(leon);
  const ulti = StringTable.getMovieClip("sc/ui.sc", "item_base_stick").getChildByName(
    "button_ulti",
  );
  ulti.gotoAndStopFrameIndex(25);
  ulti.visibility = true;
  MovieClipHelper.replaceChildWithMovieClip(ulti, "icon_ph", "sc/ui.sc", "icon_item_leon_1");
  ulti.x = leon.width / 3;
  ulti.y = leon.height / 3.2;
  ulti.scale = 1.4;
  sprite.addChild(ulti);
  return sprite;
}

function EnforceBattleChatButtonCallback() {
  const cooldown = StringTable.getMovieClip("sc/ui.sc", "emote_button").getChildByName("cooldown");
  cooldown.gotoAndStopFrameIndex(99);
  return cooldown;
}

function ShowDPSCallback() {
  const sprite = new Sprite(true);
  const text = ShowOwnPlayerCoordinatesText();
  text.fontSize = 12;
  text.text = "DPS: 1536";
  text.x = -22.5;
  text.y = -5.5;
  sprite.addChild(text);
  sprite.scale = 1.65;
  return sprite;
}

function AllyRespawnTimerCallback() {
  const sprite = new Sprite(true);
  const shocked = StringTable.getMovieClip("sc/emoji_1.sc", "emoji_shocked");
  shocked.gotoAndStopFrameIndex(0);
  shocked.scale = 3.5;
  shocked.x = shocked.width / 3;
  shocked.y += 6;
  const annoyed = StringTable.getMovieClip("sc/emoji_1.sc", "emoji_annoyed");
  annoyed.gotoAndStopFrameIndex(91);
  annoyed.scale = 3.5;
  annoyed.x = -annoyed.width / 3;
  const clock = StringTable.getMovieClip("sc/emoji_1.sc", "emoji_sandclock").getChildById(1);
  for (let i = 6; i <= 8; i++) clock.getChildById(i).visibility = false;
  clock.gotoAndStopFrameIndex(180);
  clock.scale = 0.6;
  clock.y = clock.height / 2;
  sprite.addChild(shocked);
  sprite.addChild(annoyed);
  sprite.addChild(clock);
  return sprite;
}

function TeammateHPIndicatorCallback() {
  const sprite = new Sprite(true);
  const indicator = StringTable.getMovieClip("sc/ui.sc", "team_indicator");
  indicator.y += 10;
  const [r, g, b] = TeammateHpIndicator.colorForHealthRatio(0.24);
  ColorTransform.setColor(indicator.instance, r, g, b, 255);
  sprite.addChild(indicator);
  return sprite;
}

function LowResGraphicsCallback() {
  const button = StringTable.getMovieClip("sc/ui.sc", "map_editor_remove_button").getChildByName(
    "button",
  );
  button.gotoAndStopFrameIndex(1);
  return button.getChildById(5);
}

function DisableSkinsCallback() {
  const sprite = new Sprite(true);
  const left = selectPinFrame(
    StringTable.getMovieClip("sc/emoji_1.sc", "emoji_shelly_brawloween"),
    160,
  );
  const right = selectPinFrame(StringTable.getMovieClip("sc/emoji_1.sc", "emoji_shelly"), 61);
  const speed = StringTable.getMovieClip("sc/ui.sc", "icon_gear_speed").getChildById(2);
  right.x = right.width / 2.5;
  right.y = right.height / 2.5 + 8.7;
  left.x = -right.width / 2.5;
  left.y = -right.height / 2.5 + 6.7;
  speed.colorTransform.r = 255;
  speed.colorTransform.g = 255;
  speed.colorTransform.b = 255;
  speed.scale = 0.7;
  speed.y += 2;
  sprite.addChild(left);
  sprite.addChild(right);
  sprite.addChild(speed);
  sprite.y += 25;
  return sprite;
}

function DefaultEnvironmentsCallback() {
  const icon = StringTable.getMovieClip("sc/ui.sc", "icon_gear_reload");
  icon.gotoAndStopFrameIndex(1);
  return icon;
}

function FriendListOptimizationCallback() {
  const sprite = new Sprite(true);
  const friend = StringTable.getMovieClip("sc/ui.sc", "mainscreen_hud_right")
    .getChildByName("button_navi_friends")
    .getChildById(1);
  const speed = StringTable.getMovieClip("sc/ui.sc", "icon_gear_speed").getChildById(2);
  friend.scale = 1.25;
  speed.x = friend.width / 3;
  speed.y = friend.height / 4.1;
  speed.scale = 0.9;
  speed.colorTransform.g = 255;
  sprite.addChild(friend);
  sprite.addChild(speed);
  sprite.scale = 1.35;
  return sprite;
}

function BSDProxyCallback() {
  const sprite = new Sprite(true);
  const connection = StringTable.getMovieClip("sc/ui.sc", "bad_conection_icon");
  connection.gotoAndStopFrameIndex(0);
  const denied = StringTable.getMovieClip("sc/sprays_1.sc", "spray_denied");
  denied.visibility = true;
  denied.setXY(0, 0);
  denied.scale = 1.1;
  sprite.addChild(connection);
  sprite.addChild(denied);
  return sprite;
}

function ShowFriendlyRoomOpponentsCallback() {
  const sprite = new Sprite(true);
  const item = StringTable.getMovieClip("sc/ui.sc", "member_item_extrasmall");
  friendItemChildren.forEach((name) => {
    item.getChildByName(name).visibility = false;
  });
  MovieClipHelper.replaceChildWithMovieClip(
    item,
    "image_ph",
    "sc/hero_portraits.sc",
    "hero_icon_shelly_small",
  );
  friendItemLoadoutChildren.forEach((name) => {
    const child = item.getChildByName(name);
    child.getChildByName("sp_ani").visibility = false;
    switch (name) {
      case "star_power_ph":
        MovieClipHelper.replaceChildWithMovieClip(child, "icon_ph", "sc/ui.sc", "icon_sp_shelly_2");
        break;
      case "item_ph":
        MovieClipHelper.replaceChildWithMovieClip(
          child,
          "icon_ph",
          "sc/ui.sc",
          "icon_item_shelly_2",
        );
        break;
      case "gear1_ph":
        MovieClipHelper.replaceChildWithMovieClip(child, "icon_ph", "sc/ui.sc", "icon_gear_damage");
        child.getChildByName("icon_ph").gotoAndStopFrameIndex(1);
        break;
      case "gear2_ph":
        MovieClipHelper.replaceChildWithMovieClip(child, "icon_ph", "sc/ui.sc", "icon_gear_shield");
        child.getChildByName("icon_ph").gotoAndStopFrameIndex(1);
        break;
      case "overcharge_ph":
        MovieClipHelper.replaceChildWithMovieClip(
          child,
          "icon_ph",
          "sc/ui.sc",
          "icon_overcharge_shelly_1",
        );
        child.getChildByName("notification").visibility = false;
        break;
    }
    if (name.includes("gear")) child.getChildByName("bg_gear").gotoAndStopFrameIndex(1);
  });
  const name = item.getTextFieldByName("name_txt");
  if (name) name.setTextScaleIfNecessary(StringTable.getString("TID_RANKED_ENEMY_P1"));
  const status = item.getTextFieldByName("status_txt");
  if (status) status.setTextScaleIfNecessary(StringTable.getString("TID_TEAM_MEMBER_STATUS_READY"));
  item.scale = 1;
  item.y -= 15;
  sprite.addChild(item);
  sprite.scale = 0.88;
  return sprite;
}

function HideBattlingStatusFromOthersCallback() {
  const sprite = new Sprite(true);
  const outlaws = StringTable.getMovieClip("sc/ui.sc", "icon_skins_outlaws");
  const denied = StringTable.getMovieClip("sc/sprays_1.sc", "spray_denied");
  const status = StringTable.getMovieClip("sc/ui.sc", "ingame_hud_top")
    .getChildByName("spectate_count")
    .getChildById(1);
  status.scale = 0.5;
  status.x = outlaws.width / 3;
  status.y = outlaws.height / 3.4;
  denied.visibility = true;
  denied.setXY(0, 0);
  denied.scale = 1.1;
  sprite.addChild(outlaws);
  sprite.addChild(status);
  sprite.addChild(denied);
  return sprite;
}

function InstantStarrDropOpeningCallback() {
  const starr = StringTable.getMovieClip("sc/emoji_1.sc", "emoji_starr");
  starr.getChildById(1).gotoAndStopFrameIndex(210);
  return starr;
}

function LegacyNamesCallback() {
  const rico = StringTable.getMovieClip("sc/emoji_1.sc", "emoji_rico_classic_old");
  rico.getChildById(1).gotoAndStopFrameIndex(160);
  return rico;
}

function ShowDebugMenuButtonCallback() {
  GameMain.loadAsset("sc/debug.sc");
  const sprite = new Sprite(true);
  const button = StringTable.getMovieClip("sc/debug.sc", "debug_button");
  button.setText("txt", "D");
  button.setXY(-30, 25);
  sprite.addChild(button);
  sprite.scale = 1.8;
  return sprite;
}

function RandomLocalizationCallback() {
  const sprite = new Sprite(true);
  const popover = StringTable.getMovieClip("sc/ui.sc", "popover_text_left");
  const random = StringTable.getMovieClip("sc/ui.sc", "event_icon_random").getChildById(1);
  const text = popover.getTextFieldByName("text");
  text.color = 4294967295;
  text.fontOutline = true;
  text.text = "TID_";
  text.fontSize = 24;
  text.x += -35;
  text.y += -15;
  random.x += 25;
  random.y += 0;
  random.scale = 0.3;
  sprite.addChild(text);
  sprite.addChild(random);
  sprite.scale = 1.95;
  return sprite;
}

function SlowModeCallback() {
  const sprite = new Sprite(true);
  const skull = StringTable.getMovieClip(
    "sc/ui.sc",
    "skull_atlasgenerator_texture_luminance_alpha",
  );
  const speed = StringTable.getMovieClip("sc/ui.sc", "icon_gear_speed").getChildById(2);
  speed.colorTransform.c1r = 255;
  speed.colorTransform.c2r = 255;
  speed.colorTransform.c1g = 0;
  speed.colorTransform.c2g = 0;
  speed.colorTransform.c1b = 0;
  speed.colorTransform.c2b = 0;
  speed.x = skull.width / 3;
  speed.y = skull.height / 3.3;
  speed.scale = 0.33;
  speed.rotate(180);
  sprite.addChild(skull);
  sprite.addChild(speed);
  return sprite;
}

module.exports = {
  VisualChromaticNamePinCallback,
  DisablePinAnimationCallback,
  SharedBackgroundCallback,
  RandomThemesCallback,
  RandomThemesAfterBattleCallback,
  RandomThemesMusicIndependencyCallback,
  ShowFPSCounterCallback,
  HideHomeScreenTextCallback,
  EnforceOldFriendsListCallback,
  ShowSkinNamesInProfileCallback,
  BattleTextChatCallback,
  ShowEnemyAmmoStatusCallback,
  ShowTrophiesAboveHeadCallback,
  ShowCameraButtonCallback,
  HideUltiAimingCallback,
  ShowFastPlayAgainButtonCallback,
  ShowAutoPlayAgainRadioButtonCallback,
  HideBattleBlackBarsCallback,
  BattleEndInstantExitCallback,
  BackgroundMatchmakingCallback,
  AntiAfkKickCallback,
  ColoredDamageCallback,
  DoNotShowBattleHighlightCallback,
  ShowBattleConnectionIndicatorCallback,
  ShowOwnPlayerCoordinatesCallback,
  ShowCharactersInNamesCallback,
  ShamePlayersWithThumbsdownPinCallback,
  ShowFriendsInBattleCallback,
  ShowAllianceMembersInBattleCallback,
  UseBattleProxyCallback,
  DisableShakeCallback,
  ExtendedTrajectoryCallback,
  HitboxRendererCallback,
  EnemyTracerCallback,
  AttackRangeIndicatorCallback,
  HighlightLeonCloneCallback,
  EnforceBattleChatButtonCallback,
  ShowDPSCallback,
  AllyRespawnTimerCallback,
  TeammateHPIndicatorCallback,
  LowResGraphicsCallback,
  DisableSkinsCallback,
  DefaultEnvironmentsCallback,
  FriendListOptimizationCallback,
  BSDProxyCallback,
  ShowFriendlyRoomOpponentsCallback,
  HideBattlingStatusFromOthersCallback,
  InstantStarrDropOpeningCallback,
  LegacyNamesCallback,
  ShowDebugMenuButtonCallback,
  RandomLocalizationCallback,
  SlowModeCallback,
};
