
/**
 * Deep crawler service for large e-commerce sites
 * Specialized in handling furniture catalogs and other large product collections
 */

import { DeepCrawlerCore } from './crawler/deepCrawlerCore';
import { DeepCrawlerOptions } from './crawler/types';

export class DeepCrawler extends DeepCrawlerCore {
  constructor(url: string, options: DeepCrawlerOptions) {
    super(url, options);
  }
}
