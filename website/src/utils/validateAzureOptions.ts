export function validateAzure(option: string, region: string, credentials: string) {
  if (option === 'retrieve') return;
  if (credentials === '') return 'Please set the credentials';
  if (!region) return 'Please set the region';
}
