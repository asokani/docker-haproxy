FROM mainlxc/base
MAINTAINER Asokani "https://github.com/asokani"

RUN apt-get update && \
  apt-get -y install haproxy

RUN mkdir /etc/service/haproxy
ADD haproxy.sh /etc/service/haproxy/run

EXPOSE 80 443

CMD ["/sbin/my_init"]

RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
 