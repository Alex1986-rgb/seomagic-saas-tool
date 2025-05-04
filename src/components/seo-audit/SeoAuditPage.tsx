
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, AlertCircle, FileDown, Globe, History, RotateCw, Search, Settings, Upload, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SeoAuditController, AuditOptions, PublishOptions, AuditHistory } from "@/services/audit/SeoAuditController";
import { SeoAuditResult } from "@/services/audit/seoAuditor/SeoAuditor";
import { PageContent } from "@/services/audit/crawler/WebCrawler";

const SeoAuditPage: React.FC = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState<string>('');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<SeoAuditResult | null>(null);
  const [pages, setPages] = useState<Map<string, PageContent>>(new Map());
  const [optimizedHtml, setOptimizedHtml] = useState<Map<string, string>>(new Map());
  const [crawlProgress, setCrawlProgress] = useState<{
    pagesScanned: number;
    estimatedTotal: number;
    currentUrl: string;
    stage: string;
  }>({ pagesScanned: 0, estimatedTotal: 0, currentUrl: '', stage: '' });
  const [activeTab, setActiveTab] = useState<string>('scan');
  const [auditHistory, setAuditHistory] = useState<AuditHistory[]>([]);
  const [auditOptions, setAuditOptions] = useState<AuditOptions>({
    maxPages: 100,
    maxDepth: 3,
    includeAssets: false,
    followExternalLinks: false
  });
  const [publishOptions, setPublishOptions] = useState<PublishOptions>({
    host: '',
    username: '',
    password: '',
    path: '/'
  });
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  
  const auditController = new SeoAuditController();
  
  // Load audit history on component mount
  useEffect(() => {
    const history = auditController.getAuditHistory();
    setAuditHistory(history);
  }, []);
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };
  
  const handleAuditOptionsChange = (key: keyof AuditOptions, value: any) => {
    setAuditOptions(prev => ({ ...prev, [key]: value }));
  };
  
  const handlePublishOptionsChange = (key: keyof PublishOptions, value: any) => {
    setPublishOptions(prev => ({ ...prev, [key]: value }));
  };
  
  const handleStartAudit = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a website URL to audit",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsAuditing(true);
      setActiveTab('scan');
      setAuditResult(null);
      setPages(new Map());
      setOptimizedHtml(new Map());
      
      toast({
        title: "Starting Audit",
        description: `Beginning SEO audit for ${url}`
      });
      
      // Start audit with progress callback
      const result = await auditController.auditWebsite(
        url,
        auditOptions,
        (progress) => {
          setCrawlProgress({
            pagesScanned: progress.pagesScanned,
            estimatedTotal: progress.estimatedTotal,
            currentUrl: progress.currentUrl,
            stage: progress.stage
          });
        }
      );
      
      // Get pages from the crawler and store them
      const crawledPages = new Map<string, PageContent>();
      result.optimizedPages.forEach((html, pageUrl) => {
        // Find the original page from the audit result
        // In a real implementation, we'd have direct access to the pages
        crawledPages.set(pageUrl, {
          url: pageUrl,
          html: '', // We don't need the original HTML
          title: '',
          meta: { description: '', keywords: '', canonical: '', robots: '', ogTags: {} },
          headings: { h1: [], h2: [], h3: [], h4: [], h5: [], h6: [] },
          images: [],
          links: { internal: [], external: [] },
          wordCount: 0,
          issues: []
        });
      });
      
      setAuditResult(result);
      setPages(crawledPages);
      setOptimizedHtml(result.optimizedPages);
      setActiveTab('results');
      
      toast({
        title: "Audit Complete",
        description: `SEO audit completed with a score of ${result.score}/100`
      });
    } catch (error) {
      console.error('Error during audit:', error);
      toast({
        title: "Audit Failed",
        description: "An error occurred during the audit. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAuditing(false);
    }
  };
  
  const handleDownloadOptimizedSite = async () => {
    if (!auditResult || pages.size === 0 || optimizedHtml.size === 0) {
      toast({
        title: "No Audit Result",
        description: "Please complete an audit first",
        variant: "destructive"
      });
      return;
    }
    
    try {
      toast({
        title: "Preparing Download",
        description: "Creating optimized site archive..."
      });
      
      await auditController.downloadOptimizedSite(url, pages, optimizedHtml);
      
      toast({
        title: "Download Started",
        description: "Your optimized site is being downloaded"
      });
    } catch (error) {
      console.error('Error downloading site:', error);
      toast({
        title: "Download Failed",
        description: "An error occurred while preparing the download",
        variant: "destructive"
      });
    }
  };
  
  const handlePublishSite = async () => {
    if (!auditResult || pages.size === 0 || optimizedHtml.size === 0) {
      toast({
        title: "No Audit Result",
        description: "Please complete an audit first",
        variant: "destructive"
      });
      return;
    }
    
    if (!publishOptions.host || !publishOptions.username || !publishOptions.password) {
      toast({
        title: "Missing Publish Information",
        description: "Please fill in all required fields for publishing",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsPublishing(true);
      
      toast({
        title: "Publishing Site",
        description: `Uploading optimized site to ${publishOptions.host}...`
      });
      
      const success = await auditController.publishOptimizedSite(
        url,
        pages,
        optimizedHtml,
        publishOptions
      );
      
      if (success) {
        toast({
          title: "Site Published",
          description: "Your optimized site has been successfully published"
        });
      } else {
        toast({
          title: "Publish Failed",
          description: "An error occurred during publishing",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error publishing site:', error);
      toast({
        title: "Publish Failed",
        description: "An error occurred while publishing the site",
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  };
  
  // Render issues summary
  const renderIssuesSummary = () => {
    if (!auditResult) return null;
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg font-semibold">Critical Issues</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {auditResult.issues.critical.length}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg font-semibold">Important Issues</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {auditResult.issues.important.length}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg font-semibold">Opportunities</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {auditResult.issues.opportunities.length}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg font-semibold">Passed Tests</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {auditResult.issues.passed.length}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  // Render recommendations
  const renderRecommendations = () => {
    if (!auditResult) return null;
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>Actions to improve your site's SEO performance</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {auditResult.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">SEO Audit & Optimization</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <TabsTrigger value="scan">
            <Search className="mr-2 h-4 w-4" />
            Scan Website
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!auditResult}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="download" disabled={!auditResult}>
            <FileDown className="mr-2 h-4 w-4" />
            Download
          </TabsTrigger>
          <TabsTrigger value="publish" disabled={!auditResult}>
            <Globe className="mr-2 h-4 w-4" />
            Publish
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>
        
        {/* Scan Website Tab */}
        <TabsContent value="scan">
          <Card>
            <CardHeader>
              <CardTitle>Scan Website for SEO Audit</CardTitle>
              <CardDescription>
                Enter the URL of the website you want to analyze and optimize for SEO
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="url">Website URL</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="url" 
                      value={url}
                      onChange={handleUrlChange}
                      placeholder="e.g. example.com"
                      className="flex-1"
                      disabled={isAuditing}
                    />
                    <Button 
                      onClick={handleStartAudit}
                      disabled={isAuditing || !url}
                    >
                      {isAuditing ? 
                        <RotateCw className="mr-2 h-4 w-4 animate-spin" /> : 
                        <Search className="mr-2 h-4 w-4" />
                      }
                      {isAuditing ? "Scanning..." : "Start Audit"}
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Audit Options
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxPages">Maximum Pages to Scan</Label>
                      <Input 
                        id="maxPages" 
                        type="number" 
                        value={auditOptions.maxPages}
                        onChange={(e) => handleAuditOptionsChange('maxPages', parseInt(e.target.value, 10))}
                        disabled={isAuditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maxDepth">Maximum Crawl Depth</Label>
                      <Input 
                        id="maxDepth" 
                        type="number" 
                        value={auditOptions.maxDepth}
                        onChange={(e) => handleAuditOptionsChange('maxDepth', parseInt(e.target.value, 10))}
                        disabled={isAuditing}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="includeAssets" 
                        checked={auditOptions.includeAssets}
                        onCheckedChange={(checked) => handleAuditOptionsChange('includeAssets', !!checked)}
                        disabled={isAuditing}
                      />
                      <Label htmlFor="includeAssets">Include Assets (CSS, JS, images)</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="followExternalLinks" 
                        checked={auditOptions.followExternalLinks}
                        onCheckedChange={(checked) => handleAuditOptionsChange('followExternalLinks', !!checked)}
                        disabled={isAuditing}
                      />
                      <Label htmlFor="followExternalLinks">Follow External Links</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {isAuditing && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Audit Progress</CardTitle>
                <CardDescription>
                  {crawlProgress.stage === 'sitemap' && "Extracting URLs from sitemap.xml..."}
                  {crawlProgress.stage === 'crawling' && "Crawling website pages..."}
                  {crawlProgress.stage === 'analyzing' && "Analyzing page content..."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress 
                    value={crawlProgress.estimatedTotal ? 
                      Math.round((crawlProgress.pagesScanned / crawlProgress.estimatedTotal) * 100) : 0
                    } 
                  />
                  
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{crawlProgress.pagesScanned} pages scanned</span>
                    <span>~{crawlProgress.estimatedTotal} total pages</span>
                  </div>
                  
                  {crawlProgress.currentUrl && (
                    <div className="text-sm truncate">
                      <span className="font-semibold">Current URL:</span> {crawlProgress.currentUrl}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Results Tab */}
        <TabsContent value="results">
          {auditResult && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Audit Results for {auditResult.url}</CardTitle>
                  <CardDescription>
                    Total pages analyzed: {auditResult.summary.totalPages}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Overall Score</h3>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                      <div 
                        className={`h-4 rounded-full ${
                          auditResult.score >= 90 ? 'bg-green-500' :
                          auditResult.score >= 70 ? 'bg-yellow-500' :
                          auditResult.score >= 50 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${auditResult.score}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-sm">0</span>
                      <span className="text-lg font-bold">{auditResult.score}/100</span>
                      <span className="text-sm">100</span>
                    </div>
                  </div>
                  
                  {renderIssuesSummary()}
                  
                  {renderRecommendations()}
                </CardContent>
                <CardFooter>
                  <div className="flex gap-4 flex-wrap">
                    <Button onClick={() => setActiveTab('download')}>
                      <FileDown className="mr-2 h-4 w-4" />
                      Download Optimized Site
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab('publish')}>
                      <Globe className="mr-2 h-4 w-4" />
                      Publish to Subdomain
                    </Button>
                  </div>
                </CardFooter>
              </Card>
              
              {/* Issues Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="critical">
                    <TabsList>
                      <TabsTrigger value="critical">
                        Critical ({auditResult.issues.critical.length})
                      </TabsTrigger>
                      <TabsTrigger value="important">
                        Important ({auditResult.issues.important.length})
                      </TabsTrigger>
                      <TabsTrigger value="opportunities">
                        Opportunities ({auditResult.issues.opportunities.length})
                      </TabsTrigger>
                      <TabsTrigger value="minor">
                        Minor ({auditResult.issues.minor.length})
                      </TabsTrigger>
                      <TabsTrigger value="passed">
                        Passed ({auditResult.issues.passed.length})
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="critical" className="pt-4">
                      {auditResult.issues.critical.length > 0 ? (
                        <div className="space-y-4">
                          {auditResult.issues.critical.map((issue, index) => (
                            <Alert key={index} variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>{issue.title}</AlertTitle>
                              <AlertDescription>{issue.description}</AlertDescription>
                              {issue.affectedUrls.length > 0 && (
                                <div className="mt-2">
                                  <p className="font-semibold">Affected pages: {issue.affectedUrls.length}</p>
                                  <ul className="max-h-40 overflow-y-auto text-sm">
                                    {issue.affectedUrls.slice(0, 5).map((url, urlIndex) => (
                                      <li key={urlIndex} className="truncate">{url}</li>
                                    ))}
                                    {issue.affectedUrls.length > 5 && (
                                      <li>...and {issue.affectedUrls.length - 5} more</li>
                                    )}
                                  </ul>
                                </div>
                              )}
                            </Alert>
                          ))}
                        </div>
                      ) : (
                        <p>No critical issues found.</p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="important" className="pt-4">
                      {auditResult.issues.important.length > 0 ? (
                        <div className="space-y-4">
                          {auditResult.issues.important.map((issue, index) => (
                            <Alert key={index}>
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>{issue.title}</AlertTitle>
                              <AlertDescription>{issue.description}</AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      ) : (
                        <p>No important issues found.</p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="opportunities" className="pt-4">
                      {auditResult.issues.opportunities.length > 0 ? (
                        <div className="space-y-4">
                          {auditResult.issues.opportunities.map((issue, index) => (
                            <Alert key={index} variant="default">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>{issue.title}</AlertTitle>
                              <AlertDescription>{issue.description}</AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      ) : (
                        <p>No opportunities found.</p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="minor" className="pt-4">
                      {auditResult.issues.minor.length > 0 ? (
                        <div className="space-y-4">
                          {auditResult.issues.minor.map((issue, index) => (
                            <Alert key={index}>
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>{issue.title}</AlertTitle>
                              <AlertDescription>{issue.description}</AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      ) : (
                        <p>No minor issues found.</p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="passed" className="pt-4">
                      {auditResult.issues.passed.length > 0 ? (
                        <div className="space-y-4">
                          {auditResult.issues.passed.map((issue, index) => (
                            <Alert key={index} className="bg-green-50 dark:bg-green-900/10 border-green-200">
                              <Check className="h-4 w-4 text-green-500" />
                              <AlertTitle>{issue.title}</AlertTitle>
                              <AlertDescription>{issue.description}</AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      ) : (
                        <p>No passed tests yet.</p>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
          
          {!auditResult && (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <AlertCircle className="mx-auto h-16 w-16 text-gray-400" />
                  <h3 className="mt-4 text-xl font-semibold">No Audit Results</h3>
                  <p className="mt-2 text-gray-500">
                    Please complete a website scan to view audit results.
                  </p>
                  <Button className="mt-6" onClick={() => setActiveTab('scan')}>
                    <Search className="mr-2 h-4 w-4" />
                    Start New Audit
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Download Tab */}
        <TabsContent value="download">
          {auditResult ? (
            <Card>
              <CardHeader>
                <CardTitle>Download Optimized Website</CardTitle>
                <CardDescription>
                  Get a fully optimized version of your website with all SEO improvements applied
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Alert className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertTitle>About the optimized site</AlertTitle>
                    <AlertDescription>
                      The downloaded ZIP file contains a complete optimized copy of your website with the following improvements:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Optimized meta titles and descriptions</li>
                        <li>Proper heading structure (H1-H6)</li>
                        <li>Alt text for all images</li>
                        <li>Generated XML sitemap</li>
                        <li>Optimized robots.txt</li>
                        <li>Added schema.org structured data</li>
                        <li>Added Open Graph tags for social sharing</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                  
                  <div className="text-center">
                    <Button size="lg" onClick={handleDownloadOptimizedSite}>
                      <FileDown className="mr-2 h-5 w-5" />
                      Download Optimized Site (ZIP)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <AlertCircle className="mx-auto h-16 w-16 text-gray-400" />
                  <h3 className="mt-4 text-xl font-semibold">No Audit Results</h3>
                  <p className="mt-2 text-gray-500">
                    Please complete a website scan to download an optimized version.
                  </p>
                  <Button className="mt-6" onClick={() => setActiveTab('scan')}>
                    <Search className="mr-2 h-4 w-4" />
                    Start New Audit
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Publish Tab */}
        <TabsContent value="publish">
          {auditResult ? (
            <Card>
              <CardHeader>
                <CardTitle>Publish to Subdomain</CardTitle>
                <CardDescription>
                  Deploy the optimized version of your website to a subdomain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>FTP/WebDAV Credentials Required</AlertTitle>
                    <AlertDescription>
                      To publish your optimized website, you need to provide FTP or WebDAV credentials for your hosting server.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="host">FTP Host</Label>
                        <Input 
                          id="host"
                          placeholder="ftp.example.com"
                          value={publishOptions.host}
                          onChange={(e) => handlePublishOptionsChange('host', e.target.value)}
                          disabled={isPublishing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="port">Port (optional)</Label>
                        <Input 
                          id="port" 
                          placeholder="21"
                          value={publishOptions.port || ''}
                          onChange={(e) => handlePublishOptionsChange('port', e.target.value ? parseInt(e.target.value, 10) : undefined)}
                          disabled={isPublishing}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input 
                          id="username"
                          value={publishOptions.username}
                          onChange={(e) => handlePublishOptionsChange('username', e.target.value)}
                          disabled={isPublishing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                          id="password" 
                          type="password"
                          value={publishOptions.password}
                          onChange={(e) => handlePublishOptionsChange('password', e.target.value)}
                          disabled={isPublishing}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="path">Directory Path (optional)</Label>
                      <Input 
                        id="path" 
                        placeholder="/public_html/seo"
                        value={publishOptions.path}
                        onChange={(e) => handlePublishOptionsChange('path', e.target.value)}
                        disabled={isPublishing}
                      />
                      <p className="text-sm text-gray-500">
                        Leave empty to use the default directory
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button 
                      size="lg" 
                      onClick={handlePublishSite}
                      disabled={isPublishing || !publishOptions.host || !publishOptions.username || !publishOptions.password}
                    >
                      {isPublishing ? (
                        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      {isPublishing ? "Publishing..." : "Publish Optimized Site"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <AlertCircle className="mx-auto h-16 w-16 text-gray-400" />
                  <h3 className="mt-4 text-xl font-semibold">No Audit Results</h3>
                  <p className="mt-2 text-gray-500">
                    Please complete a website scan to publish an optimized version.
                  </p>
                  <Button className="mt-6" onClick={() => setActiveTab('scan')}>
                    <Search className="mr-2 h-4 w-4" />
                    Start New Audit
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Audit History</CardTitle>
              <CardDescription>
                View previous SEO audits and their results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {auditHistory.length > 0 ? (
                <div className="space-y-4">
                  {auditHistory.map((audit, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <h3 className="font-semibold">{audit.url}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(audit.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className="md:text-right mt-2 md:mt-0">
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              Score: {audit.score}/100
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {audit.pagesScanned} pages scanned
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="mx-auto h-16 w-16 text-gray-400" />
                  <h3 className="mt-4 text-xl font-semibold">No Audit History</h3>
                  <p className="mt-2 text-gray-500">
                    Your audit history will appear here once you've performed audits.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {auditHistory.length > 0 && (
                <Button variant="outline" onClick={() => {
                  auditController.clearAuditHistory();
                  setAuditHistory([]);
                }}>
                  Clear History
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SeoAuditPage;
