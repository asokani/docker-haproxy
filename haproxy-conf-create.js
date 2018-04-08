const dns = require("dns");

async function create(JSONConfig) {
    let backends = [];
    let httpFrontends = [];
    let httpsFrontends = [];

    for (let i = 0; i < JSONConfig.length; i++) {
        let domainGroup = JSONConfig[i];
        let name = domainGroup.name;
        let strippedName = name.replace(/[^a-z0-9]/i, "_");

        try {
            var address = await new Promise((resolve, reject) => {
                
                dns.lookup(name, { family: 4 }, (err, address, family) => {
                    if (err) {
                        reject();
                    }
                    resolve(address);
                });
            });
        } catch (err) {
            continue;
        }
        httpFrontends.push(`
    use_backend http_${strippedName} if { hdr(Host) -i ${domainGroup.domains.join(" ")} }
        `)

        httpsFrontends.push(`
    use_backend https_${strippedName} if { req.ssl_sni -i ${domainGroup.domains.join(" ")} }
        `)
        
        backends.push(`
backend http_${strippedName}
    server http_${strippedName} ${address}:80
    mode http
    option forwardfor
      
backend https_${strippedName}
    mode tcp
    server https_${strippedName} ${address}:443
        `);
    }

    let config = `
global
    log 127.0.0.1 local1 notice
    chroot /var/lib/haproxy
    user haproxy
    group haproxy

defaults
    log     global
    mode    http
    option  httplog
    option  dontlognull
    timeout connect 120000
    timeout client 180000
    timeout server 180000

frontend http-in
    bind *:80

${httpFrontends.join("\n")}    

frontend https-in
    mode tcp
    option tcplog
    bind *:443
    tcp-request inspect-delay 5s
    tcp-request content accept if { req.ssl_hello_type 1 }

${httpsFrontends.join("\n")}

${backends.join("\n")}
    `;

    return config;
}

module.exports = create;

