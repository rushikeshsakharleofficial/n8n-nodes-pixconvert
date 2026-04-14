# n8n-nodes-pixconvert

An [n8n](https://n8n.io) community node for [PixConvert](https://github.com/rushikeshsakharleofficial/fileconverter) — a self-hosted PDF and image processing API.

## Features

- **35+ operations** across 8 categories
- **Binary or URL output** — pipe results directly to S3, email, Google Drive, or return a download link
- **No auth required** — just point it at your server

## Categories

| Category | Operations |
|----------|-----------|
| Organize PDF | Merge, Split, Remove Pages, Extract Pages, Organize, Scan to PDF |
| Optimize PDF | Compress, Repair, OCR |
| Convert to PDF | JPG, Word, PowerPoint, Excel, HTML → PDF |
| Convert from PDF | PDF → JPG, Word, PowerPoint, Excel, PDF/A |
| Edit PDF | Rotate, Page Numbers, Watermark, Crop, Annotations |
| PDF Security | Unlock, Lock, Sign, Redact, Compare |
| Image Conversion | JPG↔PNG, WebP→JPG, HEIC→JPG, BMP→PNG, Photo→Markdown |
| Media | Universal Convert, GIF Maker |

## Installation

In your n8n instance go to **Settings → Community Nodes** and install:

```
n8n-nodes-pixconvert
```

Or via npm in your n8n root:

```bash
npm install n8n-nodes-pixconvert
```

## Setup

1. Add a **PixConvert API** credential
2. Set **API URL** to your server's API endpoint — include `/api/v1`:
   ```
   https://your-server.com/api/v1
   ```
3. Use the node in any workflow — select Resource → Operation → configure parameters

## Deploying the PixConvert API

The API requires a Linux server with Node.js 18+, Ghostscript, LibreOffice headless, and Tesseract OCR.

See the [PixConvert server repo](https://github.com/rushikeshsakharleofficial/fileconverter) for setup instructions.

## Workflow Templates

Import ready-to-use templates from the `workflows/` directory:

| Template | Description |
|----------|-------------|
| `merge-pdfs.json` | Merge two PDFs from disk |
| `compress-and-email.json` | Compress PDF via webhook, email result |
| `word-to-pdf-pipeline.json` | Convert Word doc to PDF via webhook |
| `pdf-to-jpg-s3.json` | Convert PDF to JPG images, upload to S3 |
| `lock-pdf-workflow.json` | Password-protect PDF via webhook |

## License

MIT
