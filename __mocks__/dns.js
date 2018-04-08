var dns = jest.genMockFromModule('dns');
dns.lookup = jest.fn();
module.exports = dns;