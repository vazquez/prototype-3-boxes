$(document).ready(function(){

    var addBricks = ["heading","image","text","button","heading","text","image"];
    var addBricks = ["heading","heading","heading"];

    setTimeout(function(){
        $(".secondary-page").addClass("page-transition");
        $("#header, #screen").addClass("loaded");
    },200);

    // Brings in the templates markup
    $(".loaded-content").load("templates.html", function(){
        $(addBricks).each(function(i,item){
            var el = $(".templates .brick[type="+item+"]").clone();
            var ui = $(".templates .ui-template").clone();
            el.append(ui);
            var ham = new makeFeelySlider(el[0]);
            $("div.bricks").append(el);
        });
        checkBricks();
     });

    //Edit name UI
    $("#header .app-name").hammer().on("tap",function(){
        $(".all-wrapper").toggleClass("edit-name");
        var appName = $.trim($(".app-name-text").text());
        $("input").val(appName);
    });

    $(".edit-name-page .cancel").hammer().on("tap",function(){
        $(".all-wrapper").toggleClass("edit-name");
        $("input").blur();
    });

    $(".edit-brick-page .cancel").hammer().on("tap",function(){
        unselectBricks();
        $(".all-wrapper").toggleClass("edit-brick");
    });

    $(".edit-name-page .save").hammer().on("tap",function(){
        $(".all-wrapper").toggleClass("edit-name");
        var appName = $(".edit-name-page input").val();
        $(".app-name-text").text(appName);
        $(".edit-name-page input").blur();
    });

    //App menu - Show & Hide
    $("#header .menu, .app-menu .cancel").hammer().on("tap", function(){

        toggleMenu();
    });

    $(".app-menu").hammer().on("swipeleft", function(){
        toggleMenu();
    });


    // Add Brick Page - Show & Hide
    $(".add-brick").hammer().on("tap", function(){
        $(".add-brick-page").toggleClass("showing");
        unselectBricks();
    });

    $(".add-brick-page .cancel").hammer().on("tap", function(){
        $(".add-brick-page").toggleClass("showing");
    });

    $(".add-brick-page").hammer().on("swiperight", function(){
        $(".add-brick-page").toggleClass("showing");
    });

    // Add element
    $(".add-brick-page .bricks li").hammer().on("tap",function(e){
        var el = e.target;
        var type = $(el).attr("type");
        addBrick(type);
        $(".add-brick-page").toggleClass("showing");
        e.stopPropagation();
    });


    // The little "tap me" affordance
    $(".brick:first-child").append("<div class='tapme'></div>");
    setTimeout(function(){
        $(".tapme").remove();
    },2000);

});

function checkBricks() {

    if($("div.bricks .brick").length === 0) {
        $(".add-content-helper").show();
    } else {
        $(".add-content-helper").hide();
    }
}

function addBrick(type) {

    var cloneThis = $(".templates [type="+type+"]").first();
    var newBrick = cloneThis.clone();

    //Figure out which brick to put things after
    var insertAfter;

    $("div.bricks .brick").each(function(index,el){
        var edgebelow = $(window).scrollTop() - ($(el).height() + $(el).offset().top - 50);
        if(edgebelow < 0) {
            insertAfter = el;
            return false;
        }
    });

    var ui = $(".templates .ui-template").clone();
    newBrick.append(ui);
    if(insertAfter){
        $(insertAfter).after(newBrick);
    } else {
        $("div.bricks").append(newBrick);
    }


    var slam = new makeFeelySlider(newBrick[0]);

    $(newBrick).addClass("just-added");
    setTimeout(function(){
        $(newBrick).removeClass("just-added");
        selectBrick(newBrick[0]);
    },1000);

    checkBricks();
}

function toggleMenu() {

    unselectBricks();
    $(".all-wrapper").toggleClass("menu-open");
}

function selectBrick(el) {
    el.classList.add("open");
    $(".brick .overlay").css("opacity","1");
    $(el).find(".overlay").css("opacity","0");
    centerOpenElement();
    $("#screen").addClass("darken");
}

function unselectBricks() {
    $(".open").removeClass("open");
    $("#screen").removeClass("darken");
    $(".brick .overlay").css("opacity","0");
}

