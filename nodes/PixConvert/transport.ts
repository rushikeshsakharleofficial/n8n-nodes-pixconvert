import FormData from 'form-data';
import https from 'https';
import http from 'http';

const MAX_BYTES = 50 * 1024 * 1024;

export interface PixConvertRequestOptions {
  apiUrl: string;
  endpoint: string;
  formFields?: Record<string, string | undefined>;
  fileBuffer?: Buffer;
  fileName?: string;
  fileMimeType?: string;
  fileBuffer2?: Buffer;
  fileName2?: string;
  outputMode: 'binary' | 'url';
}

export interface PixConvertBinaryResult {
  type: 'binary';
  buffer: Buffer;
  mimeType: string;
  fileName: string;
}

export interface PixConvertUrlResult {
  type: 'url';
  url: string;
}

export type PixConvertResult = PixConvertBinaryResult | PixConvertUrlResult;

export function parsePixConvertError(body: string): string {
  if (!body) return 'Unknown error from PixConvert API';
  try {
    const parsed = JSON.parse(body);
    return parsed.error ?? 'Unknown error from PixConvert API';
  } catch {
    return body;
  }
}

export async function pixConvertRequest(opts: PixConvertRequestOptions): Promise<PixConvertResult> {
  const { apiUrl, endpoint, formFields = {}, fileBuffer, fileName, fileMimeType, fileBuffer2, fileName2, outputMode } = opts;

  if (fileBuffer && fileBuffer.length > MAX_BYTES) {
    throw new Error(`File exceeds 50MB limit (${(fileBuffer.length / 1024 / 1024).toFixed(1)}MB)`);
  }
  if (fileBuffer2 && fileBuffer2.length > MAX_BYTES) {
    throw new Error('Second file exceeds 50MB limit');
  }

  const form = new FormData();
  for (const [k, v] of Object.entries(formFields)) {
    if (v !== undefined && v !== '') form.append(k, v);
  }
  if (fileBuffer && fileName) {
    form.append('file', fileBuffer, { filename: fileName, contentType: fileMimeType ?? 'application/octet-stream' });
  }
  if (fileBuffer2 && fileName2) {
    form.append('file2', fileBuffer2, { filename: fileName2, contentType: 'application/octet-stream' });
  }

  const url = `${apiUrl.replace(/\/$/, '')}/${endpoint}${outputMode === 'url' ? '?output=url' : ''}`;
  const lib = url.startsWith('https') ? https : http;

  return new Promise((resolve, reject) => {
    const req = lib.request(url, { method: 'POST', headers: form.getHeaders() }, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (c: Buffer) => chunks.push(c));
      res.on('end', () => {
        const body = Buffer.concat(chunks);
        const status = res.statusCode ?? 0;

        if (status === 429) {
          return reject(new Error('Rate limit reached (10 req/sec). Retry in 1 second.'));
        }
        if (status < 200 || status >= 300) {
          return reject(new Error(`PixConvert error: ${parsePixConvertError(body.toString())}`));
        }

        if (outputMode === 'url') {
          try {
            const json = JSON.parse(body.toString());
            return resolve({ type: 'url', url: json.url });
          } catch {
            return reject(new Error('Expected JSON url response but received invalid body'));
          }
        }

        const contentType = res.headers['content-type'] ?? 'application/octet-stream';
        const disposition = res.headers['content-disposition'] ?? '';
        const match = disposition.match(/filename="?([^";\n]+)"?/);
        const outFileName = match ? match[1] : `output.${contentType.split('/')[1] ?? 'bin'}`;
        resolve({ type: 'binary', buffer: body, mimeType: contentType, fileName: outFileName });
      });
    });
    req.on('error', reject);
    form.pipe(req);
  });
}
