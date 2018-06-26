$(function () {
    nav(); //下拉
    toolbar(); //qq在线
    links(); //友情链接
    news();
    //	 $(".nav_main ul li a").removeClass("hover"); //状态保存
    //	 $(".nav_main ul li a").each(function (i) {
    //	     if ($(this).attr("href") != "/") {
    //	         if (window.location.href.indexOf($(this).attr("href").replace(/[ ]/g, "").replace(/[\r\n]/g, "")) > -1) {
    //	             $(this).addClass("hover");

    //	         }

    //	     }
    //	 });
});
function nav(){
	//导航条鼠标滑过;
	$(".nav_main ul li").hover(function(){
		$(this).children("a").addClass("hover");
		$(this).siblings().children("a").removeClass("hover");
		$(this).children("dl").slideDown();
	},
	function(){
		$(this).children("a").removeClass("hover")
		$(this).children("dl").hide();
		
});

}

function news() {
    $('.news_ul li').hover(function () {
        $(this).find('.left').stop(false).animate({ "padding-left": 10, 'border-left-width': 40 }, 'slow');
        $(this).find('.right').stop(false).animate({ "padding-right": 10, 'border-right-width': 10 }, 'slow');

    }, function () {
        $(this).find('.left').stop(false).animate({ "padding-left": 0, 'border-left-width': 0 }, 'fast');
        $(this).find('.right').stop(false).animate({ "padding-right": 0, 'border-right-width': 0 }, 'fast');
    })
}

function showTit() {    
    var tabh = $(".a_nav").offset().top;    
    $(window).scroll(function () {
        var a = $(document).scrollTop();
        if (a > tabh) {
            $(".a_nav").addClass("a_hover");
        } else {
            $(".a_nav").removeClass("a_hover");
        }     

    });
    
}
function topSearchProduct() {
    var keyWord = $("#SearchTxt").val();
    if (keyWord == "") {
        alert("请输入关键字");
        return false;
    }
    if (keyWord.indexOf("+") >= 0) {
        alert("搜索关键字不能包含特殊符号！");
        return;
    }
    if (keyWord.indexOf("&") >= 0) {
        alert("搜索关键字不能包含特殊符号！");
        return;
    }
    if (keyWord.indexOf("#") >= 0) {
        alert("搜索关键字不能包含特殊符号！");
        return;
    }
    if (keyWord.indexOf("”") >= 0) {
        alert("搜索关键字不能包含特殊符号！");
        return;
    }
    if (Validate.isNumber(keyWord)) {
        alert("搜索关键字不能为纯数字！");
        return;
    }
    var url = "/News/Keyword/" + encodeURIComponent(keyWord) + ".html";
    window.location = url;
  
}
function links(){
	$('.son_ul').hide();
    $('.select_box span').hover(function () {

        $(this).parent().find('dl.son_ul').stop(true, true).slideDown();

        $(this).parent().hover(function () { },
					   function () {
					       $(this).parent().find("dl.son_ul").slideUp();
					   }
					   );
    }
					);
}
function toolbar(){
	$('#toolbar dd').bind({
		'mouseenter': function(){
			if($(this).children('.slide').length){
				var _this = $(this).children('.slide');
				_this.stop(true, true).animate({'width': 180}, 200);
			}else if($(this).children('.pop').length){
				var _this = $(this).children('.pop');
				_this.show().animate({'right': 65}, 200);
			}
		},
		'mouseleave': function(){
			if($(this).children('.slide').length){
				var _this = $(this).children('.slide');
				_this.stop(false, false).animate({'width': 0}, 200);
			}else if($(this).children('.pop').length){
				var _this = $(this).children('.pop');
				_this.hide().animate({'right': 90}, 200);
			}
		}
	});
	$("#top").click(function () {
        $("body, html").stop().animate({ "scrollTop": 0 });
    });
	$("#close").click(function () {
        $("#toolbar").hide();
    });
}
function checkMeessige() {
    var name = o("applyName").value;
    var phone = o("phone").value;
    var email = o("email").value;
    if (name == "") {
        alertMessage("请输入姓名");
        document.getElementById('applyName').focus();
        return false;
    }
    if (!name.match(/^[A-Za-z]+$/) && !name.match(/^[一-龥]{0,}$/)) {
        alertMessage("姓名请输入英文名或者中文名");
        document.getElementById('applyName').focus();
        return false;
    }
    if (phone == "") {
        alertMessage("请输入手机号码");
        document.getElementById('phone').focus();
        return false;
    }
    if (!Validate.isMobile(phone)) {
        alertMessage("请输入正确的手机号码");
        document.getElementById('phone').focus();
        return false;
    }
    if (email != "") {
        if (!Validate.isEmail(email)) {
            alertMessage("请输入正确的邮箱");
            document.getElementById('email').focus();
            return false;

        }
    }
    $.ajax({
        url: '/Guestbook.aspx?Action=userMessige',
        type: 'POST',
        data: $(".form1").serialize(),
        success: function (result) {
            var arr = result.split('|');
            if (arr[0] == "ok") {
                alertMessage("留言成功！", 500);
                setTimeout(function () {
                    window.location.reload();
                }, 2000);
            }
            else {
                alertMessage(arr[1], 500);
            }
        }
    });
}   

