import { INodeProperties } from 'n8n-workflow';

export const organizeOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['organize'] } },
    options: [
      { name: 'Merge PDF', value: 'mergePdf', description: 'Merge multiple PDFs into one' },
      { name: 'Split PDF', value: 'splitPdf', description: 'Split into individual pages or ranges' },
      { name: 'Remove Pages', value: 'removePages', description: 'Remove specific pages' },
      { name: 'Extract Pages', value: 'extractPages', description: 'Extract pages into a new PDF' },
      { name: 'Organize PDF', value: 'organizePdf', description: 'Reorder pages' },
      { name: 'Scan to PDF', value: 'scanToPdf', description: 'Convert images to PDF' },
    ],
    default: 'mergePdf',
  },
];

export const organizeFields: INodeProperties[] = [
  {
    displayName: 'Pages',
    name: 'pages',
    type: 'string',
    displayOptions: { show: { resource: ['organize'], operation: ['splitPdf', 'removePages', 'extractPages'] } },
    default: '',
    placeholder: '1-3,5',
    description: 'Page range (e.g. "1-3,5"). Required for removePages and extractPages.',
  },
  {
    displayName: 'Page Order',
    name: 'order',
    type: 'string',
    displayOptions: { show: { resource: ['organize'], operation: ['organizePdf'] } },
    default: '',
    placeholder: '[3,1,2]',
    description: 'JSON array of 1-based page numbers in desired order',
    required: true,
  },
];

export const organizeEndpoints: Record<string, string> = {
  mergePdf: 'merge-pdf',
  splitPdf: 'split-pdf',
  removePages: 'remove-pages',
  extractPages: 'extract-pages',
  organizePdf: 'organize-pdf',
  scanToPdf: 'scan-to-pdf',
};

export function getOrganizeFields(get: (n: string) => unknown, op: string): Record<string, string | undefined> {
  if (['splitPdf', 'removePages', 'extractPages'].includes(op)) return { pages: String(get('pages') || '') || undefined };
  if (op === 'organizePdf') return { order: String(get('order')) };
  return {};
}
