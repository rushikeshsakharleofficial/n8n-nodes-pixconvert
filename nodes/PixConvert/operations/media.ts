import { INodeProperties } from 'n8n-workflow';

export const mediaOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['media'] } },
    options: [
      { name: 'Universal Convert', value: 'universalConvert', description: 'Convert any supported format' },
      { name: 'GIF Maker', value: 'gifMaker', description: 'Create animated GIF from images' },
    ],
    default: 'universalConvert',
  },
];

export const mediaFields: INodeProperties[] = [
  {
    displayName: 'Target Format',
    name: 'convertTo',
    type: 'string',
    displayOptions: { show: { resource: ['media'], operation: ['universalConvert'] } },
    default: '',
    placeholder: 'mp4',
    description: 'Output format extension (e.g. mp4, webm, mp3)',
    required: true,
  },
  {
    displayName: 'Frame Delay (ms)',
    name: 'gifDelay',
    type: 'number',
    displayOptions: { show: { resource: ['media'], operation: ['gifMaker'] } },
    default: 100,
  },
  {
    displayName: 'Loop Count',
    name: 'gifLoop',
    type: 'number',
    displayOptions: { show: { resource: ['media'], operation: ['gifMaker'] } },
    default: 0,
    description: '0 = infinite loop',
  },
];

export const mediaEndpoints: Record<string, string> = {
  universalConvert: 'convert',
  gifMaker: 'gif',
};

export function getMediaFields(get: (n: string) => unknown, op: string): Record<string, string | undefined> {
  if (op === 'universalConvert') return { to: String(get('convertTo')) };
  if (op === 'gifMaker') return { delay: String(get('gifDelay') || '100'), loop: String(get('gifLoop') ?? '0') };
  return {};
}
