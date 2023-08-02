export function validateAzure(option: string, region: string, credentials: string) {
  if (!region) {
    return 'Please set the region';
  }
  if (option === 'retrieve') return;
  if (credentials === '') return 'Please set the credentials';
}
