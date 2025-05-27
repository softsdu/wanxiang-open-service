import {msgBox} from "../../../../../commonjs/common/common.js";

function ChinaAncient01Gray(){
    const thatGray = this;

    this.containerId = null;

    this.manager = null;


    this.init = function (p) {
        thatGray.containerId = p.containerId;
        thatGray.manager = p.manager;
        thatGray.bindEvents();
    }

    this.bindEvents = function (){
        let container = $("#" + thatGray.containerId).find(".chinaAncient01OverviewInnerContainer");

        $(container).find(".chinaAncient01GrayBtnHome").click(function (){
            window.location.url = $(this).attr("itemValue");
            return false;
        });

        $(container).find(".chinaAncient01GrayBtnRotate").click(function (){
            msgBox.alert({info: "动画"});
            return false;
        });

        $(container).find(".chinaAncient01GrayBtnShare").click(function (){
            msgBox.alert({info: "分享"});
            return false;
        });

        $(container).find(".chinaAncient01GrayBtnLike").click(function (){
            msgBox.alert({info: "点赞"});
            return false;
        });
    }

}
export default ChinaAncient01Gray