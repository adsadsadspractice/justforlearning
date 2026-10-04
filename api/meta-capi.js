export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { event_name, event_id, event_source_url } = req.body;

    const pixelId = "1109200968148205";
    const accessToken = process.env.META_ACCESS_TOKEN;

    const eventData = {
      data: [
        {
          event_name: event_name || "Lead",
          event_time: Math.floor(Date.now() / 1000),
          event_id: event_id || crypto.randomUUID(),
          action_source: "website",
          event_source_url: event_source_url || "https://YOUR-GITHUB-SITE-URL",
        },
      ],
    };

    const response = await fetch(
      `https://graph.facebook.com/v26.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      }
    );

    const result = await response.json();

    return res.status(response.ok ? 200 : 400).json(result);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}
