import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeOperationError } from 'n8n-workflow';

import { organizeOperations, organizeFields, organizeEndpoints, getOrganizeFields } from './operations/organize';
import { optimizeOperations, optimizeFields, optimizeEndpoints, getOptimizeFields } from './operations/optimize';
import { convertToPdfOperations, convertToPdfFields, convertToPdfEndpoints, getConvertToPdfFields } from './operations/convertToPdf';
import { convertFromPdfOperations, convertFromPdfFields, convertFromPdfEndpoints, getConvertFromPdfFields } from './operations/convertFromPdf';
import { editOperations, editFields, editEndpoints, getEditFields } from './operations/edit';
import { securityOperations, securityFields, securityEndpoints, getSecurityFields } from './operations/security';
import { imageOperations, imageFields, imageEndpoints, getImageFields } from './operations/image';
import { mediaOperations, mediaFields, mediaEndpoints, getMediaFields } from './operations/media';
import { pixConvertRequest } from './transport';

const ALL_ENDPOINTS: Record<string, string> = {
  ...organizeEndpoints,
  ...optimizeEndpoints,
  ...convertToPdfEndpoints,
  ...convertFromPdfEndpoints,
  ...editEndpoints,
  ...securityEndpoints,
  ...imageEndpoints,
  ...mediaEndpoints,
};

function getExtraFields(
  get: (n: string) => unknown,
  resource: string,
  operation: string,
): Record<string, string | undefined> {
  if (resource === 'organize') return getOrganizeFields(get, operation);
  if (resource === 'optimize') return getOptimizeFields(get, operation);
  if (resource === 'convertToPdf') return getConvertToPdfFields(get, operation);
  if (resource === 'convertFromPdf') return getConvertFromPdfFields(get, operation);
  if (resource === 'edit') return getEditFields(get, operation);
  if (resource === 'security') return getSecurityFields(get, operation);
  if (resource === 'image') return getImageFields(get, operation);
  if (resource === 'media') return getMediaFields(get, operation);
  return {};
}

export class PixConvert implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'PixConvert',
    name: 'pixConvert',
    icon: 'file:pixconvert.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
    description: 'Process PDF and image files using the PixConvert API',
    defaults: { name: 'PixConvert' },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [{ name: 'pixConvertApi', required: true }],
    properties: [
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Organize PDF', value: 'organize' },
          { name: 'Optimize PDF', value: 'optimize' },
          { name: 'Convert to PDF', value: 'convertToPdf' },
          { name: 'Convert from PDF', value: 'convertFromPdf' },
          { name: 'Edit PDF', value: 'edit' },
          { name: 'PDF Security', value: 'security' },
          { name: 'Image Conversion', value: 'image' },
          { name: 'Media', value: 'media' },
        ],
        default: 'organize',
      },

      // Operation dropdowns (one per resource, filtered by displayOptions)
      ...organizeOperations,
      ...optimizeOperations,
      ...convertToPdfOperations,
      ...convertFromPdfOperations,
      ...editOperations,
      ...securityOperations,
      ...imageOperations,
      ...mediaOperations,

      // Input source
      {
        displayName: 'Input Source',
        name: 'inputSource',
        type: 'options',
        options: [
          { name: 'Binary Input (file from previous node)', value: 'binary' },
          { name: 'URL', value: 'url' },
        ],
        default: 'binary',
      },
      {
        displayName: 'Binary Property',
        name: 'binaryPropertyName',
        type: 'string',
        displayOptions: { show: { inputSource: ['binary'] } },
        default: 'data',
        description: 'Name of the binary property containing the input file',
      },
      {
        displayName: 'File URL',
        name: 'fileUrl',
        type: 'string',
        displayOptions: { show: { inputSource: ['url'] } },
        default: '',
        placeholder: 'https://example.com/file.pdf',
      },

      // Second file for compare/sign
      {
        displayName: 'Second File Binary Property',
        name: 'binaryPropertyName2',
        type: 'string',
        displayOptions: { show: { resource: ['security'], operation: ['comparePdf', 'signPdf'] } },
        default: 'data2',
        description: 'Binary property for second file (compare target or signature image)',
      },

      // Output mode
      {
        displayName: 'Output Mode',
        name: 'outputMode',
        type: 'options',
        options: [
          { name: 'Binary (file as n8n binary item)', value: 'binary' },
          { name: 'URL (returns download link)', value: 'url' },
        ],
        default: 'binary',
      },

      // Per-operation fields
      ...organizeFields,
      ...optimizeFields,
      ...convertToPdfFields,
      ...convertFromPdfFields,
      ...editFields,
      ...securityFields,
      ...imageFields,
      ...mediaFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials('pixConvertApi');
    const apiUrl = credentials.apiUrl as string;

    for (let i = 0; i < items.length; i++) {
      const resource = this.getNodeParameter('resource', i) as string;
      const operation = this.getNodeParameter('operation', i) as string;
      const inputSource = this.getNodeParameter('inputSource', i) as 'binary' | 'url';
      const outputMode = this.getNodeParameter('outputMode', i) as 'binary' | 'url';

      const endpoint = ALL_ENDPOINTS[operation];
      if (!endpoint) throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);

      const get = (name: string) => this.getNodeParameter(name, i, '');
      const formFields = getExtraFields(get, resource, operation);

      let fileBuffer: Buffer | undefined;
      let fileName: string | undefined;
      let fileMimeType: string | undefined;
      let fileBuffer2: Buffer | undefined;
      let fileName2: string | undefined;

      if (inputSource === 'binary') {
        const prop = this.getNodeParameter('binaryPropertyName', i, 'data') as string;
        const bin = items[i].binary?.[prop];
        if (!bin) throw new NodeOperationError(this.getNode(), `No binary data in property "${prop}"`, { itemIndex: i });
        fileBuffer = await this.helpers.getBinaryDataBuffer(i, prop);
        fileName = bin.fileName ?? 'input.bin';
        fileMimeType = bin.mimeType;
      } else {
        formFields['url'] = this.getNodeParameter('fileUrl', i, '') as string;
      }

      // Second file (compare / sign)
      if (resource === 'security' && (operation === 'comparePdf' || operation === 'signPdf')) {
        const prop2 = this.getNodeParameter('binaryPropertyName2', i, 'data2') as string;
        const bin2 = items[i].binary?.[prop2];
        if (bin2) {
          fileBuffer2 = await this.helpers.getBinaryDataBuffer(i, prop2);
          fileName2 = bin2.fileName ?? 'input2.bin';
        }
      }

      try {
        let result;
        try {
          result = await pixConvertRequest({ apiUrl, endpoint, formFields, fileBuffer, fileName, fileMimeType, fileBuffer2, fileName2, outputMode });
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          if (msg.includes('Rate limit')) {
            await new Promise((r) => setTimeout(r, 1000));
            result = await pixConvertRequest({ apiUrl, endpoint, formFields, fileBuffer, fileName, fileMimeType, fileBuffer2, fileName2, outputMode });
          } else {
            throw err;
          }
        }

        if (result.type === 'url') {
          returnData.push({ json: { url: result.url } });
        } else {
          const binaryData = await this.helpers.prepareBinaryData(result.buffer, result.fileName, result.mimeType);
          returnData.push({ json: {}, binary: { data: binaryData } });
        }
      } catch (err: unknown) {
        throw new NodeOperationError(this.getNode(), err instanceof Error ? err.message : String(err), { itemIndex: i });
      }
    }

    return [returnData];
  }
}
