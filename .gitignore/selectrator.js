/*
 * Selectrator - mini JavaScript library for select item from table
 * @author Zakharov Andrey
 * @version 0.2 - multiinput
 */

 function Selectrator(params) {
    let el;
    let el_name = params['element'];
    let ajaxPath = params['ajaxPath'];
    let display_fields = params['display_fields'];
    let search_fields = params['search_fields'];
    let element_for_id = params['element_for_id'];
    let element_id = params['element_id'];
    let th;
    
    console.log('Selectrator ', params['element'] ,'LOAD');
    
    this.el = document.querySelector(params['element']);
    this.th = params['th'];
    console.log(el_name, params);
	
    postAjax = function (url, data, success) {
	var params = typeof data == 'string' ? data : Object.keys(data).map(
			function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
	).join('&');

	var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	xhr.open('POST', url);
	xhr.onreadystatechange = function() {
            if (xhr.readyState>3 && xhr.status==200) { success(xhr.responseText); }
	};
	xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.send(params);
	return xhr;
    }
	
    // Cross Browser Compatibility Event
    function addEvent(elem, type, handler) {
    	if (!elem) {
            return false;
	}
	if (window.addEventListener) {
            elem.addEventListener(type, handler, false);
	} else {
            elem.attachEvent('on' + type, function() {
		handler.call(elem);
            });
	}
	return false;
    }
	
    this.init = function () {
        var inputs ='';
        search_fields.forEach(function(element) {
            inputs += element.title + ' <input type="text" class="selectrator_input_'+ element.name+'"> ';
        });
        var selectrator_html = '<style>.scrolling{background:#fff;height:200px;width:100%;border:1px solid #c1c1c1;overflow-x:scroll;overflow-y:scroll;margin:15px 0px;}</style>' 
                               + inputs + '<div id="selectrator_div"></div>';

        this.el.innerHTML  = selectrator_html;

        search_fields.forEach(function(element) {
            document.querySelector(el_name + ' .selectrator_input_'+ element.name).oninput = function(e) {
                refresh(el_name);
            };
        }); 
		
	addEvent(this.el, 'click', function(e){
            if(e.target.className === 'selectrator_button') {
		var itemId = e.target.getAttribute('data-id');
		document.querySelector(element_id).value = itemId;
                var event = new Event('change');
		document.querySelector(element_id).dispatchEvent(event);
            }
            return false;
        }, false);
    }
	
    this.refresh = function (elem, th) {
        var data_value = 'data';
        var post_param = {};
        search_fields.forEach(function(element) {
            post_param[element.name] = document.querySelector(elem + ' .selectrator_input_'+ element.name).value;
        });
        
	postAjax(ajaxPath, post_param, function(data){ 
            var selectrator_div_html = '';
            var json = JSON.parse(data);
            json.forEach(function(element) {
		var strFields = '';
		display_fields.forEach(function(fields) {
                    strFields += '<td class="selectrator selectrator_'+fields+'">'+element[fields]+'</td>';
		});
		selectrator_div_html += '<tr><td><span class="selectrator_button" data-id="' + element[element_for_id] + '">ВЫБРАТЬ</span></td>' + strFields + '</tr>';
            });
            if (selectrator_div_html !=='') {
                var thead = getTHead();
                selectrator_div_html  = '<div class="scrolling"><table>' + thead + selectrator_div_html + '</table></div>';
            } 
            document.querySelector(elem + ' #selectrator_div').innerHTML  = selectrator_div_html;
	});
    }
    
    this.getTHead = function () {
        var thead = '';
        
        this.th.forEach(function(fields) {
            thead += '<th>'+fields+'</th>';
        });
        
        return '<thead>' + thead + '</thead>'
    }
	
    this.init();
}