export default async function handler(req, res) {
  const { subscriptions } = req.body;

  const prompt = `
You must return your output ONLY as JSON.

Use the following list of subscriptions and services to produce a subscription-optimization output.

PART 1 — PRELIMINARY SUMMARY
Return:
- recommendation_count
- total_savings

PART 2 — SAVINGS TABLE
Return a JSON array called "table". Each element must contain EXACTLY these keys:
- Category
- Current Subscription & Price
- Applicable Bundle / Perk / Credit
- Estimated Savings

Add: "total_row": { "Total Estimated Savings": total_savings }

User subscriptions:
${subscriptions}
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0
    })
  });

  const data = await response.json();
  const output = JSON.parse(data.choices[0].message.content);
  res.status(200).json(output);
}
