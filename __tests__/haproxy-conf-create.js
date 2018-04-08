jest.mock("dns");
var dns = require("dns");

const haproxyCreate = require("../haproxy-conf-create");

test('creates haproxy config', async () => {
    dns.lookup.mockImplementation((name, options, callback) => {
        callback(null, "192.168.1.1");
    });

    let config = await haproxyCreate([{"name":"adminer.legolas.netfinity.cz","domains":["adminer.legolas.netfinity.cz"]},{"name":"mujmedved.cz","domains":["www.mujmedved.cz","mujmedved.cz"]}]);
    expect(config).toMatch(/192.168.1.1/);
});
