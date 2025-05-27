//暂不使用功能，未测试通过
var cssFiles = [
           	"../../css/jquery-ui-custom.css", 
           	"../../css/ui.jqgrid.css", 
           	"../../css/easyui.css", 
           	"../../css/icon.css",
			"../../css/common.css",
           	"../../css/ncpCard.css", 
           	"../../css/ncpGrid.css"
           	];

var jsFiles = [
           	"../../js/jq/jquery-1.8.0.min.js",
           	"../../js/jq/jquery.simplemodal.1.4.4.min.js",
           	"../../js/jq/jquery.easyui.min.js", 
           	"../../js/jq/jquery.jqGrid.min.js",
           	"../../js/jq/grid.locale-cn.js",
           	"../../js/base/json.js",
           	"../../js/base/datatable.js",
           	"../../js/base/hashtable.js",
           	"../../js/base/datarow.js",
           	"../../js/base/common.js",
           	"../../js/base/static.js",
           	"../../js/base/ncpCard.js",
           	"../../js/base/ncpGrid.js",
           	"../../js/base/ncpView.js",
           	"../../js/base/ncpSheet.js",
           	"../../js/base/dispunit.js"
            ];

for(var i=0;i<cssFiles.length;i++){
	document.writeln("<link rel=\"stylesheet\" type=\"text/css\" href=\"" + cssFiles[i] + "\" />");
}
for(var i=0;i<jsFiles.length;i++){
	document.writeln("<script type=\"text/javascript\" src=\"" + jsFiles[i] + "\" />");
}