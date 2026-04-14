import { PixConvertApi } from '../credentials/PixConvertApi.credentials';

describe('PixConvertApi credential', () => {
  it('has correct name and displayName', () => {
    const cred = new PixConvertApi();
    expect(cred.name).toBe('pixConvertApi');
    expect(cred.displayName).toBe('PixConvert API');
  });

  it('has a baseUrl property of type string', () => {
    const cred = new PixConvertApi();
    const baseUrlProp = cred.properties.find((p) => p.name === 'baseUrl');
    expect(baseUrlProp).toBeDefined();
    expect(baseUrlProp?.type).toBe('string');
  });
});
