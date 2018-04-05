
function create(domains) {
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
  
    use_backend http_adminer_merry_netfinity_cz if { hdr(Host) -i  adminer.merry.netfinity.cz www.kproduction.eu kproduction.eu www.18plusphotos.com }

frontend https-in
  mode tcp
  option tcplog
  bind *:443
  tcp-request inspect-delay 5s
  tcp-request content accept if { req.ssl_hello_type 1 }

  acl acl_adminer_merry_netfinity_cz req.ssl_sni -i adminer.merry.netfinity.cz
  use_backend https_adminer_merry_netfinity_cz if acl_adminer_merry_netfinity_cz

backend http_adminer_merry_netfinity_cz
  server adminer_merry_netfinity_cz 172.17.0.8:80
  mode http
  option forwardfor

backend https_adminer_merry_netfinity_cz
  mode tcp
  option tcplog
  server https_adminer_merry_netfinity_cz  172.17.0.8:443
    `;

    return config;
}

module.exports = create;