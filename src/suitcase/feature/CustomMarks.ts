// @ts-nocheck
const { LogicRandom } = require("../logic/LogicRandom");
class CustomMarks {
  static getMarkDefinitionFor(tag) {
    return this.MARK_DEFINITIONS[tag.replace("#", "")] || null;
  }
  static getTitleDefinitionFor(tag) {
    return this.TITLE_DEFINITIONS[tag.replace("#", "")] || null;
  }
  static hasMark(tag) {
    return this.MARK_DEFINITIONS[tag.replace("#", "")] !== undefined;
  }
  static hasTitle(tag) {
    return this.TITLE_DEFINITIONS[tag.replace("#", "")] !== undefined;
  }
}
CustomMarks.MARK_DEFINITIONS = {
  "9P0R2YC2Q": "<cd9adb3>[<cdd9991>m<ce18670>o<ce18670>e<cd89184>]</c>",
  "2RGGJPLQU":
    "<c0fc2f0>[<c1eb0f4>D<c2e9ef7>A<c3d8cfb>r<c4d7bff>k<c3d86ff>S<c2e92ff>i<c1e9dff>d<c0fa9ff>e<c04b5ff>]</c>",
  "8PLVR29JP": "<cb1cde3>[<ca3c7e3>B<c94c1e3>S<c86bbe4>D<c86bbe4>+<c83b3e4>+<c81abe4>]</c>",
  "8GCQYL2VL": "<cffd5b5>[<cfe9c5f>B<cfea87a>S<cffb98e>D<cffd5b5>+<cffebd4>+<cffd5b5>]</c>",
  QUJPVU0L: "<cf2e842>[<ce5e93c>L<cd9eb37>V<cd9eb37>1<ce1ef61>]</c>",
  PQL90VLR9: "<cf2e842>[<ce5e93c>L<cd9eb37>V<cd9eb37>1<ce1ef61>]</c>",
};
CustomMarks.TITLE_DEFINITIONS = {
  "9P0R2YC2Q": "Анимешка",
  "2RGGJPLQU": `Выпил ${LogicRandom.random(4000, 9000)} литров пива`,
};
exports.CustomMarks = CustomMarks;
