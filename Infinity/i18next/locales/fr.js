const fr = {
    Login: {
        webadress: "Adresse web service",
        username: "Nom d'utilisateur",
        password: "Mot de passe",
        show: "Afficher le mot de passe",
        hide: "Masquer le mot de passe",
        login: "Se connecter"
    },
    Print : {
      name: "Créer une Étiquette",
       h1: "Scannez le code-barres",
       label:"Code-barres du produit",
       button: "Imprimer",
    },
    Tabs: {
        createLabel: "Impression",
        modifyPrice: "Modification de prix"
    },
    Modify: {
        button: "Modifier",
        name: "Modifier le prix"
    },
    HeaderSide: {
        options: "Paramètres",
        remember: "Se souvenir de moi",
        theme: "Mode Sombre",
        logOut: "Se déconnecter",
        lang: "Langue",
        
    },
    ModifyPanel: {
        price: "Prix",
        modify: "Modifier",
        cancel: "Annuler"
    },
    LoginNotif: {
        "ERR_400": "Les identifiants ne peuvent être vides",
        "ERR_401": "Identifiants invalides",
        "ERR_404": "Non trouvé",
        "ERR_429": "Trop de requêtes, veuillez réessayer plus tard",
        "ERR_500": "Erreur de serveur",
        "OK_200": "Connexion réussie, bienvenue !",
        "ERR_UNKNOWN": "Une erreur inconnue est survenue",
        ERR_NETWORK: "Serveur inaccessible, vérifiez le serveur et le réseau"
    },
    modifyNotif: {
        emptyBarCode: "Le code-barres ne peut pas être vide",
        invalidBarCode: "Code-barres invalide",
        unknown: "Erreur inconnue",
        emptyPrice: "Le prix ne peut pas être vide",
        quantityPositive: "Le prix ne peut pas dépasser 15 000",
        quantityNegative: "Le prix ne peut pas être négatif",
        success: "Prix modifié avec succès",
        invalidPrice: "Prix invalide"
    },
    handleModifyPriceError : {
        400: "Le code-barres ne peut pas être vide",
        404: "Code-barres introuvable",
        500: "Erreur du serveur",
        429: "Trop de requêtes, veuillez patienter",
        unknown: "Erreur inconnue",
    },
    printerErrors : {
        1: "Imprimante occupée",
        4: "Plus de papier",
        6: "Capot ouvert",
        7: "Bourrage papier",
        9: "Imprimante non trouvée",
        505: "Imprimante non connectée",
        507: "Erreur firmware",
        REMOTE_ERR: "Erreur de connexion",
        ERR_NETWORK : "Erreur réseau",
        dataError: "Données invalides. Veuillez vérifier les informations.",
        unknown: "Erreur inconnue"
    },
    httpsText2: {
        500: "Serveur inaccessible, vérifiez le serveur et le réseau",
        429: "Trop de requêtes, attendez 30 secondes",
        ERR_429: "Trop de requêtes, attendez 30 secondes",
        ERR_500: "Serveur inaccessible, vérifiez le serveur et le réseau",
        1: "Trop de requêtes, attendez 30 secondes",
        7: "Bourrage papier, vérifiez l'imprimante",
        ERR_NETWORK: "Serveur inaccessible, vérifiez le serveur et le réseau",
        dataError: "Données produit invalides en base de données"
    }

}
export default fr;