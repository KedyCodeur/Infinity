class AkeadEncryption {

    static LC_KEY5 = "A45Pas9S9"; 


    static encode(text) {
        if (this.LC_KEY5 === '') return text;
        
        let key = this.LC_KEY5.replace(/\s+/g, '');
        if (key.length < 8) throw new Error('Key error');

        let key_len = key.length > 32 ? 32 : key.length;
        let e_sum = 0;
        let textArray = text.split('');
        let text_len = text.length;

        let j = 0;
        for (let i = 0; i < text_len; ++i) {
            let e = textArray[i].charCodeAt(0); 
            let k = (key.charCodeAt(j) + e_sum) & 0x1f;

            if (e & 0xE0) {
                textArray[i] = String.fromCharCode(e ^ k);
            }

            e_sum = e_sum + e;
            j = (j + 1) % key_len;
        }

        let ctrl = e_sum - Math.floor(e_sum / 100) * 100;
        let ctrlStr = String(ctrl).padStart(2, '0');


        let hamSifreliMetin = textArray.join('') + ctrlStr;
        
        return btoa(hamSifreliMetin);
    }
}


let testMetni = "1234";
let jsCiktisi = AkeadEncryption.encode(testMetni);

console.log("PHP ile %100 Aynı Olan JS Çıktısı:", jsCiktisi);