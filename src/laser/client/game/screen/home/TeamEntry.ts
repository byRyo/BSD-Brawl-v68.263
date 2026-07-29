// @ts-nocheck
const { Libc } = require("../../../../../lib/Libc");
const { Libg } = require("../../../../../lib/Libg");
const { Breadcrumbs } = require("../../../../../suitcase/debug/Breadcrumbs");
const { EDebugger } = require("../../../../../suitcase/debug/EDebugger");
const { LogicMemory } = require("../../../../../suitcase/logic/LogicMemory");

const getMemberAddress = Libg.offset(12380896, 11298660);
const getMember = new NativeFunction(Libg.offset(12383072, 11300356), "pointer", [
  "pointer",
  "pointer",
]);
const membersArrayOffset = LogicMemory.offset(72);
const memberFlagOffset = LogicMemory.offset(48);

class TeamEntry {
  static patch() {
    Interceptor.replace(
      getMemberAddress,
      new NativeCallback(
        (teamEntry, id) => {
          if (teamEntry.add(membersArrayOffset).readPointer().isNull()) {
            EDebugger.addMessage(
              EDebugger.WARNING,
              "TeamEntry::getMember:",
              "Members array is NULL! Why???",
            );
            Breadcrumbs.push(
              "TeamEntry::getMember(teamEntry, long); TeamEntry->m_membersArray = NULL!",
            );
            return Libc.malloc(1);
          }
          return getMember(teamEntry, id);
        },
        "pointer",
        ["pointer", "pointer"],
      ),
    );

    Interceptor.attach(getMember, {
      onEnter(args) {
        this.self = args[0];
      },
      onLeave() {
        this.self.add(memberFlagOffset).writeU8(1);
      },
    });
  }
}

exports.TeamEntry = TeamEntry;
