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

import com.facebook.react.bridge.ReadableMap;


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
                .encode(barcode, BarcodeFormat.CODE_128, 1, 1, hints);

        Bitmap raw = new BarcodeEncoder().createBitmap(result);
        Bitmap scaled = Bitmap.createScaledBitmap(raw, 196, 60, false);
        raw.recycle();
        return scaled;

    } catch (Exception e) {
        e.printStackTrace();
        return null;
    }
}



    public StaticLayout createStaticLayout(String text) {
        TextPaint textPaint = new TextPaint();
        textPaint.setTextSize(29); 
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
public void print(ReadableMap infos, Promise promise) {
    try {
        if (MainApplication.getInstance().sunmiPrinter != null) {
            
            String barcodeValue = infos.getString("barcodeValue");
            String productName = infos.getString("productName");
            String refCode = infos.getString("refCode");
            String uniteType = infos.getString("uniteType");
            String contenu = infos.getString("contenu");
            String pricePerKgL = infos.getString("pricePerKgL");
            String price = infos.getString("price");
            String currency = infos.getString("currency");


            String[] priceSeparated = price.split("\\.");

            int space = 0;
            StaticLayout layout = createStaticLayout(productName);

            int lines = layout.getLineCount();

            switch(lines){
                case 1 -> space = 110;
                case 2 -> space = 85;
                case 3 -> space = 48;
            }

            int width = 384;
            int height = 275;
          
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
           
            
            int x = 0;
            int y =  20;

            

            canvas.save(); 
            canvas.translate(3, y);
            layout.draw(canvas); 
            canvas.restore();
            y += layout.getHeight() + space;

            int barcodeWidth = 196; 
            


            paint.setTextSize(17);
            float refCodeWidth = paint.measureText(refCode);
            float barCodeTextWidth= paint.measureText(barcodeValue);
               

            paint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
            int xRefCode = (int)   ((barcodeWidth - refCodeWidth) / 2) ;

            int xBarCodeText = (int)   ((barcodeWidth - barCodeTextWidth) / 2) ;

            

            canvas.drawText(refCode, xRefCode , y - 10 , paint);
            y += 1;

            int saveY = y;
            Bitmap barcode = createBarCode(barcodeValue);
            if (barcode != null) {
                canvas.drawBitmap(barcode, x, y, null);
                y += barcode.getHeight() + 21;
            }

            paint.setTextSize(19);
            canvas.drawText(barcodeValue, xBarCodeText, y , paint);

            int yBottomValues = y;
            

            Paint rectPaint = new Paint();
            rectPaint.setColor(Color.BLACK); 
            rectPaint.setStyle(Paint.Style.FILL); 
            rectPaint.setStrokeWidth(2);    

            canvas.drawRect(215, saveY - 38  , 384, saveY + 60, rectPaint);//98 height 


            paint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
            paint.setStyle(Paint.Style.FILL_AND_STROKE);
            paint.setStrokeWidth(1.5f);
            
            paint.setTextSize(42);
            Paint.FontMetrics part1FM = paint.getFontMetrics();
            float part1Width = paint.measureText(priceSeparated[0] + ".");

            paint.setTextSize(38);
            Paint.FontMetrics part2FM = paint.getFontMetrics();
            float part2Height = part2FM.descent - part2FM.ascent;
            float part2Width = paint.measureText(priceSeparated[1]);

            paint.setStyle(Paint.Style.FILL);
            paint.setStrokeWidth(0);

            paint.setTextSize(36);
            Paint.FontMetrics part3FM = paint.getFontMetrics();
            float part3Height= part3FM.descent - part3FM.ascent;
            
            float partSpace = 1;

            float centerRect = (98 - (part2Height + - part3FM.ascent + partSpace))/ 2;
            float allWidthPrice = part1Width + part2Width;
            float marginRight = 10;

            paint.setColor(Color.WHITE);
            paint.setTextSize(42);
            canvas.drawText(priceSeparated[0] + ".", 384 - allWidthPrice - marginRight, saveY - 38 + centerRect + - part3FM.ascent + partSpace   - part1FM.ascent , paint); 


            paint.setTextSize(38);
            canvas.drawText(priceSeparated[1] , 384 - part2Width - marginRight ,saveY - 38 + centerRect + partSpace - part1FM.ascent - part3FM.ascent , paint); 

            paint.setTextSize(36);
            canvas.drawText(currency, 384 - part2Width - marginRight ,saveY - 38  + centerRect - part3FM.ascent , paint); 

           //--------------------------------------------------------------------------------------------------
            if(!uniteType.isEmpty()){
                paint.setColor(Color.BLACK);
                paint.setTextSize(19);
                canvas.drawText(contenu + " " + uniteType, 215 , yBottomValues , paint); 
                float widthLeftPart = 384 - paint.measureText(pricePerKgL + " " + currency + "/" + uniteType); // 10 == space

                
                canvas.drawText(pricePerKgL + " " + currency + "/" + uniteType, widthLeftPart , yBottomValues, paint);

                drawDashedLine(canvas, 5, height, 379, height, linePaint);
            }

            try {   
                    MainApplication.getInstance().sunmiPrinter.printerInit(null);
                    MainApplication.getInstance().sunmiPrinter.printBitmap(label, new InnerResultCallback() {
                        @Override public void onPrintResult(int code, String msg) {
                            label.recycle();
                            if (barcode != null) barcode.recycle();
                            promise.resolve("Baskı Tamamlandı!");
                        }
                        @Override public void onRaiseException(int code, String msg) {
                            label.recycle();
                            if (barcode != null) barcode.recycle();
                            promise.reject("PRINT_ERR", msg);
                        }
                        @Override public void onRunResult(boolean b) {}
                        @Override public void onReturnString(String s) {}
                    });
                    MainApplication.getInstance().sunmiPrinter.lineWrap(3, null);
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