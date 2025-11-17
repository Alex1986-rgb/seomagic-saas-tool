import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  subject: string;
  task_id?: string;
  html?: string;
  text?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { to, subject, task_id, html, text }: EmailRequest = await req.json();

    if (!to || !subject) {
      throw new Error('Email and subject are required');
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured');
    }

    console.log(`Sending email to ${to} with subject: ${subject}`);

    let emailHtml = html || '';
    let emailText = text || '';

    // If task_id provided, fetch audit results
    if (task_id && !html) {
      const { data: task } = await supabaseClient
        .from('audit_tasks')
        .select('url')
        .eq('id', task_id)
        .single();

      const { data: result } = await supabaseClient
        .from('audit_results')
        .select('score, page_count, issues_count')
        .eq('task_id', task_id)
        .single();

      emailHtml = `
        <h1>SEO Audit Report</h1>
        <p>Your SEO audit for <strong>${task?.url}</strong> is complete!</p>
        <h2>Results Summary:</h2>
        <ul>
          <li>Overall Score: ${result?.score || 'N/A'}/100</li>
          <li>Pages Analyzed: ${result?.page_count || 0}</li>
          <li>Critical Issues: ${result?.issues_count?.critical || 0}</li>
          <li>Important Issues: ${result?.issues_count?.important || 0}</li>
        </ul>
        <p>Log in to your account to view the full report and recommendations.</p>
      `;

      emailText = `SEO Audit Report\n\nYour SEO audit for ${task?.url} is complete!\n\nOverall Score: ${result?.score || 'N/A'}/100\nPages Analyzed: ${result?.page_count || 0}\nCritical Issues: ${result?.issues_count?.critical || 0}\nImportant Issues: ${result?.issues_count?.important || 0}`;
    }

    // Send email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SEO Audit <onboarding@resend.dev>',
        to: [to],
        subject: subject,
        html: emailHtml,
        text: emailText,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error('Resend API error:', errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const emailData = await emailResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        message_id: emailData.id,
        message: 'Email sent successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in send-email:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message === 'Unauthorized' ? 401 : 500,
      }
    );
  }
});
