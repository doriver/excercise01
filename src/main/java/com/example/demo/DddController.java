package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class DddController {

	@RequestMapping("/hh")
	@ResponseBody
	public String aaa() {
		return "hello worldaaa bbbb ccccccc";
	}

	@RequestMapping("/grid")
	public String ggg() {
		return "gridTest.html";
	} // default가 static폴더 안임, 타임리프 사용하면 templates에서 html을 찾음

	@RequestMapping("/ex01")
	public String gridEx01() {
		return "grid01.html";
	} 

	@RequestMapping("/jex01")
	public String jqueryEx01() {
		return "jquery01.html";
	}
	
	@RequestMapping("/nono")
	public String clearNo() {
		return "noClear.html";
	}

	@RequestMapping("/sample01")
	public String sample01() {
		return "sample01.html";
	}
}
