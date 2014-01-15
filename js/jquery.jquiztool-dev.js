// jquery helpers 
;jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", (($(this).parent().height() - this.outerHeight()) / 2) + $(this).parent().scrollTop() + "px");
    this.css("left", (($(this).parent().width() - this.outerWidth()) / 2) + $(this).parent().scrollLeft() + "px");
    return this;
}
;jQuery.fn.centerH=function(){this.css("left",($(this).parent().width()-this.width())/2+$(this).parent().scrollLeft()+"px");return this;}
;jQuery.fn.centerV=function(){this.css("top",($(this).parent().height()-this.height())/2+$(this).parent().scrollTop()+"px");return this;}
// jQuiz
;(function( $ ){
    if (/1\.(0|1|2)\.(0|1|2)/.test($.fn.jquery) || /^1.1/.test($.fn.jquery)) {
        alert('jquiztool requires jQuery v1.2.3 or later!  You are using v' + $.fn.jquery);
        return;
    }
    $.fn.jquiztool = function( params ) {

		var version = '1.0.5';
		
        // supported question types
		var Types = {ESSAY:1, ORDERED_LIST:2, MULTIPLE_RESPONSE:3, FITB:4, MULTIPLE_CHOICE:5, HOT_SPOT:6};

        // merge defaults with user submitted settings, these can be overridden on instance creation page (html)
        params = $.extend({
            "quiz_id":      '',    // if required to distiguish different quizzes (passed via GET/POST & handled by PHP)
            "interface":    "",    // the interface URL to the PHP script handling tracking and question data supplication
            "type":         'POST',// POST or GET
			"language" : 	"en",  // Language indicator used by interface to return correct user language
            "width":        450,   // default width
            "height":       440,   // default height
            "csrf_token":   '',    // csrf token used in ajax calls (must be revalidated by PHP given the nature of AJAX)
            "animate_ui":   true,  // boolean if UI should use animation
            
            "title":            'jQuiz Example', // default quiz title - load from AJAX
            "checking_text":    'Checking your answer...', // text for checking an answer
            "correct_text":     'Good job! Your answer was correct!', // text for correct answer
            "incorrect_text":   'Sorry, that was not the correct answer.', // text for incorrect answer
            "info_text":        'Your answer has been recorded.', // text for free response saved
            "loading_text":     'Loading...', // text used when quiz is loading
            "check_ans_text":   'Submit Answer', // text used on Check Answer button
            "next_btn_text":    'Next Question', // text used on Next button
            "orderlist_hint":   'Sequence the following items in the correct order:', // text used in ordered list hint
            "multiresponse_hint": 'Please select the best answers:', // text used in multiresponse hint
            "multichoice_hint":  'Please select the best answer:', // text used in multichoice hint
            "fitb_hint":        'Please provide an answer for each space above:', // text used in fill-in-the-blank hint
            "essay_hint":       'Please explain:', // text used in essay hint
            "hotspot_hint":     'Click the correct answer below:', // text used in hotspot hint
            "fitb_placeholder": 'Answer', // placeholder used for input field (if supported)
            "essay_placeholder":'', // placeholder used for essay field (if supported)
            "quiz_result_title":'Quiz Results', // used on result table
            "correct_result_text":     'Correct', // used on result table
            "incorrect_result_text":   'Incorrect', // used on result table
            "pending_result_text":     'Pending review',  // used on result table
            "fitb_correct_ans": 'The correct answer(s):', // used when showing the real answer for a Fill-in-the-blank
            "view_quiz_result_lbl" : 'View Quiz Results' // used on the button when all questions have been answered
        }, params);
        
        return this.each(function() {
            // this is per jquiz instance, currently we only support 1 on a page
            
            // we need to track what question we are on internally
            var question_num = 1;
            
            //construct DOM for jquiztool 
            var $jquiztool = $(this).addClass('jquiztool-instance').css({'width':params['width'], 'height':params['height']});
            var $title_bar = $('<div class="jquiztool-titlebar" />').appendTo($jquiztool).disableSelection();
            var $q_counter = $('<div class="jquiztool-q-counter" />').html('Question <span class="current_question">0</span> of <span class="total_questions">0</span>').appendTo($title_bar);
            var $title_div = $('<div class="jquiztool-titlediv" />').text(params['title']).appendTo($title_bar);
            var $q_reponse = $('<div class="jquiztool-response" />').appendTo($jquiztool).hide().disableSelection();
            
            var $question_div = $('<div class="jquiztool-question" />').appendTo($jquiztool).disableSelection();
            var $user_response = $('<div class="jquiztool-user-response" />').appendTo($jquiztool);
            
            var $control_bar = $('<div class="jquiztool-control-bar" />').appendTo($jquiztool).disableSelection();
            var $check_btn = $('<a href="javascript:void(0);">'+params['check_ans_text']+'</a>').button().appendTo($control_bar);
            var $next_btn = $('<a href="javascript:void(0);" class="jquiztool-next-btn">'+params['next_btn_text']+'</a>').button({ disabled: true }).appendTo($control_bar);
            
            var $overlay = $('<div class="jquiztool-overlay" />').appendTo($jquiztool).hide().disableSelection();
            var $loader = $('<div class="jquiztool-loader" />').text(params['loading_text']).appendTo($jquiztool).hide();
            var $checker = $('<div class="jquiztool-checker" />').appendTo($jquiztool).hide();
            
            var $q_result_div = $('<div class="jquiztool-quiz-results"><div>'+params['quiz_result_title']+'</div><table class="jquiztool-result-table"><tr><td>'+params['correct_result_text']+'</td><td class="q-correct-count">0</td></tr><tr><td>'+params['incorrect_result_text']+'</td><td class="q-incorrect-count">0</td></tr><tr><td>'+params['pending_result_text']+'</td><td class="q-pending-count">0</td></tr></table></div>').appendTo($jquiztool).hide();
            
            // this is the structure expected from server (JSON)
            var question_node = {
                id: 0,          // any id to represent this question in persistance (i.e. Database row id for this question)
                type: 0,        // maps to type constants above
                question: '',   // the question text
                options: [],    // options for this question
                answers: [],    // for the last question, not the current question
                total_questions: 0 // this only used on first question
            };
            
            var q_correct_count = 0, q_incorrect_count = 0, q_pending_count = 0;
            
            var g_params = params; // extend scope of params to functions
            
            // initalize this instance
            init();
            function init(){
                // apply listener to check btn
                $check_btn.click(function(){checkAnswer();});
                // apply listener to next btn
                $next_btn.click(function(){getNextQuestion();});
                // ajax load next question
                getNextQuestion();
            }
            
            /**
             * AJAX Load the next question
             */
            function getNextQuestion(){
                // check if we are loading results or another question
                if ($next_btn.hasClass('view-jquiztool-results')){
                    $next_btn.removeClass('view-jquiztool-results');
                    $next_btn.button({ disabled: true });
                    showResults();
                    return;
                }
                
                // get the next question
                
                // update UI buttons
                $check_btn.button({ disabled: false });
                $next_btn.button({ disabled: true });
                
                // show loader
                toggleLoader();
                
                var data = {};
                data.quiz_id = g_params['quiz_id'];
                if ($.trim(g_params['csrf_token']) != '')
                    data.csrf_token = g_params['csrf_token'];
				
				// add language
				data.language = g_params['language'];
                
                // @TODO: check if we have completed all the questions, if so, we want to just show results instead of loading the next question
                
                $.ajax({
                    url		: g_params['interface'],
                    dataType: 'json',
                    data	: data,
                    type	: g_params['type'],
                    success: function(data){
                        if (data['error']){  
                            alert(data['msg']);
                        }else{
                            question_node = data; // set global for usage in other function
                            render(); // render question
                        }
                        toggleLoader(); // hide showing loader
                        hideUserResult();
                    }
					// @TODO: Add in support to determine if call to interface fails to display nice message
                });
            }
            
            /**
             * Main method for handling rendering of each question
             */
            function render(){
                // update ui
                $question_div.html(question_node['question']); // support loading images, videos, audio (in HTML5)
                $q_counter.find('.current_question').text(question_num++);
                if (question_node['total_questions'])
                    $q_counter.find('.total_questions').text(question_node['total_questions']);
                
                // switch on type to handle which view is rendered
                switch(question_node['type']){
                    case Types.ESSAY:             renderEssay();
                        break;
                    case Types.ORDERED_LIST:      renderOrderedList();
                        break;
                    case Types.FITB:              renderFITB();
                        break;
                    case Types.MULTIPLE_CHOICE:   renderMultiChoice();
                        break;
                    case Types.MULTIPLE_RESPONSE: renderMultiResponse();
                        break;
                    case Types.HOT_SPOT:          renderHotSpot();
                        break;
                }
                
                // we need to update the user response area
                renderUserResponseArea();
            }
            
            /**
             * Fired when user clicks Check My Answer
             */
            function checkAnswer(){
                // we want to ajax load the answers to this question and the data for the next question
                
                // ajax variables
                var data = {};
                data['quiz_id']     = g_params['quiz_id'];
                data['question_id'] = question_node['id'];
                
                if ($.trim(g_params['csrf_token']) != '')
                    data['csrf_token']  = g_params['csrf_token'];
                
				// add language
				data.language = g_params['language'];
                
				// will hold answers depending on question type
                var answers = [];
                
                // gather user's answer(s), disable inputs
                switch(question_node['type']){
                    case Types.ESSAY:
                        $ta = $user_response.find('textarea');
                        answers.push($ta.val());
                        $ta.attr('disabled', true);
                        break;
                    case Types.FITB:
                        $user_response.find('input[type=text]').each(function(){
                            // sanitize input (remove extra spaces, and convert to lower case for easy checking
                            answers.push($.trim($(this).val().replace(/\s+/g, " ").toLowerCase()));
                            $(this).attr('disabled', true);
                        });
                        break;
                    case Types.ORDERED_LIST:
                        // verify UI lib and sortable plugin
                        if(jQuery.ui && jQuery.ui.sortable){
                            answers = $user_response.find('.jquiztool-sortlist').sortable('toArray');
                            $user_response.find('.jquiztool-sortlist').sortable("disable");
                        }
                        break;
                    case Types.MULTIPLE_CHOICE:
                    case Types.MULTIPLE_RESPONSE:
                        $user_response.find('label').each(function(){
                            if($(this).find('input:checked').length){
                                answers.push($(this).find('input').val());
                            }
                            $user_response.find('input').attr('disabled', true);
                        });
                        break;
                    case Types.HOT_SPOT:
                        // push x then y
                        answers.push($user_response.find('input[name=hotspot-coordinates-x]').val());
                        answers.push($user_response.find('input[name=hotspot-coordinates-y]').val());
                        break;
                }
                
                // set answers param to ajax data object, if array is empty pass empty string to ensure variable transport via ajax
                if (answers.length == 0)
                    data['answers'] = '';
                else
                    data['answers'] = answers;
                
                toggleChecker(); // turn on checker
                
                // ajax send data to interface
                $.ajax({
                    url: g_params['interface'],
                    dataType: 'json',
                    data: data,
                    type: g_params['type'],
                    success: function(data){
                        if (data['error']){ 
                            // error encountered, display message
                            alert(data['msg']);
                        }else{
                            // here we have to render out feedback for this question
                            // verify we have the answers to the same question submitted
                            if (question_node['id'] == data['id']){
                                
                                var user_correct = 0; // assume not correct or incorrect response unless found otherwise
                                
                                if (data['show_answers']){
                                
                                    // handle if question response is multi-choice or multi-response as they will be handled differently
                                    switch (question_node['type']){
                                        case Types.MULTIPLE_CHOICE:
                                        case Types.MULTIPLE_RESPONSE:
                                            $user_response.find('label.jquiztool-user-response-label').each(function(){
                                                $input = $(this).find('input');
                                                if($.inArray($input.val(), data['answers']) != -1){
                                                    if($input.is(':checked')){
                                                        // the user got it correct
                                                        $(this).addClass('jquiztool-item-correct');
                                                        user_correct = 1;
                                                    }else{
                                                        // it was an answer, but the user didn't choose it
                                                        $(this).addClass('jquiztool-item-correct');
                                                        user_correct = -1;
                                                    }
                                                }else{
                                                    
                                                    // if they checked anything else, they got the question wrong
                                                    if($input.is(':checked')){
                                                        // answer incorrect and user selected it
                                                        $(this).addClass('jquiztool-item-incorrect');
                                                        user_correct = -1;
                                                    }
                                                }
                                            });
                                            break;
                                        case Types.ORDERED_LIST:
                                            // verify UI lib and sortable plugin
                                            if(jQuery.ui && jQuery.ui.sortable){
                                                var items = $user_response.find('.jquiztool-sortlist').sortable('toArray');
                                                user_correct = 1; // assume correct order until proven otherwise
                                                for (var i = 0; i < items.length; i++){
                                                    // show the correct numbering
                                                    var $li = $user_response.find("li#"+data['answers'][i]).html("<b>"+(i+1)+".</b> "+$user_response.find("li#"+data['answers'][i]).html());
                                                    if (items[i] == data['answers'][i]){
                                                        $li.addClass("jquiztool-item-correct");
                                                    }else{
                                                        $li.addClass("jquiztool-item-incorrect");
                                                        user_correct = -1;
                                                    }
                                                }
                                            }else{
                                                $user_response.html('This question requires the use of the jQuery UI library and sortable plugin. Please contact your administrator.');
                                                toggleChecker();
                                                return;
                                            }
                                            break;
                                        case Types.FITB:
                                            user_correct = 1;
                                            $user_response.find('input[type=text]').each(function(index, value){
                                                // sanitize input (remove extra spaces, and convert to lower case for easy checking
                                                if (data["answers"][index] != $.trim($(this).val().replace(/\s+/g, " ").toLowerCase())){
                                                    user_correct = -1;
                                                    $(this).addClass('jquiztool-item-incorrect');
                                                }else{
                                                    $(this).addClass('jquiztool-item-correct');
                                                }
                                            });
                                            // we are going to check each answer provided and the order they are provided in
                                            $user_response.find('div.jquiztool-fitb-real-answer').html(g_params['fitb_correct_ans']+' <u>'+data['answers']+'</u>.');
                                            break;
                                        case Types.ESSAY:
                                            // no action, responses must be saved in DB
                                            break;
                                        case Types.HOT_SPOT:
                                            // we need to highlight the correct area
                                            var ans_x = $user_response.find('input[name=hotspot-coordinates-x]').val();
                                            var ans_y = $user_response.find('input[name=hotspot-coordinates-y]').val();
                                            var img_offset = $user_response.find(".jquiztool-user-response-hotspotdiv img").offset();
                                            var $ans_div = $('<div class="jquiztool-hotspot-answer" />').css({
                                                width: data.answers[0].x2 - data.answers[0].x1,
                                                height: data.answers[0].y2 - data.answers[0].y1,
                                                left: data.answers[0].x1,
                                                top: data.answers[0].y1
                                            });
											// remove click events on the image
											$user_response.find(".jquiztool-user-response-hotspotdiv img").unbind('click');
                                            $user_response.find(".jquiztool-user-response-hotspotdiv").append($ans_div);
                                            if (ans_x <= data.answers[0].x2 && ans_x >= data.answers[0].x1 && ans_y <= data.answers[0].y2 && ans_y >= data.answers[0].y1){
                                                user_correct = 1;
                                            }else{
                                                user_correct = -1;
                                            }
                                            break;
                                    }
                                }
                                
                                // show result using user_correct flag
                                if (user_correct == 1){
                                    showUserResult(g_params["correct_text"], 1);
                                    q_correct_count++;
                                }else if (user_correct == -1){
                                    showUserResult(g_params["incorrect_text"], -1);
                                    q_incorrect_count++;
                                }else{
                                    showUserResult(g_params["info_text"], 0);
                                    q_pending_count++;
                                }
                                
                            }else{
                                // for some reason, the question id that came back was different than the one requested
                                alert('Something appears to be amiss. Please contact your administrator with code: '+question_node['id']);
                            }
                        }
                        
                        // hide showing loader
                        toggleChecker(); 
                        
                        // toggle which UI buttons are enabled or disabled
                        $check_btn.button({ disabled: true });
                        $next_btn.button({ disabled: false });
                        
                        // if this is the last question, we should show quiz results
                        if ($q_counter.find('span.current_question').text() == $q_counter.find('span.total_questions').text()){
                            $next_btn.button({ label: g_params['view_quiz_result_lbl'] });
                            $next_btn.addClass('view-jquiztool-results');
                        }
                    }
                });
            }
            
            /**
             * Render out user notice whether question was correct or incorrect or saved
             * @param string content
             * @param int flag
             */
            function showUserResult(content, flag){
                if (flag == 1){
                    $q_reponse.addClass('jquiztool-response-correct');
                }else if (flag == -1){
                    $q_reponse.addClass('jquiztool-response-wrong');
                }else{
                    $q_reponse.addClass('jquiztool-response-info');
                }
                
                if (g_params['animate_ui']){
                    $q_reponse.html(content).slideDown(200, function(){
                        renderUserResponseArea();
                    });
                }else{
                    $q_reponse.html(content).show();
                    renderUserResponseArea();
                }
            }
            
            /**
             * Hide any user result being displayed
             */
            function hideUserResult(){
                if (g_params['animate_ui']){
                    $q_reponse.slideUp(200, function(){
                        $(this).removeClass('jquiztool-response-correct').removeClass('jquiztool-response-wrong');
                        renderUserResponseArea();
                    });
                }else{
                    $q_reponse.hide();
                    $(this).removeClass('jquiztool-response-correct').removeClass('jquiztool-response-wrong');
                    renderUserResponseArea();
                }
            }
            
            /**
             * Method to handle the updating of the visible height of the user response area
             */
            function renderUserResponseArea(){
                $user_response.height($control_bar.position().top - $user_response.position().top);
            }
            
            /**
             * Renders out the Essay question type
             */
            function renderEssay(){
                $user_response.html('<div class="jquiztool-instruction">'+g_params['essay_hint']+'</div><div class="jquiztool-user-response-essay"><textarea placeholder="'+g_params['essay_placeholder']+'"></textarea></div>');
                // $user_response.find('textarea').markItUp(); Future WYSIWYG support
            }
            
            /**
             * Renders a mutliple response question
             */
            function renderMultiResponse(){
                var content = '';
                $.each (question_node['options'], function(index, value){
                    content += '<label class="jquiztool-user-response-label"><input type="checkbox" value="'+value+'" /> '+value+'</label>';
                });
                $user_response.html('<div class="jquiztool-instruction">'+g_params['multiresponse_hint']+'</div>'+content);
            }
            
            /**
             * Renders a multiple choice question
             */
            function renderMultiChoice(){
                var content = '';
                $.each (question_node['options'], function(index, value){
                    content += '<label class="jquiztool-user-response-label"><input type="radio" name="jquiztool-radio-group" value="'+value+'" /> '+value+'</label>';
                });
                $user_response.html('<div class="jquiztool-instruction">'+g_params['multichoice_hint']+'</div>'+content);
            }
            
            /**
             * Renders a Fill In The Blank question
             */
            function renderFITB(){
                var input_count = 1;
                if (question_node['options'] && question_node['options'].length > 0 && question_node['options'][0]){
                    input_count = question_node['options'][0]['accept'];
                }
                var input_str = '';
                for (var i = 0; i < input_count; i++){
                    if (input_count > 1){
                        input_str += '<input type="text" class="jquiztool-user-response-fitb" placeholder="'+g_params['fitb_placeholder']+' '+(i+1)+'" />';
                    }else{
                        input_str += '<input type="text" class="jquiztool-user-response-fitb" placeholder="'+g_params['fitb_placeholder']+'" />';
                    }
                }
                $user_response.html('<div class="jquiztool-instruction">'+g_params['fitb_hint']+'</div><div class="jquiztool-user-response-fitbdiv">'+input_str+'<div class="jquiztool-fitb-real-answer"></div></div>');
            }
            
            /**
             * Renders out the ordered list if jQuery UI and sortable plugin exist
             */
            function renderOrderedList(){
                // verify jquery UI and sortable plugin exists
                if(jQuery.ui && jQuery.ui.sortable){
                    var content = '<div class="jquiztool-instruction">'+g_params['orderlist_hint']+'</div><ul class="jquiztool-sortlist">';
                    $.each (question_node['options'], function(index, value){
                        content += '<li class="jquiztool-user-response-list-item" id="'+value+'">'+value+'</li>';
                    });
                    content += "</ul>";
                    $user_response.html(content);
                    // set draggability and disable selection
                    $user_response.find('ul').sortable({ 
                        axis: 'y', // restrict to y axis
                        containment: $user_response // confine to user response area
                    }).disableSelection();
                }else{
                    // alert user requirement failed
                    $user_response.html('This question requires the use of the jQuery UI library and sortable plugin. Please contact your administrator.');
                }
            }
            
            /**
             * Renders out the hotspot question
             */
            function renderHotSpot(){
                // we will add the image, then add a listener to it to collect the answer
                var img_src = question_node['options'][0]['src'];
                $user_response.html('<div class="jquiztool-instruction">'+g_params['hotspot_hint']+'</div><div class="jquiztool-user-response-hotspotdiv"><img src="'+img_src+'"/><input type="hidden" name="hotspot-coordinates-x"/><input type="hidden" name="hotspot-coordinates-y"/><div class="jquiz-hotspot-answer-hl"></div></div>');
                $(".jquiztool-user-response-hotspotdiv img").click(function(e) {
					// get image offset for recording input relative to image
                    var offset = $(this).offset();
					var _x = e.pageX - offset.left;
					var _y = e.pageY - offset.top;
					// because we need the mouse position according to the parent for placing a child, let's access parent offset
					var p_offset = $(this).parent().offset();
					var p_x = e.pageX - p_offset.left;
					var p_y = e.pageY - p_offset.top;
                    $user_response.find('input[name=hotspot-coordinates-x]').val(_x);
                    $user_response.find('input[name=hotspot-coordinates-y]').val(_y);
					var $hs_highlight = $user_response.find('div.jquiz-hotspot-answer-hl');
					var width = $hs_highlight.outerWidth();
					var height = $hs_highlight.outerHeight();
					// position user's hit
					$hs_highlight.css({
						left: p_x - Math.floor(width) * .5,
						top:  p_y - Math.floor(height) * .5
					}).show();
                });
            }
            
            /**
             * Toggle showing/hiding the loading message
             */
            function toggleLoader(){
                // OPTIONAL: Enable these lines if you have slower server speeds
                //$overlay.fadeToggle();
                //$loader.fadeToggle().center();
            }
            
            /**
             * Toggle showing/hiding the checking answer message
             */
            function toggleChecker(){
                // OPTIONAL: Enable these lines if you have slower server speeds
                //$checker.text(g_params['checking_text']);
                //$overlay.fadeToggle();
                //$checker.fadeToggle().center();
            }
            
            /**
             * Display quiz results
             * @returns {undefined}
             */
            function showResults(){
                // set quiz counts for each category
                $q_result_div.find('td.q-correct-count').text(q_correct_count);
                $q_result_div.find('td.q-incorrect-count').text(q_incorrect_count);
                $q_result_div.find('td.q-pending-count').text(q_pending_count);
                $overlay.fadeToggle();
                $q_result_div.fadeToggle().center();
            }
        });
    };
})( jQuery );