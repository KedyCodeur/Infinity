const en = {
    Login: {
        webadress: "Web service address",
        username: "Username",
        password: "Password",
        show: "Show password",
        hide: "Hide password",
        login: "Login"
    },
    Print : {
      name: "Create Label",
      h1: "Scan the Barcode",
      label: "Product Barcode",
      button : "Print"
    },
    Tabs: {
        createLabel: "Print Label",
        modifyPrice: "Price Modification"
    },
    Modify: {
        button: "Modify",
        name: "Modify the price"
    },
    HeaderSide: {
        options: "Options",
        remember: "Remember Me",
        theme: "Dark Mode",
        logOut: "Log Out",
        lang: "Language"
    },
    ModifyPanel: {
        price: "Price",
        modify: "Modify",
        cancel: "Cancel"
    },
    LoginNotif : {
        "ERR_400": "Login data cannot be empty",
        "ERR_401": "Invalid login credentials",
        "ERR_404": "Not found",
        "ERR_429": "Too many requests, please try again later",
        "ERR_500": "Server error",
        "OK_200": "Login successful, welcome!",
        "ERR_UNKNOWN": "An unknown error occurred"
    },
    modifyNotif : {
        emptyBarCode : "Barcode cannot be empty",
        invalidBarCode : "Invalid barcode",
        unknown : "Unknown error",
        emptyPrice : "Price cannot be empty",
        quantityPositive : "Price cannot exceed 15,000",
        quantityNegative : "Price cannot be negative",
        success : "Price modified successfully",
        invalidPrice : "Invalid price"
    },
    handleModifyPriceError : {
        400: "codeBar can not be empty",
        404: "Barcode not found",
        500: "Server Error",
        429: "Too many requests please wait",
        unknown : "Unknown error",
    },
    printerErrors : {
        1: "Printer is busy",
        4: "Printer out of paper",
        6: "Printer cover is open",
        7: "Paper jam",
        9: "No printer detected",
        505: "Printer not connected",
        507: "Printer firmware error",
        REMOTE_ERR: "Printer service connection error",
        dataError: "Invalid data received. Please verify the information.",
        unknown : "Unknown error",
    }

}
export default en;