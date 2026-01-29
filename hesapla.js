const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("--- KRİPTO RİSK YÖNETİM SİHİRBAZINA HOŞ GELDİN ---");

const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

async function startApp() {
    const balance = parseFloat(await ask("1. Toplam bakiyen kaç dolar? "));
    const risk = parseFloat(await ask("2. Bu işlemde kasanın yüzde kaçını riske atarsın? (Örn: 3): "));
    const type = await ask("3. Pozisyon yönü nedir? (long/short): ");
    const entry = parseFloat(await ask("4. Giriş fiyatın nedir? (DCA yapacaksan ilk girişini yaz): "));
    const stop = parseFloat(await ask("5. Stop-Loss fiyatın neresi? "));
    const tp = parseFloat(await ask("6. Hedef satış fiyatın (TP) neresi? "));

    // Hesaplamalar
    const priceDiff = Math.abs(entry - stop) / entry;
    const lev = Math.floor(risk / (priceDiff * 100));
    const safeLev = lev > 0 ? (lev > 50 ? 50 : lev) : 1;
    const liqPrice = type.toLowerCase() === 'long' ? entry * (1 - (1 / safeLev)) : entry * (1 + (1 / safeLev));
    const rrRatio = (Math.abs(tp - entry) / Math.abs(entry - stop)).toFixed(2);

    console.log(`\n=========================================`);
    console.log(`📊 STRATEJİ SONUCU (${type.toUpperCase()})`);
    console.log(`=========================================`);
    console.log(`✅ ÖNERİLEN KALDIRAÇ: ${safeLev}x`);
    console.log(`💀 LİKİDASYON FİYATI: ${liqPrice.toFixed(4)}`);
    console.log(`⚖️  R/R (RİSK/ÖDÜL): ${rrRatio}`);
    console.log(`-----------------------------------------`);
    console.log(`💸 Eğer Stop Olursan: $${(balance * risk / 100).toFixed(2)} kaybedeceksin.`);
    console.log(`💰 Eğer Hedefe Giderse: $${((balance * risk / 100) * rrRatio).toFixed(2)} kazanacaksın.`);
    
    if ((type === 'long' && stop <= liqPrice) || (type === 'short' && stop >= liqPrice)) {
        console.log(`\n⚠️  DİKKAT: Stopun likidasyonun altında! Paranı kaybedebilirsin.`);
    }

    console.log(`=========================================\n`);
    rl.close();
}

startApp();