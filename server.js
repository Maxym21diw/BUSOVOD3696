const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("BUSOVOD3696 SERVER ONLINE");
});

app.post("/api/order", async (req, res) => {
    try {
        const {
            name,
            phone,
            from,
            to,
            cargo,
            date,
            comment
        } = req.body;

        if (!name || !phone) {
            return res.status(400).json({
                error: "Вкажіть ім'я та телефон"
            });
        }

        const message = `
🚛 НОВА ЗАЯВКА — BUSOVOD3696

👤 Замовник: ${name}
📞 Телефон: ${phone}

📍 Завантаження: ${from || "Не вказано"}
📍 Розвантаження: ${to || "Не вказано"}

📦 Вантаж: ${cargo || "Не вказано"}
📅 Дата: ${date || "Не вказано"}

💬 Коментар: ${comment || "Немає"}
        `;

        const response = await fetch(
            `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chat_id: process.env.CHAT_ID,
                    text: message
                })
            }
        );

        const result = await response.json();

        if (!result.ok) {
    console.error("Telegram error:", result);
    throw new Error(result.description || "Telegram error");
}

        res.json({ success: true });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Не вдалося надіслати заявку"
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`BUSOVOD3696 running on port ${PORT}`);
});
