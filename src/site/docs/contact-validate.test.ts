import { describe, expect, it } from 'vitest';
import { validateContact } from './contact-validate';

const ok = { name: '', email: 'user@example.ru', site: 'example.ru', message: '', consent: true };

describe('validateContact', () => {
  it('пропускает заполненную заявку', () => {
    expect(validateContact(ok)).toEqual({});
    expect(validateContact({ ...ok, site: 'https://shop.example.ru/catalog' })).toEqual({});
  });
  it('требует почту, согласие и сайт или сообщение', () => {
    const e = validateContact({ name: '', email: '', site: '', message: '', consent: false });
    expect(Object.keys(e).sort()).toEqual(['consent', 'email', 'message']);
  });
  it('ловит опечатки в почте и адресе сайта', () => {
    expect(validateContact({ ...ok, email: 'user@example' }).email).toBeTruthy();
    expect(validateContact({ ...ok, site: 'просто текст' }).site).toBeTruthy();
  });
});
