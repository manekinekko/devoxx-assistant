const DialogflowApp = require("actions-on-google").DialogflowApp;
const path = require("path");
const fs = require("fs");

module.exports.Actionary = class Actionary {
  constructor({ request, response }) {
    this.assistant = new DialogflowApp({ request, response });
    this.patch(this.assistant);
    this.actionMap = new Map();
  }

  patch(instance) {
    instance.hasScreen = function hasScreen() {
      return this.hasSurfaceCapability(this.SurfaceCapabilities.SCREEN_OUTPUT);
    };
  }

  setActions(actions) {
    if (Array.isArray(actions)) {
      actions.map(action => {
        const file = action.replace(/\./g, path.sep) + ".js";
        this.setAction(action, file);
      });
    } else {
      throw Error(
        `Ationary.setActions: expect argument type of "Array", got "${typeof actions}".`
      );
    }
    return this;
  }

  setAction(actionName, file) {
    const filePath = path.join(process.cwd(), "src", `${file}`);
    if (fs.existsSync(filePath)) {
      this.actionMap.set(actionName, require(filePath));
    } else {
      throw new Error(`Actionary.setAction: file ${filePath} NOT FOUND`);
    }
    return this;
  }

  start() {
    this.assistant.handleRequest(this.actionMap);
    return this;
  }
};

module.exports.ActionaryTest = {
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
