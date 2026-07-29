// @ts-nocheck
const { Libg } = require("../../../../../lib/Libg");
const { Localisation } = require("../../../../../suitcase/localisation/Localisation");
const { LogicArrayList } = require("../../../logic/data/LogicArrayList");
const { LogicGemOffer } = require("../../../logic/home/offers/LogicGemOffer");
const { StringObject } = require("../../../../titan/client/native/StringObject");
const { LogicDataTables } = require("../../../logic/data/LogicDataTables");
const { StringTable } = require("../../text/StringTable");
const { CollabDropPopup } = require("../../../../../suitcase/feature/CollabDrop");
const { GUI } = require("../../gui/GUI");
const { GameButton } = require("../../gui/GameButton");
const { LogicCharacterData } = require("../../../logic/data/LogicCharacterData");
const { Application } = require("../../../../titan/client/application/Application");
const { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory");

const shopItemCtor = Libg.offset(9443340, 8927800);
const purchaseOffer = Libg.offset(9453280, 8937032);
const purchaseOffer2 = Libg.offset(9550332, 9034420);
const purchaseResult = Libg.offset(9552252, 9036088);
const addOffers = Libg.offset(6809636, 6659236);
const shopCtor = Libg.offset(9977156, 9384084);
const collabButtonOffset = LogicMemory.offset(712, 720);

function packHeading(index) {
  return "".concat(Localisation.getString("CollabPack"), " ", index, ":\n");
}

class Shop {
  static patch() {
    Interceptor.attach(shopItemCtor, {
      onEnter(args) {
        this.item = args[0];
      },
      onLeave() {
        const price = new GameButton(this.item).getMovieClip().getChildByName("price");
        if (!price) return;
        const free = price.getChildByName("price_free");
        if (!free) return;
        const text = free.getTextFieldByName("txt");
        if (text) {
          free.visibility = true;
          text.setTextScaleIfNecessary(Localisation.getString("GetGems"));
        }
      },
    });

    Interceptor.replace(
      purchaseOffer,
      new NativeCallback(
        () => {
          Application.openUrl("https://t.me/bsddonatebot");
        },
        "void",
        ["pointer"],
      ),
    );
    Interceptor.replace(
      purchaseOffer2,
      new NativeCallback(
        () => {
          Application.openUrl("https://t.me/bsddonatebot");
        },
        "void",
        ["pointer"],
      ),
    );
    Interceptor.attach(purchaseResult, {
      onLeave(retval) {
        retval.replace(ptr(1));
      },
    });

    Interceptor.attach(addOffers, {
      onEnter(args) {
        Shop.currentPack++;
        if (Shop.currentPack >= 4) {
          Shop.currentPack = 1;
          Shop.firstPack = "";
          Shop.secondPack = "";
          Shop.thirdPack = "";
          Shop.fourthPack = "";
        }
        if (Shop.firstPack === "") {
          Shop.firstPack = packHeading(1);
          Shop.secondPack = packHeading(2);
          Shop.thirdPack = packHeading(3);
          Shop.fourthPack = packHeading(4);
        }

        const offers = new LogicArrayList(args[0].add(8));
        if (Shop.currentPack === 1) {
          Shop.firstPack = packHeading(1);
          Shop.secondPack = packHeading(2);
          Shop.thirdPack = packHeading(3);
          Shop.fourthPack = packHeading(4);
        }

        for (let i = 0; i < offers.getItemsCount(); i++) {
          const offerPtr = offers.getElement(i);
          if (offerPtr.isNull()) continue;
          const offer = new LogicGemOffer(offerPtr);
          const type = offer.getType();

          if (type === 5) {
            const cardName = StringObject.read(
              LogicDataTables.getTable(LogicDataTables.table.Cards)
                .getItemAt(offer.getExtraData())
                ?.getValueAt(4),
            );
            const tid = LogicDataTables.getCharacterByName(cardName).getTID();
            Shop.addToPack(
              Shop.currentPack,
              "".concat(Localisation.getString("DeckFor"), " ", StringTable.getString(tid), ", "),
            );
          }
          if (type === 4) {
            const skin = LogicDataTables.getDataById(
              LogicDataTables.table.Skins,
              offer.getExtraData(),
            );
            Shop.addToPack(
              Shop.currentPack,
              "".concat(
                Localisation.getString("SkinFor"),
                " ",
                StringTable.getString(skin.getTID()),
                ", ",
              ),
            );
          }
          if (type === 1) {
            Shop.addToPack(
              Shop.currentPack,
              "".concat(Localisation.getString("Coins"), " (", offer.getCount(), "), "),
            );
          }
          if (type === 3) {
            const character = new LogicCharacterData(offer.getData());
            Shop.addToPack(
              Shop.currentPack,
              "".concat(StringTable.getString(character.getTID()), ", "),
            );
          }
          if (type === 25) {
            const icon = LogicDataTables.getTable(LogicDataTables.table.PlayerThumbnails)
              .getItemAt(offer.getExtraData())
              ?.getName();
            Shop.addToPack(
              Shop.currentPack,
              "".concat(Localisation.getString("ProfileIcon"), " (", icon, "), "),
            );
          }
          if (type === 35) {
            const spray = LogicDataTables.getTable(LogicDataTables.table.Sprays)
              .getItemAt(offer.getExtraData())
              ?.getName();
            Shop.addToPack(
              Shop.currentPack,
              "".concat(Localisation.getString("Spray"), " (", spray, "), "),
            );
          }
          if (type === 41) {
            Shop.addToPack(
              Shop.currentPack,
              "".concat(Localisation.getString("PowerPoints"), " (", offer.getCount(), "), "),
            );
          }
          if (type === 45) {
            Shop.addToPack(
              Shop.currentPack,
              "".concat(Localisation.getString("Bling"), " (", offer.getCount(), "), "),
            );
          }
        }
      },
    });

    Interceptor.attach(shopCtor, {
      onEnter(args) {
        this.self = args[0];
      },
      onLeave() {
        new GameButton(this.self.add(collabButtonOffset).readPointer()).setCustomButtonListener(
          Shop.showPopup.bind(this),
        );
      },
    });
  }

  static addToPack(pack, text) {
    if (pack === 1) this.firstPack += text;
    else if (pack === 2) this.secondPack += text;
    else if (pack === 3) this.thirdPack += text;
    else if (pack === 4) this.fourthPack += text;
  }

  static showPopup() {
    const trim = (text) => (text.endsWith(", ") ? text.slice(0, -2) : text);
    GUI.showPopup(
      new CollabDropPopup(
        "".concat(
          trim(Shop.firstPack),
          "\n\n",
          trim(Shop.secondPack),
          "\n\n",
          trim(Shop.thirdPack),
          "\n\n",
          trim(Shop.fourthPack),
        ),
      ),
      true,
      false,
      true,
    );
  }
}

Shop.firstPack = "";
Shop.secondPack = "";
Shop.thirdPack = "";
Shop.fourthPack = "";
Shop.currentPack = 0;
exports.Shop = Shop;
