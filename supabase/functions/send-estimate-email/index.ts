import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailEstimateRequest {
  to_emails: string[];
  estimate_data: any[];
  totals: {
    subtotal: number;
    discount: number;
    final: number;
  };
  url: string;
  message?: string;
  attach_pdf?: boolean;
  attach_excel?: boolean;
  create_public_link?: boolean;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Sending estimate email...');

    const {
      to_emails,
      estimate_data,
      totals,
      url,
      message,
      create_public_link
    } = await req.json() as EmailEstimateRequest;

    // Validate inputs
    if (!to_emails || to_emails.length === 0) {
      throw new Error('No recipient emails provided');
    }

    // Create public link if requested
    let publicLink = '';
    if (create_public_link) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const authHeader = req.headers.get('Authorization');
      const token = authHeader?.replace('Bearer ', '');
      
      if (token) {
        const { data: { user } } = await supabase.auth.getUser(token);
        
        if (user) {
          const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
          
          const { data: shareData } = await supabase
            .from('shared_estimates')
            .insert({
              user_id: user.id,
              estimate_data,
              totals,
              url,
              expires_at: expiresAt
            })
            .select('share_token')
            .single();

          if (shareData) {
            publicLink = `${req.headers.get('origin') || 'https://app.example.com'}/shared-estimate/${shareData.share_token}`;
          }
        }
      }
    }

    // Build category summary
    const categoryTotals = estimate_data.reduce((acc: any, item: any) => {
      if (!acc[item.category]) {
        acc[item.category] = { count: 0, cost: 0 };
      }
      acc[item.category].count += item.count;
      acc[item.category].cost += item.cost * item.count;
      return acc;
    }, {});

    // Build HTML email
    const categoryRows = Object.entries(categoryTotals)
      .map(([category, data]: [string, any]) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${category}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${data.count}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">
            ${data.cost.toLocaleString('ru-RU')} ₽
          </td>
        </tr>
      `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .total-row { background: #f9fafb; font-weight: bold; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Смета на SEO-оптимизацию</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Сайт: ${url}</p>
            </div>
            
            <div class="content">
              ${message ? `<p style="margin-bottom: 20px;">${message}</p>` : ''}
              
              <h2 style="margin: 20px 0 10px 0;">Работы по категориям</h2>
              <table>
                <thead>
                  <tr style="background: #f9fafb;">
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Категория</th>
                    <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Работ</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Стоимость</th>
                  </tr>
                </thead>
                <tbody>
                  ${categoryRows}
                  <tr class="total-row">
                    <td colspan="2" style="padding: 12px;">Итого:</td>
                    <td style="padding: 12px; text-align: right; font-size: 18px; color: #667eea;">
                      ${totals.final.toLocaleString('ru-RU')} ₽
                    </td>
                  </tr>
                </tbody>
              </table>

              ${publicLink ? `
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${publicLink}" class="button">
                    📊 Просмотреть детальную смету онлайн
                  </a>
                </div>
              ` : ''}

              <div class="footer">
                <p>Создано в SEO Audit Tool</p>
                <p>Дата: ${new Date().toLocaleDateString('ru-RU')}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send emails using Resend (if configured) or log
    console.log('Email would be sent to:', to_emails);
    console.log('Public link:', publicLink);
    
    // Note: Resend integration would go here
    // For now, we return success with the data
    
    return new Response(
      JSON.stringify({
        success: true,
        recipients: to_emails.length,
        public_link: publicLink || null
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error sending estimate email:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});