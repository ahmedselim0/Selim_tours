const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
//const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// اللينك الخاص بك جاهز ومربوط هنا بالملي
const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/yqo0ljamkdk3n';

app.post('/api/book', async (req, res) => {
    const b = req.body;
    const createdAt = new Date().toLocaleString('ar-EG');

    const tripNamesMapping = {
        'orange': 'جزيرة أورانج باي 🌊',
        'hola': 'شاطئ هولا هولا 🏝️',
        'safari': 'سفاري البيتش باجي 🏜️',
        'pyramids': 'القاهرة والأهرامات 🏛️',
        'luxor': 'الأقصر ومعبد الكرنك 👑'
    };
    const tripArabicName = tripNamesMapping[b.trip] || b.trip;

    const dataToSend = {
        data: [
            {
                name: b.name,
                phone: b.phone,
                trip: tripArabicName,
                date: b.date,
                count: b.count,
                price: b.total_price,
                notes: b.notes || 'لا يوجد',
                time: createdAt
            }
        ]
    };

    try {
        const response = await fetch(SHEETDB_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        });

        const result = await response.json();
        
        if (result.created === 1) {
            res.json({ success: true, message: 'تم تسجيل حجزك بنجاح ونزل في جوجل شيت! 🚀' });
        } else {
            res.status(500).json({ success: false, message: 'فشل إرسال البيانات للشيت' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'حدث خطأ في السيرفر' });
    }
});

app.listen(PORT, () => {
    console.log(`السيرفر شغال ومرتبط بجوجل شيت على: http://localhost:${PORT}`);
});