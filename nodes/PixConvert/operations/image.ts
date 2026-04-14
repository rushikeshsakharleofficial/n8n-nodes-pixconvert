import { INodeProperties } from 'n8n-workflow';

export const imageOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['image'] } },
    options: [
      { name: 'JPG to PNG', value: 'jpgToPng' },
      { name: 'PNG to JPG', value: 'pngToJpg' },
      { name: 'WebP to JPG', value: 'webpToJpg' },
      { name: 'HEIC to JPG', value: 'heicToJpg' },
      { name: 'BMP to PNG', value: 'bmpToPng' },
      { name: 'Photo to Markdown', value: 'photoToMarkdown', description: 'OCR image to text' },
    ],
    default: 'jpgToPng',
  },
];

export const imageFields: INodeProperties[] = [
  {
    displayName: 'Quality',
    name: 'imageQuality',
    type: 'number',
    displayOptions: { show: { resource: ['image'], operation: ['pngToJpg', 'webpToJpg', 'heicToJpg', 'jpgToPng'] } },
    default: 90,
    description: 'Output quality 1–100',
  },
  {
    displayName: 'Language',
    name: 'imageLang',
    type: 'string',
    displayOptions: { show: { resource: ['image'], operation: ['photoToMarkdown'] } },
    default: 'eng',
    description: 'Tesseract language code',
  },
];

export const imageEndpoints: Record<string, string> = {
  jpgToPng: 'jpg-to-png',
  pngToJpg: 'png-to-jpg',
  webpToJpg: 'webp-to-jpg',
  heicToJpg: 'heic-to-jpg',
  bmpToPng: 'bmp-to-png',
  photoToMarkdown: 'photo-to-markdown',
};

export function getImageFields(get: (n: string) => unknown, op: string): Record<string, string | undefined> {
  if (op === 'photoToMarkdown') return { lang: String(get('imageLang') || 'eng') };
  if (op !== 'bmpToPng') return { quality: String(get('imageQuality') || '90') };
  return {};
}
