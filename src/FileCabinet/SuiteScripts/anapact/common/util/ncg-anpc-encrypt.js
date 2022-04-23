define(['./ncg-anpc-crypto'],
    (CryptoJS) => {
        const encryptJS = (data) => {
            var key = CryptoJS.enc.Utf8.parse('51439F4A6A1F96AS');
            var iv = CryptoJS.enc.Utf8.parse('51439F4A6A1F96AS');
            var encryptedData = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key, {
                keySize: 128 / 8, iv: iv,
                mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7
            });
            let encrypt = encryptedData.toString();
            encrypt = encrypt.split("+").join("@npt");
            encrypt = encrypt.split("/").join("AnApa(t");
            return encrypt;
        }

        return {encryptJS}

    });
