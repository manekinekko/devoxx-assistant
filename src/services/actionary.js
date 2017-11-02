const sdk = require("actions-on-google");
const DialogflowApp = sdk.DialogflowApp;
const ActionsSdkApp = sdk.ActionsSdkApp;
const path = require("path");
const fs = require("fs");

const moment = require("moment");

const Debug = require("debug");
process.env.DEBUG = "actions-on-google:*";
process.env.DEBUG_COLORS = true;
process.env.DEBUG_DEPTH = "4";
process.env.DEBUG_SHOW_HIDDEN = true;

const assert = (predicate, expecting, actual) => {
  if (predicate === false) {
    throw new Error(
      `[Actionary] Assertion failed: Expecting "${expecting}". Got "${actual}"`
    );
    return false;
  }
};

class Actionary {
  constructor({ request, response, sessionStarted }) {
    this.reqRes = { request, response, sessionStarted };
    this.assistant = null;
    this.actionMap = new Map();
  }

  use(type) {
    assert(
      typeof type === "function" &&
        /(DialogflowApp|ActionsSdkApp)/.test(type.name),
      "ActionsSdkApp|DialogflowApp",
      typeof type
    );

    this.assistant = new type(this.reqRes);
    this.patch(this.assistant);
    return this;
  }

  patch(instance) {
    instance.hasScreen = () => {
      return instance.hasSurfaceCapability(
        instance.SurfaceCapabilities.SCREEN_OUTPUT
      );
    };

    instance.getDateTimeFromRequest = () => {
      // @todo for testing purposes only.
      // 2017-11-09T13:36:40+01:00
      return moment(1510231000000);
      // return +moment(instance.body_.timestamp).utcOffset("+02:00");
    };

    instance.debug = Debug("actions-on-google:actionary:debug");
    instance.error = Debug("actions-on-google:actionary:error");
  }

  setActions(actions) {
    assert(Array.isArray(actions), "Array", typeof actions);

    actions.map(action => {
      const file = action.replace(/\./g, path.sep) + ".js";
      this.setAction(action, file);
    });
    return this;
  }

  setAction(actionName, file) {
    const filePath = path.join(process.cwd(), "src", `${file}`);
    assert(fs.existsSync(filePath), "File", "NOT_FOUND");

    this.actionMap.set(actionName, require(filePath));
    return this;
  }

  start() {
    assert(
      typeof this.assistant === "object",
      "ActionsSdkApp|DialogflowApp",
      typeof this.assistant
    );

    this.assistant.handleRequest(this.actionMap);
    return this;
  }
}

Actionary.sdk = {
  DialogflowApp,
  ActionsSdkApp
};

const ActionaryTest = {
  SurfaceCapabilities: {
    SCREEN_OUTPUT: 1
  },
  hasScreen() {
    return true;
  },
  hasSurfaceCapability() {
    return false;
  },
  getArgument() {
    return "";
  },
  ask(text) {
    console.log(text);
  },
  tell(text) {
    console.log(text);
  },
  askWithList(text) {
    this.text = text;
  },
  getContextArgument() {
    return {
      value: "TRACK_xxx"
    };
  }
};

module.exports = {
  Actionary,
  ActionaryTest
};
