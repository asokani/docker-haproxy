const haproxyCreate = require("./haproxy-conf-create");

test('creates haproxy config', () => {
    let config = haproxyCreate([{"name":"adminer.legolas.netfinity.cz","domains":["adminer.legolas.netfinity.cz"]},{"name":"mujmedved.cz","domains":["www.mujmedved.cz","mujmedved.cz"]}]);
    expect(config).toMatch(/ServerName www.example.com/);
});
