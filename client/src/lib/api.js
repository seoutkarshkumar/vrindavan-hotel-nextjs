const base = '/api';

async function req(url, opts = {}) {
  const res = await fetch(base + url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  if (!res.ok) {
    let msg = `${res.status}`;
    try { msg = (await res.json()).error || msg; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export const api = {
  get:  (u)      => req(u),
  post: (u, b)   => req(u, { method: 'POST', body: JSON.stringify(b || {}) }),
  put:  (u, b)   => req(u, { method: 'PUT',  body: JSON.stringify(b || {}) }),
  del:  (u)      => req(u, { method: 'DELETE' }),
};
