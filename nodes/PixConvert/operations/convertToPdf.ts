import { INodeProperties } from 'n8n-workflow';

export const convertToPdfOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['convertToPdf'] } },
    options: [
      { name: 'JPG / Images to PDF', value: 'jpgToPdf' },
      { name: 'Word to PDF', value: 'wordToPdf' },
      { name: 'PowerPoint to PDF', value: 'powerpointToPdf' },
      { name: 'Excel to PDF', value: 'excelToPdf' },
      { name: 'HTML to PDF', value: 'htmlToPdf' },
    ],
    default: 'jpgToPdf',
  },
];

export const convertToPdfFields: INodeProperties[] = [
  {
    displayName: 'Orientation',
    name: 'orientation',
    type: 'options',
    displayOptions: { show: { resource: ['convertToPdf'], operation: ['jpgToPdf'] } },
    options: [
      { name: 'Portrait', value: 'portrait' },
      { name: 'Landscape', value: 'landscape' },
    ],
    default: 'portrait',
  },
  {
    displayName: 'Margin (points)',
    name: 'margin',
    type: 'number',
    displayOptions: { show: { resource: ['convertToPdf'], operation: ['jpgToPdf'] } },
    default: 0,
  },
  {
    displayName: 'Page Format',
    name: 'htmlFormat',
    type: 'options',
    displayOptions: { show: { resource: ['convertToPdf'], operation: ['htmlToPdf'] } },
    options: [
      { name: 'A4', value: 'A4' },
      { name: 'Letter', value: 'Letter' },
    ],
    default: 'A4',
  },
  {
    displayName: 'Landscape',
    name: 'htmlLandscape',
    type: 'boolean',
    displayOptions: { show: { resource: ['convertToPdf'], operation: ['htmlToPdf'] } },
    default: false,
  },
];

export const convertToPdfEndpoints: Record<string, string> = {
  jpgToPdf: 'jpg-to-pdf',
  wordToPdf: 'word-to-pdf',
  powerpointToPdf: 'powerpoint-to-pdf',
  excelToPdf: 'excel-to-pdf',
  htmlToPdf: 'html-to-pdf',
};

export function getConvertToPdfFields(get: (n: string) => unknown, op: string): Record<string, string | undefined> {
  if (op === 'jpgToPdf') return { orientation: String(get('orientation') || 'portrait'), margin: String(get('margin') || '0') };
  if (op === 'htmlToPdf') return { format: String(get('htmlFormat') || 'A4'), landscape: String(get('htmlLandscape') || false) };
  return {};
}
