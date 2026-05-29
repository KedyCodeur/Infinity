package com.anonymous.Infinity;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import android.graphics.Bitmap;
import com.sunmi.peripheral.printer.InnerResultCallback;

import com.google.zxing.common.BitMatrix; 
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.BarcodeFormat;
import com.journeyapps.barcodescanner.BarcodeEncoder;
import com.sunmi.peripheral.printer.InnerResultCallback;


import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;

import android.text.StaticLayout;
import android.text.TextPaint;
import android.text.Layout;
import android.graphics.Typeface;

import com.google.zxing.EncodeHintType;
import java.util.EnumMap;
import java.util.Map;

import android.graphics.DashPathEffect;


public class SunmiModule extends ReactContextBaseJavaModule {

    SunmiModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "SunmiCustom";
    }

    public static Bitmap createBarCode(String barcode) {
        try {
            Map<EncodeHintType, Object> hints = new EnumMap<>(EncodeHintType.class);
            hints.put(EncodeHintType.MARGIN, 0); 

            BitMatrix result = new MultiFormatWriter()
                    
                    .encode(barcode, BarcodeFormat.CODE_128, 245, 60, hints);

            Bitmap BitmapBarcode = new BarcodeEncoder().createBitmap(result);
            return BitmapBarcode;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }



    public StaticLayout createStaticLayout(String text) {
        TextPaint textPaint = new TextPaint();
        textPaint.setTextSize(26); 
        textPaint.setColor(Color.BLACK);
        textPaint.setAntiAlias(true);

        textPaint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        StaticLayout.Builder builder = StaticLayout.Builder.obtain(
                text, 0, text.length(), textPaint, 384
        );
        
        builder.setAlignment(Layout.Alignment.ALIGN_NORMAL);
        builder.setLineSpacing(0f, 1f); 
        builder.setIncludePad(false);
        
        return builder.build();
    }

    public void drawDashedLine(Canvas canvas, float startX, float startY, float endX, float endY, Paint paint) {

        paint.setPathEffect(new DashPathEffect(new float[]{10f, 5f}, 0f));
        
        canvas.drawLine(startX, startY, endX, endY, paint);
        
        paint.setPathEffect(null);
    }

@ReactMethod
public void print(String text, Promise promise) {
    try {
        if (MainApplication.getInstance().sunmiPrinter != null) {
            
            String barcodeValue = "123456789";
            String productName = "Bu cümle tam olarak";
            String refCode = "SHOULDERS TRAITEMENT";
            

            int space = 0;
            StaticLayout layout = createStaticLayout(productName);

            int lines = layout.getLineCount();

            switch(lines){
                case 1 -> space = 120;
                case 2 -> space = 95;
                case 3 -> space = 67;
            }

            int width = 384;
            int height = 285;
          
            Bitmap label = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
            Canvas canvas = new Canvas(label);
            canvas.drawColor(Color.WHITE);

            
            Paint paint = new Paint();
            paint.setColor(Color.BLACK);
            paint.setAntiAlias(true);


            Paint linePaint = new Paint();
            linePaint.setColor(Color.BLACK);
            linePaint.setStrokeWidth(2);
            linePaint.setStyle(Paint.Style.STROKE);
           
            drawDashedLine(canvas, 0, 0, 384, height, linePaint);
            int x = -17;
            int y =  30;

            

            canvas.save(); 
            canvas.translate(3, y);
            layout.draw(canvas); 
            canvas.restore();
            y += layout.getHeight() + space;

            int barcodeWidth = 245; 
            


            paint.setTextSize(16);
            float refCodeWidth = paint.measureText(refCode);
            float barCodeTextWidth= paint.measureText(barcodeValue);
               

            paint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
            int xRefCode = (int)   ((barcodeWidth - refCodeWidth) / 2) ;

            int xBarCodeText = (int)   ((barcodeWidth - barCodeTextWidth) / 2) ;

            int saveY = y;

            canvas.drawText(refCode, xRefCode - 19 , y - 10 , paint);
            y += 2;

            Bitmap barcode = createBarCode(barcodeValue);
            if (barcode != null) {
                canvas.drawBitmap(barcode, x, y, null);
                y += barcode.getHeight() + 18;
            }
            
            canvas.drawText(barcodeValue, xBarCodeText - 20 , y , paint);

            Paint rectPaint = new Paint();
            rectPaint.setColor(Color.BLACK); 
            rectPaint.setStyle(Paint.Style.FILL); 
            rectPaint.setStrokeWidth(2); 
            

            canvas.drawRect(barcodeWidth - 26 , saveY - 50  , 384, saveY + 60, rectPaint);    

            drawDashedLine(canvas, 5, height, 379, height, linePaint);
            try {
            
                    MainApplication.getInstance().sunmiPrinter.printBitmap(label, new InnerResultCallback() {
                        @Override public void onPrintResult(int code, String msg) {
                            promise.resolve("Baskı Tamamlandı!");
                        }
                        @Override public void onRaiseException(int code, String msg) {
                            promise.reject("PRINT_ERR", msg);
                        }
                        @Override public void onRunResult(boolean b) {}
                        @Override public void onReturnString(String s) {}
                    });
                } catch (android.os.RemoteException e) {
                
                    promise.reject("REMOTE_ERR", e.getMessage());
                }

                    } else {
                        promise.reject("HATA", "Yazıcı bağlı değil!");
                    }
                } catch (Exception e) {
                    promise.reject("HATA", e.getMessage());
                }
}



}