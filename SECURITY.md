# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| Latest (`main`) | ✅ |

## Security Architecture

Authentiq takes security seriously across both its client and server layers.

### Backend Security Controls

| Control | Implementation |
|---------|---------------|
| **Rate Limiting** | Max 10 requests/minute per IP address, tracked in memory with automatic reset |
| **Security Headers** | `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy` |
| **Input Sanitisation** | All URL inputs are stripped of dangerous URI schemes (`javascript:`, `data:`, `vbscript:`) before processing |
| **MIME Type Allowlist** | Only `image/jpeg`, `image/png`, `image/webp`, and `image/gif` are accepted. All other types are rejected with HTTP 415 |
| **File Size Cap** | Hard 4 MB limit enforced server-side via formidable |
| **URL Length Guard** | Maximum 2048 characters enforced on URL inputs |
| **Fetch Timeout** | All external URL fetches are limited to 10 seconds via `AbortSignal.timeout` |
| **Secret Management** | API keys are stored exclusively as environment variables and never committed to source control |
| **Error Isolation** | All errors return generic messages that do not leak internal stack traces or implementation details to the client |

### Frontend Security Controls

| Control | Implementation |
|---------|---------------|
| **Error Boundary** | React `ErrorBoundary` catches all render-phase errors and displays a safe fallback instead of crashing |
| **Video Upload Block** | Video/audio files are blocked client-side before upload to prevent oversized requests |
| **File Type Validation** | Client-side MIME type check before the request is even made |

## Reporting a Vulnerability

If you discover a security vulnerability in Authentiq, please report it responsibly:

1. **Do not** open a public GitHub issue for security vulnerabilities.
2. Email a description of the vulnerability, steps to reproduce, and potential impact.
3. You can expect an acknowledgement within 48 hours.

We will work to address confirmed vulnerabilities promptly and credit responsible disclosures.
