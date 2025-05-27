<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../base.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>材料字典</title>

    <%--	<script type="text/javascript" src="${dataModel}/cat_CategoryList.js"></script>--%>
    <%--	<script type="text/javascript" src="${viewModel}/cat_CategoryList.js"></script>--%>
    <%--	<script type="text/javascript" src="${treeModel}/catetoryList.js"></script>--%>

    <script type="text/javascript" src="${dataModel}/mtl_Material.js"></script>
    <script type="text/javascript" src="${viewModel}/mtl_Material.js"></script>

    <script type="text/javascript" src="${base}/platform/base/ncpViewCard.js?timestemp='20230309'"></script>
    <link rel="stylesheet" type="text/css" href="${base}/css/ncpViewCard.css?timestemp='20230309'">

    <style>

        .zlpToolbarQueryContainer {
            min-width: 260px;
        }

        .zlpToolbarQueryContainer .zlpToolbarQueryInputText {
            min-width: 210px;
        }

        .box-card {
            aspect-ratio: 3/3.6;
            background-color: hsla(0, 0%, 50.2%, .72);
        }

        .el-image {
            height: 100%;
            width: 100%;
            position: relative;
            aspect-ratio: 1/1;
        }

        .title {
            padding: 3px 5px 0 5px;
            font-size: 12px;
            /*position: relative;*/
            top: -5px;
            height: 40px;
            line-height: 15px;
            z-index: 10;
            text-align: left;
            /*background-color: hsla(0,0%,50.2%,.72);*/
            color: #fff;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .title-content {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }


    </style>
    <script>
        var grid;
        $(document).ready(function () {
            // //列 added by liyh 20210824
            // var imgIdColModel = null;
            // for(var i = 0; i < viewModels.mdl_ComponentList.colModel.length; i++){
            // 	var cModel = viewModels.mdl_ComponentList.colModel[i];
            // 	if(cModel.name == "imgid"){
            // 		imgIdColModel = cModel;
            // 		break;
            // 	}
            // }
            // imgIdColModel.formatter = function(cellvalue, options, rowObject) {
            // 	var id = rowObject.id;
            // 	var rowId = options.rowId;
            // 	var containerId = "id_" + rowId;
            // 	var imgId = rowObject.imgid;
            // 	if (imgId != null) {
            // 		var imgUrl = "../../accessory/getImage?id=" + imgId.split(",")[0];
            // 		return "<div style=\"text-align:center;\"><img id=\"" + containerId + "\"  style=\"width:auto;height:auto;max-width: 90%;max-height: 30px;\" src=\"" + imgUrl + "\" onclick=\"showImage('" + imgUrl + "', '" + rowObject.name + "');\"></div>";
            // 	}
            // 	else {
            // 		return "";
            // 	}
            // }

            var initParam = window.parent.popInitParam;
            var p = {
                containerId: "testGridContainer",
                multiselect: false,
                dataModel: dataModels.mtl_Material,
                onePageRowCount: 20,
                viewModel: viewModels.mtl_Material,
                sysWhere: [{parttype: "field", field: "isactive", operator: "=", value: "Y"}]
            };
            grid = new NcpViewCard(p);

            // var pCat = {
            // 	containerId:"catGridContainer",
            // 	treeModel:treeModels.catetoryList,
            // 	isExpandRoot:false,
            // 	multiselect:false
            // };
            // tree = new NcpTree(pCat);

            var closePop = function (rowIds) {
                var selectedRows = null;
                if (rowIds == null) {
                    selectedRows = null;
                } else {
                    selectedRows = {};
                    for (var i = 0; i < rowIds.length; i++) {
                        var rowId = rowIds[i];
                        selectedRows[rowId] = grid.datatable.rows(rowId).allCells();
                    }
                }
                initParam.closeWin({selectedRows: selectedRows});
            };

            grid.setGridOtherParam = function (initParam) {
                initParam.ondblClickRow = function (rowId, iRow, iCol, e) {
                    closePop([rowId]);
                }
            };
            grid.initCardListHtml = function (param) {
                this.gridDiv = $("#" + this.containerId).find("div[name='gridDiv']")[0];
                var html = "";
                for (var rowId in this.datatable.allRows()) {
                    var row = this.datatable.rows(rowId);
                    console.log(row._hash.color)
                    var cardDivTitle = row._hash.code;
                    var cardTitle = row._hash.name;
                    var showContent = "名称：" + cardTitle + "  编码：" + cardDivTitle;
                    if (row._hash.imageaccessoryid !== undefined && row._hash.imageaccessoryid != null) {
                        var cardImgSrc =  basePath + "/cms/getCMSImage?id=" + row._hash.imageaccessoryid ;
                        var oneHtml = " <div id='" + rowId + "' style=\"width: 160px; box-sizing: border-box; margin: 5px; position: relative;\"> " +
                            "   <div class=\"box-content\" title='" + showContent + "'>" +
                            "   <div class=\"el-card box-card is-always-shadow\" >" +
                            "   <div class=\"el-card__body\" > " +
                            "   <div class=\"el-image\" style=\"\"> " +
                            "		<img src=\"" + cardImgSrc + "\" class=\"el-image__inner\" style=\"object-fit: cover;\">" +
                            // "   <div class=\"el-image__error\">加载失败</div>\n" +
                            // "    <img src=\""+basePath+"/images/common/southeast3.jpg\" class=\"el-image__inner\" style=\"object-fit: cover;\">" +
                            "   </div> " +
                            "   <div class=\"title\"><div class='title-content' title='" + showContent + "'>名称：" + cardTitle + "</div><div class='title-content' title='" + showContent + "'>编码：" + cardDivTitle + "</div></div>" +
                            "   </div> " +
                            "   </div> " +
                            "   </div> " +
                            " </div>";
                        html += oneHtml;
                    } else {
                        var oneHtml = " <div id='" + rowId + "' style=\"width: 160px; box-sizing: border-box; margin: 5px; position: relative;\"> " +
                            "   <div class=\"box-content\" title='" + showContent + "'>" +
                            "   <div class=\"el-card box-card is-always-shadow\" >" +
                            "   <div class=\"el-card__body\" > " +
                            "   <div class=\"el-image\" style='background-color:#"+row._hash.color+";width: 100%'> " +
                            // "		<img src=\"" + cardImgSrc + "\" class=\"el-image__inner\" style=\"object-fit: cover;\">" +
                            // "   <div style='background-color:"+row._hash.color+";'></div>" +
                            // "    <img src=\""+basePath+"/images/common/southeast3.jpg\" class=\"el-image__inner\" style=\"object-fit: cover;\">" +
                            "   </div> " +
                            "   <div class=\"title\"><div class='title-content' title='" + showContent + "'>名称：" + cardTitle + "</div><div class='title-content' title='" + showContent + "'>编码：" + cardDivTitle + "</div></div>" +
                            "   </div> " +
                            "   </div> " +
                            "   </div> " +
                            " </div>";
                        html += oneHtml;
                    }
                }//如果为空 默认显示没有数据
                if (html === "") {
                    html = "<div class=\"el-table__empty-block\" style=\"width: 100%; height: 100%;\"><span class=\"el-table__empty-text\">暂无数据</span></div>";
                }
                $(this.gridDiv).html(html);
                this.bindCardEvent(param);
            };
            grid.formatCardDivTitle = function (row) {
                var html = "";
                if (row) {
                    html = row.getValue("code");
                }
                return html;
            };

            grid.addExternalObject({
                afterRowSelect: function (rowId) {
                    closePop([rowId]);
                }
            });

            //过滤3d组件 added by ls 20221124
            // grid.sysWhere = [{parttype:"field", field: "mdltype", operator:"<>", value: "component2d"}];
            // tree.treeGridCtrl.sysWhere = [{parttype:"field", field: "mdltype", operator:"<>", value: "component2d"}];

            // tree.treeGridCtrl.addExternalObject({
            // 	afterRowSelect: function(rowId){
            // 		var catRow = tree.treeGridCtrl.datatable.rows(rowId);
            // 		var categoryCode = catRow.getValue("code");
            // 		grid.sysWhere = [{parttype:"field", field: "categorycode", operator:"like", value: categoryCode + "%"}];
            // 		grid.doPage({pageNumber: 1});
            // 	}
            // });

            grid.show();
            // tree.show();

            $("#testGridContainer").find("a[name='returnBtn']").click(function () {
                var rowIds = grid.getSelectedRowIds();
                if (rowIds.length == 0) {
                    msgBox.alert({info: "请选中记录."});
                } else {
                    closePop(rowIds);
                }
            });
            $("#testGridContainer").find("a[name='returnNullBtn']").click(function () {
                closePop([]);
            });
            $("#testGridContainer").find("a[name='closeBtn']").click(function () {
                closePop(null);
            });
        });

        function showImage(imgUrl, title) {
            var popContainer = new PopupContainer({
                width: 800,
                height: 500,
                top: 15,
                title: title
            });

            popContainer.show();
            var inputId = cmnPcr.getRandomValue();
            var innerHtml = "<div style=\"position:absolute;width:100%;height:100%;text-align:center; vertical-align: middle;display:table-cell; overflow:auto;" +
                "background:url(" + imgUrl + ") center no-repeat;\">"
                + "</img>";

            $("#" + popContainer.containerId).html(innerHtml);
        }
    </script>
</head>
<body id="testGridContainer">
<div class="zlpGridStyleContainer" id="mdlComtGridContainer"
     style="position:absolute;right:0px;top:0px;bottom:0px;left:0px;; width:auto;">
    <div class="zlpGridStyleInnerContainer">
        <div class="zlpToolbarContainer el-card-head">
            <div class="zlpToolbarLeftContainer">
                <%--					<a name="closeBtn" href="#" class="zlpToolbarBtn closeBtn">关闭</a> --%>
                <%--					<a name="returnNullBtn" href="#" class="zlpToolbarBtn returnNullBtn">返回空值</a>--%>
                <%--					<a name="returnBtn" href="#" class="zlpToolbarBtn returnBtn">返回</a> --%>
                <div class="zlpToolbarQueryContainer">
                    <input type="text" class="zlpToolbarQueryInputText" placeholder="请输入关键字"/>
                    <a name="queryBtn" href="#" class="zlpToolbarQueryBtn">查询</a>
                </div>
            </div>
        </div>

        <div class="zlpGridContainer card-list" name="gridDiv">

        </div>

        <div class="zlpBottomContainer el-card-bottom">
            <ul class="zlpNavUl pagination">
            </ul>
        </div>
    </div>
</div>

</body>
</html>