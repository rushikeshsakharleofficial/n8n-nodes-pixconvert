import { INodeProperties } from 'n8n-workflow';

export const optimizeOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['optimize'] } },
    options: [
      { name: 'Compress PDF', value: 'compressPdf', description: 'Reduce file size' },
      { name: 'Repair PDF', value: 'repairPdf', description: 'Fix corrupted PDF' },
      { name: 'OCR PDF', value: 'ocrPdf', description: 'Add selectable text via OCR' },
    ],
    default: 'compressPdf',
  },
];

export const optimizeFields: INodeProperties[] = [
  {
    displayName: 'Quality',
    name: 'quality',
    type: 'options',
    displayOptions: { show: { resource: ['optimize'], operation: ['compressPdf'] } },
    options: [
      { name: 'Low (smallest)', value: 'low' },
      { name: 'Medium', value: 'medium' },
      { name: 'High (best quality)', value: 'high' },
    ],
    default: 'medium',
  },
  {
    displayName: 'Language',
    name: 'ocrLang',
    type: 'string',
    displayOptions: { show: { resource: ['optimize'], operation: ['ocrPdf'] } },
    default: 'eng',
    description: 'Tesseract language code (e.g. eng, fra, deu)',
  },
  {
    displayName: 'Output Format',
    name: 'ocrFormat',
    type: 'options',
    displayOptions: { show: { resource: ['optimize'], operation: ['ocrPdf'] } },
    options: [
      { name: 'PDF with text layer', value: 'pdf' },
      { name: 'Plain text', value: 'txt' },
    ],
    default: 'pdf',
  },
];

export const optimizeEndpoints: Record<string, string> = {
  compressPdf: 'compress-pdf',
  repairPdf: 'repair-pdf',
  ocrPdf: 'ocr-pdf',
};

export function getOptimizeFields(get: (n: string) => unknown, op: string): Record<string, string | undefined> {
  if (op === 'compressPdf') return { quality: String(get('quality') || 'medium') };
  if (op === 'ocrPdf') return { lang: String(get('ocrLang') || 'eng'), format: String(get('ocrFormat') || 'pdf') };
  return {};
}
