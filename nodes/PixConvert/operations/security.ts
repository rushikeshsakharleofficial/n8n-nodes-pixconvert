import { INodeProperties } from 'n8n-workflow';

export const securityOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['security'] } },
    options: [
      { name: 'Unlock PDF', value: 'unlockPdf', description: 'Remove password protection' },
      { name: 'Lock PDF', value: 'lockPdf', description: 'Password-protect a PDF' },
      { name: 'Sign PDF', value: 'signPdf', description: 'Place signature image on a page' },
      { name: 'Redact PDF', value: 'redactPdf', description: 'Black out regions' },
      { name: 'Compare PDF', value: 'comparePdf', description: 'Visual diff between two PDFs' },
    ],
    default: 'unlockPdf',
  },
];

export const securityFields: INodeProperties[] = [
  {
    displayName: 'Password',
    name: 'password',
    type: 'string',
    typeOptions: { password: true },
    displayOptions: { show: { resource: ['security'], operation: ['unlockPdf', 'lockPdf'] } },
    default: '',
    description: 'For lockPdf: password to set. For unlockPdf: existing password (if any).',
    required: true,
  },
  {
    displayName: 'Signature Binary Property',
    name: 'signatureProp',
    type: 'string',
    displayOptions: { show: { resource: ['security'], operation: ['signPdf'] } },
    default: 'signature',
    description: 'Name of the binary property containing the signature image',
  },
  {
    displayName: 'Page',
    name: 'signPage',
    type: 'number',
    displayOptions: { show: { resource: ['security'], operation: ['signPdf'] } },
    default: 1,
  },
  {
    displayName: 'X Position',
    name: 'signX',
    type: 'number',
    displayOptions: { show: { resource: ['security'], operation: ['signPdf'] } },
    default: 50,
  },
  {
    displayName: 'Y Position',
    name: 'signY',
    type: 'number',
    displayOptions: { show: { resource: ['security'], operation: ['signPdf'] } },
    default: 50,
  },
  {
    displayName: 'Signature Width',
    name: 'signWidth',
    type: 'number',
    displayOptions: { show: { resource: ['security'], operation: ['signPdf'] } },
    default: 150,
  },
  {
    displayName: 'Signature Height',
    name: 'signHeight',
    type: 'number',
    displayOptions: { show: { resource: ['security'], operation: ['signPdf'] } },
    default: 60,
  },
  {
    displayName: 'Second PDF Binary Property',
    name: 'compareProp',
    type: 'string',
    displayOptions: { show: { resource: ['security'], operation: ['comparePdf'] } },
    default: 'data2',
    description: 'Binary property containing the second PDF to compare',
  },
  {
    displayName: 'Regions (JSON)',
    name: 'regions',
    type: 'string',
    displayOptions: { show: { resource: ['security'], operation: ['redactPdf'] } },
    default: '[]',
    description: 'JSON array: [{"page":1,"x":50,"y":100,"width":200,"height":30}]',
    required: true,
    typeOptions: { rows: 4 },
  },
];

export const securityEndpoints: Record<string, string> = {
  unlockPdf: 'unlock-pdf',
  lockPdf: 'lock-pdf',
  signPdf: 'sign-pdf',
  redactPdf: 'redact-pdf',
  comparePdf: 'compare-pdf',
};

export function getSecurityFields(get: (n: string) => unknown, op: string): Record<string, string | undefined> {
  if (op === 'unlockPdf' || op === 'lockPdf') return { password: String(get('password') || '') || undefined };
  if (op === 'signPdf') return { page: String(get('signPage') || '1'), x: String(get('signX') || '50'), y: String(get('signY') || '50'), width: String(get('signWidth') || '150'), height: String(get('signHeight') || '60') };
  if (op === 'redactPdf') return { regions: String(get('regions') || '[]') };
  return {};
}
