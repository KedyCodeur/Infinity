package com.anonymous.Infinity;

import android.app.Application;

import com.sunmi.peripheral.printer.InnerPrinterCallback;
import com.sunmi.peripheral.printer.InnerPrinterException;
import com.sunmi.peripheral.printer.InnerPrinterManager;
import com.sunmi.peripheral.printer.SunmiPrinterService;

public class SunmiCustomApp extends Application {
    public static SunmiCustomApp app;
    public SunmiPrinterService sunmiPrinter; 

    @Override
    public void onCreate() {
        super.onCreate();
        app = this;
        bindPrintService();
    }



    private void bindPrintService() {
        try {
            InnerPrinterManager.getInstance().bindService(this, new InnerPrinterCallback() {
                @Override
                protected void onConnected(SunmiPrinterService service) {
                    sunmiPrinter = service;
                }

                @Override
                protected void onDisconnected() {
                    sunmiPrinter = null;
                }
            });
        } catch (InnerPrinterException e) {
            e.printStackTrace();
        }
    }
}
