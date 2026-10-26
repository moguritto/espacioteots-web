/**
 * Javascript code that is associated with the front end of the calendar
 * @version 5.0.7
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

jQuery(document).ready(function($){

	// restrict this only to frontend of the calendar
	if ( evo_general_params != '' && evo_general_params !== undefined && evo_general_params.is_admin) return; 
	
	//return;
	var BODY = $('body');
	var BUS = ''; // initial eventon calendar data
	var ajax_url = evo_general_params.ajaxurl;


// EventON calendar main function
	// Calendar processing 2.8.6 u 4.6
	$.fn.evo_calendar = function (options) {

		var el = this;
		var cal = this;
		var cal = {};
		var calO = $.extend({
			'SC': {},
			'json':{},
			'type':'init' ,
			map_delay:0
		}, options);
		var SC = el.evo_shortcode_data();

		
		// load calendar eventcard and eventtop interactions
		this.find('.eventon_list_event').each(function(){
			evo_cal_eventcard_interactions( $(this) );
		});

		var init = function(){

			// change IDs for map section for eventon widgets
			if( $(el).hasClass('evcal_widget')){
				$(el).find('.evcal_gmaps').each(function(){
					var gmap_id = obj.attr('id');
					var new_gmal_id =gmap_id+'_widget'; 
					obj.attr({'id':new_gmal_id})
				});
			}

			// load maps on calendar
			_evo_run_eventcard_map_load();

			// initial actions on calendar
			$(el).evo_cal_filtering();

			// localizing event time
			$(el).evo_cal_localize_time();

			// load lightbox events on page load
			$(cal).evo_cal_oneevent_onload(calO.type);
			
			
			el.evo_cal_hide_data();	

			live_now_cal();
			counters();
		};
		
		// support	
			var live_now_cal = function(){
				$(el).find('.evo_img_time').each(function(){
					if( $(this).closest('a.desc_trig').find('em.evcal_time').length ){
						_html = $(this).closest('a.desc_trig').find('em.evcal_time')[0].outerHTML;
						$(this).html( _html );
					}				
				});
			}

			var counters = function(){
				$(el).find('.evo_countdowner').each(function(){
					$(this).evo_countdown();
				});
			}

		init();	
	};

      
// Event Card handling / Bind Event Listeners --- v4.6.1 @updated 5.0
	var EVO_EventCard_Listeners = function(){

		const EVO_Card_Listeners = {
			E: { B: $('body') },
			init(){
				const { E } = this;
				// Event listeners
	            E.B.on('click.evoCard', '.evo_et_trigger', (e) => this.evo_handle_et_sidePanel(e));
	            E.B.on('evo_ajax_success_evo_et_trigger.evoCard', (e, OO, data, el) => this.evo_handle_et_sp_content(e, OO, data, el));
	            E.B.on('click.evoCard', '.tzo_trig', (e) => this.localizeTime(e));
	            E.B.on('click.evoCard', '.evo_event_more_img', (e) => this.handle_event_more_img(e));
	            E.B.on('click.evoCard', '.evo_img_triglb', (e) => this.handle_img_triglb(e));
	            E.B.on('click.evoCard', '.evo_repeat_series_date', (e) => this.handle_repeat_series_date(e));
	            E.B.on('click.evoCard', '.copy.evo_ss', (e) => this.handle_copy_event_link(e));
	            E.B.on('click.evoCard', '.evo_copy_address', (e) => this.handle_copy_event_address(e));
	            E.B.on('click.evoCard', '.evo_openmap_trig', (e) => this.handle_open_inmaps(e));
	            E.B.on('click.evoCard', '.evo_locimg_more', (e) => this.handle_locimg_more(e));
	            E.B.on('click.evoCard', '.evo_gal_icon', (e) => this.handle_gal_icon(e));
	            E.B.on('click.evoCard', '.evobtn_details_show_more', (e) => this.handle_details_show_more(e));
	            E.B.on('click.evoCard', '.evcal_close', (e) => this.handle_close_eventcard(e));
	            E.B.on('click.evoCard', '.evocmd_button', (e) => this.handle_evocmd_button(e));
	            E.B.on('click.evoCard', '.evo_org_clk_link', (e) => this.handle_org_clk_link(e));
	            E.B.on('click.evoCard', '.editEventBtnET', (e) => this.handle_edit_event_button(e));
	            E.B.on('click.evoCard', '.evo_organizer_more_trig', (e) => this.handle_organizer_more_details(e));
			},

			handle_organizer_more_details(e){
				const { E } = this;
		        const $el = $(e.currentTarget);
		        $el.parent().hide();
		        $el.parent().siblings('.evo_org_details_full').show().removeClass('evodni');
			},

			// actions
				// Opens a side panel for event type triggers, adding a class and setting up data
		        evo_handle_et_sidePanel(e) {
		            const { E } = this;
		            const $el = $(e.currentTarget);
		            e.preventDefault();
		            $el.addClass('evo_sp_trig_on');
		            const aData = $el.data('d');
		            aData.adata.data['nonce'] = evo_general_params.n;
		            $el.evo_open_sidepanel(aData);
		        },

		        // Populates the side panel with content from an AJAX response and removes the loading bar
		        evo_handle_et_sp_content(e, OO, data, el) {
		            $(el).evo_populate_sidepanel(data.html);
		            $('#evo_sp').find('.evo_loading_bar_holder').remove();
		        },

		        // Localizes the time display for elements with the tzo_trig class
		        localizeTime(e) {
		            e.preventDefault();
		            e.stopPropagation();
		            $(e.target).evo_localize_time();
		        },

		        // Changes the main event image when a thumbnail is clicked
		        handle_event_more_img(e) {
		            const $el = $(e.currentTarget);
		            const box = $el.closest('.evcal_eventcard');
		            const gal = $el.closest('.evocard_fti_in');

		            if (box.length === 0) return;

		            $el.siblings('span').removeClass('select');
		            $el.addClass('select');

		            const mainIMG = box.find('.evocard_main_image');
		            mainIMG.data({
		                h: $el.data('h'),
		                w: $el.data('w'),
		                f: $el.data('f'),
		                a: $el.data('a'),
		            });

		            if (mainIMG.hasClass('def')) {
		                mainIMG.css('background-image', `url(${$el.data('f')})`);
		            } else {
		                mainIMG.html(`<span style="background-image:url(${$el.data('f')})"></span>`);
		                mainIMG.eventon_process_main_ft_img();
		            }
		        },

		        // Opens a lightbox to display a full-size event image when clicked
		        handle_img_triglb(e) {
		            const $el = $(e.currentTarget);

		            if ($el.hasClass('inlb')) return;

		            const __ac = parseInt($el.data('w')) >= parseInt($el.data('h')) ? 'iW' : 'iH';
		            $el.evo_lightbox_open({
		                uid: 'evocard_ft_img',
		                lbc: 'evolb_ft_img',
		                lbac: `within evocard_img ${__ac}`,
		                content: `<img class='evocard_main_image inlb' src='${$el.data('f')}' data-w='${$el.data('w')}' data-h='${$el.data('h')}' style='max-width:100%; max-height:100%;'/>`,
		                end: 'client',
		                lb_padding: '',
		                d: { event_id: $el.data('event_id'), ri: $el.data('ri') }
		            });
		        },

		        // Navigates to a repeat event's date URL based on user interaction type
		        handle_repeat_series_date(e) {
		            const $el = $(e.currentTarget);
		            if (!$el.parent().hasClass('clickable')) return;

		            const ux = $el.data('ux');
		            const URL = $el.data('l');
		            if (ux === 'def') window.location = URL;
		            if (ux === 'defA') window.open(URL, '_blank');
		        },

		        // Copies an event link to the clipboard and shows a temporary confirmation
		        handle_copy_event_link(e) {
		        	e.preventDefault();
		            e.stopPropagation();
		            const $el = $(e.currentTarget);
		            const ROW = $el.closest('.evcal_evdata_row');
		            const link = decodeURIComponent($el.data('l'));
		            navigator.clipboard.writeText(link);

		            const evo_card_socialshare_html = ROW.html();
		            ROW.html(`<p style='display:flex'><i class='fa fa-check marr10'></i> ${$el.data('t')}</p>`);

		            setTimeout(() => {
		                ROW.html(evo_card_socialshare_html);
		            }, 3000);
		        },

		        // copy event location address
		        handle_copy_event_address(e){
		        	e.preventDefault();
		            e.stopPropagation();
		        	const $el = $(e.currentTarget);
		        	const content = decodeURIComponent($el.data('txt'));
		        	navigator.clipboard.writeText(content);
		        	$el.siblings('input').val( $el.data('t'));

		        	setTimeout(() => {
		                $el.siblings('input').val( content );
		            }, 3000);
		        },

		        // open event location in maps
		        handle_open_inmaps(e){
		        	e.preventDefault();
		            e.stopPropagation();
		        	const $el = $(e.currentTarget);

		        	const address = $el.data('d');
		        	const ua = navigator.userAgent;
				    // Mobile: try to open native app first
				    if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
				        // Force Apple Maps APP
				        window.location = 'maps://maps.apple.com/?q=' + address;
				        // Fallback to web in new tab after 1 second if app didn't open
				        setTimeout(() => {
				            window.open('https://maps.apple.com/?q=' + address, '_blank');
				        }, 1000);
				    }
				    else if (ua.includes('android')) {
				        // Force Google Maps APP
				        window.location = 'geo:0,0?q=' + address;
				        setTimeout(() => {
				            window.open('https://www.google.com/maps/search/?api=1&query=' + address, '_blank');
				        }, 1000);
				    }
				    else {
				        // Desktop or unknown → always open in new tab (your requirement)
				        window.open('https://www.google.com/maps/search/?api=1&query=' + address, '_blank', 'noopener');
				    }
		        },

		        // Toggles visibility of additional location images
		        handle_locimg_more(e) {
		            e.preventDefault();
		            e.stopPropagation();
		            $(e.currentTarget).closest('.evo_metarow_locImg').toggleClass('vis');
		        },

		        // Updates the gallery main image when a gallery icon is clicked
		        handle_gal_icon(e) {
		            e.preventDefault();
		            e.stopPropagation();

		            const $el = $(e.currentTarget);
		            if ($el.hasClass('on')) return;
		            $el.siblings('div').removeClass('on');
		            $el.addClass('on');

		            $el.closest('.evo_gal_box').find('.evo_gal_main_img')
		                .css('background-image', `url(${$el.data('u')})`)
		                .data('f', $el.data('u'))
		                .data('h', $el.data('h'))
		                .data('w', $el.data('w'));
		        },

		        // Toggles the display of additional event details
		        handle_details_show_more(e) {
		            e.preventDefault();
		            this.control_more_less($(e.currentTarget));
		        },

		        // Closes the event card by sliding it up
		        handle_close_eventcard(e) {
		            e.preventDefault();
		            $(e.currentTarget).closest('.evcal_eventcard').slideUp().removeClass('open');
		        },

		        // Redirects to a URL when an event command button is clicked
		        handle_evocmd_button(e) {
		            e.preventDefault();
		            e.stopPropagation();

		            const $el = $(e.currentTarget);
		            const href = $el.data('href');
		            if ($el.data('target') === 'yes') {
		                window.open(href, '_blank');
		            } else {
		                window.location = href;
		            }
		        },

		        // Opens an organizer's link in a new tab
		        handle_org_clk_link(e) {
		            window.open($(e.currentTarget).data('link'), '_blank');
		        },

		        // Redirects to the event edit page
		        handle_edit_event_button(e) {
		            e.stopPropagation();
		            const href = $(e.currentTarget).attr('href');
		            window.open(href);
		        },

		        // Controls the more/less toggle for event details display
		        control_more_less(obj) {
		            const content = obj.attr('content');
		            const current_text = obj.find('.ev_more_text').html();
		            const changeTo_text = obj.find('.ev_more_text').attr('data-txt');
		            const cell = obj.closest('.evcal_evdata_cell');

		            if (content === 'less') {
		                cell.removeClass('shorter_desc');
		                obj.attr('content', 'more');
		                obj.find('.ev_more_arrow').removeClass('ard');
		                obj.find('.ev_more_text').attr('data-txt', current_text).html(changeTo_text);
		            } else {
		                cell.addClass('shorter_desc');
		                obj.attr('content', 'less');
		                obj.find('.ev_more_arrow').addClass('ard');
		                obj.find('.ev_more_text').attr('data-txt', current_text).html(changeTo_text);
		            }
		        }
		};

		EVO_Card_Listeners.init();		

	}
	var evo_cal_eventcard_interactions = function( EC , load_maps ){

		// process featured image sizes
		EC.find(".evocard_main_image").eventon_process_main_ft_img(  );		

		// process content sliders
		EC.find('.evo_elm_HCS').each(function(){
			$(this).evoContentSlider();
		});	

		// countdown
		EC.find('.evo_countdowner').each(function(){
			var obj = $(this);
			obj.removeClass('evo_cd_on');
			obj.evo_countdown();
		});
		
		$(window).on('resize',function(){
			BODY.find(".evocard_main_image").each(function(){
				$(this).eventon_process_main_ft_img();		
			});
			//EC.find(".evocard_main_image").eventon_process_main_ft_img();		
		});
	}
	$.fn._evo_cal_eventcard_interactions = function( EC, load_maps){
		evo_cal_eventcard_interactions( EC , load_maps);
	}

	// run all map waiting map @4.6.1
	function _evo_run_eventcard_map_load(){
		BODY.evo_run_eventcard_map_load();
	}
	$.fn.evo_run_eventcard_map_load = function(){

		time = 600;

		BODY.find('.evo_metarow_gmap').each(function(index){	
			O = $(this);
			if( !(O.is(":visible")) ) return;
			O.evo_load_gmap({
				map_canvas_id: O.attr('id'),
				trigger_point:'evo_calendar',
				delay: time
			});
			time += 600;
		});			
	}

// EventTop Interactions v4.6
	var evo_cal_eventtop_interactions = function( ET ){	}
	
// RUN on Page load
	EVO_Global_Init();

	function EVO_Global_Init(){

		EVO_Interactions();

		EVO_EventCard_Listeners();

		// check if calendars are present in the page
			var run_initload = false;

			if( $('body').find('.ajde_evcal_calendar').length > 0 ) run_initload = true;
			if( $('body').find('.ajax_loading_cal').length > 0 ) run_initload = true;
			if( $('body').find('.eventon_single_event').length > 0 ) run_initload = true;

			if(run_initload == false) return false;

			var data_arg = {};	

			BODY.trigger('evo_global_page_run');

			data_arg['global'] = $('#evo_global_data').data('d');
			data_arg['cals'] ={};	
			data_arg['nonce'] = evo_general_params.n;				

		// run through all the calendars on page
			BODY.find('.ajde_evcal_calendar').each(function(){
				const CAL = $(this);
				var SC = CAL.evo_shortcode_data();

				CAL.evo_pre_cal();

				if( CAL.hasClass('ajax_loading_cal')){
					data_arg['cals'][ CAL.attr('id')] = {};
					data_arg['cals'][ CAL.attr('id')]['sc'] = SC;

					BODY.trigger('evo_global_page_run_after', CAL , SC );// @4.6.1
				}
			});

		BODY.evo_admin_get_ajax({
			adata:{
				data:data_arg,
				a:'eventon_init_load',ajax_type:'endpoint',end:'client'
			},
			onSuccess:function( OO, data, LB){
				$('#evo_global_data').data('d', data);

				BUS = data;

				// append html to calendars if present
				if('cals' in data){
					var time = 300;
					$.each(data.cals, function(i,v){

						setTimeout( function(){

							CAL = BODY.find('#'+ i);
							if(CAL.length === 0) return;
							
							if('html' in v){						
								CAL.find('#evcal_list').html( v.html );
								CAL.removeClass('ajax_loading_cal');
								CAL.find('.evo_ajax_load_events').remove();
							}	

							// load SC and JSON to calendar
							CAL.evo_cal_functions({action:'update_shortcodes',SC: v.sc});
							CAL.evo_cal_functions({action:'update_json',json: v.json});
							
							$('body').trigger('evo_init_ajax_success_each_cal', [data, i, v, CAL]);

						}, time);
						time += 300;
					});
				}

				$('body').trigger('evo_init_ajax_success', [data]);

				// after timeout based cal loading, process all cals
				setTimeout( function(){
					BODY.find('.ajde_evcal_calendar').each(function(){
						if( $(this).hasClass('.ajax_loading_cal') ) return;					
						$(this).evo_calendar({'type':'complete'});
					});
				}, time );
			},
			onComplete:function( OO, data){
				$('body').trigger('evo_init_ajax_completed', [data]);
			}
		});	

		handlebar_additional_arguments();
		
		EVO_Cal_Body_listeners();

		// run basic countdown timers
		BODY.find('.evo_countdowner').each(function(){
			$(this).evo_countdown();
		});
	}



// ELEMENTS u4.9
	// tooltips
		$('body').on('mouseover','.ajdeToolTip, .evotooltip, .evotooltipfree',function(event){
			event.stopPropagation();
			
			const el = $(this);
			if(el.hasClass('show')) return;

			var free = el.hasClass('free') || el.hasClass('evotooltipfree');
			var content =  el.data('d') || el.attr('title') || '';
			if (!content) return;

			var p = el.position();			
			var cor = getCoords(event.target);

			$('.evo_tooltip_box').removeClass('show').removeClass('L').html( content );
			var box_height = $('.evo_tooltip_box').height();
			var box_width = $('.evo_tooltip_box').width();
			var top = cor.top - 55 - box_height + (free ? 20 : 0);

			$('.evo_tooltip_box').css({'top': top, 'left': ( cor.left + 5 ) })
				.addClass('show');

			// left align
			if( $(this).hasClass('L')){
				$('.evo_tooltip_box').css({'left': (cor.left - box_width - 15) }).addClass('L');			
			}
		})
		.on('mouseout','.ajdeToolTip, .evotooltip, .evotooltipfree',function(e){	
			event.stopPropagation();
			var relatedTarget = $(event.relatedTarget);
			var target = $(this);

			$('.evo_tooltip_box').removeClass('show');
		});

		function getCoords(elem) { // crossbrowser version
		    var box = elem.getBoundingClientRect();
		    //console.log(box);

		    var body = document.body;
		    var docEl = document.documentElement;

		    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
		    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

		    var clientTop = docEl.clientTop || body.clientTop || 0;
		    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

		    var top  = box.top +  scrollTop - clientTop;
		    var left = box.left + scrollLeft - clientLeft;

		    return { top: Math.round(top), left: Math.round(left) };
		}
	// yes no button		
		$('body').on('click','.ajde_yn_btn ', function(event){

			// stop this code from working on wp-admin
			if($('body').hasClass('wp-admin')) return false; 
			
			var obj = $(this);
			var afterstatement = obj.attr('afterstatement');
				afterstatement = (afterstatement === undefined)? obj.attr('data-afterstatement'): afterstatement;	
			var uid = '';

			// yes
			if(obj.hasClass('NO')){					
				obj.removeClass('NO');
				obj.siblings('input').val('yes');

				// afterstatment
				if(afterstatement!=''){
					var type = (obj.attr('as_type')=='class')? '.':'#';
					if( obj.data('uid') !== undefined) uid = obj.data('uid');
					$(type+ afterstatement).slideDown('fast');						
				}

			}else{//no
				obj.addClass('NO');
				obj.siblings('input').val('no');
				
				if(afterstatement!=''){
					var type = (obj.attr('as_type')=='class')? '.':'#';
					$(type+ afterstatement ).slideUp('fast');
				}
			}
		});

	// content slider v4.9.13
		// jQuery plugin for content slider
	    $.fn.evoContentSlider = function() {
	        return this.each(function() {
	            const $slider = $(this);
	            const $inner = $slider.find('.evo_elm_HCS_in');
	            const scrollAmount = 10; // Wheel scroll speed
	            let scrollTimeout;

	            // Initial button visibility
	            updateButtonVisibility($slider);

	            $slider.data('evo-slider-initialized', true);

	            // Button click handler
	            $slider.on('click', '.evo_elmHCS_nav.content_slide_trig', function() {
	                const $button = $(this);
	                const scrollDistance = parseInt($slider.width()) / 2;
	                const currentScroll = $inner.scrollLeft();
	                let newScroll;

	                if ($button.hasClass('HCSnavR')) {
	                    newScroll = currentScroll + scrollDistance;
	                    $slider.find('.HCSnavL')[0].classList.add('vis');
	                } else {
	                    newScroll = Math.max(0, currentScroll - scrollDistance);
	                }

	                $inner.animate({ scrollLeft: newScroll }, 200, () => {
	                    updateButtonVisibility($slider);
	                });
	            });

	            // Wheel scrolling
	            $inner[0].addEventListener('wheel', function(e) {
	                e.preventDefault();
	                const delta = e.deltaY;
	                const scrollableLength = this.scrollWidth - parseInt($slider.width());
	                const newScroll = Math.max(0, Math.min($inner.scrollLeft() + (delta > 0 ? scrollAmount : -scrollAmount), scrollableLength));
	                $inner.scrollLeft(newScroll);
	                updateButtonVisibility($slider);
	            }, { passive: false });

	            // Touch scrolling
	            $inner[0].addEventListener('scroll', function() {
	                clearTimeout(scrollTimeout);
	                scrollTimeout = setTimeout(() => {
	                    updateButtonVisibility($slider);
	                }, 100);
	            });
	        });
	    };

	    // Add reload method
	    $('body').on('evo_reload_slider', function(event, $slider){
	    	updateButtonVisibility($slider);
	    });
		

	    // Update button visibility
	    function updateButtonVisibility($slider) {
	    	const $inner = $slider.find('.evo_elm_HCS_in');
	        const scrollableLength = $inner[0].scrollWidth - parseInt($slider.width());
	        const currentScroll = $inner.scrollLeft();
	        const leftButton = $slider.find('.HCSnavL')[0];
	        const rightButton = $slider.find('.HCSnavR')[0];

	        if (scrollableLength <= 0) {
	            leftButton.classList.remove('vis');
	            rightButton.classList.remove('vis');
	            return;
	        }

	        leftButton.classList.toggle('vis', currentScroll >= 10);
	        rightButton.classList.toggle('vis', currentScroll < scrollableLength - 5);
	    }

	    // Debounced resize handler
	    let resizeTimeout;
	    $(window).on('resize', function() {
	        clearTimeout(resizeTimeout);
	        resizeTimeout = setTimeout(() => {
	            $('.evo_elm_HCS').each(function() {
	                updateButtonVisibility($(this), $(this).find('.evo_elm_HCS_in'));
	            });
	        }, 100);
	    });

	    BODY.find('.evo_elm_HCS').each( function(event){
			$(this).evoContentSlider();
		});

	// dynamic select @4.8.2
		BODY.on('click', '.evo_elm_dynamic_select_trig',function(e){
			e.preventDefault();
			const btn = $(this);
		    const row = btn.closest('.evo_elm_dynamic_select');
		    const list = btn.find('.evoelm_ds_list');

		    row.toggleClass('open');
		    btn.toggleClass('open');

			if (btn.hasClass('open')) {
		        const options = btn.siblings('div').data('d');
		        let html = `<div class="evoelm_ds_list evobr10 evodfx evofx_dr_c evobgcw evofz14 evoff_2 evo_ofh evoposa evoleft0 " role="listbox" aria-labelledby="selected-option">`;

		        $.each(options, (index, value) => {
		            html += `<span class="evoelm_ds_list_item evopad10 evocurp evoborderb" role="option" tabindex="-1" data-index="${index}">${value}</span>`;
		        });

		        html += '</div>';
		        btn.append(html);
		    } else {
		        list.remove();
		    }
		});

		$(document).click(function(event){
			if( !$(event.target).closest('.evo_elm_dynamic_select').length){
				const openBox = BODY.find('.evo_elm_dynamic_select.open');
		        openBox.removeClass('open').find('button').removeClass('open');
		        openBox.find('.evoelm_ds_list').remove();
			}	
		});

		// item clicked from the list
		BODY.on('click','.evoelm_ds_list_item',function(event){
			const item = $(this);
		    const box = item.closest('.evo_elm_dynamic_select');
		    const value = item.data('index');

		    // update focus item name
		    box.find('.evoelm_ds_current').html( item.html() );

		    // set new value to input
		    box.find('input').val( value );

		    // plug for others
			BODY.trigger('evoelm_dynamic_select_clicked', [ item, value, box ]);

			box.removeClass('open');
            box.find('button').removeClass('open');
            item.parent().remove();

		});


	// Image Select @added 4.9 @updated: 5.0.3	
		var file_frame;	
		var __img_index;
		var __img_obj;
		var __img_box;
		var __img_type;
	  
	    BODY.on('click','.evolm_img_select_trig',function(event) {
	    	event.preventDefault();
	    	//console.log('ef');

	    	const $trigger = $(this);
	    	const __img_obj = $(this);
	    	const $row = $trigger.closest('.evo_elm_row');
	    	const __img_box = __img_obj.closest('.evo_metafield_image');
	    	const __img_actions = __img_obj.closest('.evolm_img_actions');
	    	const __img_type = __img_box.hasClass('multi')? 'multi': 'single';
	    	const uploaderId = $row.data('id');

	    	if( __img_type == 'single' &&  __img_box.hasClass('has_img') ) return;
	    	if( __img_type == 'multi'){
	    		__img_index = __img_obj.data('index');

	    		// remove image
				if( __img_obj.hasClass('on')){
					__img_obj.css('background-image', '').removeClass('on');
					__img_obj.find('input').val( '' );
					return;
				}
	    	}

	    	// Reset file_frame to avoid stale state
	        if (file_frame) {     file_frame.close(); file_frame = null;   }

			// Get user_id (0 for non-logged-in users)
	        var user_id = __img_actions.data('userid') ? parseInt(__img_actions.data('userid')) : 0;
	        var library_args = { type: 'image' };
	        if (user_id > 0) { library_args.author = user_id; }

	        //console.log(library_args);

			// Create the media frame
			file_frame = wp.media.frames.downloadable_file = wp.media({
				title: 'Choose an Image', 
				button: {text: 'Use Image'},	
				multiple: false,
				library: library_args,
			});

			// Attache unique ID
			if( uploaderId != '' || uploaderId !== undefined){
				//console.log(uploaderId);
				file_frame.uploaderId = uploaderId;
			}


			// When an image is selected, run a callback.
			file_frame.on( 'select', function() {
				var selection = file_frame.state().get('selection');
        		//console.log('Selection:', selection.toJSON());

        		if (selection.length > 0) {
	                var attachment = selection.first().toJSON();
	                //console.log('Selected attachment:', attachment);

	                if (__img_type == 'single') {
	                    __img_box.addClass('has_img');
	                    __img_box.find('input.evo_meta_img').val(attachment.id);
	                    __img_box.find('.evoelm_img_holder').css('background-image', 'url(' + attachment.url + ')');
	                    //console.log('Single image updated:', __img_box.find('.evoelm_img_holder').css('background-image'));
	                } else {
	                    __img_obj.css('background-image', 'url(' + attachment.url + ')').addClass('on');
	                    __img_obj.find('input').val(attachment.id);
	                    //console.log('Multi image updated:', __img_obj.css('background-image'));
	                }
	            } else {
	                console.log('No image selected');
	            }

			});

			// Handle errors
	        file_frame.on('error', function(error) {
	            console.error('Media Uploader Error:', error); alert('Error: ' + error.message);
	        });

			// Finally, open the modal.
			file_frame.open();
			
	    });  
		// remove image
		BODY.on('click','.evoel_img_remove_trig',function(){

			const field = $(this).closest('.evo_metafield_image');
			if( !(field.hasClass('has_img') ) ) return;
			
			field.removeClass('has_img');
			field.find('input').val('');
			field.find('button').addClass('chooseimg');
			field.find('.evoelm_img_holder').css('background-image', '' );
		});

	// plus minus changer @updated 4.9
		$('body').on('click','.evo_plusminus_change', function(event){

			// only run on frontend
			if( evo_general_params.cal.is_admin ) return;

	        OBJ = $(this);

	        QTY = parseInt(OBJ.siblings('input').val());
	        MAX = OBJ.siblings('input').data('max');        
	        if(!MAX) MAX = OBJ.siblings('input').attr('max');           

	        NEWQTY = (OBJ.hasClass('plu'))?  QTY+1: QTY-1;

	        NEWQTY =(NEWQTY <= 0)? 0: NEWQTY;

	        // can not go below 1
	        if( NEWQTY == 0 && OBJ.hasClass('min') ){    return;    }

	        NEWQTY = (MAX!='' && NEWQTY > MAX)? MAX: NEWQTY;
	        if( isNaN( NEWQTY ) ) NEWQTY = 0;

	        OBJ.siblings('input').val(NEWQTY).attr('value',NEWQTY);

	        if( QTY != NEWQTY) $('body').trigger('evo_plusminus_changed',[NEWQTY, MAX, OBJ]);
	       
	        if(NEWQTY == MAX){
	            PLU = OBJ.parent().find('b.plu');
	            if(!PLU.hasClass('reached')) PLU.addClass('reached');   

	            if(QTY == MAX)   $('body').trigger('evo_plusminus_max_reached',[NEWQTY, MAX, OBJ]);                 
	        }else{            
	            OBJ.parent().find('b.plu').removeClass('reached');
	        } 
	    });

// CAL BODY Listeners
	function EVO_Cal_Body_listeners(){
		BODY.evo_cal_lb_listeners();

		const EVO_Listeners = {
			E: {	
				B: $('body')	
			},
			init(){
				const { B } = this.E;

				// FAQ toggle
            	B.on('click.evoCal', '.evo_faq_toggle', (e) => this.handle_faq_toggle(e));
				
				// General AJAX trigger
            	B.on('click.evoCal', '.evo_trig_ajax', (e) => this.handle_general_ajax(e));

	            // Event anywhere lightbox trigger
	            B.on('click.evoCal', '.eventon_anywhere.evoajax', (e) => this.handle_event_anywhere(e));

	            // No events button click
	            B.on('click.evoCal', '.evo_no_events_btn', (e) => this.handle_no_events_btn(e));

	            // Month switch arrows
	            B.on('click.evoCal', '.evcal_arrows', (e) => this.handle_month_switch(e));

	            // Show more events
	            B.on('click.evoCal', '.evoShow_more_events', (e) => this.handle_show_more_events(e));

	            // Refresh event top (placeholder)
	            B.on('runajax_refresh_eventtop.evoCal', (e, OBJ, nonce) => this.handle_refresh_eventtop(e, OBJ, nonce));

	            // Event card slide down complete
	            B.on('evo_slidedown_eventcard_complete.evoCal', (e, event_id, obj, is_slide_down) => this.handle_slidedown_complete(e, event_id, obj, is_slide_down));

	            // Jumper month/year switch
	            B.on('calendar_month_changed.evoCal', (e, CAL) => this.handle_calendar_month_changed(e, CAL));

	            // Go to today button
	            B.on('click.evoCal', '.evo-gototoday-btn', (e) => this.handle_gototoday_btn(e));

	            // Refresh now calendar
	            B.on('runajax_refresh_now_cal.evoCal', (e, OBJ, nonce) => this.handle_refresh_now_cal(e, OBJ, nonce));

	            // Calendar header buttons
	            this.handle_cal_head_interactions();	            
	            B.on('show_cal_head_btn.evoCal', (e, obj) => this.handle_show_cal_head_btn(e, obj));
	            B.on('hide_cal_head_btn.evoCal', (e, obj) => this.handle_hide_cal_head_btn(e, obj));

	            // Tile box style 3 click
	            B.on('click.evoCal', '.ajde_evcal_calendar.boxstyle3 .eventon_list_event', (e) => this.handle_tile_box_click(e));

	            // Event card opening
	           	B.on('click.evoCal', '.eventon_list_event .desc_trig', (e) => this.handle_desc_trig(e));
	           		            
			},
			// Toggles FAQ answer visibility and updates icon
	        handle_faq_toggle(e) {
	            const toggle = $(e.currentTarget);
	            const answer = toggle.next('.evo_faq_answer');
	            const icon = toggle.find('i.fa');
	            answer.toggle();
	            icon.toggleClass('fa-plus fa-minus');
	        },
	        // Triggers general AJAX request with data from the clicked element
	        handle_general_ajax(e) {
	            const obj = $(e.target);
	            let ajax_data = obj.data();
	            $(document).data('evo_data', ajax_data);
	            this.E.B.trigger('evo_before_trig_ajax', [obj]);
	            const new_ajax_data = $(document).data('evo_data');
	            new_ajax_data['nn'] = the_ajax_script.postnonce;
	            $.ajax({
	                beforeSend: () => {
	                    this.E.B.trigger('evo_beforesend_trig_ajax', [obj, new_ajax_data]);
	                },
	                type: 'POST',
	                url: get_ajax_url('eventon_gen_trig_ajax'),
	                data: new_ajax_data,
	                dataType: 'json',
	                success: (return_data) => {
	                    this.E.B.trigger('evo_success_trig_ajax', [obj, new_ajax_data, return_data]);
	                },
	                complete: () => {
	                    this.E.B.trigger('evo_complete_trig_ajax', [obj, new_ajax_data]);
	                }
	            });
	        },
	        // Triggers lightbox for event anywhere links
	        handle_event_anywhere(e) {
	            e.preventDefault();
	            const obj = $(e.currentTarget);
	            const data = obj.data('sc');
	            if (data.ev_uxval == '4') return;
	            data['evortl'] = 'no';
	            if ('id' in data) data['event_id'] = data.id;
	            data['ux_val'] = '3a';
	            data['ajax_eventtop_show_content'] = false;
	            obj.evo_cal_lightbox_trigger(data, obj, false);
	        },

	        // Handles click on no events button
	        handle_no_events_btn(e) {
	            this.E.B.trigger('click_on_no_event_btn', [$(e.currentTarget)]);
	        },

	        // Switches calendar month on arrow click
	        handle_month_switch(e) {
	            e.preventDefault();
	            const CAL = $(e.currentTarget).closest('.ajde_evcal_calendar');
	            let dir = $(e.currentTarget).hasClass('evcal_btn_prev') ? 'prev' : 'next';
	            const cal_id = CAL.attr('id');
	            if (CAL.hasClass('evortl')) {
	                dir = dir == 'next' ? 'prev' : 'next';
	            }
	            if ($(e.currentTarget).closest('.evo_footer_nav').length > 0) {
	                const BOX = $(e.currentTarget).closest('.evo_footer_nav');
	                const offset = BOX.offset();
	                const scrolltop = $(window).scrollTop();
	                const viewport_top = offset.top - scrolltop;
	                CAL.addClass('nav_from_foot').data('viewport_top', viewport_top);
	            }
	            run_cal_ajax(cal_id, dir, 'switchmonth');
	        },

	        // Shows more events in the calendar list
	        handle_show_more_events(e) {
	            const CAL = $(e.currentTarget).closest('.ajde_evcal_calendar');
	            const SC = CAL.evo_shortcode_data();
	            const OBJ = $(e.currentTarget);
	            if (SC.show_limit_redir !== '') {
	                window.location = SC.show_limit_redir;
	                return false;
	            }
	            if (SC.show_limit_ajax == 'yes') {
	                const CURRENT_PAGED = parseInt(SC.show_limit_paged);
	                CAL.evo_update_cal_sc({ F: 'show_limit_paged', V: CURRENT_PAGED + 1 });
	                run_cal_ajax(CAL.attr('id'), 'none', 'paged');
	            } else {
	                const event_count = parseInt(SC.event_count);
	                const eventList = OBJ.parent();
	                const allEvents = eventList.find('.eventon_list_event').length;
	                const currentShowing = eventList.find('.eventon_list_event:visible').length;
	                for (let x = 1; x <= event_count; x++) {
	                    const inde = currentShowing + x - 1;
	                    eventList.find(`.eventon_list_event:eq(${inde})`).slideDown();
	                }
	                if (allEvents >= currentShowing && allEvents <= (currentShowing + event_count)) {
	                    OBJ.fadeOut();
	                }
	            }
	        },

	        // Placeholder for refreshing event top
	        handle_refresh_eventtop(e, OBJ, nonce) {},

	        // Processes event card interactions after slide down
	        handle_slidedown_complete(e, event_id, obj, is_slide_down) {
	            if (!is_slide_down) return;
	            setTimeout(() => {
	                const OO = obj.closest('.eventon_list_event');
	                evo_cal_eventcard_interactions(OO, true);
	            }, 300);
	        },

	        // Updates jumper UI when calendar month changes
	        handle_calendar_month_changed(e, CAL) {
	            const SC = CAL.evo_shortcode_data();
	            const B = CAL.find('.evo-gototoday-btn');
	            const O = CAL.find('.evo_j_container');
	            O.find('.evo_j_months a').removeClass('set');
	            O.find(`.evo_j_months a[data-val="${SC.fixed_month}"]`).addClass('set');
	            O.find('.evo_j_years a').removeClass('set');
	            O.find(`.evo_j_years a[data-val="${SC.fixed_year}"]`).addClass('set');
	            if (SC.fixed_month != B.data('mo') || SC.fixed_year != B.data('yr')) {
	                this.E.B.trigger('show_cal_head_btn', [B]);
	            } else {
	                this.E.B.trigger('hide_cal_head_btn', [B]);
	            }
	        },

	        // Navigates to today’s date on calendar
	        handle_gototoday_btn(e) {
	            const obj = $(e.currentTarget);
	            const CAL = obj.closest('.ajde_evcal_calendar');
	            const calid = CAL.attr('id');
	            CAL.evo_update_cal_sc({ F: 'fixed_month', V: obj.data('mo') });
	            CAL.evo_update_cal_sc({ F: 'fixed_year', V: obj.data('yr') });
	            run_cal_ajax(calid, 'none', 'today');
	            this.E.B.trigger('hide_cal_head_btn', [obj]);
	        },

	        // Refreshes now calendar via AJAX
	        handle_refresh_now_cal(e, OBJ, nonce) {
	            const section = OBJ.closest('.evo_eventon_live_now_section');
	            const CAL = section.find('.ajde_evcal_calendar').eq(0);
	            const dataA = {
	                nonce: evo_general_params.n,
	                other: OBJ.data(),
	                SC: CAL.evo_shortcode_data()
	            };
	            $.ajax({
	                beforeSend: () => {
	                    section.addClass('evoloading');
	                },
	                type: 'POST',
	                url: get_ajax_url('eventon_refresh_now_cal'),
	                data: dataA,
	                dataType: 'json',
	                success: (data) => {
	                    if (data.status == 'good') {
	                        section.html(data.html);
	                        this.E.B.trigger('evo_refresh_designated_elm', [OBJ, 'evo_vir_data']);
	                    }
	                },
	                complete: () => {
	                    section.removeClass('evoloading');
	                    this.E.B.find('.evo_countdowner').each(function() {
	                        $(this).evo_countdown();
	                    });
	                }
	            });
	        },

	        // Toggles visibility of calendar header buttons
	        handle_cal_head_interactions() {
	        	const { B } = this.E;
	        	B.on('click.evoCal', '.cal_head_btn', (e) => {
	        		const obj = $(e.currentTarget);
		            if (obj.hasClass('vis')) {
		                this.E.B.trigger('hide_cal_head_btn', [obj]);
		            } else {
		                this.E.B.trigger('show_cal_head_btn', [obj]);
		            }
	        	});
	        	// when a header button is clicked
				B.on('evo_cal_header_btn_clicked',function(event, O, CAL){

					var SC = CAL.evo_shortcode_data();	

					// if search is open on init > return
					if( evo_general_params.cal.search_openoninit ) return;

					if( O.hasClass('evo-search')){
						if( O.hasClass('vis')){
							CAL.find('.evo_search_bar').show(1, function(){
								$(this).find('input').focus();
							});
						}else{
							CAL.find('.evo_search_bar').hide();
						}
					}

					// hide the search
					if( O.hasClass('evo-sort-btn') || O.hasClass('evo-filter-btn')){
						CAL.find('.evo_search_bar').hide();
					}
				});
	            
	        },

	        // Shows calendar header button
	        handle_show_cal_head_btn(e, obj) {
	            if (!obj.hasClass('evo-gototoday-btn')) {
	                obj.siblings(':not(.evo-gototoday-btn)').removeClass('show vis');
	            }
	            obj.addClass('show vis');
	            const CAL = obj.closest('.ajde_evcal_calendar');
	            this.E.B.trigger('evo_cal_header_btn_clicked', [obj, CAL, 'show']);
	        },

	        // Hides calendar header button
	        handle_hide_cal_head_btn(e, obj) {
	            const CAL = obj.closest('.ajde_evcal_calendar');
	            obj.removeClass('show vis');
	            this.E.B.trigger('evo_cal_header_btn_clicked', [obj, CAL, 'hide']);
	        },

	        // Triggers desc_trig click for tile box style 3
	        handle_tile_box_click(e) {
	            e.preventDefault();
	            e.stopPropagation();
	            $(e.currentTarget).find('.desc_trig').trigger('click');
	        },

	        // Handles event card opening with various user interactions
	        handle_desc_trig(e) {
	        	e.preventDefault();
	            const $this = $(e.currentTarget);
	            const $eventBox = $this.closest('.eventon_list_event');
	            
	            const $cal = $this.closest('.evo_lightbox').data('cal_id') ?
	                $('#' + $this.closest('.evo_lightbox').data('cal_id')) :
	                $this.closest('.ajde_evcal_calendar');
	            const SC = $cal.evo_shortcode_data();
	            const ux_val = $cal.evo_cal_event_get_uxval(SC, $this);
	            const event_id = $eventBox.data('event_id');
	            const exlk = $this.data('exlk');
	            const isSingleEventBox = $this.closest('.eventon_single_event').length > 0 && $cal.find('.evo-data').data('exturl');

	            const actions = {
	                '3': () => this.open_lightbox($this, $cal, SC, event_id, $eventBox, ux_val),
	                '3a': () => this.open_lightbox($this, $cal, SC, event_id, $eventBox, ux_val),
	                '4': () => this.open_url($this, $this.attr('href') || $this.parent().siblings('.evo_event_schema').find('a').attr('href'), '_self'),
	                '4a': () => this.open_url($this, $this.attr('href') || $this.parent().siblings('.evo_event_schema').find('a').attr('href'), '_blank'),
	                '2': () => this.handle_external_link($this, isSingleEventBox),
	                'X': () => false,
	                'none': () => false,
	                'default': () => exlk === '1' ? this.handle_external_link($this, isSingleEventBox) : this.slide_down_event_card($this, $eventBox, $cal, SC, event_id)
	            };

	            return (actions[ux_val] || actions['default'])();
	        },

	        // Opens lightbox for event content
	        open_lightbox($trigger, $cal, SC, event_id, $eventBox, ux_val) {
	            const repeat_interval = parseInt($eventBox.data('ri')) || 0;
	            const etttc_class = $cal.attr('class').split(' ').find(cls => cls.startsWith('etttc_')) || '';
	            const new_SC_data = {
	                ...SC,
	                repeat_interval,
	                event_id,
	                ux_val,
	                evortl: $trigger.closest('.eventon_events_list').hasClass('evortl') ? 'yes' : 'no',
	                ajax_eventtop_show_content: true,
	                additional_class: etttc_class
	            };
	            $cal.evo_cal_lightbox_trigger(new_SC_data, $trigger, $cal);
	            return false;
	        },

	        // Opens a URL in specified target
	        open_url($this, url, target) {
	        	target = $this.attr('target') === '_blank' ? '_blank' : target;
			    if (url) window.open(url, target);
			    return target === '_blank';
	        },

	        // Handles external link navigation
	        handle_external_link($trigger, isSingleEventBox) {
	            if (isSingleEventBox) return false;
	            const url = $trigger.attr('href');
	            if (url) {
	                window.open(url, $trigger.attr('target') === '_blank' ? '_blank' : '_self');
	            }
	            return !!url;
	        },

	        // Slides down event card and loads map if present
	        slide_down_event_card($trigger, $eventBox, $cal, SC, event_id) {
	            const $content = $eventBox.find('.event_description');
	            const isOpen = $content.hasClass('open');
	            if (SC.accord === 'yes') {
	                $cal.find('.eventon_list_event').removeClass('open');
	                $cal.find('.event_description').slideUp().removeClass('open');
	            }
	            $eventBox.toggleClass('open', !isOpen);
	            $content[isOpen ? 'slideUp' : 'slideDown']().toggleClass('open', !isOpen);
	            if ($eventBox.find('.evo_metarow_gmap').length) {
	                $eventBox.find('.evo_metarow_gmap').evo_load_gmap({ trigger_point: 'slideDownCard' });
	            }
	            if ($trigger.data('runjs')) {
	                this.E.B.trigger('evo_load_single_event_content', [event_id, $trigger]);
	            }
	            this.E.B.trigger('evo_slidedown_eventcard_complete', [event_id, $trigger, !isOpen]);
	            return false;
	        }
		}

		EVO_Listeners.init();		
	}

// Global Calendar Listeners and Interactions
	function EVO_Interactions(){
		const interactions_class = {
			E:{ B: $('body')},
			run(){
				const { B } = this.E;
				this.evoLightboxEnd();
				this.evocardNavTrig();
				this.evoMapExpandTrig();
				this.handle_lightbox_processed();
				this.handle_calendar_interactions();
				this.handle_global_listners();
				this.handle_tabs();
				this.handle_aria_population();
			},

			handle_aria_population() {
				const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			   	const gen = () => Array.from({length:9},()=>chars[Math.floor(Math.random()*62)]).join('');
			  	const used = new Set();

			  	$('.evo_aria_ready').each(function() {
			  		const $label = $(this);
			  		let $unique_label = $label.text().trim();

				    const $i = $label.siblings('.evo_aria_ready_match').first();
				    if (!$i.length) return;			    

				    //$label.removeClass('evo_aria_ready');
				    let id;
				    do { id = gen(); } while (used.has(id));
				    used.add(id);

				    $unique_label = $unique_label.replace(/\[[^\]]*\]/, '['+id+']');
				    $label.html( $unique_label );
				    $i.attr('aria-label', $unique_label );

				    $(this).attr('for', id);
				    $i.attr('id', id).removeAttr('aria-label');
				});
			},
			evoLightboxEnd() {
		        this.E.B.on('evolightbox_end', (event, LB, CAL) => {
		            setTimeout(() => {
		                LB.find('.eventon_list_event').each(function() {
		                    evo_cal_eventcard_interactions($(this), true);
		                });
		                _evo_run_eventcard_map_load();
		                LB.evo_cal_localize_time();
		                this.handle_aria_population();
		            }, 1000);
		        });

		        // eventcard lightbox event navigation @version 4.9.2
		        this.E.B.on('evolightbox_end', (e, LB, CAL, OO) => {
		            if (!evo_general_params.cal.lbnav) return;
		            if (evo_general_params.cal.lbnav === 'no') return;
		            if (OO === undefined || !('other_data' in OO)) return;

		            const event = $(OO.other_data.obj).closest('.event');
		            const calId = (CAL ? CAL.attr('id') : '');
		            const buttons = [
		                { dir: 'prev', icon: 'left', sibling: event.prev('.event') },
		                { dir: 'next', icon: 'right', sibling: event.next('.event') }
		            ].filter(b => b.sibling.length)
		             .map(b => `
		                <div class='evocard_lb_navs'>
		                    <button class='evocard_nav_trig ${b.dir} evoposa evocurp evohoop7 evobr30 evobgcw evodfx evofxjcc evofxaic evo_transit_all evoboxbb' data-id='${b.sibling.attr('id')}' data-cid='${calId}'>
		                        <i class='fa fa-chevron-${b.icon}'></i>
		                    </button>
		                </div>
		            `).join('');

		            LB.find('.evolb_box').append(buttons);
		            setTimeout(() => LB.find('.evocard_nav_trig').addClass('show'), 500);
		        });
		    },
		    evocardNavTrig(){
		    	this.E.B.on('click','.evocard_nav_trig',function(e){
					e.preventDefault();
				    const $el = $(e.currentTarget);
				    const CAL = $('#' + $el.data('cid'));
				    const SC = CAL.evo_shortcode_data();
				    const eventId = $el.data('id').split('_')[1];
				    const newEvent = CAL.find(`#${$el.data('id')}`);
				    const newEventTrigger = newEvent.find('.desc_trig');
				    const LB = $el.closest('.evo_lightbox');

				    LB.find('.evocard_nav_trig').fadeOut().addClass('old');
				    setTimeout(() => LB.find('.evocard_lb_navs').has('.old').remove(), 500);

				    LB.evo_lightbox_show_open_animation({ animation_type: 'saving' });

				    const updatedSC = {
				        ...SC,
				        repeat_interval: parseInt(newEvent.data('ri')),
				        ux_val: CAL.evo_cal_event_get_uxval(SC, newEventTrigger),
				        event_id: eventId,
				        ajax_eventtop_show_content: true,
				        evortl: newEvent.find('.eventon_events_list').hasClass('evortl') ? 'yes' : 'no',			
				        additional_class: CAL.attr('class').match(/etttc_\w+/)?.[0] || '',
				    };

				    const newLbClass = "evo_eventcard_"+eventId;
				    LB.removeClass(LB.data('lbc')).addClass(newLbClass).data('lbc', newLbClass);

				    setTimeout(() => CAL.evo_cal_lightbox_trigger(updatedSC, newEventTrigger, CAL, LB), 1000);
				});
		    },
		    evoMapExpandTrig(){
		    	this.E.B.on('click','.evo_map_expand_trig',function(e){
					e.preventDefault();

					const $gmapDiv = $(this).closest('.evo_map').find('.evo_metarow_gmap');
					const mapID = $gmapDiv.attr('id')+'_exp';
					const $newDiv = $('<div id="'+ mapID +'" class="evo_lb_map evobr15" style="min-height:calc(100vh - 120px);"></div>');
					const locationAdd = $gmapDiv.data('address');
					const locationName = $gmapDiv.data('name');

					const extra = `<div class='evodfx evofxdrr evofxaic evogap10 evomarr50'>
							<input id="user-address-${mapID}" type="text" placeholder="Enter starting address"/>
							<button id="get-directions-${mapID}" class='evo_nonbtn'><i class='fa fa-circle-arrow-right'></i></button>
							<i class='fa fa-route evofz24i evocurp evoop5 evohoop7'></i>
							<button class='evo_nonbtn evoff_2 evocurp evohoop7 evoop5'><i class='fa fa-calendar evomarr10 evofz24i'></i>More Events</button>
						</div>`;
					const $topDiv = `<div class='evodfx evofxdrr evogap10 evofxjcsb evofxaic evomarb10'>
						<div class='evodfx evofxdrr evofxaic evogap10'>
							<p class='evoff_1i evomar0i evofz18i'>${locationName}</p>
							<p class='evomar0i evofz14i'>${locationAdd}</p>
						</div>
						</div>`;
					const $botDiv = ``;

					// Copy only data attributes, not content
					$.each($gmapDiv.data(), function(key, value) {
					    $newDiv.data(key, value).attr('data-'+key, value);
					});
					const calID = $(this).closest('.ajde_evcal_calendar').attr('id');
					$(this).evo_lightbox_open({
						uid: 'evo_map_expand',calid: calID,
						lbdata:{ class:'evo_map_expand',content: $topDiv + $newDiv[0].outerHTML + $botDiv }
					});
				});
		    },
		    handle_lightbox_processed(){
		    	this.E.B.on('evo_lightbox_processed',function(e, OO, LB){
		    		if( OO.uid == 'evo_map_expand'){
						//console.log(OO);
						setTimeout(function(){
							LB.find('.evo_lb_map').evo_load_gmap({	cal: $('body').find('#'+ OO.calid)	});
						}, 500);						
					}
				}).on('evo_ajax_success_evo_open_eventcard_lightbox', function( e, OO, data, el){
					//console.log(OO);
					setTimeout(function(){
						LB.find('.evcal_gmaps').evo_load_gmap({	cal: $('body').find('#'+ OO.d.calid)	});
					}, 500);	
				});
		    },

		    // Calendar
		    handle_calendar_interactions(){
		    	const { B } = this.E;
		    	B.find('.ajde_evcal_calendar').each( (index, calendar) => {

		    		const $calendar = $(calendar);
		    		const $SC = $calendar.evo_shortcode_data();

			        // Bubble tooltip for events in calendars with 'bub' class
			        if ($calendar.hasClass('bub')) {
			            $calendar.on('mouseover.evoCal', '.eventon_list_event', (e) => {
			                const $event = $(e.currentTarget);
			                const $list = $event.closest('.eventon_events_list');
			                const title = $event.find('.evoet_dayblock').data('bub');
			                const position = $event.position();

			                $list.append(`<span class="evo_bub_box">${title}</span>`);
			                const $bubble = $list.find('.evo_bub_box');

			                let left = position.left;
			                let top = position.top - $bubble.height() - 30;

			                // Adjust bubble position if it exceeds list width
			                const listWidth = $list.width();
			                const totalWidth = position.left + $bubble.width() + $event.width();
			                if (totalWidth > listWidth) {
			                    left = position.left - $bubble.width() + $event.width() - 20;
			                }

			                $bubble.css({ top, left }).addClass('show');
			            }).on('mouseout.evoCal', '.eventon_list_event', (e) => {
			                $(e.currentTarget).closest('.eventon_events_list').find('.evo_bub_box').remove();
			            });
			        }

			        // Jumper button toggle
			        $calendar.on('click.evoCal', '.evo-jumper-btn', (e) => {
			            const $this = $(e.currentTarget);
			            $this.closest('.calendar_header').find('.evo_j_container').toggle();
			            $this.toggleClass('vis');
			        });

			        // select a new time from jumper
			        $calendar.on('click','.evo_j_dates a',function(){
						var val = $(this).attr('data-val'),
							type = $(this).parent().parent().attr('data-val'),
							CAL = $calendar,
							SC = CAL.evo_shortcode_data();

						if(type=='m'){ // change month
							CAL.evo_update_cal_sc({F:'fixed_month', V: val });
						}else{
							CAL.evo_update_cal_sc({F:'fixed_year', V: val });
						}

						run_cal_ajax( CAL.attr('id') ,'none','jumper');
						
						// hide month jumper if not set to leave expanded
						if(SC.expj =='no')	container.delay(2000).slideUp();
					});

					// view switcher
					$calendar.on('click', '.evo_vSW',function(){
						const O = elm = $(this);
						var DATA = O.data('d');
						if(O.hasClass('focusX')) return;
						CAL = $calendar;

						// remove other additions from other views
						CAL.find('.evoADDS').hide().delay(200).queue(function(){
							$(this).remove();
						});

						var SC = $SC;
						const cal_tz = CAL.evo_get_global({S1:'cal_def',S2:'cal_tz'});
						var reload_cal_data = false;
						
						// Create date object
							_M1 = moment().set({'year': SC.fixed_year, 'month': ( SC.fixed_month -1 ), 'date':SC.fixed_day}).tz( cal_tz );
							_M1.set('date',1).startOf('date');
							_start = _M1.unix();
							_M1.endOf('month').endOf('date'); // move to end of month
							_end = _M1.unix();

						// DEP
							var DD = new Date(SC.fixed_year,SC.fixed_month -1 , SC.fixed_day, 0,0,0 );
							DD.setUTCHours(0);
							DD.setUTCFullYear( SC.fixed_year );
							DD.setUTCMonth( SC.fixed_month -1 );
							DD.setUTCDate( SC.fixed_day );

						// switch to normal
							O.siblings('.evo_vSW').removeClass('focusX select');					
							O.addClass('focusX select');
							CAL.find('.evo-viewswitcher-btn em').html( O.html() );
							O.closest('.evo_cal_view_switcher').removeClass('show');

						// ux_val for specific cal
							if( DATA && 'ux_val' in DATA)	CAL.evo_update_cal_sc({F:'ux_val', V: DATA.ux_val });

						// calendar class toggling
							O.siblings('.evo_vSW').each(function(){
								var _d = $(this).data('d');
								if( _d && 'c' in _d )	CAL.removeClass( _d['c'] ); // remove other cls
							});
							if( DATA && 'c' in DATA)	CAL.addClass( DATA.c );
					

						// process date times block
							CAL.find('.evoet_dayblock span').hide();
							CAL.find('.evoet_dayblock span.evo_start').show();
							CAL.find('.evoet_dayblock span.evo_end').show();
							CAL.find('.evoet_dayblock span.evo_end.only_time').hide();

						// if current date range is not a month load those unix
						if( SC.focus_start_date_range != _start && SC.focus_end_date_range != _end ){
							reload_cal_data = true;
							CAL.evo_update_cal_sc({F:'focus_start_date_range',V: _start });
							CAL.evo_update_cal_sc({F:'focus_end_date_range', V: _end });
						}

						// treating events list based on dif preferences--  vals el_visibility = hide_events, show_events
							if( 'el_visibility' in DATA){
								el_visibility = DATA.el_visibility;

								if( el_visibility =='show_events') CAL.find('.eventon_list_event').show();
								if( el_visibility =='hide_events') CAL.find('.eventon_list_event').hide();
								if( el_visibility =='hide_list') CAL.find('#evcal_list').addClass('evo_hide').hide();
								if( el_visibility =='show_all'){
									CAL.find('#evcal_list').removeClass('evo_hide').show();
									CAL.find('.eventon_list_event').show();
								} 
							}				

						CAL.evo_update_cal_sc({F:'calendar_type', V: 'default'});
						
						B.trigger('evo_vSW_clicked_before_ajax', [ O, CAL, DD, reload_cal_data ]);

						// run ajax to load new events in the range
							if( reload_cal_data ){
								B.trigger('evo_run_cal_ajax',[CAL.attr('id'),'none','filering']);
							}else{
								B.trigger('evo_vSW_clicked_noajax', [ O, CAL ]); // @s4.6
							}
												
						B.trigger('evo_vSW_clicked', [ O, CAL, DD, reload_cal_data]);

						// switching to and from tiles view
							if( elm.hasClass('evoti')){
								CAL.find('.eventon_list_event').each(function(){
									color = $(this).data('colr');
									$(this).find('a.desc_trig').css({'background-color': color});
								});
								CAL.addClass('color').removeClass('sev').data('oC', 'sev');
							}else{
								if( CAL.hasClass('esty_0') || CAL.hasClass('esty_4') ){
									CAL.removeClass('color');
									CAL.find('.eventon_list_event').each(function(){
										$(this).find('a.desc_trig').css({'background-color': ''});
									});
									if( CAL.data('oC') !== undefined) CAL.addClass( CAL.data('oC'));
								}
							}

					});
		    	});
		    },		  

		    // Global  
		    handle_global_listners(){
		    	const { B } = this.E;
		    	B.on('evo_trigger_cal_reset', function(event, cal){
					cal_resets( cal );
				});
				B.on('click', function(event) {
					BODY.trigger('clicked_on_page', [ $(event.target) , event ]);
				});
				B.find('.evo_location_map').each(function(){			
					$(this).evo_load_gmap();
				});
				// on event card lightbox load -> taxonomy details @since 4.2 u4.6
				B.on('evo_ajax_complete_eventon_get_tax_card_content', function(event,  OO){
			
					LB = B.find('.'+ OO.lightbox_key);

					setTimeout(function(){
						// run map load
						if( LB.find('.evo_trigger_map').length > 0 ){
							map_id_elm = LB.find('.evo_trigger_map');			
							map_id_elm.evo_load_gmap();
							console.log('Loading Event Map');
						}
						
						// run countdown timers
						LB.find('.evo_countdowner').each(function(){
							$(this).evo_countdown();
						});

						// run calendar filtering function
						CAL = LB.find('.ajde_evcal_calendar');
						if (CAL.length) CAL.evo_cal_filtering();
					},500);		
				});
		    },
		    // Tab view switcher
		    handle_tabs(){
		    	const { B } = this.E;
		    	B.find('.evo_tab_container').each(function(){
					$(this).find('.evo_tab_section').each(function(){
						if(!$(this).hasClass('visible')){
							$(this).addClass('hidden');
						}
					});
				});
				B.on('click','.evo_tab',function(){
					tab = $(this).data('tab');
					tabsection = $(this).closest('.evo_tab_view').find('.evo_tab_container');
					tabsection.find('.evo_tab_section').addClass('hidden').removeClass('visible');
					tabsection.find('.'+tab).addClass('visible').removeClass('hidden');

					$(this).parent().find('.evo_tab').removeClass('selected');
					$(this).addClass('selected');

					B.trigger('evo_tabs_newtab_selected',[ $(this)]);
				});
		    },

		};

		interactions_class.run();
	}

// EVO ON
	const EVO = {

		E:{
			B: $('body')
		},
		init(){
			this.Tools.init();
			this.Interactions.init();
			this.Virtual_Events.init();
			this.Search.init();
			this.Elements_Interactions.init();
			// Global event listeners (e.g., heartbeat, resize)
        	this.setupGlobalListeners();
        	this.schedule_view();
        	this.ajax_triggers();
		},

		setupGlobalListeners(){
			const { B } = this.E;
			// Heartbeat hooks
	        $(document).on('heartbeat-send', (e, data) => {
	            if (this.BODY && this.BODY.find('.evo_refresh_on_heartbeat').length) {
	                this.BODY.find('.evo_refresh_on_heartbeat').each((i, el) => {
	                    if ($(el).closest('.eventon_list_event').length <= 0) return;
	                    if ($(el).data('refresh') !== undefined && !$(el).data('refresh')) return;

	                    data['evo_data'] = EVO.Tools.build_elm_refresh_data($(el));
	                });
	            }
	        });

	        $(document).on('heartbeat-tick', (e, data) => {
	            EVO.Tools.evo_apply_refresh_content(data);
	        });

			// Other global events
	        B.on('evo_refresh_elements', (e, send_data) => {
	            if (!send_data || send_data.length <= 0) return;

	            send_data['nonce'] = evo_general_params.n;

	            $.ajax({
	                beforeSend: () => {
	                    if ('evo_data' in send_data) {
	                        $.each(send_data.evo_data, (ekey, eclasses) => {
	                            $.each(eclasses, (classnm, val) => {
	                                if (val && 'loader' in val && val.loader && 'loader_class' in val) {
	                                    $('#event_' + ekey).find('.' + val.loader_class).addClass('evoloading');
	                                }
	                            });
	                        });
	                    }
	                },
	                type: 'POST',
	                url: EVO.Tools.get_ajax_url('eventon_refresh_elm'),
	                data: send_data,
	                dataType: 'json',
	                success: (data) => {
	                    if (data.status === 'good') {
	                        EVO.Tools.evo_apply_refresh_content(data);
	                    }
	                },
	                complete: () => {
	                    if ('evo_data' in send_data) {
	                        $.each(send_data.evo_data, (ekey, eclasses) => {
	                            $.each(eclasses, (classnm, val) => {
	                                if (val && 'loader' in val && val.loader && 'loader_class' in val) {
	                                    $('#event_' + ekey).find('.' + val.loader_class).removeClass('evoloading');
	                                }
	                            });
	                        });
	                    }
	                }
	            });
	        });
	        // refresh the closest hearbeat run parent
			B.on('evo_refresh_designated_elm', function(ee, elm, elm_class, extra_data){
				//get closest event object
				const event = $(elm).closest('.eventon_list_event');
	            if (!event || event.find('.' + elm_class).length === 0) return;

	            const refresh_elm = event.find('.' + elm_class);
	            let send_data = {};	

				send_data['evo_data'] = EVO.Tools.build_elm_refresh_data( refresh_elm , extra_data);				
				B.trigger('evo_refresh_elements',[ send_data ]);
			});

		},
		schedule_view(){
			EVO.E.B.on('evo_init_ajax_success_each_cal',function(event, data, i, v, CAL){
				$('body').find('.ajde_evcal_calendar.evoSV').each(function(){
					EVO.Tools.evosv_populate( $(this) );
				});
			})
			.on('evo_main_ajax_before_fnc', function(event, CAL,  ajaxtype, data_arg){
				SC = data_arg.shortcode;
				if( SC.calendar_type == 'schedule'){
					CAL.find('#evcal_list').removeClass('evo_hide').show();
				}
			}).on('evo_main_ajax_success', function(event, CAL,  ajaxtype, data , data_arg){
				SC = data_arg.shortcode;
				if( SC.calendar_type == 'schedule'){
					CAL.find('#evcal_list').addClass('evo_hide').hide();
				}
			}).on('evo_main_ajax_complete', function(event, CAL,  ajaxtype, data , data_arg){
				SC = data_arg.shortcode;
				if( SC.calendar_type == 'schedule'){
					EVO.Tools.evosv_populate( CAL );
				}
			})
			// view switching
			.on('evo_vSW_clicked_before_ajax',function(event, O, CAL, DD, reload_cal_data){
				if(!(O.hasClass('evosv'))) return;
				var SC = CAL.evo_shortcode_data();

				CAL.evo_update_cal_sc({F:'calendar_type', V: 'schedule'});
				CAL.evo_update_cal_sc({F:'fixed_day', V: SC.fixed_day });

			})
			.on('evo_vSW_clicked',function(event, OBJ, CAL, DD, reload_cal_data){
				if(!(OBJ.hasClass('evosv'))) return;						
				CAL.evo_update_cal_sc({F:'calendar_type', V: 'schedule'});
			})
			.on('evo_vSW_clicked_noajax',function(event, OBJ, CAL, DD, reload_cal_data){
				if(!(OBJ.hasClass('evosv'))) return;						
				EVO.Tools.evosv_populate( CAL );		
			})
			// open events from schedule view
			.on('click','.evosv_items',function(event, elm){
				O = $(this);
				CAL = O.closest('.ajde_evcal_calendar');
				var e_cl = 'event_'+O.data('id');
				
				const clicked_event_uxval = O.data('uxval');

				// if event is set to slide down .. switch to lightbox
				if( clicked_event_uxval == '1' ){
					CAL.find('.'+e_cl).find('.desc_trig').data('ux_val', 3);
				}

				CAL.find('.'+e_cl).find('.desc_trig').trigger('click');
			});
		},
		Interactions:{
			init(){
				const { B } = EVO.E;
			},

		},
		Search:{
			init(){
				const { B } = EVO.E;
				B.on('click.evoSearch', '.evo_do_search', (event) => {
		            EVO.Tools.do_search_box($(event.target));
		        });
		        B.on('keypress.evoSearch', '.evo_search_field', (ev) => {
	                if ((ev.keyCode || ev.which) === 13) {
	                    EVO.Tools.do_search_box($(ev.target).siblings('.evo_do_search'));
	                }
	            });
	            B.on('keypress.evoSearch', '.evo_search_bar_in_field', (ev) => {
	                if ((ev.keyCode || ev.which) === 13) {
	                    EVO.Tools.search_within_calendar( $(ev.target) );
	                }
	            });
	            B.on('click', '.evosr_search_clear_btn', function(e) {
				    e.preventDefault(); EVO.Tools.reset_search($(this).siblings('input'), $(this));
				});
				B.on('evo_main_ajax_complete', function(e, CAL, ajaxtype, responseJSON, data) {
					if (ajaxtype === 'search' && data.shortcode['s']) {
				        CAL.find('.evosr_search_clear_btn').addClass('show');
				    }
				});
				// Handle search input interactions
				B.on({
					'click': function() { EVO.Tools.search_within_calendar($(this).siblings('input')); },
				    'keyup': function(e) {
				        const $input = $(this), $clearBtn = $input.siblings('.evosr_search_clear_btn');
				        if (e.which === 27) { e.preventDefault(); EVO.Tools.reset_search($input, $clearBtn); return; }
				        $clearBtn.toggleClass('show', $input.val().trim() !== '');
				    }		    
				}, '.evo_search_bar_in_field, .evosr_search_btn');
			}			
		},
		Elements_Interactions:{
			init(){
				const { B } = EVO.E;
				// increase and reduce quantity
			    B.on('click','.evo_qty_change', function(event){
			        var OBJ = $(this);
			        var QTY = oQTY = parseInt(OBJ.siblings('em').html());
			        var MAX = OBJ.siblings('input').attr('max');
			        var BOX = OBJ.closest('.evo_purchase_box');

			        var pfd = BOX.find('.evo_purchase_box_data').data('pfd');			        

			        (OBJ.hasClass('plu'))?  QTY++: QTY--;

			        QTY =(QTY==0)? 1: QTY;
			        QTY = (MAX!='' && QTY > MAX)? MAX: QTY;

			        // new total price
			        var sin_price = OBJ.parent().data('p');
			        new_price = sin_price * QTY;

			        new_price = EVO.Tools.get_format_price( new_price, pfd);

			        BOX.find('.total .value').html( new_price);

			        OBJ.siblings('em').html(QTY);
			        OBJ.siblings('input').val(QTY);

			        B.trigger('evo_qty_changed',[QTY,oQTY, new_price,OBJ ]);
			    });
			}
		},
		Virtual_Events:{
			init(){
				const { B } = EVO.E;
				this.jitsi();
				// record sign in - virtual plus // @+3.1
				B.on('click','.evo_vir_signin_btn',function(){
								
					let extra_data = {};
					extra_data['signin'] = 'y';
					extra_data['refresh_main'] = 'y';
					extra_data['loader'] = true;
					extra_data['loader_class'] = 'evo_vir_main_content';

					B.trigger('evo_refresh_designated_elm',[ $(this) , 'evo_vir_data',extra_data]);
				});
			},
			jitsi( mod_refresh){
				const { B } = EVO.E;
				const domain = 'meet.jit.si';
			    let api = [];

			    B.find('.evo-jitsi-wrapper').each(function(index, element) {
			    	const O = $(this);
			    	const eventO = O.closest('.eventon_list_event');

			    	if( mod_refresh != '' && mod_refresh == 'mod_refresh_no' && O.hasClass('mod')) return;

			        const roomName = $(element).data('n');
		            const width = $(element).data('width');
		            const height = $(element).data('height');
		            const audioMuted = $(element).data('audiomute');
		            const videoMuted = $(element).data('videomute');
		            const screenSharing = $(element).data('screen');
	           
			        const myOverwrite =
					{
					 	'TOOLBAR_BUTTONS': $(element).data('d'),
					    "DEFAULT_BACKGROUND": '#494a4e',
					    'MOBILE_APP_PROMO': false,
					    'SETTINGS_SECTIONS':['devices', 'language', 'profile', 'calendar'],
					};
			        const options = {
			            roomName,
			            width,
			            height,
			            parentNode: element,	            
			            configOverwrite: { 
			            	startWithAudioMuted: audioMuted,
			                startWithVideoMuted: videoMuted,
			                startScreenSharing: false,	  
			                disableInviteFunctions: false,             
			            },
			            interfaceConfigOverwrite: myOverwrite,     
			        };

			       	api = new JitsiMeetExternalAPI(domain, options);      

			        api.addEventListener('participantRoleChanged', function(event){

			        	// record moderator joined
			        	if (event.role === "moderator"){	        		
			        		this._record_moderator_join( 'yes', eventO.data('event_id'), eventO.data('ri'));
			        	}

			        	const pp = jQuery(element).data('p');
			        	if (event.role === "moderator" && pp != '__') {
			        		ppp = pp.replace('_','');
					        api.executeCommand('password', ppp);
					    }	        	
			        });	

			        // moderator leave	        
			        api.addEventListener('videoConferenceLeft', function(event){
			        	if( eventO.find('.evo_vir_data').data('ismod') =='y'){
			        		this._record_moderator_join( 'no', eventO.data('event_id'), eventO.data('ri'));
			        		O.siblings('.evo_vir_mod_left').show();
			        		O.hide();
			        	}
			        });
			    });
			},
			// record moderator logins for jitsi
			_record_moderator_join(joined, eid, ri){
				var data_arg = {
					'action': 'eventon_record_mod_joined',
					'eid': eid,
					'ri': ri,
					'joined': joined,
					'nonce': evo_general_params.n,				
				};

				$.ajax({
					beforeSend: function(){},
					type: 'POST',url: ajax_url,
					data: data_arg,dataType:'json',
					success:function(data){	}
				});
			}
		},
		ajax_triggers(){
			const { B } = EVO.E;
			B.on('evo_before_trig_ajax',function(event, obj){
				if(!obj.hasClass('evo_trig_vir_end')) return;
				
				var new_ajax_data = $(document).data( 'evo_data');
				new_ajax_data['fnct'] = 'mark_event_ended';
				$(document).data( 'evo_data', new_ajax_data );
				
			})
			.on('evo_beforesend_trig_ajax',function( event, obj, new_ajax_data){
				if(!obj.hasClass('evo_trig_vir_end')) return;

				obj.closest('.evo_vir_mod_box').addClass('evoloading');
			})
			.on('evo_success_trig_ajax',function( event, obj, new_ajax_data, return_data){
				if(!obj.hasClass('evo_trig_vir_end')) return;

				// if virtual events were marked as ended
				if(!('_vir_ended' in return_data)) return;

				// refresh the virtual main content
				extra_data = {};
				extra_data['refresh_main'] = 'yy';
				extra_data['loader'] = true;
				extra_data['loader_class'] = 'evo_vir_main_content';

				//console.log(extra_data);

				B.trigger('evo_refresh_designated_elm',[ obj , 'evo_vir_data',extra_data]);
			})
			.on('evo_complete_trig_ajax',function( event, obj, new_ajax_data){
				if(!obj.hasClass('evo_trig_vir_end')) return;
				obj.closest('.evo_vir_mod_box').removeClass('evoloading');
			});
		},
		Tools:{
			init() {
				const { B } = EVO.E;  
				//const { B } = EVO.E;
	            // Bind AJAX listeners once
	            B.on('evo_ajax_beforesend_evo_get_search_results', (event, OO, el) => {
	            	$(el).find('.evo_search_results_count').hide();
	                $(el).addClass('searching');
	            }).on('evo_ajax_complete_evo_get_search_results', (event, OO, el) => {
	                $(el).removeClass('searching');
	            }).on('evo_ajax_success_evo_get_search_results', (event, OO, data, el) => {
	                $(el).find('.evo_search_results').html(data.content);
	                if ($(el).find('.no_events').length === 0) {
	                    const Events = $(el).find('.eventon_list_event').length;
	                    $(el).find('.evo_search_results_count span').html(Events);
	                    $(el).find('.evo_search_results_count').fadeIn();
	                }
	            });
			},
			do_search_box( OBJ ){
				const { B } = EVO.E;
				const SearchVal = OBJ.closest('.evosr_search_box').find('input').val();
				const Evosearch = OBJ.closest('.EVOSR_section');
				OBJ.closest('.evo_search_entry').find('.evosr_msg').toggle( !SearchVal );

				if (!SearchVal) return false;			

				var ajax_results = Evosearch.evo_admin_get_ajax({
					'ajaxdata': {
						//action: 		'eventon_search_evo_events',
						search: 		SearchVal,
						shortcode:  	Evosearch.find('span.data').data('sc'),
						nonce: 			evo_general_params.n				
					},
					ajax_type:'endpoint',
					ajax_action:'eventon_search_evo_events',
					uid:'evo_get_search_results',
					end: 'client',
				});
			},
			// Search function
			search_within_calendar($input) {
			    const ev_cal = $input.closest('.ajde_evcal_calendar');
			    ev_cal.evo_update_cal_sc({ F: 'show_limit_paged', V: '1' });
			    ev_cal.evo_update_cal_sc({ F: 's', V: $input.val() });
			    run_cal_ajax(ev_cal.attr('id'), 'none', 'search');
			    return false;
			},

			// Reset search function
			reset_search($input, $clearBtn) {
			    const ev_cal = $input.closest('.ajde_evcal_calendar');
			    ev_cal.evo_update_cal_sc({ F: 's', V: '' });
			    run_cal_ajax(ev_cal.attr('id'), 'none', 'search');
			    $input.val('');
			    $clearBtn.removeClass('show');
			},

			// Total formating
	        get_format_price(price, data){

	            // price format data
	            PF = data;
	           
	            totalPrice = price.toFixed(PF.numDec); // number of decimals
	            htmlPrice = totalPrice.toString().replace('.', PF.decSep);

	            if(PF.thoSep.length > 0) {
	                htmlPrice = EVO.Tools._addThousandSep(htmlPrice, PF.thoSep);
	            }
	            if(PF.curPos == 'right') {
	                htmlPrice = htmlPrice + PF.currencySymbol;
	            }
	            else if(PF.curPos == 'right_space') {
	                htmlPrice = htmlPrice + ' ' + PF.currencySymbol;
	            }
	            else if(PF.curPos == 'left_space') {
	                htmlPrice = PF.currencySymbol + ' ' + htmlPrice;
	            }
	            else {
	                htmlPrice = PF.currencySymbol + htmlPrice;
	            }
	            return htmlPrice;
	        },
	        _addThousandSep(n, thoSep){
	            var rx=  /(\d+)(\d{3})/;
	            return String(n).replace(/^\d+/, function(w){
	                while(rx.test(w)){
	                    w= w.replace(rx, '$1'+thoSep+'$2');
	                }
	                return w;
	            });
	        },

	        // apply refresh event element content with matching data that is sent
			evo_apply_refresh_content(data){
				const { B } = EVO.E;          
				if (!('evo_data' in data)) return;

				$.each(data.evo_data, function(eclass, boxes){
					// if event exists in the page

					var vir_data_vals = false;
					if( 'evo_vir_data' in boxes) vir_data_vals = boxes.evo_vir_data.data;

					B.find('.'+eclass).each(function(){
						const event_elm = $(this);
						$.each(boxes, (boxclass, boxdata) => {
							//console.log(boxdata);
							if( boxdata == '') return;
		                    if (!boxdata.html || event_elm.find('.' + boxclass).length <= 0) return;
		                    event_elm.find('.' + boxclass).html(boxdata.html);
		                });

						// only for virtual event update
						if( vir_data_vals ){

							// reload jitsi for main content - if main content html is sent it will refresh
								if( vir_data_vals && ('vir_type' in vir_data_vals) 
									&& vir_data_vals.vir_type == 'jitsi' 
									&& ('evo_vir_main_content' in boxes) 
									&& ('html' in boxes.evo_vir_main_content)  
									&& boxes.evo_vir_main_content.html != ''
								){
									EVO.Virtual_Events.jitsi('mod_refresh_no');
								}

							// update data for sent object
								$.each(boxes, function(boxclass, boxdata){
									if( boxdata.data == '' || boxdata.data === undefined) return;

									// for jitsi if mod left --> force refresh main
									if( boxdata !== undefined && vir_data_vals.vir_type == 'jitsi' && vir_data_vals.mod_joined =='left'){
										
										// force refresh main
										boxdata.data['refresh_main'] = 'yy';
									}	

									event_elm.find( '.'+boxclass ).data( boxdata.data );
								});
						}

					});
				});
			},
			// get refresh data for specified elem
			build_elm_refresh_data( elm , extra_data){
				const dataObj = {};
		        const event = $(elm).closest('.eventon_list_event');
		        const ekey = event.data('event_id') + '_' + parseInt(event.data('ri'));
		        dataObj[ekey] = {};
		        const key2 = elm.data('key');
		        dataObj[ekey][key2] = elm.data();

		        if (elm.data('check_awaitmod')) {
		            if ((event.find('.evo_vir_jitsi_waitmod').length > 0)) dataObj[ekey][key2]['refresh_main'] = 'yy';

		            if (event.find('.evo-jitsi-wrapper').length > 0 && dataObj[ekey][key2]['mod_joined'] !== 'left') 
		                dataObj[ekey][key2]['refresh_main'] = '';
		        }

		        if (extra_data && extra_data !== undefined) {
		            $.each(extra_data, (index, val) => {
		                dataObj[ekey][key2][index] = val;
		            });
		        }

		        return dataObj;
			},

			// populate the schedule view data @4.5.8
			evosv_populate(CAL){
				//console.log('s');
				var SC = CAL.evo_shortcode_data();
				OD = CAL.evo_get_OD(); // calendar other data 

				var cal_events = CAL.find('.eventon_list_event');
				days_in_month = CAL.evo_day_in_month({M: SC.fixed_month, Y: SC.fixed_year});
				time_format = CAL.evo_get_global({S1:'cal_def',S2:'wp_time_format'});

				// text strings
					_txt = CAL.evo_get_txt({V:'no_events'});
					_txt2 = CAL.evo_get_txt({V:'until'});
					_txt3 = CAL.evo_get_txt({V:'from'});
					_txt4 = CAL.evo_get_txt({V:'all_day'});
				
				CAL.find('#evcal_list').addClass('evo_hide');

				var has_events = false;
				var html = '';
				var template_data = {};
				var processed_ids = {};

				// Set initial date - date values
					var SU = parseInt( SC.focus_start_date_range);	var EU = '';
					var M = moment.unix( SU ).tz( OD.cal_tz );

				// go through each day in month
				for(var x=1; x<= days_in_month; x++){
					
					var month_name = CAL.evo_get_dms_vals({ V: (M.get('month') +1), type:'m3'});
					var day_name = CAL.evo_get_dms_vals({ V: M.day(), type:'d3'});
					
					// set event unix into moment
						SU = M.unix();	M.endOf('day');
						EU = M.unix();	M.startOf('day');
					
					// run through each event and get events in this date
						var events = {};

						cal_events.each(function(index, elm){
							ED = $(elm).evo_cal_get_basic_eventdata();
							if( !ED) return;

							processed_ids[ED.uID] = ED.uID;
							ESU = ED.unix_start; EEU = ED.unix_end;

							// check for date range
								var inrange = CAL.evo_is_in_range({
									'S': SU,	'E': EU,	'start': ESU,	'end':EEU
								});
								if(!inrange) return; // skip if no in range

							has_events = true;

							// event time relative to calendar tz
							m = moment.unix( ESU ).tz( OD.cal_tz );
							me = moment.unix( end ).tz( OD.cal_tz );

							var all_day = $(elm).find('a.desc_trig').hasClass('allday') ? true: false;

							// get event time correct for all day
							if( all_day ){
								ED['t'] = _txt4;
							}else{
								if( ESU <= SU ){
									if( EEU >= EU) ED['t'] = _txt4;
									if( EEU < EU ) ED['t'] = _txt2+' ' + me.format( time_format);		
								}else if(ESU > SU){
									if( EEU >= EU)  ED['t'] = _txt3+' '+ m.format( time_format);
									if( EEU < EU ) ED['t'] = m.format( time_format) +' - '+ me.format( time_format);
								}	
							}						

							// hide end time
							if( ED.hide_et == 'y')		ED['t'] = m.format( time_format);

							events[index] = ED;
						});			

					// if there are events in this date
						if( events && Object.keys(events).length > 0){
							
							template_data[ x ] = {};
							template_data[ x ]['date'] = '<b>' + M.get('date')+'</b> '+ month_name+' '+ day_name;
							template_data[ x ]['d'] =  M.format('YYYY-M-D');
							template_data[ x ]['SU'] = SU;
							template_data[ x ]['events'] = {}

							$.each(events, function(index, item){		

								location_data = organizer_data = event_tags = '';

								// location 
								if( SC.show_location == 'yes' && 'location' in item){
									location_data = "<div class='evosv_subdata evosv_location'><i class='fa fa-location-pin marr5'></i>" +item.location+"</div>";
								}

								// organizer					
								if( SC.show_organizer == 'yes' && 'organizer' in item){
									organizer_data = "<div class='evosv_subdata evosv_org'>" +item.organizer+"</div>";
								}

								// event tags
								if( SC.show_tags == 'yes' && 'event_tags' in item){
									event_tags = "<div class='evosv_subdata evosv_tags'>";
									$.each( item.event_tags, function(index, val){
										event_tags += "<span class='evosv_tag " + index +"'>" + val+"</span>";
									});
									event_tags += "</div>";
								}

								template_data[ x ]['events'][ item.uID ] = {
									'time': item.t,
									'ux_val': item.ux_val,
									'title': item.event_title,
									'color':item.hex_color,
									'tag': event_tags,
									'loc': location_data,
									'org': organizer_data,
									'i': item
								}

							});					
						}

					// next date
					M.add(1, 'd');
				}

				var html_ = "<div class='evosv_grid evoADDS'>";
				
				// if no events
				if( !has_events){
					no_event_content = CAL.evo_get_global({S1: 'html', S2:'no_events'});			
					html_ += "<div class='date_row'><div class='row no_events evosv'>"+no_event_content+"</div></div>";
				}else{
					html_ += CAL.evo_HB_process_template({
						TD:template_data, part:'evosv_grid'
					});
				}

				html_ += '</div>';

				if( CAL.find('.evosv_grid').length > 0){
					CAL.find('.evosv_grid').replaceWith( html_ );
				}else{
					ELM = CAL.find('#eventon_loadbar_section');
					ELM.after( html_ );
				}
				
			},

			// call ajax url
			get_ajax_url(action){
				var ajax_type = 'endpoint';
				if('ajax_method' in evo_general_params ) ajax_type = evo_general_params.ajax_method;
				return EVO.E.B.evo_get_ajax_url({a:action, type: 	ajax_type });
			},
		}

	};
	EVO.init();



// Other
	// RESET general calendar -- @U 2.8.9		
		function cal_resets(calOBJ){
			calargs = $(calOBJ).find('.cal_arguments');
			calargs.attr('data-show_limit_paged', 1 );
			calOBJ.evo_update_cal_sc({
				F:'show_limit_paged',V:'1'
			});
		}
	
	// layout view changer - legacy
		if($('body').find('.evo_layout_changer').length>0){
			// menu button focus adjust
			$('body').find('.evo_layout_changer').each(function(item){
				if($(this).parent().hasClass('boxy')){
					$(this).find('.fa-th-large').addClass('on');
				}else{
					$(this).find('.fa-reorder').addClass('on');
				}
			});

			// interaction
			$('.evo_layout_changer').on('click','i',function(){
				const CAL = $(this).closest('.ajde_evcal_calendar');
				TYPE = $(this).data('type');
				$(this).parent().find('i').removeClass('on');
				$(this).addClass('on');

				//console.log(TYPE);
				
				if(TYPE=='row'){
					CAL.attr('class','ajde_evcal_calendar');
					// set tile colors
					CAL.find('.eventon_list_event').each(function(){
						$(this).find('.desc_trig').css('background-color',  '');
						$(this).find('.desc_trig_outter').css('background-color',  '');
					});
				}else if(TYPE =='bar'){
					CAL.attr('class','ajde_evcal_calendar  box_2 sev cev');
					
					// set tile colors
					CAL.find('.eventon_list_event').each(function(){
						const color = $(this).data('colr');
						$(this).find('.desc_trig').css('background-color',  color);
					});
				}else{

					// set tile colors
					CAL.find('.eventon_list_event').each(function(){
						const color = $(this).data('colr');
						$(this).find('.desc_trig_outter').css('background-color',  color);
					});

					CAL.attr('class','ajde_evcal_calendar boxy boxstyle0 box_2');
				}				
			});
		}
	
	// SORTING & FILTERING		
		// Sorting	
			// update calendar based on the sorting selection
				$('body').on('click', '.evo_sort_option',function(){
					O = $(this);
					var CAL = O.closest('.ajde_evcal_calendar');
					var sort_by = O.data('val');
					
					// update new values everywhere
					CAL.evo_update_cal_sc({F:'sort_by',V:sort_by});

					O.parent().find('p').removeClass('select');
					O.addClass('select');	

					run_cal_ajax(CAL.attr('id'),'none','sorting');						
				});		

		// close filter menus on click outside
			BODY.on('clicked_on_page',function( ev, obj, ee){

				// hide filter menu when clicked outside 4.6.2
				if( !(obj.hasClass('eventon_filter')) && 
					!(obj.hasClass('filtering_set_val')) &&
					!(obj.hasClass('evo_filter_val')) &&
					!(obj.hasClass('evofp_filter_search_i')) &&
					obj.parents('.filtering_set_val').length == 0 
				){
					//console.log(obj);
					BODY.find('.evo_filter_menu').html('');
					BODY.find('.evo_filter_tax_box.vis').removeClass('vis');
				}
			});

		// Filtering
			$.fn.evo_cal_filtering = function(O){
				
				var opt = $.extend({}, O);

				var el = this; // cal
				const sortbox = el.find('.eventon_sorting_section'),
					filter_container = sortbox.find('.evo_filter_container_in'),
					filter_line = sortbox.find('.eventon_filter_line'),
					fmenu = sortbox.find('.evo_filter_menu'),
					all_cal_filter_data = el.evo_get_filter_data(),
					SC = el.evo_shortcode_data();
				var tterms = [];


				var init = function(){

					if( SC == '' || SC === null ) return;
					if( el.hasClass('filters_go'))	return;
					el.addClass('filters_go');
					
					draw_filter_bar();
					filter_actions();
					run_filter_nav_check();

				}

				// draw the filter bar
				var draw_filter_bar = function(){
					//console.log(all_cal_filter_data);

					BODY.trigger('evo_filter_before_draw', [ el ]);

					html = '';

					$.each( all_cal_filter_data , function( index, value){

						// skip fast filter items
						if( SC && 'fast_filter' in SC && SC.fast_filter == 'yes' && SC.ff_tax != '' && SC.ff_tax !== undefined ){
							__t = SC.ff_tax.split(',');
							if( __t.includes( index ) ) return;
						}

						html += "<div class='eventon_filter evo_filter_tax_box evo_hideshow_st "+index+"' data-tax='"+ value.__tax +"' data-filter_type='"+ value.__filter_type +"'>";
						html += "<div class='eventon_filter_selection'>";
							html += "<p class='filtering_set_val'><i class='fa fa-check'></i> "+ value.__name +"<em class='fa fa-caret-down'></em></p>";							
						html += "</div>";
						html += "</div>";
					});

					filter_line.html( html );

					BODY.trigger('evo_filter_drawn', [ el ]);
				}


				// filter all actions
				var filter_actions = function(){

					el.off('click', '.evo-filter-btn');

					// show/hide filter bar
						el.on('click','.evo-filter-btn',function(){
							const CAL = $(this).closest('.ajde_evcal_calendar');
							
							BODY.trigger('evo_filter_btn_trig', [ CAL , O ]);
							if( CAL.hasClass('fp_lb')) return; // PLUG 4.6.4

							if( !( $(this).hasClass('vis') ) ){
								sortbox.addClass('vis');
								run_filter_nav_check();
							}else{
								sortbox.removeClass('vis');
							}

						});

						// close filter when other sibling buttons clicked 4.6.4
						BODY.on('evo_cal_header_btn_clicked',function(event, O){	
							if( O.hasClass('evo-sort-btn') || O.hasClass('evo-search')  ){
								const CAL = O.closest('.ajde_evcal_calendar');
								CAL.find('.eventon_sorting_section').removeClass('vis');								
							}
						});
						
						
					// show hide menu
					el.on('click','.filtering_set_val',function(){

						O = $(this);
						const filterbox = O.closest('.evo_filter_tax_box'),
						filter_tax = filterbox.data('tax');
						selected_terms = el.evo_cal_get_filter_sub_data( filter_tax , 'tterms' );

						// close sort menu
							el.find('.eventon_sort_line').hide();

						// hide already opened menus
							if( filterbox.hasClass('vis')){
								filterbox.removeClass('vis');							
								close_filter_menu();
								return;
							}
							if( fmenu.data('tax') == filter_tax ){	
								filterbox.removeClass('vis');							
								close_filter_menu();
								return;
							}else{
								sortbox.find('.filtering_set_val').removeClass('show');
								sortbox.find('.evo_filter_tax_box').removeClass('vis');
								filterbox.addClass('vis');	
							}

						// build the filter menu from data
							var filter_item_data = all_cal_filter_data[ filter_tax ].__list;

							//console.log(all_cal_filter_data);
							//console.log(selected_terms);
							
							var __menu_html = '<div class="evo_filter_inside evo_filter_menu_in" data-tax="'+filter_tax+'"><div class="eventon_filter_dropdown">';


							// Sort the filter list alphabetically
							var sorted_data = Object.values(filter_item_data);  
							sorted_data.sort(function(a, b) {
							    // Natural sort by term label (a[1] and b[1]), case-insensitive
							    return a[1].localeCompare(b[1], 'en', {
							        numeric: true,      // Treat numbers properly (e.g., 2 before 11)
							        sensitivity: 'base' // Ignore case and accents for case-insensitive sort
							    });
							});
							
							// each term
							var menuInside = '';
							var AllHtml = '';
							$.each(sorted_data, function (index, val){
								var icon_html = '';
								var _class = filter_tax+'_'+ val[0] + ' '+ val[0];
								
								// parent or child term
								if( val[3] !== undefined && val[3] != '' && val[3] == 'n') _class += ' np';

								//console.log(selected_terms);
								// select or not
								if( selected_terms == 'all' )  _class += ' select';
								if( selected_terms.includes( val[0] ) )  _class += ' select';

								// icon
								if( val[2] != '' && val[2] !== undefined ){
									_class += ' has_icon'; icon_html = val[2];
								} 

								// tax term color
								var _tax_color = '';
								if( val[4] != '' && val[4] !== undefined ){
									_tax_color = `style='background-color:#${val[4]};'`;
								}

								const itemHTML = `<p class="evo_filter_val ${_class}" data-id="${val[0]}" ${_tax_color}>${icon_html} ${val[1]}</p>`;

								// save all value
								if( val[0]=='all'){
									AllHtml = itemHTML;
								}else{
									menuInside += itemHTML;
								} 
								
							});

							__menu_html += AllHtml + menuInside +"</div></div>";

							// 4.6.4
							BODY.trigger('evo_filter_menu_html_ready', [ el , __menu_html , O , filterbox, filter_tax]);


							if( el.hasClass('fp_side')) return; // PLUG
							

							
						// set new menu with correct location
							const scrolled_width = filter_container.scrollLeft();
							fmenu.html( __menu_html );

							// pluggable
							BODY.trigger('evo_filter_menu_built', [ el , fmenu , filter_tax ]);
							

							__left_margin = filterbox.position().left + 10 - scrolled_width;
							__menu_width = fmenu.find('.evo_filter_inside').width();

							__cal_left_margin = el.position().left;

							//console.log(__cal_left_margin + ' '+ __left_margin +' '+ __menu_width + ' '+ $(window).width());

							if( __left_margin + __menu_width + __cal_left_margin > $(window).width()  ){
								
								if(  ( __left_margin + __menu_width ) > el.width() ){
									new_left = el.width() - __menu_width - 10;
								}else{
									new_left = ( el.width() - __menu_width ) / 2;
								}								
								fmenu.css('left', new_left );
							}else{
								fmenu.css('left', __left_margin);
							}
					});

					// select a static filter menu item
						el.on('click','p.filtering_static_val',function(){

							BODY.trigger('evo_filter_static_clicked', [ el , $(this) ]);
												
						});

					// select terms in filter menu
						el.on('click','p.evo_filter_val',function (){

							var O = $(this);
							const filter_menuIN = O.closest('.evo_filter_inside'),
								filter_tax = filter_menuIN.data('tax'),
								filterbox = sortbox.find('.evo_filter_tax_box.'+ filter_tax),
								all_terms_obj = filter_menuIN.find('p'),
								new_term_id = O.data('id'),
								old_terms = el.evo_cal_get_filter_sub_data( filter_tax , 'terms' )
								;
							var tterms = el.evo_cal_get_filter_sub_data( filter_tax , 'nterms' );

							var new_terms = [];


							// select filter type
							if( SC.filter_type == 'select' ){

								// all value
								if( new_term_id == 'all' ){
									if( O.hasClass('select') ){
										all_terms_obj.removeClass('select');
									}else{
										all_terms_obj.addClass('select');
										new_terms.push('all');
									}
								}else{
									// unselect all value
									filter_menuIN.find('p.all').removeClass('select');
									O.toggleClass('select');	

									var unselect_count = 0;
									all_terms_obj.each(function(){
										if( $(this).hasClass('select')){
											new_terms.push( $(this).data('id') )
										}else{
											// not select
											if(!$(this).hasClass('all')) unselect_count++;
										}
									});	

									// all selected
									if(unselect_count == 0){
										filter_menuIN.find('p.all').addClass('select');
										new_terms.push('all');
									}	

									// if all field is not visible; nothing selected = all
									if( new_terms.length == 0 && O.parent().find('p.all').length == 0) 
										new_terms.push('all');
								}							

							// non select type
							}else{ 
								// all value
								if( new_term_id == 'all' ){
									// if all is already selected
									if( O.hasClass('select')){
										new_terms.push('NOT-all');
										all_terms_obj.removeClass('select');
									}else{
										all_terms_obj.addClass('select');
										new_terms.push( new_term_id );
									}	
								}else{
									all_terms_obj.removeClass('select');
									O.addClass('select');
									new_terms.push( new_term_id );
								}

								update_filter_data( filter_tax, new_terms );

								// process selection @4.6.6
									if( tterms == new_terms ){
										close_filter_menu();
									}else{					
										cal_resets( el );
												
										el.evo_update_sc_from_filters();					

										run_cal_ajax( el.attr('id') ,'none','filering');
																								
										close_filter_menu();
										O.removeClass('show');
									}

								close_filter_menu();
								// mark hide of menu
								filterbox.removeClass('vis');
							}
							
							// show and hide apply filter button
								// if new terms = temp terms
									if( compare_terms( new_terms, tterms) ){
										filterbox.removeClass('chg');										
									}else{
										filterbox.addClass('chg');			
									}
									if( compare_terms( old_terms, new_terms) ){
										filterbox.removeClass('set');	
									}else{
										filterbox.addClass('set');
									}								
									

								// changed filters
								var chg_filters = sortbox.find('.evo_filter_tax_box.chg').length;
								var set_count = sortbox.find('.evo_filter_tax_box.set').length;
								if( SC.filter_type == 'select' ) 
									( chg_filters > 0 ) ? show_apply_btns() : hide_apply_btns();


							// Filter highlighted indicator 
								if( !( el.hasClass('flhi') ) ){

									const filter_btn = el.find('.evo-filter-btn');	

									if( set_count > 0){
										filter_btn.find('em').html( set_count ).addClass('o');	
									}else{
										filter_btn.find('em').removeClass('o');			
									}			
								}



							update_filter_data( filter_tax, new_terms , 'tterms');

							run_filter_nav_check();

						});
													
					// apply filters button
						el.on('click','.evo_filter_submit',function(){

							el.evo_filters_update_from_temp( filter_line, el );
							
							cal_resets( el);

							close_filter_menu(); // hide filter menu

							// update filter item button
							sortbox.find('.filtering_set_val').removeClass('show');

							el.evo_update_sc_from_filters();	// update shortcode from filters
							
							run_cal_ajax( el.attr('id'),'none','filering');

							run_filter_nav_check();
						});

					// clear filters
						el.on('click','.evo_filter_clear',function(){
								
							el.find('.evo_filter_tax_box').each(function(){
								const O = $(this),
									tax = O.data('tax'),
									terms = O.data('terms');

								O.removeClass('set');
								O.find('.filtering_set_val').removeClass('set show');
								el.find('.evo-filter-btn em').removeClass('o');

								close_filter_menu();
							});

							// update all filters with default/ onload values @4.6.1
							$.each( all_cal_filter_data, function( tax, tdata){
								update_filter_data( tax, tdata.terms );
							} );


							hide_apply_btns(); // hide filter action buttons
							
							// update shortcode and run new ajax for events
							el.evo_update_sc_from_filters();					
							run_cal_ajax( el.attr('id'),'none','filering');

							run_filter_nav_check();
						});

					// click on filter navs
						el.on('click','.evo_filter_nav',function(){
							O = $(this);

							_filter_bar = O.closest('.evo_filter_bar');
							_filter_container = _filter_bar.find('.evo_filter_container_in');
							_filter_line_width = _filter_bar.find('.eventon_filter_line')[0].scrollWidth;
							_filter_container_width = parseInt( _filter_container.width() ) + 0;
							_leftPos = _filter_container.scrollLeft();
							_scrollable_legth = _filter_line_width - _filter_container_width;

							const scroll_length = _filter_container_width /2;
							
							// move right
							if( O.hasClass('evo_filter_r') ){
																		
								_filter_container.animate({scrollLeft:_leftPos + scroll_length},200);
								_filter_bar.find('.evo_filter_l').addClass('vis');
							// move left
							}else{
								sleft = (_leftPos - scroll_length < scroll_length) ? 0 :  _leftPos - scroll_length;
								_filter_container.animate({scrollLeft: sleft },200);											
							}

							close_filter_menu();

							setTimeout(function(){
								var _leftPos = _filter_container.scrollLeft();
								//console.log(_leftPos);
								if( _leftPos < 10){
									_filter_bar.find('.evo_filter_l').removeClass('vis');
									_filter_bar.find('.evo_filter_r').addClass('vis');
								}

								if( _leftPos > ( _scrollable_legth - 5 ) ){
									_filter_bar.find('.evo_filter_r').removeClass('vis');
								}
							},200);
												
						});

					// on window size change
					$(window).on('resize',function(){
						run_filter_nav_check();
					});
				}

				var compare_terms = function(a, b){
					if (a === b) return true;
					if (a == null || b == null) return false;
					if (a.length !== b.length) return false;

					for (var i = 0; i < a.length; ++i) {
					   if (a[i] !== b[i]) return false;
					}
					return true;
				}
				var close_filter_menu = function(){
					fmenu.html('').data('tax','');
				}

				var show_apply_btns = function(){
					sortbox.find('.evo_filter_aply_btns').addClass('vis');	
				}
				var hide_apply_btns = function(){
					sortbox.find('.evo_filter_aply_btns').removeClass('vis');		
				}

				var update_filter_data = function(tax, new_val, key){

					el.evo_cal_update_filter_data( tax , new_val , key );					
				}


				// adjust and position filter nav buttons
				var run_filter_nav_check = function(){

					$.each( el.find('.evo_filter_bar') , function(event){
						_filter_bar = $(this);
						_filter_container = _filter_bar.find('.evo_filter_container_in');
						_filter_line_width = _filter_bar.find('.eventon_filter_line')[0].scrollWidth;
						_filter_container_width = parseInt( _filter_container.width() ) + 3;
						var leftPos = _filter_container.scrollLeft();

						//console.log(_filter_line_width +' '+ _filter_container_width +' '+leftPos);

						// filter line is not showing full
						if( _filter_line_width > _filter_container_width ){

							// if some of filter line is hidden on right
							if( ( _filter_container_width + leftPos  ) < _filter_line_width )
								_filter_bar.find('.evo_filter_r').addClass('vis');

							// if filter has been scrolled
							if( leftPos > 0 ){
								_filter_bar.find('.evo_filter_l').addClass('vis');
							}else{
								_filter_bar.find('.evo_filter_r').addClass('vis');
							}
						}else{
							_filter_bar.find('.evo_filter_l').removeClass('vis');
							_filter_bar.find('.evo_filter_r').removeClass('vis');
						}

					});

					//console.log(filter_line_width +' '+ filter_container_width +' '+leftPos);					
				}

				init();
			}

			// for each tax move tterms value to nterms / before sending ajax
			$.fn.evo_filters_update_from_temp = function(filter_line, cal){
				// move temp term values into new terms
					filter_line.find('.evo_filter_tax_box').each(function(){
						var taxonomy = $(this).data('tax');
						const tterms = cal.evo_cal_get_filter_sub_data( taxonomy , 'tterms');

						cal.evo_cal_update_filter_data( taxonomy , tterms, 'nterms');

						$(this).removeClass('chg');
					});
			}
				

	// PRIMARY hook to get content	 
		// MAIN AJAX for calendar events v2.8
		function run_cal_ajax( cal_id, direction, ajaxtype){
			
			// identify the calendar and its elements.
			var CAL = ev_cal = $('#'+cal_id); 

			// check if ajax post content should run for this calendar or not			
			if(CAL.attr('data-runajax')!='0'){

				const EVENTS_LIST = CAL.find('.eventon_events_list');
				const $showMoreBtn = EVENTS_LIST.find('.evoShow_more_events');

				// category filtering for the calendar
				var cat = CAL.find('.evcal_sort').attr('cat');

				// reset paged values for switching months
				if(ajaxtype=='switchmonth'){
					CAL.find('.cal_arguments').attr('data-show_limit_paged',1);
					CAL.evo_update_cal_sc({F:'show_limit_paged', V: '1'});
				}	

				SC = CAL.evo_cal_functions({action:'load_shortcodes'});

				$('body').trigger('evo_main_ajax_before', [CAL, ajaxtype, direction, SC]);		

				var data_arg = {
					//action: 		'eventon_get_events',
					direction: 		direction,
					shortcode: 		SC,
					ajaxtype: 		ajaxtype,
					nonce: 			evo_general_params.n,
					nonceX: 		evo_general_params.nonce
				};	

				

				$.ajax({
					// preload actions
					beforeSend: function(xhr){
						xhr.setRequestHeader('X-WP-Nonce', evo_general_params.nonce );

						CAL.addClass('evo_loading');

						// paged -- adding events to end
						if(ajaxtype == 'paged'){							
							const currentContent = $showMoreBtn.html();
							$showMoreBtn.data('txt',currentContent);
							if( SC.tiles == 'yes'){
								$showMoreBtn.addClass('evoloading');
								$showMoreBtn.find('span').html('');
							}else{
								$showMoreBtn.find('span').addClass('evobtn_loader full');
							}
							
						}else{

							html = evo_general_params.html.preload_events;
							if( SC.tiles == 'yes') html = evo_general_params.html.preload_event_tiles;

							EVENTS_LIST.html( html );
							//EVENTS_LIST.slideUp('fast');
						}	

						// maintain scrolltop location 4.6
						if( CAL.hasClass('nav_from_foot')){
							
							//scrolltop = (CAL.find('.evo_footer_nav').offset().top) - CAL.data('viewport_top');
							scrolltop = CAL.offset().top;
							$('html, body').animate({	scrollTop: scrolltop	},20);
						}	

						$('body').trigger('evo_main_ajax_before_fnc',[CAL, ajaxtype, data_arg ]);	//s4.6			
					},
					type: 'POST', url: get_ajax_url('eventon_get_events'),data: data_arg,dataType:'json',
					success:function(data){

						if(!data) return false;

						// paged calendar
						if(ajaxtype == 'paged'){	
							$showMoreBtn.remove();
							EVENTS_LIST.find('.clear').remove();
							EVENTS_LIST.append( data.html + "<div class='clear'></div>");

							// hide show more events if all events loaded
							var events_in_list = EVENTS_LIST.find('.eventon_list_event').length;
							if( 'total_events' in data && data.total_events == events_in_list){
								$showMoreBtn.hide();
							}	

							// for month lists duplicate headers // @+2.8.1
							var T = {};
							EVENTS_LIST.find('.evcal_month_line').each(function(){
								d = $(this).data('d');
								if( T[d]) 
									$(this).remove();
								else
									T[d] = true;
							});

							var T = {};
							EVENTS_LIST.find('.sep_month_events').each(function(){
								d = $(this).data('d');
								if( T[d]){
									var H = $(this).html();
									EVENTS_LIST.find('.sep_month_events[data-d="'+d+'"]').append( H );
									$(this).remove();
								}else{T[d] = true;}
							});
							
						}else{
							EVENTS_LIST.html(data.html);
						}

						
						// update calendar data
						CAL.find('.evo_month_title').html( data.cal_month_title );

						CAL.evo_cal_functions({action:'update_shortcodes',SC: data.SC});
						CAL.evo_cal_functions({action:'update_json',json: data.json});

						// run cal process code
						CAL.evo_calendar({
							SC: data.SC,
							json: data.json
						});
							

						$('body').trigger('calendar_month_changed',[CAL, data]);
						
						$('body').trigger('evo_main_ajax_success', [CAL, ajaxtype, data, data_arg]);
															
					},complete:function(data){

						// show events list events if not set to hide on load
						if(! EVENTS_LIST.hasClass('evo_hide')) EVENTS_LIST.delay(300).slideDown('slow');
						
						// maintain scrolltop location 4.6
						if( CAL.hasClass('nav_from_foot')){
							
							setTimeout(function(){
								//scrolltop = (CAL.find('.evo_footer_nav').offset().top) - CAL.data('viewport_top');
								scrolltop = CAL.offset().top;
								$('html, body').animate({	scrollTop: scrolltop	},20);
								CAL.removeClass('nav_from_foot');
							},302);														
						}					

						// pluggable
						$('body').trigger('evo_main_ajax_complete', [CAL, ajaxtype, data.responseJSON , data_arg]);
						CAL.removeClass('evo_loading');
					}
				});
			}			
		}

		$('body').on('evo_run_cal_ajax',function(event,cal_id, direction, ajaxtype){
			run_cal_ajax( cal_id, direction, ajaxtype);
		});

		// deprecated bridge function for sortby value 
		function ajax_post_content(sortby, cal_id, direction, ajaxtype){
			run_cal_ajax( cal_id, direction, ajaxtype);
		}
	
		
	// SINGLE EVENTS
		// Loading single event json based content
			$('body').on('evo_load_single_event_content', function(event, eid, obj){
				var ajaxdataa = {};
				ajaxdataa['eid'] = eid;
				ajaxdataa['nonce'] = the_ajax_script.postnonce;	

				// pass on other event values
				if(obj.data('j')){
					$.each(obj.data('j'), function(index,val){
						ajaxdataa[ index] = val;
					});
				}			
				
				$.ajax({
					beforeSend: function(){ 	},	
					url:	get_ajax_url('eventon_load_event_content'),
					data: 	ajaxdataa,	dataType:'json', type: 	'POST',
					success:function(data){
						$('body').trigger('evo_single_event_content_loaded', [data, obj]);
					},complete:function(){ 	}
				});
			});
	
		if(BODY.evo_is_mobile()){
			if($('body').find('.fb.evo_ss').length != 0){
				$('body').find('.fb.evo_ss').each(function(){
					obj = $(this);
					obj.attr({'href':'http://m.facebook.com/sharer.php?u='+obj.attr('data-url')});
				});
			}
		}

		// on single event page
		if($('body').find('.evo_sin_page').length>0){
			$('.evo_sin_page').each(function(){
				$('body').trigger('evo_load_single_event_content',[ $(this).data('eid'), $(this)]);
				$(this).find('.desc_trig ').attr({'data-ux_val':'none'});
			});
		}
		
		// Single events box
			// Click on single event box > Handled via main function
			// each single event box
				$('body').find('.eventon_single_event').each(function(){
					var _this = $(this);

					var CAL = _this.closest('.ajde_evcal_calendar');
					var SC = CAL.evo_shortcode_data();	
					var evObj = CAL.find('.eventon_list_event');									

					// show expanded eventCard
					if( SC.expanded =='yes'){
						_this.find('.evcal_eventcard').show();
						var idd = _this.find('.evcal_gmaps');						

						// close button
						_this.find('.evcal_close').parent().css({'padding-right':0});
						_this.find('.evcal_close').hide();

						//console.log(idd);
						var obj = _this.find('.desc_trig');

						// Google Map
						_this.find('.evo_metarow_gmap').evo_load_gmap();
					
						// mark as eventcard open @since 4.4
						evObj.find('.event_description').addClass('open');

					// open eventBox and lightbox	
					}else if(SC.uxval =='3'){

						var obj = _this.find('.desc_trig');
						// remove other attr - that cause to redirect
						obj.removeAttr('data-exlk').attr({'data-ux_val':'3'});
					}

					// show event excerpt
					var ev_excerpt = CAL.find('.event_excerpt').html();
					
					if(ev_excerpt!='' && ev_excerpt!== undefined && SC.excerpt =='yes' ){
						var appendation = '<div class="event_excerpt_in">'+ev_excerpt+'</div>'
						evObj.append(appendation);
					}

					// trigger support @since 4.4
					var obj = evObj.find('.desc_trig');
					var event_id = evObj.data('event_id');


					$('body').trigger('evo_slidedown_eventcard_complete',[ event_id, obj]);	
				});

// supportive
	// ajax url function  @u 4.5.5
		function get_ajax_url(action){
			var ajax_type = 'endpoint';
			if('ajax_method' in evo_general_params ) ajax_type = evo_general_params.ajax_method;
			return $('body').evo_get_ajax_url({a:action, type: 	ajax_type });
		}
	// handlebar additions
		function handlebar_additional_arguments(){
			Handlebars.registerHelper('ifE',function(v1, options){
				return (v1 !== undefined && v1 != '' && v1)
                    ? options.fn(this)
                    : options.inverse(this);
			});

			Handlebars.registerHelper('ifEQ',function(v1, v2, options){
				return ( v1 == v2)? options.fn(this): options.inverse(this);
			});
			Handlebars.registerHelper('ifNEQ',function(v1, v2, options){
				return ( v1 != v2)? options.fn(this): options.inverse(this);
			});
			Handlebars.registerHelper('BUStxt',function(V, options){	
				if( !( V in BUS.txt) ) return V;
				return BUS.txt[V];
			});
			Handlebars.registerHelper('GetDMnames',function(V, U, options){				
				return BUS.dms[U][ V ];
			});
			// get total of increments
			Handlebars.registerHelper('forAdds',function(count, add_val, options){	
				O = '';
				for(x=1; x<= count; x++){	O += add_val;	}			
				return O;
			});
			Handlebars.registerHelper('GetEvProp',function(EID, PROP, CALID){
				EID = EID.split('-');	
				EV = $('#'+ CALID).find('.evo_cal_events').data('events');
				
				var O = '';
				$.each(EV, function(i,d){
					if( d.ID == EID[0] && d.ri == EID[1]){
						if( !(PROP in d.event_pmv)) return;
						O = d.event_pmv[PROP][0];
					}
				});
				return O;
			});
			Handlebars.registerHelper('GetEvV',function(EID, PROP, CALID){
				EID = EID.split('-');	
				EV = $('#'+ CALID).find('.evo_cal_events').data('events');
				
				var O = '';
				$.each(EV, function(i,d){
					if( d.ID == EID[0] && d.ri == EID[1]){
						O = d[PROP];
					}
				});
				return O;
			});
			Handlebars.registerHelper('COUNT',function( V){		
				return Object.keys(V).length;
			});
			Handlebars.registerHelper('CountlimitLess',function( AR, C,options){		
				var L= Object.keys(AR).length;
				return ( L < C)? options.inverse(this): options.fn(this);
			});
			Handlebars.registerHelper('ifCOND',function(v1, operator, v2, options){
				return checkCondition(v1, operator, v2)
	                ? options.fn(this)
	                : options.inverse(this);
			});
			Handlebars.registerHelper('toJSON', function(obj) {
			    return new Handlebars.SafeString(JSON.stringify(obj));
			});
			Handlebars.registerHelper('Cal_def_check',function(V, options){		
				if( BUS.cal_def && BUS.cal_def[V] ) return options.fn(this);
				return options.inverse(this);
			});
			Handlebars.registerHelper('TypeCheck',function(V, options){		
				if( options.type == V ) return options.fn(this);
				return options.inverse(this);
			});
		}
		function checkCondition(v1, operator, v2) {
	        switch(operator) {
	            case '==':
	                return (v1 == v2);
	            case '===':
	                return (v1 === v2);
	            case '!==':
	                return (v1 !== v2);
	            case '<':
	                return (v1 < v2);
	            case '<=':
	                return (v1 <= v2);
	            case '>':
	                return (v1 > v2);
	            case '>=':
	                return (v1 >= v2);
	            case '&&':
	                return (v1 && v2);
	            case '||':
	                return (v1 || v2);
	            default:
	                return false;
	        }
	    }


// DEPRECATING 
	// LIGHTBOX		
		// since 4.2 moving to functions
		// open lightbox @2.9
			BODY.on('evo_open_lightbox',function(event, lb_class, content){
				const LIGHTBOX = $('.evo_lightbox.'+lb_class).eq(0);

				// if already open
				if(LIGHTBOX.is("visible")===true) return false;

				if( content != ''){
					LIGHTBOX.find('.evo_lightbox_body').html( content );
				}
				BODY.trigger('evolightbox_show', [ lb_class ]);
			});

		// click outside close LB
			BODY.on('clicked_on_page', function(event, obj, ev ){
				if( obj.hasClass('evo_content_inin')){
					closing_lightbox( obj.closest('.evo_lightbox') );
				}
			});

		// close popup
			BODY.on('click','.evolbclose', function(){	
				if( $(this).hasClass('evolb_close_btn')) return;
				LIGHTBOX = 	$(this).closest('.evo_lightbox');
				closing_lightbox( LIGHTBOX );				
			});

		// close with click outside popup box when pop is shown						
			function closing_lightbox( lightboxELM){
				
				if(! lightboxELM.hasClass('show')) return false;
				Close = (lightboxELM.parent().find('.evo_lightbox.show').length == 1)? true: false;
				lightboxELM.removeClass('show');

				$('body').trigger('lightbox_before_event_closing', [lightboxELM]);

				setTimeout( function(){ 
					lightboxELM.find('.evo_lightbox_body').html('');
					
					if(Close){
						$('body').removeClass('evo_overflow');
						$('html').removeClass('evo_overflow');
					}
					
					// trigger action to hook in at this stage
						$('body').trigger('lightbox_event_closing', [lightboxELM]);
				}, 100);
			}

		// when lightbox open triggered
			$('body').on('evolightbox_show',function(event, lb_class){
				$('.evo_lightboxes').show();
				$('body').addClass('evo_overflow');
				$('html').addClass('evo_overflow');

				$('body').trigger('evolightbox_opened',[ lb_class ]);
			});


});