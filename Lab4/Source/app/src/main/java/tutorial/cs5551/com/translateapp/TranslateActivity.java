package tutorial.cs5551.com.translateapp;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class TranslateActivity extends AppCompatActivity {

    //String API_URL = "https://api.fullcontact.com/v2/person.json?";
    //String API_KEY = "b29103a702edd6a";
    String sourceText;
    TextView outputTextView;
    TextView outputTypeView;
    //Context mContext;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_translate);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        outputTextView = (TextView) findViewById(R.id.txt_Result);
        outputTypeView = (TextView) findViewById(R.id.txt_Type);
    }
    public void logout(View v) {
        Intent redirect = new Intent(TranslateActivity.this, LoginActivity.class);
        startActivity(redirect);
    }
    public void translateText(View v) {
        TextView sourceTextView = (TextView) findViewById(R.id.txt_Email);

        sourceText = sourceTextView.getText().toString();

        // get the sentiment from Alchemy
        String getURL = "http://gateway-a.watsonplatform.net/calls/text/TextGetTextSentiment?" +
                "apikey=6374c076c0afdefeb93b382ecf5610fb71710307&outputMode=json&text=" + sourceText;
        final String response1 = "";
        OkHttpClient client = new OkHttpClient();
        try {
            Request request = new Request.Builder()
                    .url(getURL)
                    .build();
            client.newCall(request).enqueue(new Callback() {
                @Override
                public void onFailure(Call call, IOException e) {
                    System.out.println(e.getMessage());
                }
                @Override

                // Parse the results of the Alchemy call
                public void onResponse(Call call, Response response) throws IOException {
                    final JSONObject jsonResult;
                    final String result = response.body().string();
                    try {
                        // Process the score
                        jsonResult = new JSONObject(result);
                        JSONObject jsonDocSentiment = jsonResult.getJSONObject("docSentiment");
                        Double scoreDouble = jsonDocSentiment.getDouble("score")*100;
                        String scoreText = String.format("%.0f", scoreDouble);
                        final String convertedScore = "Score: " + scoreText;

                        // Process the type of sentiment
                        String typeString = jsonDocSentiment.getString("type");
                        final String typeStringColor = typeString;
                        final String convertedType = "Type: " + typeString;

                        Log.d("okHttp", jsonResult.toString());
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {

                                // Set color based on type of sentiment
                                if(typeStringColor.equals("positive"))
                                {
                                    // Green for good
                                    outputTextView.setTextColor(0xFF00FF00);
                                    outputTypeView.setTextColor(0xFF00FF00);
                                }
                                else
                                {
                                    // red for bad
                                    outputTextView.setTextColor(0xFFFF0000);
                                    outputTypeView.setTextColor(0xFFFF0000);
                                }

                                // Display sentiment score and type
                                outputTextView.setText(convertedScore);
                                outputTypeView.setText(convertedType);

                            }
                        });
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            });


        } catch (Exception ex) {
            outputTextView.setText(ex.getMessage());

        }

    }
    public void sendMessage(View view) {
        // Email support with a new request
        Intent intent = new Intent(Intent.ACTION_SEND);
        intent.setType("message/rfc822");
        intent.putExtra(Intent.EXTRA_EMAIL, new String[] { "jwnf7b@mail.umkc.edu" });
        intent.putExtra(Intent.EXTRA_SUBJECT, "Support Request");
        intent.putExtra(Intent.EXTRA_TEXT, "Give us some details");
        startActivity(Intent.createChooser(intent, "send email to support.."));
    }
}
