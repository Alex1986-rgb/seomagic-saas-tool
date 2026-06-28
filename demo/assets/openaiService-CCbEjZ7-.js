var g=Object.defineProperty;var y=(s,e,t)=>e in s?g(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var l=(s,e,t)=>y(s,typeof e!="symbol"?e+"":e,t);import{bL as m}from"./vendor-4aACfuwA.js";class w{constructor(){l(this,"apiKey",null)}setApiKey(e){this.apiKey=e,localStorage.setItem("openai_api_key",e)}getApiKey(){if(this.apiKey)return this.apiKey;const e=localStorage.getItem("openai_api_key");return e?(this.apiKey=e,e):null}async makeRequest(e,t,i={}){var p;if(!this.apiKey)throw new Error("OpenAI API key not set");const n=t||localStorage.getItem("openai_model")||"gpt-4o-mini",r=i.maxTokens||2500,c=i.temperature!==void 0?i.temperature:.7;try{return(await m.post("https://api.openai.com/v1/chat/completions",{model:n,messages:e,temperature:c,max_tokens:r},{headers:{Authorization:`Bearer ${this.apiKey}`,"Content-Type":"application/json"}})).data.choices[0].message.content}catch(o){if(console.error("Error calling OpenAI API:",o),m.isAxiosError(o)&&o.response){const d=o.response.status,u=o.response.data;throw d===401?new Error("Неверный API ключ OpenAI. Проверьте настройки API ключа."):d===429?new Error("Превышен лимит запросов к API OpenAI. Попробуйте позже."):new Error(`Ошибка API OpenAI: ${((p=u.error)==null?void 0:p.message)||"неизвестная ошибка"}`)}throw new Error("Ошибка при обращении к API OpenAI")}}async generateImage(e,t="1024x1024"){if(!this.apiKey)throw new Error("OpenAI API key not set");try{return(await m.post("https://api.openai.com/v1/images/generations",{prompt:e,n:1,size:t},{headers:{Authorization:`Bearer ${this.apiKey}`,"Content-Type":"application/json"}})).data.data[0].url}catch(i){throw console.error("Error generating image with OpenAI:",i),new Error("Ошибка при генерации изображения")}}}const a=new w;class h{static createSystemPrompt(e){const t=e.language||"en",i=e.contentQuality||"premium";let n="";switch(i){case"standard":n="Provide practical optimization focusing on essential SEO elements.";break;case"premium":n="Provide detailed optimization with a balance of SEO effectiveness and high-quality content.";break;case"ultimate":n="Provide expert-level comprehensive optimization with perfect SEO, excellent readability, and fully detailed information.";break;default:n="Provide detailed optimization with a balance of SEO effectiveness and high-quality content."}let r=`You are an expert SEO content optimizer. Your task is to optimize website content for better search engine rankings while maintaining readability and user engagement. ${n}

Please respond in ${t} language.

For the provided page, you should:`;return e.optimizeMetaTags&&(r+=`
- Create an optimized page title (50-60 characters)
- Create an optimized meta description (150-160 characters)
- Suggest relevant keywords for the page`),e.optimizeHeadings&&(r+=`
- Suggest optimized H1 heading (include one primary keyword)
- Suggest optimized H2 and H3 headings (include secondary keywords)`),e.optimizeContent&&(r+=`
- Provide optimization suggestions for the content
- Fix any grammatical or spelling errors
- Suggest improvements to make the content more engaging`),e.prompt&&(r+=`

Additional instructions: ${e.prompt}`),r}static createUserPrompt(e){return`Please optimize the following web page for better SEO:

URL: ${e.url}

Current Title: ${e.title||"No title"}

Current Meta Description: ${e.metaTags.description||"No meta description"}

Current Meta Keywords: ${e.metaTags.keywords||"No meta keywords"}

Current H1 Headings: ${e.headings.h1.join(" | ")||"No H1 headings"}

Current H2 Headings: ${e.headings.h2.join(" | ")||"No H2 headings"}

Page Content Sample:
${e.content}

SEO Issues:
${[...e.issues.critical.map(t=>`CRITICAL: ${t}`),...e.issues.important.map(t=>`IMPORTANT: ${t}`),...e.issues.opportunities.map(t=>`OPPORTUNITY: ${t}`)].join(`
`)}

Please provide your optimization suggestions in the following JSON format:
{
  "title": "Optimized Page Title",
  "metaDescription": "Optimized meta description that encourages clicks and includes relevant keywords.",
  "keywords": "keyword1, keyword2, keyword3, keyword4, keyword5",
  "h1": "Optimized H1 Heading",
  "h2": ["Optimized H2 Heading 1", "Optimized H2 Heading 2"],
  "h3": ["Optimized H3 Heading 1", "Optimized H3 Heading 2"],
  "contentSuggestions": [
    "Specific suggestion 1",
    "Specific suggestion 2",
    "Specific suggestion 3"
  ]
}`}static createHtmlFixPrompt(e,t){return`Please fix the following errors in this HTML:
${t.join(`
`)}

HTML:
${e}

Please return only the fixed HTML code.`}static createContentImprovePrompt(e,t=[],i="premium"){let n="";switch(i){case"standard":n="Make SEO-focused improvements while keeping the content concise.";break;case"premium":n="Make comprehensive improvements with a balance of SEO and user experience, adding details where appropriate.";break;case"ultimate":n="Make expert-level improvements with perfect SEO, excellent readability, and fully detailed information.";break;default:n="Make comprehensive improvements with a balance of SEO and user experience."}return`Please improve this content. ${n} ${t.length>0?"Focus on these keywords: "+t.join(", "):""}
    
Content:
${e}

Please return the improved content only.`}}class f{static applyOptimizations(e,t){try{let i=e;if(t.title&&(i=i.replace(/<title>.*?<\/title>/i,`<title>${t.title}</title>`)),t.metaDescription&&(i.includes('<meta name="description"')?i=i.replace(/<meta name="description".*?>/i,`<meta name="description" content="${t.metaDescription}">`):i=i.replace(/<head>([\s\S]*?)<\/head>/i,`<head>$1<meta name="description" content="${t.metaDescription}">
</head>`)),t.keywords&&(i.includes('<meta name="keywords"')?i=i.replace(/<meta name="keywords".*?>/i,`<meta name="keywords" content="${t.keywords}">`):i=i.replace(/<head>([\s\S]*?)<\/head>/i,`<head>$1<meta name="keywords" content="${t.keywords}">
</head>`)),t.h1){const n=(i.match(/<h1/g)||[]).length;n===1?i=i.replace(/<h1.*?>([\s\S]*?)<\/h1>/i,`<h1>${t.h1}</h1>`):n===0&&(i=i.replace(/<body>([\s\S]*?)/i,`<body>
<h1>${t.h1}</h1>$1`))}return i}catch(i){return console.error("Error applying optimizations to HTML:",i),e}}}class k{async optimizePage(e,t){try{const i={url:e.url,title:e.title,metaTags:e.metaTags,headings:e.headings,content:e.content.substring(0,2e3),links:{internal:e.links.internal.length,external:e.links.external.length},issues:e.issues},n=h.createSystemPrompt(t),r=h.createUserPrompt(i),c=await a.makeRequest([{role:"system",content:n},{role:"user",content:r}]);return this.parseOptimizationResponse(c,e)}catch(i){return console.error("Error optimizing page with OpenAI:",i),{title:e.title,metaTags:{description:e.metaTags.description,keywords:e.metaTags.keywords},headings:{h1:e.headings.h1,h2:e.headings.h2,h3:e.headings.h3},optimizedHtml:null,suggestions:["Error optimizing page with OpenAI"]}}}parseOptimizationResponse(e,t){try{const i=e.match(/\{[\s\S]*\}/);if(!i)throw new Error("No JSON found in response");const n=JSON.parse(i[0]),r=f.applyOptimizations(t.html,n);return{title:n.title||t.title,metaTags:{description:n.metaDescription||t.metaTags.description,keywords:n.keywords||t.metaTags.keywords},headings:{h1:n.h1?[n.h1]:t.headings.h1,h2:n.h2||t.headings.h2,h3:n.h3||t.headings.h3},optimizedHtml:r,suggestions:n.contentSuggestions||[]}}catch(i){return console.error("Error parsing optimization response:",i),{title:t.title,metaTags:{description:t.metaTags.description,keywords:t.metaTags.keywords},headings:{h1:t.headings.h1,h2:t.headings.h2,h3:t.headings.h3},optimizedHtml:null,suggestions:["Error parsing optimization response"]}}}}const S=new k;class O{constructor(){l(this,"systemSettings",{auto_optimize:!0,auto_fix_errors:!0,content_quality:"premium",max_tokens:2500,temperature:.7});this.loadSettings()}loadSettings(){const e=localStorage.getItem("ai_settings");if(e)try{const t=JSON.parse(e);this.systemSettings={...this.systemSettings,...t}}catch(t){console.error("Ошибка при загрузке настроек AI:",t)}}setApiKey(e){a.setApiKey(e)}getApiKey(){return a.getApiKey()}setModel(e){localStorage.setItem("openai_model",e)}getModel(){return localStorage.getItem("openai_model")||"gpt-4o-mini"}getSetting(e){return this.systemSettings[e]}getSettings(){return{...this.systemSettings}}async optimizePage(e,t){const i=this.getModel();return S.optimizePage(e,{...t,model:i,temperature:this.systemSettings.temperature,max_tokens:this.systemSettings.max_tokens})}async generateContent(e){return a.makeRequest([{role:"system",content:"You are a helpful content creation assistant."},{role:"user",content:e}],this.getModel())}async fixErrors(e,t){if(!this.systemSettings.auto_fix_errors)return console.log("Автоматическое исправление ошибок отключено в настройках"),e;const i=await a.makeRequest([{role:"system",content:"You are a helpful HTML and technical error fixing assistant. Fix the provided HTML based on the list of errors without changing the visual design or content meaning."},{role:"user",content:`Please fix the following errors in this HTML:
${t.join(`
`)}

HTML:
${e}`}],this.getModel()),n=i.match(/<html[\s\S]*<\/html>/i);return n?n[0]:i}async improveContent(e,t=[]){let i="";switch(this.systemSettings.content_quality){case"standard":i="Provide a good quality improvement that focuses on SEO.";break;case"premium":i="Provide a premium quality improvement with balanced attention to SEO and readability. Add detailed information where appropriate.";break;case"ultimate":i="Provide the highest quality content optimization with expert-level insights, perfect SEO, excellent readability, and fully detailed information.";break}return await a.makeRequest([{role:"system",content:`You are an expert content optimization assistant. ${i}`},{role:"user",content:`Please improve this content. ${t.length>0?"Focus on these keywords: "+t.join(", "):""}
        
        Content:
        ${e}`}],this.getModel())}}const A=new O;export{A as o};
