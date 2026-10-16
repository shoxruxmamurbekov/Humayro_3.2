# Security Policy

## Reporting a vulnerability

Please do not open a public issue for security problems. Contact the maintainer privately
through GitHub (use "Report a vulnerability" under the repository's Security tab, if enabled),
or by email to the maintainer listed in the LICENSE file. Include steps to reproduce and the
affected version or commit. You will get an acknowledgement as soon as possible.

## Secrets

- Never commit `.env` files or real API keys. Use `.env.example` for placeholders only.
- `ADMIN_SECRET` must be a long random value. The server refuses to start without it.
- If a secret is ever exposed, rotate it immediately in your hosting provider. Removing it
  from the code does not invalidate it, and it stays visible in git history.
