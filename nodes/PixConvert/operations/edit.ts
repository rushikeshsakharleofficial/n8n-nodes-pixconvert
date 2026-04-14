import { INodeProperties } from 'n8n-workflow';

export const editOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['edit'] } },
    options: [
      { name: 'Rotate PDF', value: 'rotatePdf' },
      { name: 'Add Page Numbers', value: 'addPageNumbers' },
      { name: 'Add Watermark', value: 'addWatermark' },
      { name: 'Crop PDF', value: 'cropPdf' },
      { name: 'Edit PDF', value: 'editPdf' },
    ],
    default: 'rotatePdf',
  },
];

export const editFields: INodeProperties[] = [
  {
    displayName: 'Angle',
    name: 'angle',
    type: 'options',
    displayOptions: { show: { resource: ['edit'], operation: ['rotatePdf'] } },
    options: [
      { name: '90°', value: '90' },
      { name: '180°', value: '180' },
      { name: '270°', value: '270' },
    ],
    default: '90',
    required: true,
  },
  {
    displayName: 'Pages',
    name: 'rotatePages',
    type: 'string',
    displayOptions: { show: { resource: ['edit'], operation: ['rotatePdf'] } },
    default: '',
    placeholder: '1-3,5',
    description: 'Leave empty to rotate all pages',
  },
  {
    displayName: 'Position',
    name: 'pageNumPosition',
    type: 'options',
    displayOptions: { show: { resource: ['edit'], operation: ['addPageNumbers'] } },
    options: [
      { name: 'Bottom Center', value: 'bottom-center' },
      { name: 'Bottom Right', value: 'bottom-right' },
      { name: 'Bottom Left', value: 'bottom-left' },
      { name: 'Top Center', value: 'top-center' },
    ],
    default: 'bottom-center',
  },
  {
    displayName: 'Start From',
    name: 'startFrom',
    type: 'number',
    displayOptions: { show: { resource: ['edit'], operation: ['addPageNumbers'] } },
    default: 1,
  },
  {
    displayName: 'Font Size',
    name: 'pageNumFontSize',
    type: 'number',
    displayOptions: { show: { resource: ['edit'], operation: ['addPageNumbers'] } },
    default: 12,
  },
  {
    displayName: 'Watermark Text',
    name: 'watermarkText',
    type: 'string',
    displayOptions: { show: { resource: ['edit'], operation: ['addWatermark'] } },
    default: 'CONFIDENTIAL',
  },
  {
    displayName: 'Opacity',
    name: 'watermarkOpacity',
    type: 'number',
    displayOptions: { show: { resource: ['edit'], operation: ['addWatermark'] } },
    default: 0.3,
    description: '0.0–1.0',
  },
  {
    displayName: 'Rotation',
    name: 'watermarkRotation',
    type: 'number',
    displayOptions: { show: { resource: ['edit'], operation: ['addWatermark'] } },
    default: 45,
  },
  {
    displayName: 'Crop Top (pt)',
    name: 'cropTop',
    type: 'number',
    displayOptions: { show: { resource: ['edit'], operation: ['cropPdf'] } },
    default: 0,
  },
  {
    displayName: 'Crop Right (pt)',
    name: 'cropRight',
    type: 'number',
    displayOptions: { show: { resource: ['edit'], operation: ['cropPdf'] } },
    default: 0,
  },
  {
    displayName: 'Crop Bottom (pt)',
    name: 'cropBottom',
    type: 'number',
    displayOptions: { show: { resource: ['edit'], operation: ['cropPdf'] } },
    default: 0,
  },
  {
    displayName: 'Crop Left (pt)',
    name: 'cropLeft',
    type: 'number',
    displayOptions: { show: { resource: ['edit'], operation: ['cropPdf'] } },
    default: 0,
  },
  {
    displayName: 'Annotations (JSON)',
    name: 'annotations',
    type: 'string',
    displayOptions: { show: { resource: ['edit'], operation: ['editPdf'] } },
    default: '[]',
    description: 'JSON array of annotation objects',
    required: true,
    typeOptions: { rows: 4 },
  },
];

export const editEndpoints: Record<string, string> = {
  rotatePdf: 'rotate-pdf',
  addPageNumbers: 'add-page-numbers',
  addWatermark: 'add-watermark',
  cropPdf: 'crop-pdf',
  editPdf: 'edit-pdf',
};

export function getEditFields(get: (n: string) => unknown, op: string): Record<string, string | undefined> {
  if (op === 'rotatePdf') return { angle: String(get('angle')), pages: String(get('rotatePages') || '') || undefined };
  if (op === 'addPageNumbers') return { position: String(get('pageNumPosition') || 'bottom-center'), startFrom: String(get('startFrom') || '1'), fontSize: String(get('pageNumFontSize') || '12') };
  if (op === 'addWatermark') return { text: String(get('watermarkText') || ''), opacity: String(get('watermarkOpacity') || '0.3'), rotation: String(get('watermarkRotation') || '45') };
  if (op === 'cropPdf') return { top: String(get('cropTop') || '0'), right: String(get('cropRight') || '0'), bottom: String(get('cropBottom') || '0'), left: String(get('cropLeft') || '0') };
  if (op === 'editPdf') return { annotations: String(get('annotations') || '[]') };
  return {};
}
