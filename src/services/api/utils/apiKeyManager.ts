
export const apiKeyManager = {
  async getApiKey(): Promise<string | null> {
    try {
      // In a real app, this should use secure storage
      const apiKey = localStorage.getItem('firecrawl_api_key');
      return apiKey;
    } catch (error) {
      console.error('Error getting API key:', error);
      return null;
    }
  },

  async setApiKey(apiKey: string): Promise<boolean> {
    try {
      localStorage.setItem('firecrawl_api_key', apiKey);
      return true;
    } catch (error) {
      console.error('Error setting API key:', error);
      return false;
    }
  }
};
