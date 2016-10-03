package tutorial.maps.google.googlemapsapplication;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.util.Log;
import 	android.app.AlertDialog;
import android.content.DialogInterface;
import android.widget.ImageView;
import android.widget.TextView;
import android.graphics.Bitmap;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import android.widget.ImageButton;


import java.util.List;


public class MainActivity extends AppCompatActivity {
    Button button_map;
    ImageButton button_photo;
    private static final String TAG = "MainActivity";
    public Geocoder geocoder;
    String emailPattern = "[a-zA-Z0-9._-]+@[a-z]+\\.+[a-z]+";
    Bitmap bitmap;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle("Sign Up");
            getSupportActionBar().setHomeButtonEnabled(true);
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }

        // create buttons
        button_map = (Button) findViewById(R.id.main_btn_maps);
        button_photo = (ImageButton) findViewById(R.id.main_btn_photo);




        // Get position for address field
        geocoder = new Geocoder(this);

        // Address string
        StringBuilder userAddress = new StringBuilder();

        // Get location
        LocationManager userCurrentLocation = (LocationManager) this
                .getSystemService(Context.LOCATION_SERVICE);

        // Location listeners
        LocationListener userCurrentLocationListener = new LocationListener() {
            @Override
            public void onLocationChanged(Location location) {

            }

            @Override
            public void onStatusChanged(String provider, int status, Bundle extras) {

            }

            @Override
            public void onProviderEnabled(String provider) {

            }

            @Override
            public void onProviderDisabled(String provider) {

            }
        };

        // Get lat and long
        LatLng userCurrentLocationCorodinates = new LatLng(0,0);
        double latitute = 0, longitude = 0;

        // Check permissions
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED && ActivityCompat
                .checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {
            //show message or ask permissions from the user.
            return;
        }
        //Getting the current location of the user.
        userCurrentLocation.requestLocationUpdates(LocationManager.GPS_PROVIDER,
                0, 0, userCurrentLocationListener);
        latitute = userCurrentLocation
                .getLastKnownLocation(LocationManager.GPS_PROVIDER)
                .getLatitude();
        longitude = userCurrentLocation
                .getLastKnownLocation(LocationManager.GPS_PROVIDER)
                .getLongitude();
        userCurrentLocationCorodinates = new LatLng(latitute,longitude);

        //Getting the address of the user based on latitude and longitude.
        try {
            List<Address> addresses = geocoder.getFromLocation(latitute, longitude, 1);
            Address address = addresses.get(0);
            userAddress =  new StringBuilder();
            for (int i = 0; i < address.getMaxAddressLineIndex(); i++) {
                userAddress.append(address.getAddressLine(i)).append("\t");
            }
            userAddress.append(address.getCountryName()).append("\t");

        }
        catch(Exception ex)
        {
            ex.printStackTrace();
        }

        TextView text = (TextView) findViewById(R.id.postalText);
        text.setText(userAddress);


    }

    public void onClickOfMapButton(View v) {
        //This code redirects the from main page to the maps page.


        // Gets form info
        final EditText nameField = (EditText) findViewById(R.id.nameText);
        String name = nameField.getText().toString();
        final EditText userField = (EditText) findViewById(R.id.userText);
        String user = userField.getText().toString();
        final EditText pwordField = (EditText) findViewById(R.id.pwordText);
        String pword = pwordField.getText().toString();
        final EditText cpwordField = (EditText) findViewById(R.id.cpwordText);
        String cpword = cpwordField.getText().toString();
        final EditText emailField = (EditText) findViewById(R.id.emailText);
        String email = emailField.getText().toString();
        final EditText postalField = (EditText) findViewById(R.id.postalText);
        String postal = postalField.getText().toString();

        // Log the form info
        Log.v(TAG, name + "  msg 1");
        Log.v(TAG, user + "  msg 2");
        Log.v(TAG, pword + "  msg 3");
        Log.v(TAG, cpword + "  msg 4");
        Log.v(TAG, email + "  msg 5");
        Log.v(TAG, postal + "  msg 6");

        // Check form password to be same as confirmation
        if(!pword.equals(cpword))
        {
            AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
            builder.setTitle("Warning")
                    .setMessage("Passwords do not match")
                    .setCancelable(false)
                    .setNegativeButton("Close",new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int id) {
                            dialog.cancel();
                        }
                    });
            AlertDialog alert = builder.create();
            alert.show();
        }
        else if(name.isEmpty())
        {
            AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
            builder.setTitle("Warning")
                    .setMessage("No Name Give")
                    .setCancelable(false)
                    .setNegativeButton("Close",new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int id) {
                            dialog.cancel();
                        }
                    });
            AlertDialog alert = builder.create();
            alert.show();

        }

        else if(postal.isEmpty())
        {
            AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
            builder.setTitle("Warning")
                    .setMessage("No Mailing Address Given")
                    .setCancelable(false)
                    .setNegativeButton("Close",new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int id) {
                            dialog.cancel();
                        }
                    });
            AlertDialog alert = builder.create();
            alert.show();

        }


        // Check for valid email
        else if(email.isEmpty() || email.matches(emailPattern))
        {
            AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
            builder.setTitle("Warning")
                    .setMessage("Give me a valid email")
                    .setCancelable(false)
                    .setNegativeButton("Close",new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int id) {
                            dialog.cancel();
                        }
                    });
            AlertDialog alert = builder.create();
            alert.show();

        }
        // Check for user name
        else if(user.isEmpty())
        {
            AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
            builder.setTitle("Warning")
                    .setMessage("No User Name Given")
                    .setCancelable(false)
                    .setNegativeButton("Close",new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int id) {
                            dialog.cancel();
                        }
                    });
            AlertDialog alert = builder.create();
            alert.show();

        }
        else
        {
            Intent redirect = new Intent(MainActivity.this, MapsActivity.class);
            redirect.putExtra("bmp", bitmap);
            startActivity(redirect);
        }


    }

    public void onClickOfPhotoButton(View v) {
        //This code redirects to the photo activity.
        Intent redirect = new Intent(MainActivity.this, PhotoActivity.class);
        startActivity(redirect);

    }

    // This allows us to use getIntent to get the latest intent, instead of the first Intent used in the onCreate
    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
    }

    @Override
    protected void onResume(){
        super.onResume();

        // check if got bmp from camera, if null then do nothing
        Bundle extras = getIntent().getExtras();
        if (extras == null)
        {
            return;
        }

        // Got an image, put it in the icon
        else
        {
            bitmap = getIntent().getParcelableExtra("bmp");
            button_photo.setImageBitmap(bitmap);
        }


    }

}
