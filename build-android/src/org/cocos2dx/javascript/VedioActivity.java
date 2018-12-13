package org.cocos2dx.javascript;

import android.app.Activity;
import android.content.Context;
import android.content.res.Resources;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Bundle;
import android.util.TypedValue;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.RelativeLayout.LayoutParams;
import android.widget.TextView;

import org.cocos2d.ctestand.R;

import static org.cocos2dx.lib.Cocos2dxActivity.getContext;


public class VedioActivity extends Activity implements MediaPlayer.OnCompletionListener, View.OnClickListener {
    private Context mContext;
    private RelativeLayout rl_root;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mContext = this;
        // 最外层的控件 RelativeLayout
        rl_root = new RelativeLayout(mContext);
        //隐藏标题栏
        this.requestWindowFeature(Window.FEATURE_NO_TITLE);
        //隐藏状态栏
        this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

        //初始化视频View
        VideoView view = new VideoView(this);
        view.setBackgroundColor(0xff0000);
        //添加一个按钮
        ImageButton imageButton = new ImageButton(mContext);
        imageButton.setBackgroundResource(R.mipmap.b_cl);
        RelativeLayout.LayoutParams imgBtnlayer = new RelativeLayout.LayoutParams(dip2px( mContext,42), dip2px( mContext,42));
        imgBtnlayer.addRule(RelativeLayout.ALIGN_PARENT_TOP);
        imgBtnlayer.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
        imgBtnlayer.topMargin = 55;
        imgBtnlayer.rightMargin = 55;
        imageButton.setLayoutParams(imgBtnlayer);
        imageButton.setOnClickListener(this);

//        RelativeLayout closeBtnLayout = (RelativeLayout) LayoutInflater.from(mContext).inflate(R.layout.video_colse, null);
//        ImageView BtnClose = (ImageView) closeBtnLayout.findViewById(R.id.videoclose);
//        BtnClose.setOnClickListener(this);
        rl_root.addView(view);
        // 添加自定义图片的 按钮
        rl_root.addView(imageButton);
        //设置显示视频View
        setContentView(rl_root);
        //注册监听视频
        view.setOnCompletionListener(this);
        //设置视频文件路径
        String uri = "android.resource://" + getPackageName() + "/" + R.raw.test;
        view.setVideoURI(Uri.parse(uri));
        //播放视频
        view.start();
    }

    private int dip2px(Context context, float dipValue) {
        Resources r = context.getResources();
        return (int) TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP, dipValue, r.getDisplayMetrics());
    }

    /**
     * 根据手机的分辨率从 px(像素) 的单位 转成为 dp
     */
    public static int px2dip(Context context, float pxValue) {
        final float scale = context.getResources().getDisplayMetrics().density;
        return (int) (pxValue / scale + 0.5f);
    }

    /**
     * 根据手机的分辨率从 dp 的单位 转成为 px(像素)
     */
    public static int dp2px(Context context, float dpValue) {
        final float scale = context.getResources().getDisplayMetrics().density;
        return (int) (dpValue * scale + 0.5f);
    }

    /** px转换dip */
    public static int px2dip(int px) {
        final float scale = getContext().getResources().getDisplayMetrics().density;
        return (int) (px / scale + 0.5f);
    }
    /** px转换sp */
    public static int px2sp(int pxValue) {
        final float fontScale = getContext().getResources().getDisplayMetrics().scaledDensity;
        return (int) (pxValue / fontScale + 0.5f);
    }
    /** sp转换px */
    public static int sp2px(int spValue) {
        final float fontScale = getContext().getResources().getDisplayMetrics().scaledDensity;
        return (int) (spValue * fontScale + 0.5f);
    }


    //当视频播放完后回调此函数
    @Override
    public void onCompletion(MediaPlayer mp) {
        //结束当前Activity
        this.finish();
    }

    @Override
    public void onClick(View v) {
        this.finish();
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        this.finish();
    }


}