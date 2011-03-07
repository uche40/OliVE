package com.readytalk.olive.json;

public class UpdateVideosPositionRequest {

	// No-args constructor
	public UpdateVideosPositionRequest() {

	}

	public String command;
	public Arguments arguments;
	
	// Must be static for Gson to work.
	// See: http://sites.google.com/site/gson/gson-user-guide#TOC-Nested-Classes-including-Inner-Clas
	public static class Arguments {

		// No-args constructor
		public Arguments() {

		}
		
		public Videos[] videos;
		
		// Must be static for Gson to work.
		// See: http://sites.google.com/site/gson/gson-user-guide#TOC-Nested-Classes-including-Inner-Clas
		public static class Videos {

			// No-args constructor
			public Videos() {

			}
			
			public String video;
		}
	}
}
