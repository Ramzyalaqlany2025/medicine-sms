// index.js

const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
const port = 3000;

// استبدل هذه البيانات بمعلوماتك من Twilio Dashboard
const accountSid = 'YOUR_TWILIO_ACCOUNT_SID';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
const twilioPhone = 'YOUR_TWILIO_PHONE_NUMBER'; // مثل +1415xxxxxxx

const client = twilio(accountSid, authToken);

app.use(bodyParser.json());

// نقطة استقبال بيانات العلاج وإرسال الرسالة
app.post('/send-reminder', (req, res) => {
    const { phone, name, dosage, frequency, duration } = req.body;

    if (!phone || !name || !dosage || !frequency || !duration) {
        return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    const messageBody = `🔔 تذكير بتناول الدواء: ${name} - ${dosage}, ${frequency} مرات/يوم لمدة ${duration}`;

    client.messages
        .create({
            body: messageBody,
            from: twilioPhone,
            to: phone
        })
        .then(message => {
            console.log(`✅ تم إرسال الرسالة. SID: ${message.sid}`);
            res.json({ success: true, sid: message.sid });
        })
        .catch(error => {
            console.error(`❌ فشل الإرسال:`, error);
            res.status(500).json({ error: 'فشل الإرسال', details: error.message });
        });
});

app.listen(port, () => {
    console.log(`✅ الخادم يعمل على http://localhost:${port}`);
});
