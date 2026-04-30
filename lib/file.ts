export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Unable to read PDF attachment.'));
        return;
      }
      resolve(result.split(',')[1] ?? result);
    };
    reader.onerror = () => reject(reader.error ?? new Error('Unable to read PDF attachment.'));
    reader.readAsDataURL(blob);
  });
}