function centerOpenElement() {
    var el = $(".open");
    var viewHeight = $("#screen").outerHeight() - 50;
    var elHeight = el.outerHeight() + 70;
    var space = (viewHeight - elHeight) / 2;
    var elTop =  el.offset().top;
    var delta = space - elTop;
    $('#screen').stop().animate({
        'scrollTop': $("#screen").scrollTop() - delta - 60
    }, 200, 'swing');
}


function toggleEditBrick(){
    $(".all-wrapper").toggleClass("edit-brick");
}

var deletedIndex = "blam";

function makeFeelySlider(el){

    var slider = {
        el : "",
        ui : "",
        toggleClicked : function(e){
            var anythingOpen = $(".open").length;
            if(anythingOpen > 0) {
                unselectBricks();
            } else {
                selectBrick(this.el);
            }
        },
        cloneMe : function(){

            var clone = $(this.el).clone();
            clone.removeClass("open");

            $(".brick").removeClass("open");
            $(".overlay").css("opacity","0");

            var jammer = new makeFeelySlider(clone[0]);

            $(this.el).after(clone);
            clone.hide();
            clone.css("opacity",0);

            clone.slideToggle(function(){
                clone.css("opacity",1);
            });
        },
        move : function(direction){
            var myIndex = $(this.el).index();
            var me = $(this.el);
            if(direction == "up") {
                var previousBrick = $(".bricks .brick:nth-child("+myIndex+")");
                var myTop = me.position().top;
                var prevTop = previousBrick.position().top;
                var delta = -1 * (myTop - prevTop);
                $(".bricks").addClass("sorting");
                me.css("-webkit-transform","translateY("+delta+"px)");
                previousBrick.css("-webkit-transform","translateY("+ (me.outerHeight()) +"px)");
                var that = this;

                setTimeout(function(){
                    $(".bricks").removeClass("sorting");
                    me.css("-webkit-transform","translateY(0px)");
                    previousBrick.css("-webkit-transform","translateY(0px)");
                    previousBrick.before(that.el);
                    centerOpenElement();
                },200);
            }

            if(direction == "down"){
                var nextBrick = $(".bricks .brick:nth-child(" + (myIndex+2) + ")");
                var myBottom = me.position().top + me.outerHeight();
                var nextBottom = nextBrick.position().top + nextBrick.outerHeight();
                var delta = -1 * (myBottom - nextBottom);
                $(".bricks").addClass("sorting");
                me.css("-webkit-transform","translateY("+delta+"px)");
                nextBrick.css("-webkit-transform","translateY("+ (-1*me.outerHeight()) +"px)");

                var that = this;
                setTimeout(function(){
                    $(".bricks").removeClass("sorting");
                    me.css("-webkit-transform","translateY(0px)");
                    nextBrick.css("-webkit-transform","translateY(0px)");
                    nextBrick.after(that.el);
                    var bottom = $(window).scrollTop() + window.innerHeight;
                    var bottomEl = me.offset().top + me.outerHeight() + 70;
                    centerOpenElement();
                },200);
            }

        },
        deleteMe : function(){
            var that = this;
            unselectBricks();

            this.el.classList.add("delete");
            deletedIndex = $(this.el).index();

            $(".brick").removeClass("open");
            $(".overlay").css("opacity","0");

            setTimeout(function(){
                $(that.el).slideToggle();
            },200);
            setTimeout(function(){
                $(that.el).remove();
                checkBricks();
            },600);

            setTimeout(function(){
                $("#popnote").addClass("show");
            },500);
            setTimeout(function(){
                $("#popnote").removeClass("show");
            },10000);

        },
        init: function(el){

            var that = this;
            this.el = el;

            $(el).find(".overlay").hammer().on("tap",function(ev){
                that.toggleClicked();
            });

            $(el).find(".del").hammer().on("tap",function(ev){
                that.deleteMe();
            });


            $(el).find(".move-up").hammer().on("tap",function(ev){
                that.move("up");
            });

            $(el).find(".move-down").hammer().on("tap",function(ev){
                that.move("down");
            });

            $(el).find(".edit").hammer().on("tap",function(ev){
                toggleEditBrick();
            });


            $(el).find(".dupl").hammer().on("tap",function(ev){
                unselectBricks();
                that.cloneMe();
            });

            this.ui = $(this.el).find(".brick-ui");
        }
    }

    slider.init(el);

    return slider;

}
