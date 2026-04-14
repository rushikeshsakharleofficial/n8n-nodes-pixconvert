import { PixConvertApi } from '../credentials/PixConvertApi.credentials';

describe('PixConvertApi credential', () => {
  it('has correct name and displayName', () => {
    const cred = new PixConvertApi();
    expect(cred.name).toBe('pixConvertApi');
    expect(cred.displayName).toBe('PixConvert API');
  });

  it('has an apiUrl property of type string', () => {
    const cred = new PixConvertApi();
    const apiUrlProp = cred.properties.find((p) => p.name === 'apiUrl');
    expect(apiUrlProp).toBeDefined();
    expect(apiUrlProp?.type).toBe('string');
  });
});
