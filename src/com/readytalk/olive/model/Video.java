package com.readytalk.olive.model;

public class Video {

	private String name;
	private String url;
	private String icon;
	private int projectId;
	private int startTimeStoryboard;
	private boolean isSelected;

	public Video(String name, String url, String icon, int projectId,
			int startTimeStoryboard, boolean isSelected) {
		this.name = name;
		this.url = url;
		this.icon = icon;
		this.projectId = projectId;
		this.startTimeStoryboard = startTimeStoryboard;
		this.isSelected = isSelected;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public int getProjectId() {
		return projectId;
	}

	public void setProjectId(int project) {
		this.projectId = project;
	}

	public void setStartTimeStoryboard(int startTimeStoryboard) {
		this.startTimeStoryboard = startTimeStoryboard;
	}

	public int getStartTimeStoryboard() {
		return startTimeStoryboard;
	}
	
	public void setIsSelected(boolean isSelected) {
		this.isSelected = isSelected;
	}
	
	public boolean getIsSelected() {
		return isSelected;
	}

}
