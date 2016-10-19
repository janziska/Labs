package com.mongo.service.example;


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
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;

import javax.net.ssl.HttpsURLConnection;

import org.json.*;

//import com.ibm.json.java.JSONObject;


/**
 * Servlet implementation class UserServlet
 */


@Path("/user")
public class UserServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
		public UserServlet() {
			super();
		// TODO Auto-generated constructor stub
	}
		public void destroy() {
			super.destroy(); // Just puts "destroy" string in log
			// Put your code here
		}
	

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	// Respond to user get request
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
	 
		// Get parameters from the url
		String source = request.getParameter("source");
		System.out.println(source + "\n");
		String target = request.getParameter("target");
		System.out.println(target + "\n");
		String q = request.getParameter("q");
		System.out.println(q + "\n");
		
		// Encode as a url for Google
		String urlGoogle = "https://www.googleapis.com/language/translate/" 
				+ "v2?key=AIzaSyCvMpcuLjolygMmSkHIIHIgnkq-10yIEXM" + "&source=" 
				+ URLEncoder.encode(source, "UTF-8") + "&target=" + URLEncoder.encode(target, "UTF-8") + "&q=" + URLEncoder.encode(q, "UTF-8");
		  
		// String for the result
		String translation = null;
		
		// Send to Google
		try{
			URL obj = new URL(urlGoogle);
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();
	
			// optional default is GET
			con.setRequestMethod("GET");
			con.setRequestProperty("Accept", "application/json");
			
			// If failed
			if (con.getResponseCode() != 200) {
				throw new RuntimeException("Failed : HTTP error code : "
						+ con.getResponseCode());
				
				}	
			
			String  j = "";
			
			// Get output and send it to console and make it a string
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

		// Send translated text to Watson
		try{
			// Create URL
			System.out.println(translation);
			String urlWatson = "http://gateway-a.watsonplatform.net/calls/text/TextGetTextSentiment?" +
	                "apikey=6374c076c0afdefeb93b382ecf5610fb71710307&outputMode=json&text=" + URLEncoder.encode(translation, "UTF-8");
			 
			// Send to Watson
			URL obj = new URL(urlWatson);
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();
	
			// optional default is GET
			con.setRequestMethod("GET");
			con.setRequestProperty("Accept", "application/json");
			
			// Bad connection
			if (con.getResponseCode() != 200) {
				throw new RuntimeException("Failed : HTTP error code : "
						+ con.getResponseCode());
				
				}	
			// Object to write back to user the JSON
			 PrintWriter out = response.getWriter();
			 String  j = "";
			 
			 // Check the output on console
			BufferedReader br = new BufferedReader(new InputStreamReader(
					(con.getInputStream())));
			String output;
				System.out.println("Output from Server .... \n");
				while ((output = br.readLine()) != null) {
					System.out.println(output);
					j += output;
				}

				// Add in the translation
				JSONObject json  = new JSONObject(j);
				json.put("translatedText", translation);
				
				// Send it back to the user
				out.println(json);
				con.disconnect();
				
					// Create info header for a response 
					response.setHeader("Access-Control-Allow-Origin", "*");
					response.setHeader("Access-Control-Allow-Methods", "GET");
					response.setHeader("Access-Control-Allow-Headers", "Content-Type");
					response.setContentType("application/json");
					response.setHeader("Access-Control-Max-Age", "86400");
		}
		catch (MalformedURLException e) {

			e.printStackTrace();

		  } catch (IOException e) {

			e.printStackTrace();

		  }

		

		
		

		
		
		
		
}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
	/*	StringBuilder buffer = new StringBuilder();
		BufferedReader reader = request.getReader();
		String line;
		while ((line = reader.readLine()) != null) {
			buffer.append(line);
		}
		String data = buffer.toString();
		System.out.println(data);

		JSONObject params = new JSONObject(data);
		BasicDBObject user1 = new BasicDBObject();
		
		for(Object key:params.keySet().toArray())
		{
			user1.put(key.toString(),params.get(key.toString()));
		}
		System.out.println(user1.toJson());
		
		MongoClientURI uri = new MongoClientURI("mongodb://dbuser:password@ds019028.mlab.com:19028/asedb");
		MongoClient client = new MongoClient(uri);

		DB db = client.getDB(uri.getDatabase());
		DBCollection users = db.getCollection("collectioname");
		WriteResult result = users.insert(user1);

		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Methods", "POST");
		response.setHeader("Access-Control-Allow-Headers", "Content-Type");
		response.setHeader("Access-Control-Max-Age", "86400");

		response.getWriter().write(result.toString());*/
	}

	@Override
	protected void doOptions(HttpServletRequest arg0, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		super.doOptions(arg0, response);

		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, HEAD, OPTIONS");
		response.setHeader("Access-Control-Allow-Headers", "Content-Type");
		response.setHeader("Access-Control-Max-Age", "86400");
	}
}

