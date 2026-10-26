/**
 * Javascript: EventON functions for all calendars
 * @version: 5.0.7
 * @license EventON JavaScript Assets 
 * Copyright (C) 2014-2026 Ashan Jay, AshanJay Designs LLC.
 * 
 * PROPRIETARY LICENSE - All Rights Reserved
 * 
 * Permission granted solely for personal use with valid EventON license.
 * YOU MAY NOT: redistribute, resell, sublicense, or publish these Assets.
 * 
 * Trademark: "EventON" is a trademark of AshanJay Designs LLC.
 * Contact: info@myeventon.com
 * 
 * PROVIDED "AS IS" WITHOUT WARRANTY. VIOLATION MAY RESULT IN LEGAL ACTION.
 */

jQuery(document).ready(function($) {

	const BB = $('body');

	// Basics
		// Calendar function s
			$.fn.evo_cal_functions = function(O){
				const el = this;
				switch(O.action){
					// load shortcodes inside calendar data
					case 'load_shortcodes':
						return el.find('.evo_cal_data').data('sc');		
					break;
					case 'update_json':
						//console.log(O.json);
						el.find('.evo_cal_events').data('events', O.json);		
					break;
					case 'update_shortcodes':
						//console.log(O.SC);
						el.find('.evo_cal_data').data( 'sc', O.SC );
					break;
				}
			};

		// access page GLOBALS
			$.fn.evo_get_global = function(opt){
				var defaults = { S1:'', S2:''};
				var OPT = $.extend({}, defaults, opt);

				var BUS = $('#evo_global_data').data('d');

				if(!(OPT.S1 in BUS)) return false;
				if(!(OPT.S2 in BUS[OPT.S1])) return false;
				return BUS[OPT.S1][OPT.S2];
			}
			$.fn.evo_get_txt = function(opt){
				var defaults = { V:''}
				var OPT = $.extend({}, defaults, opt);

				var BUS = $('#evo_global_data').data('d');
				//console.log(BUS);
				if(!('txt' in BUS)) return false;
				if(!(OPT.V in BUS.txt)) return false;
				return BUS.txt[OPT.V];
			}

			// get translated text strings from ajax loaded data @4.6.4
			$.fn.evo_lang = function(text){
				var t = text.toLowerCase()
				    .replace(/ /g, "_")
				    .replace(/[^\w-]+/g, "");


				var BUS = $('#evo_global_data').data('d');

				if(!('txt' in BUS)) return text;
				if(!(t in BUS.txt)) return text;
				return BUS.txt[ t ];

			}
			$.fn.evo_get_cal_def = function(opt){
				var defaults = { V:''}
				var OPT = $.extend({}, defaults, opt);

				var BUS = $('#evo_global_data').data('d');
				if(!('cal_def' in BUS)) return false;
				if(!(OPT.V in BUS.cal_def)) return false;
				return BUS.cal_def[OPT.V];
			}

			// return dms translates values from global data
			// added 4.0
			$.fn.evo_get_dms_vals = function(opt){
				// type = d, d1,d3, m, m3
				// V = 0-x
				var defaults = { type:'d', V:''}
				var OPT = $.extend({}, defaults, opt);

				var BUS = $('#evo_global_data').data('d');			
				if(!('dms' in BUS)) return false;
				if(!(OPT.type in BUS.dms)) return false;

				return BUS.dms[ OPT.type ][ OPT.V ];
				
			}

	// GENERAL AJAX ACCESS @4.7.2 updated @4.9.2
		$.fn.evo_admin_get_ajax = function(opt){

			var el = $(this);

  			var OO = this.evo_process_ajax_params( opt );


  			var _lbdata = OO.lbdata;
			var _adata = OO.adata;	
			var _populate_id = OO._populate_id;	

			// Allow custom success callback to be passed in opt -- 4.9.2    		
    		var customBefore = typeof opt.onBefore === 'function' ? opt.onBefore : null;   // New onBefore callback
		    var customSuccess = typeof opt.onSuccess === 'function' ? opt.onSuccess : (typeof opt.success === 'function' ? opt.success : null); 
		    	// Rename to onSuccess, keep backward compatibility with 'success'
		    var customSuccess_Extra = typeof opt.successExtra === 'function' ? opt.successExtra : null; // this will run with default ajax
		    var customComplete = typeof opt.onComplete === 'function' ? opt.onComplete : null; // New onComplete callback

			var ajax_url = el.evo_get_ajax_url({a: _adata.a, e: _adata.end, type: _adata.ajax_type});

			// for lightbox
				var LB = false;
	  			if( _lbdata.class != '') LB = $('body').find('.evo_lightbox.'+ _lbdata.class );


	  		// Run AJAX
	  		let ajaxResponse = '';
  			$.ajax({
				beforeSend: function(){
					if (customBefore) {   customBefore.call(el, OO, LB); } // Call with onBefore:function(OO, LB){}
					el.evo_perform_ajax_run_loader( OO, LB, 'start'  );
				},
				type: 'POST', url: ajax_url, data: _adata.data,	dataType:'json',
				success:function(data){	
					ajaxResponse = data;
					//console.log(data);
					// If a custom success callback is provided, use it
		            if (customSuccess) {
		                customSuccess.call(el, OO, data, LB); // Call with onSuccess:function( OO, data, LB){} 
		                // call data with data.data
		                // Trigger a custom event for onSuccess - 4.9.11
		                $('body').trigger('evo_ajax_success_' + OO.uid,[ OO, data , el]);	
		            } else {
		                // Otherwise, use the default success behavior
		                el.evo_perform_ajax_success(OO, data, LB);
		                if( customSuccess_Extra ) customSuccess_Extra.call( el, OO, data, LB );
		            }

				},complete:function(){
					if (customComplete) {     customComplete.call(el, OO, ajaxResponse, LB);  } // Call with onSuccess:function( OO, data, LB){} 
					el.evo_perform_ajax_run_loader( OO, LB, 'end'  );
					
				}
			});				
		}

		// submit forms via ligtbox
		// @since 4.2.2		@updated 4.8
		$.fn.evo_ajax_form_submit = function( opt , boxtype , formObj){
			const el = this;	


  			var OO = this.evo_process_ajax_params( opt );

  			//console.log(OO);

  			var _lbdata = OO.lbdata;
  			var _spdata = OO.spdata;
			var _adata = OO.adata;	
			var _populate_id = OO._populate_id;	
  			  			
  			// get parent element
  			var parent = '';
  			if( boxtype == 'sp') parent = el.closest('.evosp_in');
  			if( boxtype == 'lb'){
  				parent = el.closest('.evo_lightbox');
  				if( _lbdata.class != '') parent = $('body').find('.evo_lightbox.'+ _lbdata.class );
  			} 

  			var form = parent.find('form');
  			if( formObj !== undefined ) form = formObj;

  			if( form.length == 0){ console.log('No Fom object found'); return;}

  			// form required fields validation - @4.9
			if( el.hasClass('validate')){

				var hasError = false;
				$('body').trigger('evo_elm_form_presubmit_validation', [form, function(isValid) {
				    hasError =  isValid ? false: true;
				}]);
			    if( hasError){
			    	el.evo_snackbar( 'Required fields missing' );
			    	//LB.evo_lightbox_show_msg({message:'Required fields missing'});
			    	return;
			    }	
			}


  			// reset LB message
  			if( boxtype == 'lb') parent.evo_lightbox_hide_msg();

  			var ajax_url = el.evo_get_ajax_url({a: _adata.a, e: _adata.end, type: _adata.ajax_type});


  			// Add passed on data from ajax object @4.8.2
			var extra_ajax_data = ('data' in _adata ) ? _adata.data : null;

			let ajaxResponse = '';
	  			
  			// Submit form
				form.ajaxSubmit({
					beforeSubmit: function(opt, xhr){
						el.evo_perform_ajax_run_loader( OO, parent, 'start', boxtype  );
					},
					dataType: 	'json',	
					url: ajax_url,	type: 	'POST',
					data: extra_ajax_data,
					success:function(data){
						//console.log(data);
						ajaxResponse = data;
						el.evo_perform_ajax_success( OO, data, parent , boxtype);
					},
					complete:function(){	
						el.evo_perform_ajax_run_loader( OO, parent, 'end' , boxtype , ajaxResponse);
					}
				});
		}
		$.fn.evo_ajax_lightbox_form_submit = function(opt , formObj ){			
  			this.evo_ajax_form_submit( opt, 'lb', formObj );
		}

	// perform ajax functions / type = start/end
		$.fn.evo_perform_ajax_run_loader = function( OO , LB, type , boxtype, ajaxResponse){
			var el = this;
			var _lbdata = OO.lbdata;
			var _adata = OO.adata;	
			var _spdata = OO.spdata;	

			var customer_loader_elm = false;
			var loader_btn_el = false;
			var loader_in_icon = false;

  			if( _adata.loader_el !='')	customer_loader_elm = _adata.loader_el;
  			if( 'loader_class' in _adata && _adata.loader_class != '') 
  				customer_loader_elm = $('.' + _adata.loader_class);
  			if( _adata.loader_btn_el != '' && _adata.loader_btn_el !== undefined ) loader_btn_el = el;
  			if( _adata.loader_in_icon != '' && _adata.loader_in_icon !== undefined ) loader_in_icon = el;
  			
  			var LB_loader = false;
  			if( LB && 'loader' in _lbdata && _lbdata.loader ) LB_loader = true;

  			if( type == 'start'){

  				var trigger_id = ( 'uid' in OO && OO.uid != '' ) ? OO.uid : OO.ajax_action; // @4.8
  				$('body').trigger('evo_ajax_beforesend_' + trigger_id ,[ OO, el ]);

				if( LB_loader ){
					LB.find('.ajde_popup_text').addClass( 'evoloading'); // legacy
					LB.evo_lightbox_start_inloading();
				}
				if( customer_loader_elm ) $( customer_loader_elm ).addClass('evoloading ');
				if( loader_btn_el ) el.addClass('evobtn_loader'); // loader on button
				if( loader_in_icon ) el.addClass('evoloader_icon'); // Loader in Icon (replace i.fa child with loader elm) @5.0.3
  			
			// COMPLETE
  			}else{

  				var trigger_id = ( 'uid' in OO && OO.uid != '' ) ? OO.uid : OO.ajax_action; // @4.8
  				if( trigger_id === undefined ) trigger_id = OO.adata.a;
  				//console.log(OO);

  				$('body').trigger('evo_ajax_complete_' + trigger_id ,[ OO , el ]);
			
				if( LB_loader ){
					LB.find('.ajde_popup_text').removeClass( 'evoloading');
					LB.evo_lightbox_stop_inloading();	
				}
				if( customer_loader_elm ) $( customer_loader_elm ).removeClass('evoloading');
				if( loader_btn_el ) el.removeClass('evobtn_loader'); // loader on button
				if( 'loader_btn_el_done' in _adata && _adata.loader_btn_el_done ){
					if( ajaxResponse.success ) el.removeClass('evobtn_loader success' );
				} 
				if( loader_in_icon ) el.removeClass('evoloader_icon'); // Loader in Icon (replace i.fa child with loader elm) @5.0.3				
  			}

			return {
				'l1': customer_loader_elm,
				'l2':LB_loader
			};
		}

		$.fn.evo_perform_ajax_success = function ( OO, data, LB , boxtype){
			var el = this;
			var _lbdata = OO.lbdata;
			var _adata = OO.adata;	
			var _spdata = OO.spdata;	
			var _populate_id = OO._populate_id;		

			if( !data || data === undefined ) return;


			// if json is passing data object @4.9
			var _success = ('success' in data) ? data.success : (data.status === 'good');

			var extractedContent = 'content' in data ? data.content: '';
			if( 'data' in data && 'content' in data.data) extractedContent = data.data.content;
			var extractedData = ('data' in data) ? data.data : data;
			extractedData['content'] = extractedContent;

			// Ensure extractedData is an object for property checks; if it’s a string, wrap it
		    if (typeof extractedData !== 'object' || extractedData === null) {
		        extractedData = { msg: extractedData }; // Convert string to object
		    }

		    // Assign success and status to the extracted data
		    extractedData.success = _success;
		    extractedData.status = ('status' in extractedData) ? extractedData.status : (_success ? 'good' : 'bad');

		    // Replace original data with processed data
		    data = extractedData;

		    //console.log(data);
			//console.log( OO);

			// if inside lightbox
			if( LB.length > 0 && boxtype != 'sp'){
				console.log('show lb msg');
				// show message
					if (data && typeof data === 'object' && !Array.isArray(data) && 'msg' in data && data.msg !== '') {
						LB.evo_lightbox_show_msg({
							'type': ( _success ? 'good':'bad'), 
							'message':data.msg, 
							hide_lightbox: (  _success ? _lbdata.hide : false ),	
							hide_message: _lbdata.hide_msg
						});
					}	

				// populate lightbox
				if( data && _lbdata.new_content && 'content' in data && data.content != '' ){

					// populate a specific dom element with content
					if( _populate_id ){
						$('body').find('#'+_populate_id ).replaceWith( data.content );					
					}else{
						LB.evo_lightbox_populate_content({content: data.content});
					}
				}	
								
			}else{
				// populate content
				if( data && _populate_id && 'content' in data && data.content != ''){
					$('body').find('#'+_populate_id ).html( data.content );
				}						
			}

			// Show snackbar message
				if( 'show_snackbar' in  _adata && ('msg' in data)  && data.msg != '' ) 
					el.evo_snackbar({message: data.msg});

			// populate content with matching DOM class names, will set new html @4.7.2
				if( data && 'populate_dom_classes' in data){
					$.each( data.populate_dom_classes, function( domclass, content){
						$('body').find('.'+ domclass).html( content );
					} );
				}

			// Replace Content with new content DOM class match @since 5.0.9
				if( data && 'replace_dom_classes' in data){
					$.each( data.replace_dom_classes, function( domclass, content){
						$('body').find('.'+ domclass).replaceWith( content );
					} );
				}

			// if ajax data pass dom content to be replaced with run through each and replace - @4.2.3
				if(data &&  'refresh_dom_content' in data ){
					$.each(data.refresh_dom_content, function(domid, content){
						$('body').find('#'+ domid).replaceWith( content);
					});
				}

			// Trigger success actions @5.0.3
			// call like 'trig_success'=> [ ['evosp_trig_close', ['delay'=> 2000] ] ]
				if( _success &&  'trig_success' in _adata ){
					$.each( _adata.trig_success, function(i, item) {
				        var event_name = item[0];
				        var extra_data = item[1] || {};   // parameters object (or {} if none)
				        $('body').trigger( event_name, extra_data );
				    });
				}

			// SIDE PANEL ACTIONS
				// for SP content @since 4.5.2
					if(data &&  'sp_content' in data){
						$("body").find('#evops_content').html( data.sp_content);
					}
				// SP footer content @since 4.5.2
					if( data && 'sp_content_foot' in data){
						$("body").find('.evosp_foot_in').html( data.sp_content_foot);
					}

				// SP Show message 
					if( data && 'sp_show_msg' in data){
						BB.evo_showmsg_sidepanel( data.sp_show_msg );
					}
			// process trumbowyg editors
				$('body').trigger('evo_elm_load_interactivity');


			// assign dynamic vals to DOM element
				setTimeout(function(){
					if( 'evoelms' in data ){
						$.each( data.evoelms , function( uniqueid, elm_data ){

							$('body').find('.has_dynamic_vals').each(function(){

								if( $(this).attr('id') != uniqueid ) return;
								var dynamic_elm = $(this);

								$.each( elm_data , function( elm_key, elmv){
									dynamic_elm.data( elm_key, elmv );
								});
							});
						});
					}
				},200);


			// call like $('body').on('evo_ajax_success_X', function(event, OO, data, el){
			$('body').trigger('evo_ajax_success_' + OO.uid,[ OO, data , el]);	
		}

	// Process ajax and lightbox values @4.7.2
		$.fn.evo_process_ajax_params = function ( opt ){
			// defaults
			var defz = { 
				'uid':'',

				// @since 4.7.2
				'adata':{}, // @4.7.2 include all ajax data in here, type (ajax,rest,endpoint),action/a, other data
				'lbdata':{},// @4.7.2 lightbox data all in one place, class, title, size, padding
				'spdata':{},// @5.0.3 side panel data all in one place, class, title, size, padding, ajax_data
				'_populate_id':'', // loading new content into matching elements outside of lightbox
				
				// legacy values
				'content':'',// passed on dynamic content
				'content_id' :'',// id to get dynamic content from page		
								
				't':'', //title
				'lbc':'',// * lightbox class - REQUIRED
				'lbac':'',// ligthbox additional class 4.6
				'lbsz':'',// lightbox size = mid small, s400, s500, s700, s800
				'lightbox_loader': true,
				'preload_temp_key': 'init', // 4.6
				'load_new_content': true, // @since 4.3.5
				'lb_padding': '', // @4.3.5
				'load_new_content_id':'',

				'ajax':'no',// use ajax to load content yes no
				'ajax_url':'',// load content from ajax file
				'end':'admin',// admin or client end
				'ajax_action':'', // @4.4 pass on ajax endpoint action key
				'a':'',
				'ajax_type':'ajax', // @4.4 ajax type, ajax, rest or endpoint
				'd':'', // data object for ajax
				'other_data':'',
				'ajaxdata':'',				
			};


			// extend passed with defaults
			var OO = $.extend({}, defz, opt);

			// Build processed object
				var processed = {};
				processed['uid'] = OO.uid;


			// Ajax	
				var _adata = ( OO.adata == '') ? {}: OO.adata;

				// type passed value fix
				var passed_type_val = false;
				if( 'type' in _adata && _adata.type != '' &&
					!['ajax', 'rest', 'endpoint'].includes(_adata.type)
				){
					passed_type_val = _adata.type;
					_adata.type = '';
				}

				// set default needed values
				var def_avals = { 
					'a':'',
					'type':'ajax',
					'end':'admin',
					'data': '',
					'loader_el':'',
					'loader_btn_el':'',//4.8
					'loader_btn_el_done':'', // 5.0.9
					'loader_class':'',
					'url':'',
					'trig_success':[], // @5.0.3 trigger actions to run on success
				}
				
				// set default values
				$.each( def_avals, function(key, value) {					
					if( key == 'data' && !( 'a' in _adata ) && ('data' in _adata ) && 'a' in _adata.data ) return;
					if( !(key in _adata ) && value != '' ) _adata[ key ] = value;
				});	

				//console.log( _adata );

				// map old to new
				var def_adata_mapping = { 
					'a' : 'a',
					'ajax_action' : 'a',
					'ajax_type':'type',
					'end': 'end',
					'ajax_url': 'url',
					'ajaxdata':'data',
					'ajax_data':'data',
					'd':'data',
				}
				$.each( def_adata_mapping, function(oldV, newV) {					
					if( newV in _adata && _adata[ newV ] != '' ) return;

					if(  oldV in OO && OO[oldV] !== '' ) {
						_adata[newV] = OO[oldV];
					}  
				});	

				if( _adata.data === undefined ) _adata.data = {};

				//console.log( _adata );			

				// Move additional values in _adata to _adata.data
					$.each(_adata, function(key, value) {
						if ( !(key in def_avals)) {
							//_adata.data[key] = value; // Move any extra values to _adata.data
							//delete _adata[key]; // Remove them from the main _adata object
						}
					});

				if( 'data' in _adata ){
					//_adata['data']['nn'] = ( _adata.end == 'client' ) ? evo_general_params.n : evo_admin_ajax_handle.postnonce; 
										
					_adata['data']['nn'] = (typeof evo_admin_ajax_handle !== 'undefined' && evo_admin_ajax_handle !== null) 
					    ? evo_admin_ajax_handle.postnonce 
					    : evo_general_params.n;


					_adata['data']['uid'] = processed['uid'];
					if( passed_type_val ) _adata['data']['type'] = passed_type_val;
					if( 'action' in _adata.data ) _adata['a'] =  _adata.data.action;
					if( 'a' in _adata.data ) _adata['a'] =  _adata.data.a;
					if( 'ajaxdata' in OO ) processed['ajaxdata'] = _adata.data;
				}		

				processed['adata'] = _adata;
				

			// lightbox
				var _lbdata = ( OO.lbdata == '') ? {}: OO.lbdata;

				// if legacy values exists > convert them to new
				var def_lbdata_mapping = {
					'lbc':'class',
				    'lbsz':'size',
				    'lbac' :'additional_class',
				    't':'title',
				    'lb_padding': 'padding',
				    'load_new_content':'new_content',
				    'lightbox_loader': 'loader',
				    'content_id':'content_id',
				    'content':'content',
				    'hide_lightbox':'hide',
				    'hide_message':'hide_msg',
				    'lightbox_key': 'class',
				}
				$.each( def_lbdata_mapping, function(oldV, newV) {
					// if _lbdata has new value > skip
					if (newV in _lbdata && _lbdata[newV] !== '' && _lbdata[newV] !== null && _lbdata[newV] !== undefined) {
				        return; 
				    }
					if(  oldV in OO && OO[oldV] !== '' ) {
						_lbdata[newV] = OO[oldV];
					} 
				});	

				// set default needed values
				var def_lbvals = {
					'padding':'evopad30',
					'loader': false,
					'preload_temp_key':'init',
					'new_content': true,
					'additional_class':'',
					'title':'',
					'hide':false,
					'hide_msg':2000,
					'content':'', // content for lightbox
					'content_id':'', // content id in DOM to grab content for lightbox
				}
				// set default values
				$.each( def_lbvals, function(key, value) {
					if(  key in _lbdata )  return;
					if( value == '') return;
					_lbdata[ key ] = value;
				});


				//console.log( _lbdata.new_content ) ;

				// load lightbox content legacy
				if( OO.ajaxdata.load_lbcontent ) _lbdata['new_content'] = true;
				if( OO.ajaxdata.load_new_content ) _lbdata['new_content'] = true;

				// populate new content @4.7.3
					processed['_populate_id'] =  false;
					if( OO.load_new_content_id != '')  processed['_populate_id'] = OO.load_new_content_id;
					if( 'new_content_id' in _lbdata && _lbdata.new_content_id != '')  processed['_populate_id'] = _lbdata.new_content_id;
					if( 'content_id' in _lbdata && _lbdata.content_id != '') processed['_populate_id'] = _lbdata.content_id;

				processed['lbdata'] = _lbdata;

			// make sure uid is moved to main level
				if( processed.uid == '' && 'uid' in processed['lbdata'] ) processed['uid'] = processed['lbdata']['uid'];

			// add legacy variables for backward compatibility
				$.each(opt, function(oldkey, oldval){
					if( oldkey in processed ) return;
					processed[ oldkey ] = oldval;
				});

			// Side Panel
				var _spdata = ( OO.spdata == '' ) ? {} : OO.spdata;
				// set default needed values
				var def_spvals = {
					'class':'',
					'loader': false,
					'new_content': true,
					'additional_class':'',
					'title':'',
					'hide':false,
					'hide_msg':2000,
					'content':'', // content for sp
					'content_id':'', // content id in DOM to grab content for sp
					'size':'',
				}
				// set default values
				$.each( def_spvals, function(key, value) {
					if(  key in _lbdata )  return;
					if( value == '') return;
					_lbdata[ key ] = value;
				});

			//console.log( processed );

			return processed;
		}

	// LIGHTBOX triggers
		// @version 4.2
		$('body').on('click','.evolb_trigger', function(event){
			if( event !== undefined ){
				event.preventDefault();
				event.stopPropagation();
			}
				
			$(this).evo_lightbox_open(
				$(this).data('lbvals') ?? $(this).data('d')
			);
		});
		$('body').on('click','.evolb_close_btn', function (){
			const LB = $(this).closest('.evo_lightbox');
			LB.evo_lightbox_close();
		});

		// save form content - @since 4.2.2
		$('body').on('click','.evolb_trigger_save, .evo_submit_form', function(event){
			if( event !== undefined ){	event.preventDefault();	event.stopPropagation();	}

			$(this).evo_ajax_form_submit( $(this).data('d') , ( $(this).closest('.evo_lightbox').length ? 'lb':'') );
		});

		$('body').on('click','.evo_trigger_ajax_run', function(event){
			if( event !== undefined ){
				event.preventDefault();
				event.stopPropagation();
			}

			//console.log($(this).data('d') );
			$(this).evo_admin_get_ajax( $(this).data('d') );
		});
		// @since 4.3.3
		$('body').on('evo_lightbox_trigger', function(event, data){
			event.preventDefault();
			//console.log( data );
			$('body').evo_lightbox_open(data);
		});

	// Lightbox opening	
	// @updated 4.9.11	
		$.fn.evo_alert = function(opt){ // @since 4.9.2
			var defz = { 
		        'title': 'Confirmation Action',
		        'message': '',
		        'yes_text': 'Proceed',
		        'no_text': 'No',
		        'on_yes': function() {}, // Callback for Yes
		        'on_no': function() {}   // Callback for No
		    };	

		    // Extend passed options with defaults
		    var options = $.extend({}, defz, opt);

		    // Create alert HTML content
		    var alertHtml = '<div class="evo_alert_box">' +
		        '<p class="evotal evopad10i">' + options.message + '</p>' +
		        '<div class="evo_alert_buttons evotar">' +		            
		            '<button class="evo_alert_no evoboxsn evobrn evooln evocurp evohoop7 evopad10-20 evobr20 evobgclt">' + options.no_text + '</button>' +
		            '<button class="evo_alert_yes evoboxsn evobrn evooln evocurp evoHbgc1 evopad10-20 evobr20 evomarr10 evobgclp evoclw">' + options.yes_text + '</button>' +
		        '</div></div>';

		    // Define lightbox options with the alert content
		    var lightboxOptions = {
		        lbdata: {
		            class: 'evo_alert_lightbox',
		            title: options.title || 'Alert',
		            content: alertHtml, // Set the alert HTML as the lightbox content
		            padding: 'pad20', // Optional: Add padding class if needed
		            size:'small',
		        },
		    };

		    // Open the lightbox with the alert content
		    $(this).evo_lightbox_open(lightboxOptions);

		    // After the lightbox is opened, attach event handlers
		    setTimeout(function() {
		        var LIGHTBOX = $('.evo_lightbox.evo_alert_lightbox');
		        
		        LIGHTBOX.find('.evo_alert_yes').on('click', function() {
		        	var shouldClose = options.on_yes(LIGHTBOX);// Execute Yes callback
		        	console.log(shouldClose);
		        	if (shouldClose !== false) {
		        		LIGHTBOX.evo_lightbox_close(); // Close the lightbox
		        	}
		            removeKeyListeners(); // Remove key listeners
		        });

		        LIGHTBOX.find('.evo_alert_no').on('click', function() {
		            options.on_no(LIGHTBOX); // Execute No callback
		            LIGHTBOX.evo_lightbox_close(); // Close the lightbox
		            removeKeyListeners(); // Remove key listeners
		        });

		        // Keypress handler function
		        function handleKeyPress(event) {
		            if (event.key === 'Escape') { // Esc key
		                options.on_no(LIGHTBOX); // Execute No callback
		                LIGHTBOX.remove(); // Close the lightbox
		                removeKeyListeners(); // Remove key listeners
		            } else if (event.key === 'Enter') { // Enter key
		                options.on_yes(LIGHTBOX); // Execute Yes callback
		                LIGHTBOX.remove(); // Close the lightbox
		                removeKeyListeners(); // Remove key listeners
		            }
		        }

		        // Add keypress listener
		        $(document).on('keydown', handleKeyPress);

		        // Function to remove key listeners
		        function removeKeyListeners() {
		            $(document).off('keydown', handleKeyPress);
		        }

		        // Ensure key listeners are removed when lightbox is closed manually (e.g., via close button)
		        LIGHTBOX.find('.evolb_close_btn').on('click', function() {
		            removeKeyListeners();
		        });
		    }, 350); // Delay to ensure lightbox is fully rendered
		}
		$.fn.evo_lightbox_open = function (opt ){

			var OO = this.evo_process_ajax_params( opt );
			
			var _lbdata = OO.lbdata;
			var _adata = OO.adata;
			var _populate_id = OO._populate_id;

			//console.log(opt);
			//console.log(OO);
			

			// check if required values missing for lightbox
			if( !('class' in _lbdata) || _lbdata.class == '' ) return;


			const fl_footer = _adata.end == 'client' ? '<div class="evolb_footer"></div>' :'';

			// create lightbox HTML
				var __lb_size = _lbdata.size === undefined ? '' : _lbdata.size;

				var html = '<div class="evo_lightbox '+_lbdata.class+' '+_adata.end+' '+ ( _lbdata.additional_class !== undefined ? _lbdata.additional_class :'') +'" data-lbc="'+_lbdata.class+'"><div class="evolb_content_in"><div class="evolb_content_inin"><div class="evolb_box '+_lbdata.class+' '+ __lb_size +'"><div class="evolb_header"><a class="evolb_backbtn" style="display:none"><i class="fa fa-angle-left"></i></a>';
				if( _lbdata.title !== undefined ) html += '<p class="evolb_title">' + _lbdata.title + '</p>';
				html += '<span class="evolb_close_btn evolbclose "><i class="fa fa-xmark"><i></span></div><div class="evolb_content '+ _lbdata.padding +'"></div><p class="message"></p>'+fl_footer+'</div></div></div></div>';

			$('#evo_lightboxes').append( html );	
			const lbCount = $('#evo_lightboxes').find('.evo_lightbox').length;

			var LIGHTBOX = $('.evo_lightbox.'+ _lbdata.class );		
			if( $('.evo_sp').hasClass('show')) LIGHTBOX.addClass('aboveSP');

			
			// Open lightbox on page
				setTimeout( function(){ 
					$('#evo_lightboxes').show();
					LIGHTBOX.addClass('show');	
					$('body').addClass('evo_overflow');
					$('html').addClass('evo_overflow');
				},300);

				// show loading animation
				LIGHTBOX.evo_lightbox_show_open_animation(OO);


			// Load content locally from DOM
			    if (_lbdata.content_id != '') {
			        var content = $('#' + _lbdata.content_id).html();
			        LIGHTBOX.find('.evolb_content').html(content);
			    }
			    if (_lbdata.content != '') {
			        LIGHTBOX.find('.evolb_content').html(_lbdata.content);
			    }

			// run ajax to load content for the lightbox inside
				if( 'a' in _adata  && _adata.a != ''){ // @4.7.2
					LB.evo_admin_get_ajax( OO );
				}
				
			// load content from a AJAX file			
				if( 'url' in _adata && _adata.url != '' ){
					$.ajax({
						beforeSend: function(){},
						url:	OO.ajax_url,
						success:function(data){
							LIGHTBOX.find('.evolb_content').html( data);							
						},complete:function(){}
					});
				}
			
			$('body').trigger('evo_lightbox_processed', [ OO, LIGHTBOX]);
		}

		// support close lightbox with click outside @since 5.0.9
		$(document).on('click', function(e) {
		    const $open = $('.evo_lightbox.show');		   
		    if ($open.length === 0) return;

		    if (!document.contains(e.target)) return;

		    // SP opened from LB
		    const $open_sp = $('.evo_lightbox.show.on_sp');
		    if( $open_sp.length > 0 ) return;

		    // If clicked inside any .evolb_box → do nothing
		    if ($(e.target).closest('.evolb_box').length) return;

		    // Otherwise close the topmost lightbox
		    $open.last().evo_lightbox_close({ delay: 300 });
		});

		$.fn.evo_lightbox_close = function(opt) {
		    if (!this.hasClass('show')) return;

		    const defaults = { delay: 500, remove_from_dom: true };
		    const OO = $.extend({}, defaults, opt);
		    const hideDelay = parseInt(OO.delay);
		    const completeClose = this.parent().find('.evo_lightbox.show').length === 1;

		    // Remove 'show' class with delay if needed
		    hideDelay > 500 ? setTimeout(() => this.removeClass('show'), hideDelay - 500) : this.removeClass('show');

		    // Final cleanup after delay
		    setTimeout(() => {
			    completeClose && $('body, html').removeClass('evo_overflow');
			    OO.remove_from_dom && this.remove();
			}, hideDelay);
		};


		// Other LB functions
			$.fn.evo_lightbox_populate_content = function(opt){
				LB = this;
				var defaults = { 
					'content':'',
				}; var OO = $.extend({}, defaults, opt);

				LB.find('.evolb_content').html( OO.content );
			}
			
			$.fn.evo_lightbox_show_msg = function(opt){
				LB = this;
				var defaults = { 
					'type':'good',
					'message':'',
					'hide_message': false,// hide message after some time pass time or false
					'hide_lightbox': false, // hide lightbox after some time of false
				}; var OO = $.extend({}, defaults, opt);
				LB.find('.message').removeClass('bad good').addClass( OO.type ).html( OO.message ).fadeIn();
				//console.log('showing LB msg');

				if( OO.hide_message ) setTimeout(function(){  LB.evo_lightbox_hide_msg() }, OO.hide_message );

				if( OO.hide_lightbox ) LB.evo_lightbox_close({ delay: OO.hide_lightbox });
			}
			$.fn.evo_lightbox_hide_msg = function(opt){
				LB = this;
				LB.find('p.message').hide();
			}


			// add preload animations to lightbox u4.6
			$.fn.evo_lightbox_show_open_animation = function(opt){
				LB = this;
				var defaults = { 
					'animation_type':'initial', // animation type initial or saving
					'preload_temp_key': 'init', // 4.6 passed on preload template key
					'end':'admin',
				};
				var OO = $.extend({}, defaults, opt);

				if( OO.animation_type == 'initial'){

					passed_data = (  typeof evo_admin_ajax_handle !== 'undefined') ? evo_admin_ajax_handle: evo_general_params;

					//console.log( passed_data);

					html = passed_data.html.preload_general;
					if( OO.preload_temp_key != 'init') html = passed_data.html[ OO.preload_temp_key ];
					LB.find('.evolb_content').html( html );
				}

				if( OO.animation_type == 'saving')
					LB.find('.evolb_content').addClass('evoloading');
			}

		// eventcard Lightbox function v4.6
			$.fn.evo_cal_lightbox_trigger = function( SC_data , obj, CAL , LB = null){
				
				const event = obj.closest('.eventon_list_event');
			    const classes = ['cancel_event', SC_data.additional_class, SC_data.calendar_type]
			        .filter(cls => cls && (cls !== 'cancel_event' || obj.hasClass('cancel_event')))
			        .join(' ');

			    //console.log( SC_data);

				const other_data = {
			        extra_classes: `evo_lightbox_body eventon_list_event evo_pop_body evcal_eventcard event_${SC_data.event_id}_${SC_data.repeat_interval} ${classes}`,
			        CAL,
			        obj,
			        et_data: obj.find('.evoet_data').data(),
			        SC: SC_data
			    };
				
				const randomId = `evo_eventcard_${Math.floor(Math.random() * 90) + 10}`;
				const lbac = { 'sc1': 'within', 'sc2': 'within ecSCR' }[evo_general_params.cal.lbs] || '';

				const openLightbox = (content,  ajaxData = null) => {
			        const config = {
			            //uid: ajaxData?.uid || 'evo_open_eventcard_lightbox',
			            uid: 'evo_open_eventcard_lightbox',
			            lbc: randomId,
			            lbc: LB ? LB.data('lbc') || randomId : randomId,
			            lbac,
			            end: 'client',
			            content,
			            other_data
			        };
			        if (ajaxData) {
			            Object.assign(config, {
			                ajax: 'yes',
			                ajax_type: 'endpoint',
			                ajax_action: 'eventon_load_single_eventcard_content',
			                d: ajaxData
			            });
			        }

			        // if LB is passed populate that LB @4.9
			        if( LB  ){
			        	if( ajaxData){			        		

			        		var OO = this.evo_process_ajax_params( config );
			        		LB.evo_admin_get_ajax( OO );
			        		$('body').trigger('evo_lightbox_processed', [ config, LB]);
			        		return;
			        	}
			        	LB.evo_lightbox_populate_content({content: content}); 
			        	$('body').trigger('evo_lightbox_processed', [ config, LB]);
			        	return;
			        }

			        //console.log( config);
			        $('body').evo_lightbox_open(config);
			    };

				if (SC_data.ux_val === '3a') {
			        const placeholder = `
			            <div class="evo_cardlb" style="padding:10px 10px 0 10px">
			                <div style="margin-bottom:20px; width:100%; height:200px" class="evo_preloading"></div>
			                ${Array(3).fill('<div style="display:flex;justify-content:space-between;margin-bottom:10px"><div style="width:40px;height:40px;margin-right:20px" class="evo_preloading"></div><div style="flex:1 0 auto"><div class="evo_preloading" style="width:70%;height:20px;margin-bottom:10px"></div><div class="evo_preloading" style="width:100%;height:80px;margin-bottom:10px"></div></div></div>').join('')}
			            </div>
			        `;

			        
			        const ajaxData = {
			            event_id: SC_data.event_id,
			            ri: SC_data.repeat_interval,
			            SC: { ...SC_data, tile_style: '0', tile_bg: '0', tiles: 'no', eventtop_style: SC_data.tile_style == '2' ? '0' : SC_data.eventtop_style },
			            load_lbcontent: true,
			            action: 'eventon_load_single_eventcard_content',
			            uid: 'load_single_eventcard_content_3a',
			            calid: ( CAL ? CAL.attr('id') : '' ), 
			        };

			        openLightbox(placeholder, ajaxData);
			    } else {
			        const content = event.find('.event_description').html();
			        const clrW = event.hasClass('clrW') ? 'clrW' : 'clrD';
			        openLightbox(`<div class="evopop_top ${clrW}">${obj.html()}</div><div class="evopop_body">${content}</div>`);
			    }
			}

			// listerners for lightbox on eventcard
			$.fn.evo_cal_lb_listeners = function(){
				// Listerners
				// process various lightbox types
				$('body')
				.on('evo_lightbox_processed', function(event, OO, LIGHTBOX){
					if( OO.uid != 'evo_open_eventcard_lightbox') return false;

					var CAL = OO.other_data.CAL;

					LIGHTBOX.addClass('eventcard eventon_events_list');
					LIGHTBOX_content = LIGHTBOX.find('.evolb_content');
					LIGHTBOX_content.attr('class', 'evolb_content '+ OO.other_data.extra_classes );
					
					var SC = OO.other_data.SC;
					var obj = OO.other_data.obj;

					//console.log(SC);

					// update border color and eventtop color
						const evoet_data = OO.other_data.et_data;
						
						bgcolor = bggrad ='';
						if( evoet_data ){
							bgcolor = evoet_data.bgc;
							bggrad = evoet_data.bggrad;
						}
						

						// if tiles and eventtop style set to clean
						var show_lightbox_color = ( SC.eventtop_style == '0' || SC.eventtop_style == '4') ? false: true;
						
						if( (CAL && CAL.hasClass('color') && show_lightbox_color) ||
							(!CAL && show_lightbox_color)

						){
							LIGHTBOX_content.addClass('color');
							LIGHTBOX_content.find('.evopop_top').css({
								'background-color':bgcolor,
								'background-image': bggrad,
							});
						}else{
							LIGHTBOX_content.addClass('clean');
							LIGHTBOX_content.find('.evopop_top').css({'border-left':'3px solid '+bgcolor});
						}

					// trigger 
					if( obj.data('runjs')){
						$('body').trigger('evo_load_single_event_content',[ SC.event_id, OO.other_data.obj]);
					}
									
					
					// RTL
					if( SC.evortl =='yes')	LIGHTBOX.addClass('evortl');

					$('body').trigger('evolightbox_end', [ LIGHTBOX , CAL, OO]);	// @s4.6

				})

				// after eventcard content is loaded to lightbox via 3a - @since 4.2.3
					.on('evo_ajax_success_evo_open_eventcard_lightbox', function (event, OO, data){
						
						if( OO.ajaxdata.uid != "load_single_eventcard_content_3a") return false;
						
						LIGHTBOX = $('.evo_lightbox.'+ OO.lightbox_key);

						CAL = $('body').find('#'+ OO.ajaxdata.calid);
						
						$('body').trigger('evolightbox_end', [ LIGHTBOX , CAL, OO]);	// @s4.6	
					})
				;			
			}

	// Side Panel for admin
	// @since 4.5.2 @updated 5.0
		BB
		.on('click', '.evosp_trigger', function(e){ 
			e.preventDefault(); e.stopPropagation();
			const $el = $(this);
			$el.addClass('evo_sp_trig_on');
			$el.evo_open_sidepanel($el.data('d'), $el.data('spv'));
		 })
		.on('click', '.evosp_close', function(e){ e.preventDefault(); e.stopPropagation(); $(this).evo_close_sidepanel() })
		.on('click', '.evosp_trigger_save', function(e){ e.preventDefault(); e.stopPropagation(); $(this).evo_ajax_form_submit( $(this).data('d'), 'sp');  })
		.on('evosp_trig_close', function(e, opt){ $(this).evo_close_sidepanel( opt ); });
		

		/**
		 * Side panel for eventON 
		 * @version 4.9
		 */ 		
		$.fn.evo_open_sidepanel = function(opt, spv){
			var defs = {
				'uid':'',
				'end':'admin', // admin or client
				'hide_sp':false,
				'hide_message':false,
				'title':'',
				'sp_title':'',
				'sp_class':'',
				'sp_id':'',// identifier for side panel @5.0.3
				'content_id':'',  // only to load dynamic content
				'content':'',// @5.0.3 populate passed on content with delay
				'content_footer':'',// @5.0.9 footer content
				'content_load_delay':0,// 1000
				'ajax':'no',
				'ajax_data':'',		
				'adata':{},
				'other_data':{},	
				'spdata':{}, // in progress pass all sidepanel data in one			
				'size': 'sm', // sm | med | lar
				'movepage': false,// in complete -- idea to move the entire page
				end:'admin'
			}
			var OO = $.extend({}, defs, opt);
			//console.log(OO);

			const SP = $('body').find('.evo_sp');

			// structure
				const load_html = "<div class='evo_loading_bar_holder h100'><div class='evo_loading_bar wid_50 hi_50'></div><div class='evo_loading_bar hi_100'></div><div class='evo_loading_bar'></div><div class='evo_loading_bar'></div><div class='evo_loading_bar hi_50'></div></div>";

				const footer_html = `<div class='evosp_foot evo_bordert evodfx evofxdrr evofxaic evofxww evogap10'><div class='evosp_foot_in evofx_1 evogap10'>
				<div class='evo_loading_bar_holder h100 evopad0i'><div class='evo_loading_bar wid_50 hi_50'></div></div>
				</div><p class='evosp_message message evomar0i'></p></div>`;

				SP.html(`<div id='${OO.sp_id}' class='evosp_in ${OO.sp_class}'><span class='evosp_close'><i class='fa fa-multiply'></i></span><div class='evosp_head evoff_1'>${OO.sp_title}</div><div id='evops_content' class='evosp_body'>${load_html}</div>${footer_html}</div>`);

				SP.addClass('show');
				SP.removeClass('med lar sm').addClass( OO.size );

				// if move page as well
				//if( OO.movepage ) $('body').find('.editor-editor-interface').addClass('evotrans pagemoved').css('right', '400px');

				const SP_body = SP.find('.evosp_body');
				const SP_head = SP.find('.evosp_head');
				const SP_foot = SP.find('.evosp_foot');

			// tag lightbox if they are already opened
				const $open = $('.evo_lightbox.show');
				if ($open.length !== 0){
					$open.addClass('on_sp');
				}

			// load using content
				if( OO.content_id != ''){
					if( OO.content_load_delay > 0){
						setTimeout(function(){
							SP.evo_populate_sidepanel( BB.find('#'+ OO.content_id ).html() );
						}, OO.content_load_delay );
					}else{
						SP.evo_populate_sidepanel( BB.find('#'+ OO.content_id ).html() );
					}				
				}

			// run ajax to load content for the lightbox inside
				if( ( OO.ajax == 'yes' && OO.ajax_data != '') || ( OO.adata != '' && 'a' in OO.adata) ){
					var passing_data = {
						adata: OO.adata,
						ajaxdata: OO.ajax_data, 
						uid: OO.uid ,
						end: OO.end,
						load_new_content: true,
						load_new_content_id: 'evops_content',
						lightbox_loader:false,
						end: OO.end,
					};

					SP.evo_admin_get_ajax( passing_data );
				}else{
					setTimeout(()=> BB.trigger('evo_sp_stop_loading'),OO.content_load_delay);
				}

			// populate with passed on content with delay @5.0.3
				if( OO.content != ''){
					setTimeout(()=> SP.evo_populate_sidepanel( OO.content ),OO.content_load_delay);
					if( OO.content_footer ) setTimeout(()=> SP.evo_populate_sidepanel_footer( OO.content_footer ), (OO.content_load_delay + 500) );
				}
			// populate new content with spv values
				if( spv != ''){
					BB.on('evo_ajax_success_'+ OO.uid , function(){
						$('#evops_content').find('input, select').each(function(){
							var fel = $(this);
							$.each(spv,function(index, val){
								if( fel.attr('name') == index){

									if( val == 'no' || val == 'yes') fel.evo_elm_change_yn_btn( val );
									fel.val( val );
								}
							});					
						});
					});
				}
	  		
	  		BB.trigger('evo_sp_opened_'+OO.uid, OO);
	  		BB.trigger('evo_sp_opened', OO);
	  		
	  	}

	  	BB.on('evo_sp_stop_loading',function(){
	  		$('body').find('.evo_sp').find('.evo_loading_bar_holder').remove();
	  	});
	  	$.fn.evo_savevals_sidepanel = function(spv){
	  		const el = BB.find('.evo_sp_trig_on');

	  		el.data('spv', spv);
	  		el.removeClass('evo_sp_trig_on');
	  	}

	  	$.fn.evo_populate_sidepanel = function(content){
	  		const SP = $('body').find('.evo_sp');
	  		SP.find('.evosp_body').html( content );
	  		console.log('Populate SP');
	  	}

	  	// populate sidepanel footer @5.0.3
	  	$.fn.evo_populate_sidepanel_footer = function(content ){
	  		const SP = $('body').find('.evo_sp');
	  		SP.find('.evosp_foot_in').html( content );
	  	}
	  	// CLOSE sidepanel
	  	$.fn.evo_close_sidepanel = function(opt){
	  		SP = BB.find('.evo_sp');

	  		var defaults = { 'delay':200};
			if( !(SP.hasClass('show')) ) return;
			var OO = $.extend({}, defaults, opt);

			// Remove tag from lightboxes tagged on
				const $open = $('.evo_lightbox.show.on_sp');
				if ($open.length !== 0){
					$open.removeClass('on_sp');
				}
			
	  		setTimeout(function(){	
	  			BB.trigger('evo_sp_closed',[ SP ]);
	  			SP.removeClass('show');
	  			$('body').find('.editor-editor-interface.pagemoved').removeClass('pagemoved').css('right', 'auto');
	  			BB.find('.evo_sp_trig_on').removeClass('evo_sp_trig_on');
	  		}, OO.delay );
	  		setTimeout(function(){	SP.html('');	}, ( OO.delay + 100 ) );
	  	}

	  	$.fn.evo_showmsg_sidepanel = function(opt){
	  		var defaults = { 
				'type':'good',
				'message':'',
				'hide_message': false,// hide message after some time pass time or false
				'hide_sp': false, // hide lightbox after some time of false
			}; var OO = $.extend({}, defaults, opt);

			console.log('showing sp msg');
			const SP = $('body').find('#evo_sp');

			SP.find('.evosp_message').removeClass('bad good').addClass( OO.type ).html( OO.message ).fadeIn();
			if( OO.hide_message ) setTimeout(function(){  SP.evo_hidemsg_sidepanel() }, OO.hide_message );
			if( OO.hide_sp ) SP.evo_close_sidepanel({ delay: OO.hide_sp });
	  	}
	  	$.fn.evo_hidemsg_sidepanel = function(opt){
			SP = this;
			console.log('ss');
			SP.find('p.evosp_message').hide();
		}



	// Get Ajax url @since 4.4 @u 4.5.5
		$.fn.evo_get_ajax_url = function(opt){
			var defaults = { 
				a:'', // action key
				e:'client', // end
				type: 'ajax'};
			var OO = $.extend({}, defaults, opt);

			

			// end point url
			if( OO.type == 'endpoint'){
				var evo_ajax_url = ( OO.e == 'client' || typeof evo_general_params !== 'undefined' )? 
					evo_general_params.evo_ajax_url : evo_admin_ajax_handle.evo_ajax_url;
				return  evo_ajax_url.toString().replace( '%%endpoint%%', OO.a );
			// rest api url
			}else if( OO.type == 'rest' ){
				var evo_ajax_url = ( OO.e == 'client' || typeof evo_general_params !== 'undefined')? 
					evo_general_params.rest_url : evo_admin_ajax_handle.rest_url;
					//console.log(evo_ajax_url);
					//console.log(OO);
				return  evo_ajax_url.toString().replace( '%%endpoint%%', OO.a );
			}else{
				action_add = OO.a != '' ? '?action='+ OO.a: '';
				return ( OO.e == 'client' || typeof evo_general_params !== 'undefined') ? 
					evo_general_params.ajaxurl + action_add : evo_admin_ajax_handle.ajaxurl + action_add;
			}	
		}

	// loading animations @4.7.2
		$.fn.evo_start_loading = function( opt ){
			var defaults = { type:'1'};
			var OPT = $.extend({}, defaults, opt);
			var el = this;

			if( OPT.type == '1') el.addClass('evoloading loading');
			if( OPT.type == '2') el.addClass('evoloading_2');
		}
		$.fn.evo_stop_loading = function( opt ){
			var el = this;
			var defaults = { type:'1'};
			var OPT = $.extend({}, defaults, opt);

			if( OPT.type == '1') el.removeClass('evoloading loading');
			if( OPT.type == '2') el.removeClass('evoloading_2');
		}
		$.fn.evo_lightbox_start_inloading = function(opt){
			LB = this;
			LB.find('.evolb_content').addClass('loading evoloading');
		}
		$.fn.evo_lightbox_stop_inloading = function(opt){
			LB = this;
			LB.find('.evolb_content').removeClass('loading evoloading');
		}
	
	// Count down	// @+ 4.5
		$.fn.evo_countdown_get = function(opt){
			var defaults = { gap:'', endutc: ''};
			var OPT = $.extend({}, defaults, opt);
			var gap = OPT.gap;

			// if gap not provided use endutc
			if( gap == '' ){				
				var Mnow = moment().utc();
				var M = moment();
				M.set('millisecond', OPT.endutc );

				gap = OPT.endutc - Mnow.unix();
			}
			
			// if negative gap
			if( gap < 0){
				return {
					'd': 0,
					'h':0,
					'm':0,
					's':0
				}; 
			}
		
			distance = ( gap * 1000);

			var days = Math.floor(distance / (1000 * 60 * 60 * 24));
			var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((distance % (1000 * 60)) / 1000);

			minutes = minutes<10? '0'+minutes : minutes;
			seconds = seconds<10? '0'+seconds : seconds;

			return {
				'd': days,
				'h':hours,
				'm':minutes,
				's':seconds
			}; 
		};
		// @u 4.5.2
		$.fn.evo_countdown = function(opt){
			var defaults = { S1:''};
			var OPT = $.extend({}, defaults, opt);
			var el = $(this);

			const day_text = ( el.data('d') !== undefined && el.data('d') != '' )? el.data('d'):'Day';
			const days_text = ( el.data('ds') !== undefined && el.data('ds') != '' )? el.data('ds'):'Days';

			// intial run
			//var gap = parseInt(el.data('gap'));
			var duration = el.data('dur');
			var endutc = parseInt(el.data('endutc'));
			var text = el.data('t');
			
			if(text === undefined) text = '';

			if( el.hasClass('evo_cd_on')) return;

			// get gap using end time utc
				var Mnow = moment().utc();
				var M = moment();
				M.set('millisecond', OPT.endutc );

				//console.log(Mnow.unix());
				//console.log(endutc);

				gap = endutc - Mnow.unix();


			// on initial run - event hasnt happened yet
			if( gap > 0 ){

				// initial
				dd = el.evo_countdown_get({ 'gap': gap });
				
				el.html( ( dd.d>0 ? dd.d + ' ' + ( dd.d >1 ? days_text: day_text ) + " "  :'') + dd.h + ":" + dd.m +':'+ dd.s +'  '+text );
				
				el.data('gap', ( gap - 1)  );	// save new gap value
				el.addClass('evo_cd_on');

				//return;
				
				// set intervals
				var CD = setInterval(function(){
					
					gap = el.data('gap'); // get gap for this cycle
					duration = el.data('dur');	

					const bar_elm = el.closest('.evo_event_progress').find('.evo_ep_bar');	

					// when timer is ticking
					if( gap > 0 ){

						// increase bar width if exists
						if( duration !== undefined && bar_elm.length){
							perc = ( (duration - gap)/ duration ) * 100;
							bar_elm.find('b').css('width',perc+'%');							
						}
						
						dd = el.evo_countdown_get({ 'gap': gap });	

						el.html( ( dd.d>0 ? dd.d + ' '  + ( dd.d >1 ? days_text: day_text ) + " ":'') + dd.h + ":" + dd.m +':'+ dd.s +' '+text );
						el.data('gap', ( gap - 1)  );

					// when timer expired
					}else{

						const expire_timer_action = el.data('exp_act');

						// perform ajax task after expiration
						if(expire_timer_action !== undefined){
							$('body').trigger('runajax_refresh_now_cal',[ 
								el , 
								el.data('n'),
							]);
						}

						const _complete_text = el.evo_get_txt({V:'event_completed'});

						// live now text
						if(bar_elm.length){
							bar_elm.addClass('evo_completed');
							//el.siblings('.evo_ep_pre').html( _complete_text );
						}


						// event tag & live elements
						if( el.closest('.evcal_desc').length){
							el.closest('.evcal_desc').find('.eventover').html( _complete_text);
							el.closest('.evcal_desc').find('.evo_live_now').remove();
						}

						// event card
						if( el.closest('.eventon_list_event').length){
							el.closest('.eventon_list_event').find('span.evo_live_now').hide();
						}

						el.html('');
						clearInterval(CD);
					}

				},1000);
			// event has already passed
			}else{
				// if gap is less
				el.closest('.evo_event_progress').find('.evo_ep_bar').hide();
				clearInterval(CD);
			}
		};	

	// Handlebar process template data into html
		$.fn.evo_HB_process_template = function(opt){
			var defaults = { TD:'', part:''}
			var OPT = $.extend({}, defaults, opt);

			BUS = $('#evo_global_data').data('d');
						
			template = Handlebars.compile( BUS.temp[ OPT.part ] );
			return template( OPT.TD );
		}

	// Date range and events @4.6.7
		// Date range and events - from webpage
		$.fn.evo_cal_events_in_range = function(opt){
			var defaults = { S:'', E:'', 
				hide: true, 
				closeEC:true,
				showEV: false, // show events
				showEVL: false, // show events list
				showAllEvs: false // show all events regardless of the range
			};
			var OPT = $.extend({}, defaults, opt);
			var CAL = $(this);

			var eJSON = CAL.find('.evo_cal_events').data('events');
			var SC = CAL.evo_shortcode_data();

			R = {};
			html = '';
			json = {};

			show = 0;

			// using events JSON data
			if( eJSON && eJSON.length > 0){
				$.each(eJSON, function(ind, ED){
					eO = CAL.find('#event_'+ ED._ID);
					if(eO === undefined || eO.length==0) return;

					if(OPT.hide)	eO.hide(); // pre hide
					this_show = false;

					// month long or year long events
					if( ED.month_long || ED.year_long ){
						this_show = true;

					}else{
						if(CAL.evo_is_in_range({
							'S': OPT.S,	'E': OPT.E,	'start': ED.unix_start ,	'end':ED.unix_end 
						})){						
							this_show = true;
						} 
					}

					if( OPT.showAllEvs) this_show = true;
					
					if( this_show){	
						// show event
						if( OPT.showEV) eO.show();

						// close open event cards
						if(OPT.closeEC && SC.evc_open == 'no') eO.find('.event_description').hide().removeClass('open');

						html += eO[0].outerHTML;
						json[ ED._ID] = ED;
						show++;	
					} 
				});
			}else{	
				// get all the events in the events list
				var cal_events = CAL.find('.eventon_list_event');

				cal_events.each(function(index, elm){
					var ED = $(elm).evo_cal_get_basic_eventdata();
					if( !ED) return;

					if(OPT.hide)	$(elm).hide(); // pre hide
					this_show = false;

					// month long or year long events
					if( $(elm).hasClass('month_long') || $(elm).hasClass('year_long') ){
						this_show = true;

					}else{
						if(CAL.evo_is_in_range({
							'S': OPT.S,	'E': OPT.E,	'start': ED.unix_start ,	'end':ED.unix_end 
						})){						
							this_show = true;
						} 
					}

					if( OPT.showAllEvs) this_show = true;
					
					if( this_show){	
						// show event
						if( OPT.showEV) $(elm).show();

						// close open event cards
						if(OPT.closeEC && SC.evc_open == 'no') 
							$(elm).find('.event_description').hide().removeClass('open');

						html += $(elm)[0].outerHTML;
						json[ ED.uID ] = ED;
						show++;	
					} 
				});
			}


			// No events
			if( OPT.showEV){

				no_event_content = CAL.evo_get_global({S1: 'html', S2:'no_events'});

				tx_noevents = CAL.evo_get_txt({V:'no_events'});
				EL = CAL.find('.eventon_events_list');
				EL.find('.eventon_list_event.no_events').remove();
				if( show == 0 )
					EL.append('<div class="eventon_list_event no_events">'+ no_event_content +'</div>');
			}

			// if show events list
			if( OPT.showEVL){
				CAL.find('.eventon_events_list').show().removeClass('evo_hide');
			}

			R['count'] = show;
			R['html'] = html;
			R['json'] = json;

			return R;
		}

		// check if an event is in the given date range
			$.fn.evo_is_in_range = function(opt){
				var defaults = { S:'', E:'', start:'',end:''}
				var OPT = $.extend({}, defaults, opt);

				S = parseInt(OPT.S);
				E = parseInt(OPT.E);
				start = parseInt(OPT.start);
				end = parseInt(OPT.end);

				return (
					( start <= S && end >= E ) ||
					( start <= S && end >= S && end <= E) ||
					( start <= E && end >= E ) ||
					( start >= S && end <= E )
				) ? true: false;
			}
			$.fn.evo_cal_hide_events = function(){
				CAL = $(this);
				CAL.find('.eventon_list_event').hide();
			}

	// get event data basics from html event on page 
	// ~@version 4.0.3 @updated 4.9.8
		$.fn.evo_cal_get_basic_eventdata = function(){
			var ELM = $(this);

			var _time = ELM.data('time');
			if( _time === undefined ) return false;

			const time = _time.split('-');
			const ri = ELM.data('ri').replace('r','');
			const eID = ELM.data('event_id');

			var _event_title = ELM.find('.evcal_event_title').text();
			_event_title = _event_title.replace(/'/g, '&apos;');

			// extract text time
			let timeRange = '';
			const timeElement = ELM.find('.evo_tz_time');
			if( timeElement.length > 0){
				const timeClone = timeElement.clone();
		        // Remove the span.evo_tz and its contents
		        timeClone.find('.evo_tz').remove();
		        // Get the text, trim it, and remove any remaining icon-related characters
		        let timeText = timeClone.text().trim();
		        // Remove any lingering non-time characters (e.g., leftover from <i> tags)
		        timeText = timeText.replace(/[^\d:\s-]/g, '');
		        // Trim again to remove any extra spaces
		        timeRange = timeText.trim() || 'N/A';
			}
			
			var RR = {
				'uID': eID + '_' + ri,
				'ID': eID ,
				'event_id': eID ,
				'ri': ri,
				'event_start_unix': parseInt(time[0]),
				'event_end_unix': parseInt(time[1]),
				'time_text': timeRange, // @since 4.9.8
				'ux_val': ELM.find('.evcal_list_a').data('ux_val'),
				'event_title': _event_title,
				'hex_color': ELM.data('colr'),
				'hide_et': ELM.hasClass('no_et') ? 'y':'n', // hide endtime
				'evcal_event_color': ELM.data('colr'),
				'unix_start': parseInt(time[0]),// @4.5.7
				'unix_end': parseInt(time[1]),// @4.5.7
			};

			// event type
			RR['ett1'] = {};
			ELM.find('.evoet_eventtypes.ett1 .evoetet_val').each(function(){
				RR['ett1'][ $(this).data('id')] = $(this).data('v');
			});

			// since 4.3.5
			const eventtop_data = ELM.find('.evoet_data').data('d');

			// location
			if(eventtop_data && 'loc.n' in eventtop_data && eventtop_data['loc.n'] != ''){
				RR['location'] = eventtop_data['loc.n'];
			}

			// organizer
			if(eventtop_data && 'orgs' in eventtop_data && eventtop_data.orgs !== undefined ){
				var org_names = '';
				$.each(eventtop_data.orgs, function(index, value){
					org_names += value +' ';
				});
				RR['organizer'] = org_names;
			}

			// event image
			if( ELM.find('.evo_event_schema').length > 0){
				imgObj = ELM.find('.evo_event_schema').find('meta[itemprop=image]').attr('content');
				RR['image_url'] = imgObj;
			}

			// event tags @s 4.5.2
			if( eventtop_data && 'tags' in eventtop_data && eventtop_data.tags !== undefined ){
				//console.log(eventtop_data.tags);
				RR['event_tags'] = eventtop_data.tags;
			}


			return RR;

		}


	// Calendar Helper functions @+2.8 @updated 4.9	
		$.fn.evo_cal_oneevent_onload = function(type){// @since 4.9
			if( type != 'complete') return;

			const bodyClasses = $('body').attr('class') || '';
			const match = bodyClasses.match(/one_event_\d+_\d+/);
			if (match) {
        		const className = match[0];
        		const [, x, y] = className.match(/one_event_(\d+)_(\d+)/);

				const event_obj = $('body').find('#event_'+ x +'_'+ y);
				const $cal = event_obj.closest('.ajde_evcal_calendar');
				const SC = $cal.evo_shortcode_data();


				if( event_obj.length > 1 ) return;

				const new_SC_data = {
		            ...SC,
		            repeat_interval: y,
		            event_id: x,
		            ux_val: '3a',
		            evortl: event_obj.find('.eventon_events_list').hasClass('evortl') ? 'yes' : 'no',			            
		            ajax_eventtop_show_content: true,
		            additional_class: CAL.attr('class').match(/etttc_\w+/)?.[0] || '',
		        };

		        console.log( new_SC_data);
		        $cal.evo_cal_lightbox_trigger(new_SC_data, event_obj, $cal);
				
			}
		}
		$.fn.evo_cal_event_get_uxval = function(SC, obj){
			const CAL = this;
			var ux_val = obj.data('ux_val');

			if(SC && 'ux_val' in SC && SC.ux_val!='' && SC.ux_val!== undefined && SC.ux_val!='0'){
				ux_val = SC.ux_val;
			}

			// special mobile only user interaction 
			if( SC && SC.ux_val_mob !== undefined && SC.ux_val_mob != '' && 
				SC.ux_val_mob != '-' && SC.ux_val_mob != ux_val){
				if( CAL.evo_is_mobile() ) ux_val = SC.ux_val_mob;
			}
			return ux_val;
		}

		// to run before cal ajax is performed @4.6
		$.fn.evo_pre_cal = function(options){
			var el = this;
			var cal = {};
			var OO = $.extend({}, options);

			var run = function(){
				cal_width_assoc();
				cal_load_nav_html();
			}
			var cal_width_assoc = function(){
				cal_w = el.width();
				if( cal_w <300) el.addClass('szS');
				if( cal_w >300 && cal_w <600) el.addClass('szM');
				if( cal_w >600 && cal_w <900) el.addClass('szL');
				if( cal_w >900) el.addClass('szX');
			}

			// load nav html into cal
			var cal_load_nav_html = function(){
				nav_data = el.evo_cal_get_footer_data('nav_data');				
				if( nav_data && 'month_title' in nav_data){
					__html = nav_data.month_title;
					if( 'arrows' in nav_data ) __html += nav_data.arrows;
					el.find('.evo_header_mo').html( __html );
					el.find('.evo_footer_nav').html( __html );
				}
			}
			run();
		}

		// localize time @4.6.7 @u 4.9
		$.fn.evo_cal_localize_time = function(){			
			this.find('.evo_loct_inprocess').each(function(e){	$(this).evo_localize_time();	});
		}
		$.fn.evo_localize_time = function( ){
			
			const eventcard = this.closest('.eventon_list_event');
		    const hideEnd = eventcard.hasClass('no_et');
		    const textLocal = evo_general_params.text.local_time;

		    eventcard.find('.evo_mytime').each(function() {
		    	const $el = $(this);
		        const isEventCard = $el.hasClass('evocard');
		        const { times, __f: fullFormat, __tf: timeOnlyFormat, tzo: utcOffset = 0 } = $el.data();
		        const [start, end] = times.split('-').map(Number);

		        const startMoment = moment.unix(start).utc().local();
		        const endMoment = moment.unix(end).utc().local();
		        const sameMonth = startMoment.format('YYYY/M') === endMoment.format('YYYY/M');
		        const sameDay = sameMonth && startMoment.format('DD') === endMoment.format('DD');

		        const startText = startMoment.format(fullFormat);
		        const endText = endMoment.format(sameDay ? timeOnlyFormat : fullFormat);
		        const html = `${startText}${hideEnd ? '' : ' - ' + endText}` + 
		                     (isEventCard ? `<span class='evomarl5'>(${textLocal})</span>` : '');

		        $el.replaceWith(`<span class='evo_newmytime'>${html}</span>`);
		    });
		}	
		$.fn.evo_day_in_month = function(opt){
			var defaults = { M:'', Y:''}
			var OPT = $.extend({}, defaults, opt);

			return new Date(OPT.Y, OPT.M, 0).getDate();
		}
		$.fn.evo_get_day_name_index = function(opt){
			var defaults = { M:'', Y:'', D:''}
			var OPT = $.extend({}, defaults, opt);

			//return moment(OPT.Y+'-'+OPT.M+'-'+OPT.D).utc().day();

			return new Date(  Date.UTC(OPT.Y, OPT.M-1, OPT.D) ).getUTCDay();
		}

		// scrollbar
		// Function to initialize custom scrollbar
		$.fn.evo_init_scrollbars = function(options){

			const defaults = { scrollSpeed: 50 };
		    const settings = $.extend({}, defaults, options);


		    return this.each(function() {
		        const $scope = $(this);
		        $scope.find('.evo-scrollbar').each(function() {
		            const $container = $(this);
		            if ($container.hasClass('evo-scroll-container')) return;

		            $container.addClass('evo-scroll-container');
		            const $parent = $container.parent();
		            if (!$parent.css('height') || $parent.css('height') === 'auto') {
		                $parent.css('height', '300px');
		            }

		            const $content = $container.children().wrapAll('<div class="evo-scroll-content"></div>').parent();
		            $container.append('<div class="evo-scroll-tab-container"><div class="evo-scroll-tab"></div></div>');

		            const $tabContainer = $container.find('.evo-scroll-tab-container');
		            const $tab = $tabContainer.find('.evo-scroll-tab');
		            const $scrollContent = $container.find('.evo-scroll-content');

		            // Dynamic tab height and visibility
		            const updateTabHeight = () => {
		                const height = $container.height();
		                const contentHeight = $scrollContent[0].scrollHeight;
		                const maxScroll = contentHeight - height;
		                const tabHeight = Math.max(height * (height / contentHeight), 20);
		                $tab.css('height', `${tabHeight}px`);
		                $tab.toggleClass('scroll-needed', maxScroll > 0); // Show tab only if scrollable
		                console.log(height+' '+contentHeight+' '+maxScroll+' '+tabHeight);
            		};
		            $container.on('mouseenter', updateTabHeight);

		            // Click to scroll
		            $tab.on('click', (e) => {
		                const height = $container.height();
		                const maxScroll = $scrollContent[0].scrollHeight - height;
		                const current = $container.scrollTop();
		                $container.scrollTop(current < maxScroll ? current + settings.scrollSpeed : current - settings.scrollSpeed);
		            });

		            // Drag events
		            let isDragging = false;
		            let startY, startScrollTop;

		            // Drag events
		            $tab.on('mousedown', (e) => {
		                isDragging = true;
		                $tab.addClass('dragging');
		                startY = e.pageY;
		                startScrollTop = $container.scrollTop();
		                e.preventDefault();
		            });

		            $(document).on('mouseup', () => {
		                isDragging = false;
		                $tab.removeClass('dragging');
		            });

		            $(document).on('mousemove', (e) => {
		                if (!isDragging) return;

		                const height = $container.height();
		                const maxScroll = $scrollContent[0].scrollHeight - height;
		                const tabHeight = $tab.height();
		                const tabMaxTravel = height - tabHeight;
		                const deltaY = e.pageY - startY;
		                const scrollPercent = deltaY / tabMaxTravel;
		                $container.scrollTop(Math.max(0, Math.min(startScrollTop + (scrollPercent * maxScroll), maxScroll)));
		            });

		            // Scroll event with requestAnimationFrame
		            $container.on('scroll', () => {
		                const height = $container.height();
		                const contentHeight = $scrollContent[0].scrollHeight;
		                const maxScroll = contentHeight - height;
		                const tabHeight = $tab.height();
		                const tabMaxTravel = height - tabHeight;
		                const scrollPosition = $container.scrollTop();
		                const scrollPercent = maxScroll > 0 ? scrollPosition / maxScroll : 0;

		                requestAnimationFrame(() => {
		                    $tabContainer.css('top', `${scrollPosition}px`);
		                    $tab.css('top', `${scrollPercent * tabMaxTravel}px`);
		                });
		            });
		        });
		    });
		}


		/*
	    // Run on page load for all elements with .evo-scrollbar
	    initCustomScrollbar($('body').find('.evo-scrollbar'));

	    // Expose function globally for on-demand use
	    window.initCustomScrollbar = function(selector) {
	        const $elements = selector ? $(selector) : $('body').find('.evo-scrollbar');
	        initCustomScrollbar($elements);
	    };
	    */



	// LIGHTBOX
	// page Lightbox functions @+2.8
	// append to the lightbox main class name .evo_lightbox		
		// Legacy
			$.fn.evo_prepare_lb = function(){
				$(this).find('.evo_lightbox_body').html('');
			}
			$.fn.evo_show_lb = function(opt){
				var defaults = { RTL:'', calid:''}
				var OPT = $.extend({}, defaults, opt);

				$(this).addClass('show '+ OPT.RTL).attr('data-cal_id', OPT.calid);
				$('body').trigger('evolightbox_show');
			}
			$.fn.evo_append_lb = function(opt){
				var defaults = { C:'', CAL:''}
				var OPT = $.extend({}, defaults, opt);
				$(this).find('.evo_lightbox_body').html( OPT.C);

				if(  OPT.CAL!= '' && OPT.CAL !== undefined && OPT.CAL.hasClass('color')){
					const LIST = $(this).find('.eventon_events_list');
					if( LIST.length>0){
						LIST.find('.eventon_list_event').addClass('color');
					}				
				}
			}

	// event image gallery @4.6
		$.fn.eventon_process_main_ft_img = function(OO){
			const IMG = this;
			var img_sty = 'def';
			if( IMG.hasClass('fit') ) img_sty = 'fit';
			if( IMG.hasClass('full') ) img_sty = 'full';
			
			// Initialize box dimensions
		    let box_width =  IMG.width();
		    let box_height =  IMG.height();
			
			// Ensure valid box dimensions
		    box_width = box_width > 0 ? box_width : 100; // Fallback to prevent errors
		    box_height = box_height > 0 ? box_height : 100;
			

			 // Get image dimensions from data attributes
		    const img_width = parseInt(IMG.data('w')) || 100; // Fallback to prevent division by zero
		    const img_height = parseInt(IMG.data('h')) || 100;
		    const img_ratio = img_height / img_width; // Image aspect ratio
					
			let new_width, new_height;
			
			// Handle 'fit' style 
			if( IMG.hasClass('fit')){
				// Scale to fit within box while maintaining aspect ratio
		        new_width = box_height / img_ratio;
				new_height = box_height;
				if( new_width > box_width ){// width is wider than box

					if( img_ratio <1 ){
						new_width = box_width; new_height = img_ratio * new_width;
					}else{
						new_height = box_height; new_width = new_height / img_ratio;
					}
				} 	
					
				IMG.find('span').css({'width':new_width, 'height': new_height} );
			}

			// full style
			if( IMG.hasClass('full')){
				new_height = img_ratio * box_width;
				new_width = box_width;
				IMG.find('span').css({'width':new_width, 'height': new_height} );
				IMG.css({'height': new_height} );
			}

			//console.log(box_width +' '+img_width+' '+new_width);
		}


	/**
	 * Form functions
	 * @version 4.8.2
	 * @updated 4.9.6
	 */
		$.fn.evo_RealTime_form_validation = function() {
	        return this.each(function() {
	            var form = $(this);
	            var req_fields = form.find('.input.req');
	            var email_fields = form.find('.input.email');
	            var humanvalid_fields = form.find('.input.evoelm_hval_val');

            		        
	            req_fields.on('input blur', function() { $(this).evo_form_validate_field( 'text'); });
            	email_fields.on('input blur', function() { $(this).evo_form_validate_field( 'email'); });
            	humanvalid_fields.on('input blur', function() { $(this).evo_form_validate_field( 'humanvalid'); });
            	
	        });
	    }

	    $.fn.evo_form_validation_check = function(){

	    	var form = this;
	    	var req_fields = form.find('.input.req'); // Define here for use in validateForm
		    var email_fields = form.find('.input.email');
		    var humanvalid_fields = form.find('.input.evoelm_hval_val');

	    	
            function validateForm() {
	            var hasErrors = false;
	            req_fields.each(function() {
	                if ( $(this).evo_form_validate_field( 'text')) hasErrors = true;
	            });
	            email_fields.each(function() {
	                if ($(this).evo_form_validate_field( 'email')) hasErrors = true;
	            });
	            humanvalid_fields.each(function() {
	                if ($(this).evo_form_validate_field( 'humanvalid')) hasErrors = true;
	            });

	            return !hasErrors;
	        }

	        return validateForm();
	    }
	    $.fn.evo_form_validate_field = function(type){
	    	var field = this;
	    	var errorElement = field.siblings('em');
            var hasError = false;
            var fieldValue = field.val().trim();

            if (type === 'email') {		   
            	if (field.hasClass('req')) {
                    // Required email: Check if filled AND valid
                    hasError = fieldValue === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue);
                } else {
                    // Optional email: Only check if it’s not empty
                    hasError = fieldValue !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue);
                }
                 	
            } else if (type === 'humanvalid') {
                var correctAnswer =  field.data('val'); // Expected answer from data attribute
                hasError = ( '89r329' +field.val().trim()+ '8932ufe' ) !== correctAnswer;
            } else {
                hasError = field.val().trim() === '';
            }                

            if (hasError) {
                if (errorElement.length === 0) {
                    errorElement = $('<em class="evoelm_field_errmsg evopadt5"></em>');
                    field.after(errorElement);
                }
                errorElement.html(getErrorMessage(type === 'email' ? 'err2' : type === 'humanvalid' ? 'err3' : 'err1'))
                    .removeClass('evodn')
                    .addClass('evodib');
                field.addClass('err');
            } else {
                errorElement.remove();
                field.removeClass('err');
            }	   

            function getErrorMessage(type) {
	            const messages = {
	                err1: evo_general_params.text.err1, // Required field error
	                err2: evo_general_params.text.err2, // Email format error
	                err3: evo_general_params.text.err3  // Human validation error (e.g., "Incorrect answer")
	            };
	            return messages[type] || "";
	        }             

            return hasError;
	    }	

	    $('body').on('evo_elm_form_presubmit_validation', function(event, form, callback){
    		event.preventDefault();
    		var $form = $(form);

    		var isValid = $form.evo_form_validation_check();

            if (typeof callback === "function") {
                callback(isValid); // Return true/false to the callback
            }
    	});

	// Calendar Data & Shortcodes
		// get shortcodes from evo bottom
		$.fn.evo_shortcode_data = function(){		
			var ev_cal = $(this);
			return ev_cal.find('.evo_cal_data').data('sc');			
		}

		// get filter data @4.6
			$.fn.evo_get_filter_data = function(){			
				return $(this).find('.evo_cal_data').data('filter_data');			
			}
			$.fn.evo_cal_get_filter_sub_data = function( tax , key){
				newdata = $(this).evo_get_filter_data();

				return newdata[ tax ][ key ];
			}
			$.fn.evo_cal_update_filter_data = function(tax, new_val, key){

				newdata = $(this).evo_get_filter_data();
				if( key === undefined) key = 'nterms';
				newdata[ tax ][ key ] = new_val;
				$(this).find('.evo_cal_data').data('filter_data', newdata );
			}
			$.fn.evo_cal_get_footer_data = function( key ){
				data = $(this).find('.evo_cal_data').data();

				//console.log(data);

				if( data === undefined ) return false; // 4.6.2
				if( key in data ) return data[ key ];
				return false;		
			}

		// hide cal data from view
		$.fn.evo_cal_hide_data = function(){			
			$(this).find('.evo_cal_data').attr({
				'data-sc':'',
				'data-filter_data':'',
				'data-nav_data':'',
			});			
		}

		// update shortcode values from filter changes @u4.6
		$.fn.evo_update_sc_from_filters = function(){
			var el = $(this); 	
			SC = el.evo_shortcode_data();


			$.each( el.evo_get_filter_data() , function(index, value){
				var default_val 	= value.terms;
				var filter_val 		= value.nterms;
				const NOT_values 	= value.__notvals;

				filter_val = filter_val == ''? 'NOT-all': filter_val;	
				
				var not_string = '';

				// if NOT filter in place > include that in tax value for query
				if( NOT_values!== undefined && NOT_values.length >0 && filter_val != default_val ){	
					
					$.each(NOT_values, function(index, value){
						not_string += 'NOT-'+ value +',';
					});
				}		

				SC[ index ] = not_string + filter_val;
			});
			

			el.find('.evo_cal_data').data( 'sc', SC );
		}
		
		

		// get shortcode single value
		$.fn.evo_get_sc_val = function(opt){
			var defaults = {	F:''}
			var OPT = $.extend({}, defaults, opt);
			var ev_cal = $(this); 

			if(OPT.F=='') return false;
			SC = ev_cal.find('.evo_cal_data').data('sc');

			if(!(SC[ OPT.F])) return false;
			return SC[ OPT.F];
		}
		// UPDATE Single value
		$.fn.evo_update_cal_sc = function(opt){
			var defaults = {
				F:'', V:''
			}
			var OPT = $.extend({}, defaults, opt);
			var ev_cal = $(this); 
			SC = ev_cal.find('.evo_cal_data').data('sc');

			SC[ OPT.F ] = OPT.V;

			ev_cal.find('.evo_cal_data').data( 'sc', SC );
		}
		// UPDATE all shortcode values
		$.fn.evo_update_all_cal_sc = function(opt){
			var defaults = {SC:''}
			var OPT = $.extend({}, defaults, opt);
			var CAL = $(this);
			CAL.find('.evo_cal_data').data( 'sc', OPT.SC );
		}

		

	// OTHERS
		// hex colors // @+2.8 @updated 4.7.2
			$.fn.evo_is_hex_dark = function(opt){
				var defaults = { hex:'808080'}
				var OPT = $.extend({}, defaults, opt);

				hex = OPT.hex;

				var c = hex.replace('#','');
				var is_hex = typeof c === 'string' && c.length === 6 && !isNaN(Number('0x' + c));

				if(is_hex){	
					var values = c.split('');
					r = parseInt(values[0].toString() + values[1].toString(), 16);
				    g = parseInt(values[2].toString() + values[3].toString(), 16);
				    b = parseInt(values[4].toString() + values[5].toString(), 16);
				}else{
					var vals = c.substring(c.indexOf('(') +1, c.length -1).split(', ');
					var r = vals[0]  // extract red
					var g = vals[1];  // extract green
					var b = vals[2];
				}

				var luma = ((r * 299) + (g * 587) + (b * 114)) / 1000; // per ITU-R BT.709

				return luma> 128? true:false;
			}

		// get rgb from hex code @4.5
			$.fn.evo_rgb_process = function(opt){
				var defaults = { data:'808080',type:'rgb', method:'rgb_to_val'}
				var opt = $.extend({}, defaults, opt);

				const color = opt.data;

				// RGB => hex
				if( opt.method == 'rgb_to_hex'){
					if(color == '1'){
						return;
					}else{
						if(color !=='' && color){
							rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
							
							return "#" +
							("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
							("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
							("0" + parseInt(rgb[3],10).toString(16)).slice(-2);
						}
					}
				}

				// RGB => rgb val
				if( opt.method == 'rgb_to_val'){
					if( opt.type == 'hex'){
						var rgba = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);	
						var rgb = new Array();
						rgb['r']= parseInt(rgba[1], 16);			
						rgb['g']= parseInt(rgba[2], 16);			
						rgb['b']= parseInt(rgba[3], 16);
						
					}else{
						rgb = color;
					}
					
					return parseInt((rgb['r'] + rgb['g'] + rgb['b'])/3);
				}				
			}

		// Other data
			$.fn.evo_get_OD = function(){			
				var ev_cal = $(this);
				return ev_cal.find('.evo_cal_data').data('od');			
			}

	

		// get evo data for a given calendar
		$.fn.evo_getevodata = function(){

			var ev_cal = $(this);
			var evoData = {};
			
			ev_cal.find('.evo-data').each(function(){
				$.each(this.attributes, function(i, attrib){
					var name = attrib.name;
					if(attrib.name!='class' && attrib.name!='style' ){
						name__ = attrib.name.split('-');
						evoData[name__[1]] = attrib.value;	
					}
				});
			});	

			return evoData;
		}

		// check if mobile device v4.6
		$.fn.evo_is_mobile = function(){
			return ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )? true: false;		
		}

	// eventon loading functions
	// v 2.4.5 -- deprecating
		$.fn.evo_loader_animation = function(opt){
			var defaults = {
				direction:'start'
			}
			var OPT = $.extend({}, defaults, opt);

			if(OPT.direction == 'start'){
				$(this).find('#eventon_loadbar').slideDown();
			}else{
				$(this).find('#eventon_loadbar').slideUp();
			}
		}

	// DEPRECATED functions
		$.fn.evo_item_shortcodes = function(){			
			var OBJ = $(this);
			var shortcode_array ={};			
			OBJ.each(function(){	
				$.each(this.attributes, function(i, attrib){
					var name = attrib.name;
					if(attrib.name!='class' && attrib.name!='style' && attrib.value !=''){
						name__ = attrib.name.split('-');
						shortcode_array[name__[1]] = attrib.value;	
					}
				});
			});
			return shortcode_array;
		}
		$.fn.evo_shortcodes = function(){			
			var ev_cal = $(this);
			var shortcode_array ={};
					
			ev_cal.find('.cal_arguments').each(function(){
				$.each(this.attributes, function(i, attrib){
					var name = attrib.name;
					if(attrib.name!='class' && attrib.name!='style' && attrib.value !=''){
						name__ = attrib.name.split('-');
						shortcode_array[name__[1]] = attrib.value;	
					}
				});
			});	
			return shortcode_array;
		}
		

});