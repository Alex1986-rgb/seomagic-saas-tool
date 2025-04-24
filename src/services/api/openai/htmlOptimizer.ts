
export class HtmlOptimizer {
  static applyOptimizations(html: string, optimizations: any): string {
    try {
      let optimizedHtml = html;
      
      if (optimizations.title) {
        optimizedHtml = optimizedHtml.replace(
          /<title>.*?<\/title>/i,
          `<title>${optimizations.title}</title>`
        );
      }
      
      if (optimizations.metaDescription) {
        if (optimizedHtml.includes('<meta name="description"')) {
          optimizedHtml = optimizedHtml.replace(
            /<meta name="description".*?>/i,
            `<meta name="description" content="${optimizations.metaDescription}">`
          );
        } else {
          optimizedHtml = optimizedHtml.replace(
            /<head>([\s\S]*?)<\/head>/i,
            `<head>$1<meta name="description" content="${optimizations.metaDescription}">\n</head>`
          );
        }
      }
      
      if (optimizations.keywords) {
        if (optimizedHtml.includes('<meta name="keywords"')) {
          optimizedHtml = optimizedHtml.replace(
            /<meta name="keywords".*?>/i,
            `<meta name="keywords" content="${optimizations.keywords}">`
          );
        } else {
          optimizedHtml = optimizedHtml.replace(
            /<head>([\s\S]*?)<\/head>/i,
            `<head>$1<meta name="keywords" content="${optimizations.keywords}">\n</head>`
          );
        }
      }
      
      if (optimizations.h1) {
        const h1Count = (optimizedHtml.match(/<h1/g) || []).length;
        
        if (h1Count === 1) {
          optimizedHtml = optimizedHtml.replace(
            /<h1.*?>([\s\S]*?)<\/h1>/i,
            `<h1>${optimizations.h1}</h1>`
          );
        } else if (h1Count === 0) {
          optimizedHtml = optimizedHtml.replace(
            /<body>([\s\S]*?)/i,
            `<body>\n<h1>${optimizations.h1}</h1>$1`
          );
        }
      }
      
      return optimizedHtml;
    } catch (error) {
      console.error('Error applying optimizations to HTML:', error);
      return html;
    }
  }
}

