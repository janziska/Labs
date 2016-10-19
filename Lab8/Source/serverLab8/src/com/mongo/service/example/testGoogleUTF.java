package com.mongo.service.example;

import static org.junit.Assert.*;
import java.io.BufferedReader;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Path;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Test;


import org.junit.Test;

public class testGoogleUTF {
	@Test
	public void testSingle() throws UnsupportedEncodingException {
		String source = "en";
		String target = "es";
		String qSingle = "hi";
		String qTwo = "Good Morning";
		String translation = "";
		
		
		// Setup Google URL for the connection test
		String urlGoogle = "https://www.googleapis.com/language/translate/v2?key=AIzaSyCvMpcuLjolygMmSkHIIHIgnkq-10yIEXM";
		String urlSingle = urlGoogle + "&source=" + URLEncoder.encode(source, "UTF-8") + "&target=" + URLEncoder.encode(target, "UTF-8") + "&q=" + URLEncoder.encode(qSingle, "UTF-8");
		  
		try{
		// Send to Google

			URL obj = new URL(urlSingle);
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();
	
			// optional default is GET
			con.setRequestMethod("GET");
			con.setRequestProperty("Accept", "application/json");
			
			// If failed
			if (con.getResponseCode() != 200) {
				throw new RuntimeException("Failed : HTTP error code : "
						+ con.getResponseCode());
				
			}		
			String j = "";
			BufferedReader br = new BufferedReader(new InputStreamReader(
					(con.getInputStream())));
			String output;
				System.out.println("Output from Server .... \n");
				while ((output = br.readLine()) != null) {
					System.out.println(output);
					//out.println(output);
					j += output;
				}

			// Parse Json for translated text
			JSONObject json  = new JSONObject(j);
			JSONObject data = json.getJSONObject("data");
			JSONArray arr =	data.getJSONArray("translations");
			JSONObject zero = arr.getJSONObject(0);
			translation = zero.getString("translatedText");
			System.out.println(translation + "\n");
			con.disconnect();
}
		
		// Catches for bad url or other errors
		catch (MalformedURLException e) {

			e.printStackTrace();

		  } catch (IOException e) {

			e.printStackTrace();

		  }
	
			assertEquals(translation, "Hola");
			
	}
	
	@Test
	public void testDouble() throws UnsupportedEncodingException {
		String source = "en";
		String target = "es";
		String qSingle = "hi";
		String qTwo = "Good Morning";
		String translation = "";
		
		

		// Setup Google URL for the connection test
		String urlGoogle = "https://www.googleapis.com/language/translate/v2?key=AIzaSyCvMpcuLjolygMmSkHIIHIgnkq-10yIEXM";
		String urlDouble = urlGoogle + "&source=" + URLEncoder.encode(source, "UTF-8") + "&target=" + URLEncoder.encode(target, "UTF-8") + "&q=" + URLEncoder.encode(qTwo, "UTF-8");

		  
		try{
		// Send to Google
	
			URL obj = new URL(urlDouble);
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();
	
			// optional default is GET
			con.setRequestMethod("GET");
			con.setRequestProperty("Accept", "application/json");
			
			// If failed
			if (con.getResponseCode() != 200) {
				throw new RuntimeException("Failed : HTTP error code : "
						+ con.getResponseCode());
				
			}		
			String j ="";
			BufferedReader br = new BufferedReader(new InputStreamReader(
					(con.getInputStream())));
			String output;
				System.out.println("Output from Server .... \n");
				while ((output = br.readLine()) != null) {
					System.out.println(output);
					//out.println(output);
					j += output;
				}

			// Parse Json for translated text
			JSONObject json  = new JSONObject(j);
			JSONObject data = json.getJSONObject("data");
			JSONArray arr =	data.getJSONArray("translations");
			JSONObject zero = arr.getJSONObject(0);
			translation = zero.getString("translatedText");
			System.out.println(translation + "\n");
			con.disconnect();
}
		
		// Catches for bad url or other errors
		catch (MalformedURLException e) {

			e.printStackTrace();

		  } catch (IOException e) {

			e.printStackTrace();

		  }
	
			assertEquals(translation, "Buenos días");
			
	}
}