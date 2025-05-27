function SelectComponentForm() {
    var thatForm = this;

    this.containerId = null;

    this.fromComCode = null;
    this.fromComVersionNum = null;
    this.mapTypeCode = null;

    this.init = function (p) {
        thatForm.containerId = p.containerId;
        thatForm.fromComCode = p.code;
        thatForm.fromComVersionNum = p.versionNum;
        thatForm.mapTypeCode = p.mapTypeCode;
        thatForm.initItems(p);
    }

    this.getRelatedMapComs = function (p) {
        let componentCode = p.code;
        let componentVersionNum = p.versionNum;
        let mapTypeCode = p.mapTypeCode;
        let relatedMapComs = [];
        for (let i = 0; i < js3MapComs.length; i++) {
            let mapCom = js3MapComs[i];
            if (mapCom.fromComCode === componentCode
                && mapCom.fromComVersionNum === componentVersionNum
                && mapCom.mapTypeCode === mapTypeCode) {
                relatedMapComs.push(mapCom);
            }
        }
        return relatedMapComs;
    }

    this.initItems = function (p) {
        let container = $("#" + thatForm.containerId);
        let relatedMapComs = thatForm.getRelatedMapComs(p);
        let innerHtml = "";
        for (let i = 0; i < relatedMapComs.length; i++) {
            let mapCom = relatedMapComs[i];
            var requestParam = {
                componentCode: encodeURIComponent(mapCom.toComCode),
                versionNum: encodeURIComponent(mapCom.toComVersionNum)
            };
            let componentInfoJson = {};
            $.ajax({
                type: "GET",
                url: "../../../../../mdlComponentNcpService/getComponentInfoByCode.action",
                async: false,
                data: {
                    requestParam: cmnPcr.jsonToStr(requestParam)
                },
                dataType: "json",
                success: function (data) {
                    if (data[0] && data[0].code == 000) {
                        console.log(data[0].result.componentInfo)
                        componentInfoJson=data[0].result.componentInfo
                    } else {
                        alert(data[0].message);
                    }
                },
                error: function (data, status, e) {
                    alert("数据访问错误，请重试");
                }
            });
            const cardImgSrc = thatForm.formatCardImgSrc(componentInfoJson.imgId);
            innerHtml += ("<div class=\"itemDiv\" comCode=\"" + mapCom.toComCode + "\" comVersionNum=\"" + mapCom.toComVersionNum + "\"><img id=\"" + container + "\"  style=\"width:auto;height:auto;max-width: 90%;max-height: 60px;margin-right: 30px;\" src=\"" + cardImgSrc + "\">" + mapCom.toComName + "<br/>(" + mapCom.toComCode + ", " + mapCom.toComVersionNum + ")</div>");
        }
        $(container).html(innerHtml);
        $(container).find(".itemDiv").click(function () {
            $("#" + thatForm.containerId).find(".itemDiv").removeClass("itemDivActive");
            $(this).addClass("itemDivActive");
        });
        $(container).find(".itemDiv")[0].click();
    }
    this.formatCardImgSrc = function (img) {
        var src = basePath + "/images/common/southeast3.jpg";
        if (img !== null && img !== undefined && img !== '') {
            src = basePath + "/cms/getCMSImage?id=" + img;
        }
        return src;
    }
    this.getSelectedComponent = function () {
        let activeItem = $("#" + thatForm.containerId).find(".itemDivActive")[0];
        return {
            fromComCode: thatForm.fromComCode,
            fromComVersionNum: thatForm.fromComVersionNum,
            toComCode: $(activeItem).attr("comCode"),
            toComVersionNum: $(activeItem).attr("comVersionNum")
        };
    }
}
