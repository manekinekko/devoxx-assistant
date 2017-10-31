const sdk = require("actions-on-google");
const DialogflowApp = sdk.DialogflowApp;
const ActionsSdkApp = sdk.ActionsSdkApp;
const path = require("path");
const fs = require("fs");

const assert = (predicate, expecting, actual) => {
  if (predicate === false) {
    throw new Error(
      `[Actionary] Assertion failed: Expecting "${expecting}". Got "${actual}"`
    );
    return false;
  }
};

class Actionary {
  constructor({ request, response }) {
    this.assistant = null;
    this.reqRes = { request, response };
    this.actionMap = new Map();
  }

  instance(type) {
    assert(
      (typeof type === 'function' && /(DialogflowApp|ActionsSdkApp)/.test(type.name)),
      "ActionsSdkApp|DialogflowApp",
      typeof type
    );

    this.assistant = new type(this.reqRes);
    this.patch(this.assistant);
    return this;
  }

  patch(instance) {
    instance.hasScreen = function hasScreen() {
      return this.hasSurfaceCapability(this.SurfaceCapabilities.SCREEN_OUTPUT);
    };
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
      (typeof this.assistant === 'object'),
      "ActionsSdkApp|DialogflowApp",
      typeof this.assistant
    );

    this.assistant.handleRequest(this.actionMap);
    return this;
  }
};

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