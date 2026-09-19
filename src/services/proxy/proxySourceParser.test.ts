import { describe, it, expect } from 'vitest';
import { parseProxiesFromText } from './proxySourceParser';

describe('parseProxiesFromText', () => {
  it('parses simple ip:port lines with default http protocol', () => {
    const [p] = parseProxiesFromText('1.2.3.4:8080');
    expect(p).toMatchObject({ ip: '1.2.3.4', port: 8080, protocol: 'http', id: '1.2.3.4:8080' });
  });

  it('parses protocol://ip:port and keeps recognized protocols', () => {
    const [p] = parseProxiesFromText('socks5://5.6.7.8:1080');
    expect(p).toMatchObject({ ip: '5.6.7.8', port: 1080, protocol: 'socks5' });
  });

  it('falls back to http for unrecognized protocols', () => {
    const [p] = parseProxiesFromText('ftp://9.9.9.9:21');
    expect(p.protocol).toBe('http');
  });

  it('ignores blank lines and surrounding whitespace', () => {
    const result = parseProxiesFromText('\n  1.1.1.1:80  \n\n2.2.2.2:8080\n');
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.ip)).toEqual(['1.1.1.1', '2.2.2.2']);
  });

  it('skips lines with an unparseable port', () => {
    expect(parseProxiesFromText('1.2.3.4:notaport')).toHaveLength(0);
  });
});
