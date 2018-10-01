package com.vew2;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.marianhello.bgloc.react.BackgroundGeolocationPackage;
import com.brentvatne.react.ReactVideoPackage;
import cl.json.RNSharePackage;
import com.github.yamill.orientation.OrientationPackage;
import com.joshblour.reactnativeheading.ReactNativeHeadingPackage;
import com.rnfs.RNFSPackage;
import org.reactnative.camera.RNCameraPackage;
import com.mapbox.rctmgl.RCTMGLPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ReactNativePushNotificationPackage(),
            new BackgroundGeolocationPackage(),
            new ReactVideoPackage(),
            new RNSharePackage(),
            new OrientationPackage(),
            new ReactNativeHeadingPackage(),
            new RNFSPackage(),
            new RNCameraPackage(),
            new RCTMGLPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
