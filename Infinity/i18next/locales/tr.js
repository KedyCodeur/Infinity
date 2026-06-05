const tr = {
    Login: {
        webadress: "Web servis adresi",
        username: "Kullanıcı adı",
        password: "Şifre",
        show: "Şifreyi göster",
        hide: "Şifreyi gizle",
        login: "Giriş yap"
    },
    Print : {
      name : "Etiket Oluştur",
      h1: "Barkodu Tara",
      label : "Ürün Barkodu",
      button: "Yazdır",
    },
    Tabs: {
        createLabel: "Etiket Oluştur",
        modifyPrice: "Fiyat Değiştir"
    },
    Modify: {
        button: "Düzenle",
        name: "Fiyatı düzenle"
    },
    HeaderSide: {
        options: "Ayarlar",
        remember: "Beni Hatırla",
        theme: "Karanlık Mod",
        logOut: "Çıkış Yap",
        lang: "Dil"
    },
    ModifyPanel: {
        price: "Fiyat",
        modify: "Değiştir",
        cancel: "İptal"
    },
    LoginNotif: {
        "ERR_400": "Giriş bilgileri boş olamaz",
        "ERR_401": "Geçersiz giriş bilgileri",
        "ERR_404": "Sunucu bulunamadı",
        "ERR_429": "Çok fazla istek, lütfen daha sonra tekrar deneyin",
        "ERR_500": "Sunucu hatası",
        "OK_200": "Giriş başarılı, hoş geldiniz!",
        "ERR_UNKNOWN": "Bilinmeyen bir hata oluştu",
        ERR_NETWORK: "Sunucuya ulaşılamıyor, sunucu ve ağı kontrol edin"
    },
    modifyNotif: {
        emptyBarCode: "Barkod boş olamaz",
        invalidBarCode: "Geçersiz barkod",
        unknown: "Bilinmeyen hata",
        emptyPrice: "Fiyat boş olamaz",
        quantityPositive: "Fiyat 15.000'i aşamaz",
        quantityNegative: "Fiyat negatif olamaz",
        success: "Fiyat başarıyla güncellendi",
        invalidPrice: "Geçersiz fiyat"
    },
    handleModifyPriceError : {
        400: "Barkod boş olamaz",
        404: "Barkod bulunamadı",
        500: "Sunucu hatası",
        429: "Çok fazla istek gönderildi, lütfen bekleyin",
        unknown: "Bilinmeyen hata",
    },
    printerErrors : {
        1: "Yazıcı meşgul",
        4: "Kağıt bitti",
        6: "Yazıcı kapağı açık",
        7: "Kağıt sıkıştı",
        9: "Yazıcı algılanamadı",
        505: "Yazıcı bağlı değil",
        507: "Yazıcı yazılım hatası",
        REMOTE_ERR: "Servis bağlantı hatası",
        ERR_NETWORK : "Ağ hatası",
        dataError: "Geçersiz veri. Lütfen bilgileri kontrol edin.",
        unknown: "Bilinmeyen hata"
    },
    httpsText2: {
        500: "Sunucuya ulaşılamıyor, sunucu ve ağ bağlantısını kontrol edin",
        429: "Çok fazla istek, 30 saniye bekleyin",
        ERR_429: "Çok fazla istek, 30 saniye bekleyin",
        ERR_500: "Sunucuya ulaşılamıyor, sunucu ve ağ bağlantısını kontrol edin",
        1: "Çok fazla istek, 30 saniye bekleyin",
        7: "Kağıt sıkışması, yazıcıyı kontrol edin",
        ERR_NETWORK: "Sunucuya ulaşılamıyor, sunucu ve ağ bağlantısını kontrol edin",
        dataError: "Veritabanında geçersiz ürün verisi"
    }

}
export default tr;