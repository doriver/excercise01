/**********************************************************************************************************************
* Type		: cmn > javascript
* Purpose	: function to communicate to server using ajax 
***********************************************************************************************************************
* Desc.
***********************************************************************************************************************
* - defined to communicate to server using ajax
***********************************************************************************************************************
*	Modified date			Modifier			Remark		
***********************************************************************************************************************
*	
**********************************************************************************************************************/
(function($){
	/************************************************************************************************************
	* Commnuicate to server using AJAX
	*  paramMethod : GET/POST
	*  paramUrl : call service url in server
	*  paramJsonData : throw paramter to server with json format.
	*  paramCallbackFunction : after get successful response from server, run callback function.  
	*  paramErrorCallbackFunction : after get failed response from server, run callback function.
	*  asyncYn : asynchronous transaction call
	*  element :
	*  msgShowOpt : 
	*  jsonFormatOpt :
	*  timeOutSec : 기본 45초
	************************************************************************************************************/
	$.tx = {
		ajax : function (paramMethod, paramUrl, paramJsonData, paramCallbackFunction, paramErrorCallbackFunction
						, asyncYn, element, msgShowOpt, jsonFormatOpt, pDataType, pAttachedFile, useError, timeOutSec
						){
			if(pDataType === undefined) pDataType = 'json'; 
			if(msgShowOpt === undefined) msgShowOpt = false; // FTD-88 삭제 요청
			
	    	var ajaxParam = {
				"dataType": pDataType, 
				"type": paramMethod,
				"contentType": "application/json",
				"async": (asyncYn != null && asyncYn) ? true : asyncYn ,
				"url": paramUrl,
				"timeout" : (timeOutSec != null && timeOutSec) ? 45000 : timeOutSec,
				
				// 요청 전처리 : HEADER에 JWT 추가
				"beforeSend": function(req){
					/*
					if(paramMethod == "GET" || paramMethod == "POST" ||paramMethod == "PUT" || paramMethod == "DELETE") {
						(element != null && element) ? $('body').addClass(element) : $('body').addClass('Loading')
					}
										
					if(jsonMenuString != null && jsonMenuString[0]) {
						var jsonMenu = JSON.parse(jsonMenuString[0]);
						var menu = new Object() ;
						menu.menuId = jsonMenu.menuId;
						menu.pgmId = jsonMenu.pgmId;
						menu.pgmUrl = jsonMenu.pgmUrl;
						req.setRequestHeader('Menulink', JSON.stringify(menu));
					}
					console.log("beforeSend : " + paramMethod + " " + paramUrl + "\n" + JSON.stringify(paramJsonData,null,2));
					*/
					$.popup.overlay.loading('open');
					//add csrf token into header
					var token = $("meta[name='_csrf']").attr("content");
					var header = $("meta[name='_csrf_header']").attr("content");
					req.setRequestHeader(header, token);
					req.setRequestHeader('Accept-Language','en');
					req.setRequestHeader('TimeZone',jstz.determine().name());
					req.setRequestHeader('source','dwlg');
					if(sessionStorage.getItem("srvId") == null) ﻿﻿sessionStorage.setItem("srvId", "WEB");
					req.setRequestHeader('srvId',﻿﻿sessionStorage.getItem("srvId"));
				},
				
				// 응답 (성공/실패)후처리 : TODO : 진행바 표시
				"complete": function(){
					//console.log('complete 1111')
				},
				
				// 응답결과 성공 후처리 : SESSION에 갱신된 JWT 저장
				"success": function(result, textStatus, request){
					/* get 방식 성공
					code: 0
					list: (27847) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, …]
					msg: "성공하였습니다."
					success: true
					*/
					//console.log('suc')
//					console.log("result > success : " + paramMethod + " " + paramUrl + "\n" + JSON.stringify(result,null,2));
					
					//duplicated message popup
					if(msgShowOpt){
						if($(".jqx-notification-table").length <= 1){
							$('#web2MsgContents').html(result.message);
							$('#web2MsgNotification').jqxNotification({ template: "success"}).jqxNotification("open");
						}
					}
					$.popup.overlay.loading('close');
					var rtnDt = result.jqxData;
					
					//select return data format
					if(jsonFormatOpt == 'json'){
						rtnDt = result.list;
					}
					
					//single type
					if(rtnDt === undefined || rtnDt == ''){
						rtnDt = result;
					}
					
					paramCallbackFunction(rtnDt,result.code,result.message);
				},
				
				// 응답결과 실패 후처리 : exception.code별 공통 후처리
				"error":function(request,status,error) {
					var exception = request.responseJSON;
					if(useError !== false) { 
						$.popup.overlay.loading('close');
						if(exception !== undefined){
							//console.log('err')
							//console.log(exception);
							//console.log(request);
		
							//toastmessage로만 처리하기 위해 주석처리함 23.01.25 이경희
							//$.popup.alert(exception.message);
		
		/*
							if(msgShowOpt){
								//duplicated message popup
								if($(".jqx-notification-table").length <= 1){
									$('#web2MsgContents').html(result.message);
									$('#web2MsgNotification').jqxNotification({ template: "error"}).jqxNotification("open");
								}
							}
							*/
							if(paramErrorCallbackFunction){
								paramErrorCallbackFunction(exception);
							}
						}else{
							 document.write(request.responseText);				
						 	 //window.top.postMessage({type:'ERROR'}, '*');
						}
					} else {
						if(paramErrorCallbackFunction){
							paramErrorCallbackFunction(exception);
						}
					}
				}
	    	};
	    	
	    	// 요청 파라미터 추가 : GET - QueryString, POST - PAYLOAD
	    	if(paramMethod == "GET" && paramJsonData != null){
	    		ajaxParam.url = ajaxParam.url + "?filter=" + encodeURIComponent(JSON.stringify(paramJsonData));
	        }
	    	else{
	        	ajaxParam.data = JSON.stringify(paramJsonData);
	        }
	    	
	    	if(pAttachedFile){
	    		ajaxParam.enctype = 'multipart/form-data';
	    		ajaxParam.contentType = false;
				ajaxParam.processData = false;
				ajaxParam.cache = false;
				delete ajaxParam.dataType;
				ajaxParam.data = paramJsonData;
	    	}
	    	//console.log(ajaxParam)
	    	//console.log("paramJsonData : " + encodeURIComponent(JSON.stringify(paramJsonData)));
	    	
	        $.ajax(ajaxParam);
		}
	}
})(jQuery);