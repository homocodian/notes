package com.notes.homocodians;

import android.os.Bundle;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

  public void onCreate(Bundle savedInstanceState){
    super.onCreate(savedInstanceState);
    
    registerPlugin(GoogleAuth.class);
  }
}
