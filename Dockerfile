FROM mainlxc/ubuntu
MAINTAINER Asokani "https://github.com/asokani"

RUN add-apt-repository ppa:vbernat/haproxy-1.8
RUN apt-get update && \
  apt-get -y install haproxy

RUN mkdir /etc/service/haproxy
ADD haproxy.sh /etc/service/haproxy/run
ADD syslog-ng-haproxy.conf /etc/syslog-ng/conf.d/haproxy.conf

CMD ["/sbin/my_init"]

RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
 