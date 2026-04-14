import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class PixConvertApi implements ICredentialType {
  name = 'pixConvertApi';
  displayName = 'PixConvert API';
  documentationUrl = 'https://github.com/rushikeshsakharleofficial/n8n-nodes-pixconvert';
  properties: INodeProperties[] = [
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: '',
      placeholder: 'https://your-server.com',
      description: 'The base URL of your PixConvert API server (no trailing slash)',
      required: true,
    },
  ];
}
