function showAllNGraph(dataName, dataId){
	var nGraphContainers = $(".nGraphContainer");
	for(var i = 0; i < nGraphContainers.length; i++){
		var nGraphContainer = nGraphContainers[i]; 	
		var graphName = $(nGraphContainer).attr("graphName"); 
		if(graphName != null && graphName.length > 0){
			var nGraphViewer = new NGraphViewer({
				container: nGraphContainer,
				dataName: dataName,
				dataId: dataId,
				graphName: graphName,
				graphType: "node"
			});
			nGraphViewer.show();
		}
	}
}

var nGraphIdToGraphJson = {};

function NGraphViewer(p){
	var that = this;
	this.container = p.container; 
	this.dataId = p.dataId; 
	this.dataName = p.dataName; 
	this.graphName = p.graphName;
	this.graphType = p.graphType;
	this.graphJson = p.graphJson;
	
	this.show = function(){
		if(that.graphJson == null){
			that.getGraphInfo();			
		}
		else{
			that.showChart(that.graphJson, true);
		}
	}
	
	this.getGraphInfo = function(){
	    var requestParam = { 
    		dataName: that.dataName,
    		graphName: that.graphName,
    		graphType: that.graphType,
	        id: that.dataId
	    }
		serverAccess.request({
			serviceName:"nGraphQueryNcpService",
			funcName:"getGraphByName",
		    args:{requestParam:cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){  
				var graphJson = obj.result.graphJson;
				that.graphJson = graphJson;
				nGraphIdToGraphJson[that.graphName] = graphJson;
				that.showChart(graphJson, false);
			},
			failFunc:function(obj){
				$(that.container).text(obj.message);
			}
		}); 
	}
	
	this.showChart = function(graphJson, isMax){	
		var allNodeTypes = graphJson.nodeTypes;
		var nodes = graphJson.nodes;
		
		if(nodes == null || nodes.length == 0){
			$(that.container).html("<div class=\"nGraphNoneInfo\">暂无相关信息</div>");
		}
		else{
			var categories = new Array();
			var categoryToIndex = new Object();
			var nodeNames = new Object();

			categoryToIndex["currentNode"] = 0;	
			categories.push({
				name: "currentNode",
				itemStyle: {
					normal: {
						color: supportiveNGraphKeyColors.currentNodeColor
					}
				}
			}); 
			
			for(var i = 0; i < allNodeTypes.length; i++){
				var nodeType = allNodeTypes[i];
				categoryToIndex[nodeType] = i + 1;			
				categories.push({
					name: nodeType,
					itemStyle: {
						normal: {
							color: supportiveSearchTypes[nodeType].color
						}
					}
				});
			}

			var allNodeData = new Array();
			var nodeIdToIndex = new Object();
			for(var i = 0; i < nodes.length; i++){
				var node = nodes[i];
				var nodeType = node.nodeTypes[0];
				nodeIdToIndex[node.nodeId] = i;
				var categoryIndex = that.dataId == node.id ? categoryToIndex["currentNode"] : categoryToIndex[nodeType]; 
				allNodeData.push({
	                name: node.name,
	                id: node.id,
	                nodeType: nodeType,
	                category: categoryIndex,
	                draggable: true,
	                elementType: "node"
				});
				
				nodeNames[node.nodeId] = node.name;
			}

			var relations = graphJson.relations;
			var allRelationData = new Array();
			for(var i = 0; i < relations.length; i++){
				var relation = relations[i];
				nodeIdToIndex[relations.relationId] = i;
				allRelationData.push({
	                value: relation.name,
	                name: relation.name + "(" + nodeNames[relation.fromNodeId] + "➜" + nodeNames[relation.toNodeId] + ")",
	                id: relation.id,
	                nodeRelationType: relation.nodeRelationType,
	                source: nodeIdToIndex[relation.fromNodeId],
	                target: nodeIdToIndex[relation.toNodeId],
	                elementType: "relation"
				});
			}
			
			$(that.container).html("<div class=\"nGraphContentInnerContainer\"></div>");
			var needSetDisplayBeforeInit = $(that.container).css("display") == "none";
			
			if(needSetDisplayBeforeInit){
				$(that.container).addClass("tempTabActive");
			}
	        var chart = echarts.init($(that.container).find(".nGraphContentInnerContainer")[0]); 
			if(needSetDisplayBeforeInit){
				chart.on('finished', function () {
					if($(that.container).hasClass("tempTabActive")){
						$(that.container).removeClass("tempTabActive"); 
					}
				});
			} 
			option = {
			    title: {
			        text: ''
			    },
			    animation: true, 
			    animationThreshold: 30, 
			    animationEasing: "linear",
			    animationDurationUpdate: 100, 
			    tooltip: null, 
			    label: {
			        normal: {
			            show: true,
			            textStyle: {
			                fontSize: 12
			            },
			        }
			    }, 
			    series: [
			        {
			            type: 'graph',
			            layout: 'force',
			            symbolSize: 40,
			            focusNodeAdjacency: false,
			            legendHoverLink: false,
			            hoverAnimation: true,
			            roam: true,
			            categories: categories,
			            label: {
			                normal: {
			                    show: true,
			                    textStyle: {
			                        fontSize: 12
			                    },
			                }
			            }, 
			            force: {
			                repulsion: 1200,
			                layoutAnimation: nodes.length > 50? false : true
			            }, 
			            edgeSymbol: ['none', 'arrow'],
			            edgeSymbolSize: [8, 8],
			            edgeLabel: {
			                normal: {
			                    show: true,
			                    textStyle: {
			                        fontSize: 12
			                    },
			                    formatter: "{c}"
			                }
			            },
			            data: allNodeData,
			            links: allRelationData,
			            lineStyle: {
			                normal: {
			                    opacity: 1,
			                    width: 1,
			                    curveness: 0.1
			                }
			            },
			            left:0,
			            top:0
			        }
			    ]
			};

	        chart.setOption(option);
	        
	        chart.on('dblclick', function (params) {
	        	var infoType = supportiveSearchTypes[params.data.nodeType];
	    		var pageName = "detailPage_" + infoType.nodeType + "_" + params.data.id;
	    		var pageFullUrl = "../" + infoType.category + "/" + params.data.nodeType + "_Card.jsp?k=" + params.data.id;
	    		var pageTitle = infoType.name + ": " + params.data.name;
	    		window.parent.iocClient.mainPageTab().showPage(pageName, pageTitle, pageFullUrl, true);
	        });
		}
	}
	
}