#!/usr/bin/node

const path = require("path");
const fs = require("fs");
const childProcess = require("child_process");
const haproxyCreate = require("./haproxy-conf-create");
 
const configDir = "/etc/secrets/_config/haproxy";

const haproxyConf = "/etc/haproxy/haproxy.cfg";

const JSONConfig = JSON.parse(fs.readFileSync(path.join(configDir, "config.json"), "utf8"));

(async () => {
    const conf = await haproxyCreate(JSONConfig)

    fs.writeFileSync(haproxyConf, conf, "utf8");
})();

