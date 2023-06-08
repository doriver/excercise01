/**
 * Purpose	: UI components to set defult method.
 */
 
 //내  용 : 공통조회로직
//작성자 : LKH
//작성일 : 2022-12-05
function gfnSearchMsg(sqlId, searchParm, dataProvider, columns, pgmCd, fnCallback, msgFlag){
    var messageIn = {}; 
    var path1 = pgmCd.substr(0,3).toLowerCase();
    var path2 = pgmCd.substr(3,4).toLowerCase();
    var realPath = "kr.co.dwlg."+path1+"."+path2+".persistence."+pgmCd+"Mapper."+sqlId;
    
    messageIn["cmnSearchMap"] = getMessageSearchJSON(realPath, searchParm);

	$.tx.ajax("POST", "/CmnSearchListJson.do", messageIn
			, function(result){
					    dataProvider.clearRows(); // onCurrentChanged 이벤트 발생시키기 위해 데이타 삭제
				        dataProvider.fillJsonData(result.data.rtn_dst[1]);
				        //Undo 사용을 위한 Master SavePoint 
		    			dataProvider.clearSavePoints();
						dataProvider.savePoint(true);
				        if(dataProvider.getRowCount()==0){ //조회된 결과가 없으면 입력항목 초기화
				        	if(msgFlag != "N"){
					        	 $().toastmessage('showToast', { 
						             text     : '등록된 자료가 없습니다.',
						             type     : 'error'
						         });
					        }
				        	var obj = columns;
				           jQuery.each( obj, function( i, val ) {
				            if(val.bind_type == "text"){
				             // GRID -> CONTROL
				             $("#"+val.bind_obj).val("");
				            } else if(val.bind_type == "select"){
				             // GRID -> CONTROL
				             $("#"+val.bind_obj).val("");
				            } else if(val.bind_type == "check"){
				             /* 
				             TODO
				             */
				            } else if(val.bind_type == "radio"){
				             /* 
				             TODO
				             */
				            }
				           });
				        }else{
				        	if(msgFlag != "N"){
				        		$().toastmessage('showToast', { 
					             text     : '조회 되었습니다.',
					             type     : 'success'
					         });
				        	}
				        };
				        
				        if(fnCallback!=null && typeof fnCallback == 'function'){
							 fnCallback();
						}
				       
	       	  }
	         , function(result){ //error
					alert("error");
	       	   }
	          , false //sync
	       );

	
}
