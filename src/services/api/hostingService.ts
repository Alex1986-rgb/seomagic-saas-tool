
import axios from 'axios';
import { Buffer } from 'buffer';

export interface HostingCredentials {
  provider: 'ftp' | 'beget' | 'cpanel';
  host?: string;
  username: string;
  password: string;
  apiKey?: string;
  port?: number;
  path?: string;
}

export interface DeployResult {
  success: boolean;
  message: string;
  url?: string;
  error?: string;
}

class HostingService {
  private credentials: HostingCredentials | null = null;
  
  /**
   * Set hosting credentials
   */
  setCredentials(credentials: HostingCredentials): void {
    this.credentials = credentials;
  }
  
  /**
   * Clear hosting credentials
   */
  clearCredentials(): void {
    this.credentials = null;
  }
  
  /**
   * Deploy a site to a hosting provider
   */
  async deploySite(domain: string, siteZip: Blob): Promise<DeployResult> {
    if (!this.credentials) {
      return {
        success: false,
        message: 'No hosting credentials set',
        error: 'No hosting credentials set'
      };
    }
    
    try {
      switch (this.credentials.provider) {
        case 'beget':
          return await this.deployToBeget(domain, siteZip);
        case 'ftp':
          return await this.deployToFtp(domain, siteZip);
        case 'cpanel':
          return await this.deployToCPanel(domain, siteZip);
        default:
          return {
            success: false,
            message: `Unsupported hosting provider: ${this.credentials.provider}`,
            error: `Unsupported hosting provider: ${this.credentials.provider}`
          };
      }
    } catch (error) {
      console.error('Error deploying site:', error);
      
      return {
        success: false,
        message: 'Error deploying site',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Deploy a site to Beget hosting
   */
  private async deployToBeget(domain: string, siteZip: Blob): Promise<DeployResult> {
    if (!this.credentials || !this.credentials.username || !this.credentials.password) {
      throw new Error('Missing Beget credentials');
    }
    
    try {
      // Convert Blob to base64
      const arrayBuffer = await siteZip.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      
      // Call Beget API to deploy the site
      const response = await axios.post(
        'https://api.beget.com/v1/site/upload',
        {
          login: this.credentials.username,
          passwd: this.credentials.password,
          domain: domain,
          archive: base64
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.status === 'success') {
        return {
          success: true,
          message: 'Site deployed successfully to Beget',
          url: `https://${domain}`
        };
      } else {
        return {
          success: false,
          message: 'Error deploying site to Beget',
          error: response.data.error || 'Unknown error'
        };
      }
    } catch (error) {
      console.error('Error deploying to Beget:', error);
      
      return {
        success: false,
        message: 'Error deploying site to Beget',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Deploy a site via FTP
   */
  private async deployToFtp(domain: string, siteZip: Blob): Promise<DeployResult> {
    // Note: As browser-based FTP is limited, this would typically be handled by a server
    // This is a simplified implementation for demonstration purposes
    return {
      success: false,
      message: 'Browser-based FTP deployment not supported',
      error: 'For FTP deployment, use the download option and upload manually, or use our server-side deployment feature.'
    };
  }
  
  /**
   * Deploy a site to cPanel hosting
   */
  private async deployToCPanel(domain: string, siteZip: Blob): Promise<DeployResult> {
    if (!this.credentials || !this.credentials.host || !this.credentials.username || !this.credentials.password) {
      throw new Error('Missing cPanel credentials');
    }
    
    try {
      // Convert Blob to base64
      const arrayBuffer = await siteZip.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      
      // Call cPanel API to deploy the site
      const response = await axios.post(
        `https://${this.credentials.host}:2083/execute/WebDeploy/upload_file`,
        {
          dir: this.credentials.path || `/public_html`,
          file_name: `${domain}-optimized.zip`,
          file_data: base64,
          overwrite: 1
        },
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${this.credentials.username}:${this.credentials.password}`).toString('base64')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.status) {
        // Extract the file after upload
        const extractResponse = await axios.post(
          `https://${this.credentials.host}:2083/execute/WebDeploy/extract_file`,
          {
            dir: this.credentials.path || `/public_html`,
            file_name: `${domain}-optimized.zip`,
            overwrite: 1
          },
          {
            headers: {
              'Authorization': `Basic ${Buffer.from(`${this.credentials.username}:${this.credentials.password}`).toString('base64')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (extractResponse.data.status) {
          return {
            success: true,
            message: 'Site deployed successfully to cPanel',
            url: `https://${domain}`
          };
        } else {
          return {
            success: false,
            message: 'Error extracting archive on cPanel',
            error: extractResponse.data.errors || 'Unknown error'
          };
        }
      } else {
        return {
          success: false,
          message: 'Error uploading archive to cPanel',
          error: response.data.errors || 'Unknown error'
        };
      }
    } catch (error) {
      console.error('Error deploying to cPanel:', error);
      
      return {
        success: false,
        message: 'Error deploying site to cPanel',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const hostingService = new HostingService();
