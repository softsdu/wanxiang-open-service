
//ncpGrid
var grid = null;

//操作按钮列的名称
const operateColumnName = "operateColumn";

function getCellContainerId(rowId){
	return operateColumnName + "_" + rowId;
}

$(document).ready(function(){
	var p = {
		containerId: "testGridContainer",
		multiselect: true,
		dataModel: dataModels.s3d_App,
		onePageRowCount: 20,
		isRefreshAfterSave: false,
		viewModel: viewModels.s3d_AppView
	};
	grid = new NcpGrid(p);
	grid.show();
});