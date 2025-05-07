
export class CrawlerBase {
  protected url: string;
  protected options: any;
  
  constructor(url: string, options: any) {
    this.url = url;
    this.options = options || {};
  }
  
  getDomain(): string {
    try {
      return new URL(this.url).hostname;
    } catch (e) {
      return '';
    }
  }
  
  getBaseUrl(): string {
    try {
      const urlObj = new URL(this.url);
      return `${urlObj.protocol}//${urlObj.hostname}`;
    } catch (e) {
      return this.url;
    }
  }
}
