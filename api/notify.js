const { Resend } = require('resend');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { day, time } = req.body;
  if (!day || !time) return res.status(400).json({ error: 'Missing fields' });

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: 'for-leti <onboarding@resend.dev>',
    to: process.env.NOTIFY_EMAIL,
    subject: '☕ She said yes to coffee!',
    html: `
      <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:2rem;color:#2c1e1e;">
        <h2 style="font-size:24px;margin-bottom:0.5rem;">It's a date 🎉</h2>
        <p style="font-size:16px;color:#6b4f4f;margin-bottom:1.5rem;">Someone confirmed a coffee date with you.</p>
        <div style="background:#fdf2f4;border-radius:12px;padding:1.25rem 1.5rem;border-left:3px solid #c0475e;">
          <p style="margin:0;font-size:18px;font-weight:600;color:#2c1e1e;">${day}</p>
          <p style="margin:0.25rem 0 0;font-size:16px;color:#c0475e;">${time}</p>
        </div>
        <p style="margin-top:1.5rem;font-size:13px;color:#a07878;">Sent from for-leti</p>
      </div>
    `
  });

  if (error) return res.status(500).json({ error });

  res.status(200).json({ ok: true, id: data.id, to: process.env.NOTIFY_EMAIL });
};
