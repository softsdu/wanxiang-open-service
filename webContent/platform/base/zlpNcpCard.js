function ZlpNcpCard(p) {

	var that = this; 
	//基类
	this.base = NcpCard;
	this.base(p);	
	
	this.joinDataToGrids = {};

	var externalObject = {
		afterDoPage: function(param){
			var row = param.datatable.getRowByIndex(0);
			var idValue = row == null ? null : row.getValue(that.dataModel.idFieldName);
			if(idValue != null){
				showAllNGraph(that.dataModel.name, idValue);
				that.showRelateData(idValue);
			}
		}
	}
	this.addExternalObject(externalObject); 	
	
	this.showRelateData = function(idValue){
		var detailGridContainers = $("#" + that.containerId +" .zlpCardDetailGridContainer");
		for(var i = 0; i < detailGridContainers.length; i++){
			var detailGridContainer = detailGridContainers[i];
			var joinData = $(detailGridContainer).attr("joinData");
			if(joinData != null && joinData.length > 0){
				var detailGridContainerId = $(detailGridContainer).attr("id");
				var relateCategory = $(detailGridContainer).attr("relateCategory");
				var relateData = $(detailGridContainer).attr("relateData"); 
				var joinFieldAName = $(detailGridContainer).attr("joinFieldAName");
				var joinFieldBName = $(detailGridContainer).attr("joinFieldBName");

				var p = { 
					containerId: detailGridContainerId,   
					multiselect: true,  
					dataModel: dataModels[relateData],
					onePageRowCount: 20,
					isRefreshAfterSave: true,
					viewModel: viewModels[relateData],
					detailPageUrl: "../" + relateCategory + "/" + relateData + "_Card.jsp",
					nameFieldName: "name",
					sysWhere: [{parttype:"clause", clause:"id in (select jt." + joinFieldBName + " from " + joinData + " jt where jt." + joinFieldAName + " = '" + idValue + "')"}]
				};
				var relateDataGrid = new ZlpNcpGrid(p); 
				relateDataGrid.show();	
				
				that.joinDataToGrids[joinData] = relateDataGrid;
			}
		}
	}
	
	this.getRelateCardCtrl = function(joinData){
		return that.joinDataToGrids[joinData];
	}		

	//注册其他控件操作方法
	this.regOtherOperateCtrls = function(){  
		$("#" + that.containerId + " .zlpCardDetailContainer .zlpCardDetailTabbar li a").click(function(){
			var linkElements = $("#" + that.containerId + " .zlpCardDetailContainer li a");
			var linkIndex = -1;
			for(var i = 0; i < linkElements.length; i++){
				var linkElement = linkElements[i];
				$(linkElement).parent().removeClass("active");
				if(linkElement == this){
					$(linkElement).parent().addClass("active");
					linkIndex = i;
				}
			}
			var detailContainers = $("#" + that.containerId + " .zlpCardDetailGridContainer");
			if(detailContainers.length >= 0 && detailContainers.length > linkIndex){
				for(var i = 0; i < detailContainers.length; i++){
					var detailContainer = detailContainers[i];
					$(detailContainer).removeClass("zlpCardDetailGridContainerActive");
					if(i == linkIndex){
						$(detailContainer).addClass("zlpCardDetailGridContainerActive");
						var joinData = $(detailContainer).attr("joinData");
						if(joinData != null && joinData.length > 0){
							var relateGridCtrl = that.getRelateCardCtrl(joinData);
							relateGridCtrl.fulfill();
						}
					}
				}
			}
			else{
				msgBox.alert({info: "子表tabbar个数存在问题"});
			}
		});
	}
}