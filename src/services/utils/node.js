module.exports.pbcopy = (data) => {
  var proc = require("child_process").spawn("pbcopy");
  proc.stdin.write(data);
  proc.stdin.end();
};

module.exports.writeJSON = (path, data) => {
  return require('fs').writeFileSync(path, JSON.stringify(data, null, 1)); 
}