function index(){//首页
    $(window).scroll(function () {
        var windowHeight = $(window).height();
        var Scroll = $(document).scrollTop();
        if (($(".floor_main_1").offset().top - Scroll - windowHeight) <= 0) {
            $(".floor_main_1 ").addClass("upIn animated");
        }

        if (($(".floor_main_2").offset().top - Scroll - windowHeight) <= 0) {
            $(".floor_main_2 h1,.floor_main_2 h2").addClass("upIn animated");
        }
        if (($(".floor_main_2 .picScroll-left").offset().top - Scroll - windowHeight) <= 0) {
            $(".floor_main_2 .picScroll-left").addClass("downIn animated");
        }
        if (($(".floor_main_3").offset().top - Scroll - windowHeight) <= 0) {
            $(".floor_main_3 h1,.floor_main_3 h2").addClass("upIn animated");
        }
        if (($(".floor_main_3 .news_ul").offset().top - Scroll - windowHeight) <= 0) {
            $(".floor_main_3 .news_ul").addClass("upIn animated");
        }
        if (($(".floor_main_4 h2").offset().top - Scroll - windowHeight) <= 0) {
            $(".floor_main_4 h2,.floor_main_4 h3").addClass("upIn animated");
        } 
        if (($(".floor_main_4 .left").offset().top - Scroll - windowHeight) <= 0) {
            $(".floor_main_4 .left").addClass("leftIn animated");
           
        }
        if (($(".floor_main_5").offset().top - Scroll - windowHeight) <= 0) {
            $(".floor_main_5").addClass("upIn animated");
        }
        if (($(".floor_main_7 .title ").offset().top - Scroll - windowHeight) <= 0) {
            $(".floor_main_7 .title").addClass("upIn animated");
        } 
        if (($(".floor_main_7 .bd ").offset().top - Scroll - windowHeight) <= 0) {
            $(".floor_main_7 .bd").addClass("downIn animated");
        }
        if (($(".floor_main_8 ").offset().top - Scroll - windowHeight) <= 0) {
            $(".floor_main_8").addClass("downIn animated");
        }
        if (($(".floor_main_8 .body ").offset().top - Scroll - windowHeight) <= 0) {
            $(".floor_main_8 h1,.floor_main_8 h2").addClass("downIn animated");
        }
        if (($(".floor_main_8 .ul ").offset().top - Scroll - windowHeight) <= 0) {
            $(".floor_main_8 .ul").addClass("upIn animated");
        }







    })
}
function aboutScroll(){//about
	$(window).scroll(function () {
		 var windowHeight = $(window).height();
   		 var Scroll = $(document).scrollTop();
   		 if (($(".about2").offset().top - Scroll - windowHeight) <= 200) {
   		 	$(".about2 li:nth-child(2n)").css("margin-top","126px")
   		 	
   		 }
	})
}




function about(){
	 $('#img-slider li').bind({
        reposition: function() {
            var degrees = $(this).data('roundabout').degrees,
                roundaboutBearing = $(this).parent().data('roundabout').bearing,
                rotateY = Math.sin((roundaboutBearing - degrees) * (Math.PI/180)) * 9;

//          $(this).css({
//              "-webkit-transform": 'rotate(' + rotateY + 'deg)',
//              "-moz-transform": 'rotate(' + rotateY + 'deg)',
//              "-ms-transform": 'rotate(' + rotateY + 'deg)',
//              "-o-transform": 'rotate(' + rotateY + 'deg)',
//              "transform": 'rotate(' + rotateY + 'deg)'
//          });
        }
    });

    $('.jQ_sliderPrev').on('click', function(){
        $('#img-slider').roundabout('animateToNextChild');

        return false;
    });

    $('.jQ_sliderNext').on('click', function(){
        $('#img-slider').roundabout('animateToPreviousChild');

        return false;
    });

    $('body').on('keyup', function(e) {
        var keyCode = e.which || e.keyCode;

        if(keyCode == 37) {
            $('#img-slider').roundabout('animateToPreviousChild');
            e.preventDefault();
            return false;
        } else if(keyCode == 39) {
            $('#img-slider').roundabout('animateToNextChild');
            e.preventDefault();
            return false;
        }
    });

    $('.jQ_sliderSwitch li').on('click', function() {
        var $elem = $(this);
        var index = $elem.index();

        $('#img-slider').roundabout('animateToChild', index);

        return false;
    });

    $('#img-slider').roundabout({
        minScale: 0.4,
        maxScale: 0.9,
        duration: 750
    }).bind({
        animationEnd: function(e) {
            var index = $('#img-slider').roundabout('getChildInFocus');
            $('.jQ_sliderSwitch li').removeClass('active');
            $('.jQ_sliderSwitch li').eq(index).addClass('active');
        }
    });
	
}
//关于我们频道页滚动效果
function slide_nav(sum) {

    var fl = true;
    var num = new Array();
    (function () { for (var i = 1; i <= sum; i++) { num[i] = $(".as" + i).offset().top; } return num; })();

    var ie6 = ! -[1, ] && !window.XMLHttpRequest;
    $(window).scroll(function () {

        var sc = $(window).scrollTop();      
        $.each(num, function (n, value) {
            if (value - 70 < sc) {
                if (sc < value + 70) {
                    if (fl) {
                        var m = n;

                        $(".a_nav .a" + m).addClass("hover").parent().siblings().find("a").removeClass("hover");
                    }
                }
            }
        });


        if (!ie6) return false;

        var sh = $(window).height();
        if (sc > 400) {
            var scc = sc + (sh - 600);
            $(".a_nav").css("top", scc + "px");
        }
    });
    $(".a_nav li a").click(function () {
        var v = $(this).addClass("hover").parent().siblings().find("a").removeClass("hover");
        var c = $(this).attr("hrefs").substr(2, $(this).attr("hrefs").length);
        c = $(".as" + c).offset().top - 85;
        fl = false;
        $('body,html').stop(false).animate({ scrollTop: c }, 500, function () {
            fl = true;
        });
    })        

};
