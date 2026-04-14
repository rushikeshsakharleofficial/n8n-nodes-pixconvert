import { INodeProperties } from 'n8n-workflow';

export const convertFromPdfOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['convertFromPdf'] } },
    options: [
      { name: 'PDF to JPG', value: 'pdfToJpg' },
      { name: 'PDF to Word', value: 'pdfToWord' },
      { name: 'PDF to PowerPoint', value: 'pdfToPowerpoint' },
      { name: 'PDF to Excel', value: 'pdfToExcel' },
      { name: 'PDF to PDF/A', value: 'pdfToPdfa' },
    ],
    default: 'pdfToJpg',
  },
];

export const convertFromPdfFields: INodeProperties[] = [
  {
    displayName: 'DPI',
    name: 'dpi',
    type: 'number',
    displayOptions: { show: { resource: ['convertFromPdf'], operation: ['pdfToJpg'] } },
    default: 150,
    description: 'Resolution (72–300)',
  },
  {
    displayName: 'Quality',
    name: 'jpgQuality',
    type: 'number',
    displayOptions: { show: { resource: ['convertFromPdf'], operation: ['pdfToJpg'] } },
    default: 90,
    description: 'JPEG quality (1–100)',
  },
];

export const convertFromPdfEndpoints: Record<string, string> = {
  pdfToJpg: 'pdf-to-jpg',
  pdfToWord: 'pdf-to-word',
  pdfToPowerpoint: 'pdf-to-powerpoint',
  pdfToExcel: 'pdf-to-excel',
  pdfToPdfa: 'pdf-to-pdfa',
};

export function getConvertFromPdfFields(get: (n: string) => unknown, op: string): Record<string, string | undefined> {
  if (op === 'pdfToJpg') return { dpi: String(get('dpi') || '150'), quality: String(get('jpgQuality') || '90') };
  return {};
}
