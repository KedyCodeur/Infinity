const nl = {
    Login: {
        webadress: "Webserviceadres",
        username: "Gebruikersnaam",
        password: "Wachtwoord",
        show: "Wachtwoord tonen",
        hide: "Wachtwoord verbergen",
        login: "Inloggen"
    },
    Print : {
      name: "Label Aanmaken",
      h1: "Scan de Barcode",
      label: "Productbarcode",
      button: "Afdrukken",
    },
    Tabs: {
        createLabel: "Label Afdrukken",
        modifyPrice: "Prijswijziging"
    },
    Modify: {
        button: "Wijzigen",
        name: "Prijs wijzigen"
    },
    HeaderSide: {
        options: "Instellingen",
        remember: "Onthoud mij",
        theme: "Donkere modus",
        logOut: "Uitloggen",
        lang: "Taal"
    },
    ModifyPanel: {
        price: "Prijs",
        modify: "Wijzigen",
        cancel: "Annuleren"
    },
    loginNotif: {
        "ERR_400": "Inloggegevens mogen niet leeg zijn",
        "ERR_401": "Ongeldige inloggegevens",
        "ERR_404": "Niet gevonden",
        "ERR_429": "Te veel verzoeken, probeer het later opnieuw",
        "ERR_500": "Serverfout",
        "OK_200": "Inloggen geslaagd, welkom!",
        "ERR_UNKNOWN": "Er is een onbekende fout opgetreden",
        ERR_NETWORK: "Server onbereikbaar, controleer server en netwerk"
    },
    modifyNotif: {
        emptyBarCode: "Barcode mag niet leeg zijn",
        invalidBarCode: "Ongeldige barcode",
        unknown: "Onbekende fout",
        emptyPrice: "Prijs mag niet leeg zijn",
        quantityPositive: "Prijs mag niet hoger zijn dan 15.000",
        quantityNegative: "Prijs mag niet negatief zijn",
        success: "Prijs succesvol gewijzigd",
        invalidPrice: "Ongeldige prijs"
    },
    handleModifyPriceError : {
    400: "Barcode mag niet leeg zijn",
    404: "Barcode niet gevonden",
    500: "Serverfout",
    429: "Te veel verzoeken, wacht alstublieft",
    unknown: "Onbekende fout",
    },
    printerErrors : {
        1: "Printer bezet",
        4: "Papier op",
        6: "Klep open",
        7: "Papierstoring",
        9: "Printer niet gedetecteerd",
        505: "Printer niet verbonden",
        507: "Printer firmwarefout",
        REMOTE_ERR: "Service verbindingsfout",
        ERR_NETWORK : "Netwerkfout",
        dataError: "Ongeldige data. Controleer de gegevens.",
        unknown: "Onbekende fout"
    },
    httpsText2: {
        500: "Server onbereikbaar, controleer server en netwerk",
        429: "Te veel verzoeken, wacht 30 seconden",
        ERR_429: "Te veel verzoeken, wacht 30 seconden",
        ERR_500: "Server onbereikbaar, controleer server en netwerk",
        1: "Te veel verzoeken, wacht 30 seconden",
        7: "Papierstoring, controleer de printer",
        ERR_NETWORK: "Server onbereikbaar, controleer server en netwerk",
        dataError: "Ongeldige productgegevens in database"
    }
    
}
export default nl;