import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class PixConvertApi implements ICredentialType {
  name = 'pixConvertApi';
  displayName = 'PixConvert API';
  documentationUrl = 'https://github.com/rushikeshsakharleofficial/n8n-nodes-pixconvert';
  properties: INodeProperties[] = [
    {
      displayName: 'API URL',
      name: 'apiUrl',
      type: 'string',
      default: '',
      placeholder: 'https://your-server.com/api/v1',
      description: 'Your PixConvert API URL including /api/v1 — no trailing slash',
      required: true,
    },
  ];
}
