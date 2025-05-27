//AI助手分析
js3CommandProcessors["assistantAI"] = {
	toStatus: "normal",
	icon: "/images/assistantAI.png",
	hasSun: false,
	editor: null,
	webSocketUrl: "ws://127.0.0.1:8087/websocket",
	ws: null,
	clientId: null,
	run: function(p){
		let editor = p.editor;
		let tab = $("#" + editor.containerId).find(".core3dTabTitle[name='assistantAIList']")[0];
		editor.setTabVisible(tab, true);
	},
	init: function(p){
		let cmdJson = js3CommandProcessors["assistantAI"];
		cmdJson.editor = p.editor;
		let assistantAIUIContainers = $("#" + cmdJson.editor.containerId).find(".core3dTabContent[name='assistantAIList']");
		if(assistantAIUIContainers.length > 0) {
			let assistantAIUIContainer = assistantAIUIContainers[0];
			$(assistantAIUIContainer).find(".assistantAISendBtn").click(function (ev) {
				let cmdJson = js3CommandProcessors["assistantAI"];
				cmdJson.sendMsg();
				return false;
			});
			$(assistantAIUIContainer).find(".assistantAIInput").keydown(function (ev) {
				ev.stopPropagation();
				let cmdJson = js3CommandProcessors["assistantAI"];
				let assistantAIUIContainer = $("#" + cmdJson.editor.containerId).find(".core3dTabContent[name='assistantAIList']")[0];
				let inputDom = $(assistantAIUIContainer).find(".assistantAIInput")[0];
				let msgContent = $(inputDom).val().trim();
				if (msgContent.length > 0 && ev.keyCode === 13) {
					cmdJson.sendMsg();
					return false;
				} else {
					return true;
				}
			});

			cmdJson.initWebSocket();
		}

		//如果是AI创建的，那么在对话框中添加完成提醒
		cmdJson.editor.bindEvent("afterAddUnitObject3DToScene", function(p) {
			let cmdJson = js3CommandProcessors["assistantAI"];
			let unitData = p.object3D.unitData;
			if (unitData.otherInfo != null && unitData.otherInfo.isAIOperation) {
				if(unitData.otherInfo.isNew) {
					cmdJson.addMsgLog({
						owner: "AI助手",
						content: "已新建. \n构件名称: \"" + unitData.name + "\""
					});
				}
				else{
					cmdJson.addMsgLog({
						owner: "AI助手",
						content: "已修改."
					});
				}
			}
		});
	},
	initWebSocket: function () {
		let cmdJson = js3CommandProcessors["assistantAI"];
		let ws = new WebSocket(cmdJson.webSocketUrl);

		// 当WebSocket连接成功建立时触发
		ws.onopen = function (event) {
			//连接成功
			let cmdJson = js3CommandProcessors["assistantAI"];
			cmdJson.addMsgLog({
				owner: "AI助手",
				content: "您好，我是Sino-BIM AI助手，欢迎您的使用。"
			});
		};

		// 收到服务器的消息时触发
		ws.onmessage = function (event) {
			let cmdJson = js3CommandProcessors["assistantAI"];
			cmdJson.afterGotMsg({
				msgText: event.data
			});
		};

		// 当WebSocket连接关闭时触发
		ws.onclose = function (event) {
			let cmdJson = js3CommandProcessors["assistantAI"];
			cmdJson.addMsgLog({
				owner: "系统",
				content: "AI助手已关闭. 问题码: " + event.code + ". " + event.reason
			});
		};

		// 如果发生错误时触发
		ws.onerror = function (event) {
			let error = "";
			// 虽然event对象的具体内容因浏览器而异，但通常可以通过event.target.error属性访问错误信息
			if (event.target.readyState === WebSocket.CLOSED) {
				error = "创建连接失败.";
			} else if (event.target.readyState === WebSocket.CONNECTING) {
				error = "连接异常.";
			} else if (event.target.readyState === WebSocket.OPEN) {
				error = "连接异常.";
			}

			// 对于具体的错误信息，可以尝试检查event的其他属性或event.target.error（并非所有浏览器都支持）
			if (event.target.error) {
				error = "event.target.error.message";
			}

			let cmdJson = js3CommandProcessors["assistantAI"];
			cmdJson.addMsgLog({
				owner: "系统",
				content: "调用AI助手失败，请联系系统管理员，或者刷新当前页面继续尝试. 问题: " + error
			});
		};
		cmdJson.ws = ws;
	},
	afterGotMsg: function (p){
		let cmdJson = js3CommandProcessors["assistantAI"];
		let msgJson = cmnPcr.strToJson(p.msgText);
		switch(msgJson.msgType){
			case "response_operation":{
				cmdJson.doOperation(msgJson)
				break;
			}
			case "response_ai_message":{
				cmdJson.addMsgLog({
					owner: "AI助手",
					content: msgJson.content
				});
				break;
			}
			case "response_remote_user_message":{
				cmdJson.addMsgLog({
					owner: "用户",
					content: msgJson.content
				});
				break;
			}
			case "error":{
				cmdJson.updateMsgLog({
					owner: "AI助手",
					content: "无法处理的请求. " + msgJson.content,
					msgId: msgJson.thatId
				});
				break;
			}
			default:{
				//不做处理
				break;
			}
		}
	},
	sendMsg: function (p) {
		let cmdJson = js3CommandProcessors["assistantAI"];
		let assistantAIUIContainer = $("#" + cmdJson.editor.containerId).find(".core3dTabContent[name='assistantAIList']")[0];
		let inputDom = $(assistantAIUIContainer).find(".assistantAIInput")[0];
		let msgContent = $(inputDom).val().trim();
		if (msgContent.length > 0) {
			let msgId = cmdJson.addMsgLog({
				owner: "用户",
				content: msgContent
			});
			let thatMsgId = cmdJson.addMsgLog({
				owner: "AI助手",
				type: "waiting"
			})
			$(inputDom).val("");
			cmdJson.sendMsgToServer({
				content: msgContent,
				id: msgId,
				thatId: thatMsgId
			});
		}
	},
	addMsgLog: function (p){
		let cmdJson = js3CommandProcessors["assistantAI"];
		let assistantAIUIContainer = $("#" + cmdJson.editor.containerId).find(".core3dTabContent[name='assistantAIList']")[0];
		let msgId = cmnPcr.createGuid();
		let ownerClass;
		switch(p.owner){
			case "用户":{
				ownerClass = "cmdMsgItemUser";
				break;
			}
			case "系统":{
				ownerClass = "cmdMsgItemSys";
				break;
			}
			case "AI助手":{
				ownerClass = "cmdMsgItemAI";
				break;
			}
		}

		let msgItemDom = "<div msgId=\"" + msgId + "\" class=\"cmdMsgItem\">"
			+ "<span class=\"cmdMsgItemOwner " + ownerClass + "\">" + p.owner + "："
			+ "<span class=\"cmsMsgItemTime\">" + cmnPcr.datetimeToStr(new Date(), "HH:mm:ss") + "</span>"
			+ "</span>"
			+ "<br />"
			+ "<span class=\"cmdMsgItemContent\"></span>"
			+ "</div>";
		let logContainer = $(assistantAIUIContainer).find(".assistantAIMsgLog")[0];
		$(logContainer).append(msgItemDom);

		let contentHtml = "";
		switch (p.type){
			case "waiting":{
				let imgUrl = basePath + "/web/design/common/plugins/assistantAI/images/waiting.gif";
				contentHtml = "<img class='cmsMsgItemWaiting' src='" + imgUrl + "' alt='等待回复'/>"
				break;
			}
			default:{
				contentHtml = cmnPcr.html_encode(p.content);
				break;
			}
		}

		$(assistantAIUIContainer).find(".cmdMsgItem[msgId='" + msgId + "'] .cmdMsgItemContent").html(contentHtml);
		$(logContainer)[0].scrollTop =  $(logContainer)[0].scrollHeight;
		return msgId;
	},
	updateMsgLog: function (p){
		let cmdJson = js3CommandProcessors["assistantAI"];
		let msgId = p.msgId;
		let contentHtml = cmnPcr.html_encode(p.content);
		let assistantAIUIContainer = $("#" + cmdJson.editor.containerId).find(".core3dTabContent[name='assistantAIList']")[0];
		let logContainer = $(assistantAIUIContainer).find(".assistantAIMsgLog")[0];
		$(logContainer).find(".cmdMsgItem[msgId='" + msgId + "'] .cmdMsgItemContent").html(contentHtml);
		$(logContainer)[0].scrollTop =  $(logContainer)[0].scrollHeight;
		return msgId;
	},
	sendMsgToServer: function (p){
		let cmdJson = js3CommandProcessors["assistantAI"];
		if(cmdJson.ws.readyState === WebSocket.OPEN){
			let msgJson = {
				id: p.id,
				thatId: p.thatId,
				msgType: "request_user_message",
				modelId: cmdJson.editor.componentInfo.id,
				content: p.content
			};
			cmdJson.ws.send(cmnPcr.jsonToStr(msgJson));
		}
		else{
			let assistantAIUIContainer = $("#" + cmdJson.editor.containerId).find(".core3dTabContent[name='assistantAIList']")[0];
			cmdJson.addMsgLog({
				owner: "系统",
				content: "尚未连接AI助手，请刷新当前页面重新尝试."
			});
		}
	},
	doOperation: function (msgJson){
		let cmdJson = js3CommandProcessors["assistantAI"];
		let operationInfo = msgJson.content;
		switch(operationInfo.operateType){
			case "create":{
				cmdJson.doCreateUnit(msgJson);
				break;
			}
			case "remove":{
				cmdJson.doRemoveUnit(msgJson);
				break;
			}
			case "modify":{
				cmdJson.doModifyUnit(msgJson);
				break;
			}
			case "rotate":{
				cmdJson.doRotateUnit(msgJson);
				break;
			}
			case "move":{
				cmdJson.doMoveUnit(msgJson);
				break;
			}
			case "select":{
				cmdJson.doSelectUnit(msgJson);
				break;
			}
			case "zoomIn":{
				cmdJson.doWindowZoom(msgJson, "in");
				break;
			}
			case "zoomOut":{
				cmdJson.doWindowZoom(msgJson, "out");
				break;
			}
			case "rotateLeft":{
				cmdJson.doWindowRotate(msgJson, "left");
				break;
			}
			case "rotateRight":{
				cmdJson.doWindowRotate(msgJson, "right");
				break;
			}
			case "rotateUp":{
				cmdJson.doWindowRotate(msgJson, "up");
				break;
			}
			case "rotateDown":{
				cmdJson.doWindowRotate(msgJson, "down");
				break;
			}
			case "hello":{
				cmdJson.doHello(msgJson);
				break;
			}
			default:{
				msgBox.alert("不支持的操作. operateType=" + operationInfo.operateType);
				break;
			}
		}
	},
	updateMsgLogOnNoneObject: function (msgJson){
		let cmdJson = js3CommandProcessors["assistantAI"];
		if(msgJson.content.target == null || msgJson.content.target.length === 0){
			cmdJson.updateMsgLog({
				owner: "AI助手",
				content: "请先选中任何构件，或者给出构件名称",
				msgId: msgJson.thatId
			});
		}
		else {
			switch (msgJson.content.target) {
				case "selectedUnit": {
					cmdJson.updateMsgLog({
						owner: "AI助手",
						content: "请先选中任何构件，或者给出构件名称",
						msgId: msgJson.thatId
					});
					break;
				}
				default: {
					cmdJson.updateMsgLog({
						owner: "AI助手",
						content: "没有找到\"" + msgJson.content.target + "\"",
						msgId: msgJson.thatId
					});
					break;
				}
			}
		}
	},
	doWindowZoom: function (msgJson, zoomType){
		let cmdJson = js3CommandProcessors["assistantAI"];
		let zoomValue = cmdJson.editor.orbitControl.zoom0;
		switch(zoomType){
			case "in":{
				zoomValue = zoomValue * 2;
				break;
			}
			case "out":{
				zoomValue = zoomValue / 2;
				break;
			}
			default:{
				break;
			}
		}
		cmdJson.editor.setZoom(zoomValue);
		cmdJson.updateMsgLog({
			owner: "AI助手",
			content: "已执行缩放",
			msgId: msgJson.thatId
		});
	},
	doWindowRotate: function (msgJson, rotateType){
		let cmdJson = js3CommandProcessors["assistantAI"];
		let directionType = "";
		let angleValue = 90;
		switch (rotateType){
			case "left":
			case "right":
			case "up":
			case "down":{
				directionType = rotateType;
				break;
			}
			default:{
				directionType = "right";
				break;
			}
		}

		let properties = msgJson.content.properties;
		if(properties.length > 0) {
			let propertyInfo = properties[0];
			switch (propertyInfo.name) {
				case "left":
				case "right":
				case "up":
				case "down": {
					directionType = propertyInfo.name;
					break;
				}
				default: {
					directionType = "right";
					break;
				}
			}
			angleValue = propertyInfo.value == null || propertyInfo.value.length === 0 ? 90 : cmnPcr.strToDecimal(propertyInfo.value);
		}

		switch(directionType){
			case "right":{
				cmdJson.doWindowRotateH(-angleValue);
				break;
			}
			case "left":{
				cmdJson.doWindowRotateH(angleValue);
				break;
			}
			case "up":{
				cmdJson.doWindowRotateV(-angleValue);
				break;
			}
			case "down":{
				cmdJson.doWindowRotateV(angleValue);
				break;
			}
			default:{
				break;
			}
		}
		cmdJson.updateMsgLog({
			owner: "AI助手",
			content: "已执行旋转",
			msgId: msgJson.thatId
		});
	},
	doWindowRotateH: function(angleValue){
		let cmdJson = js3CommandProcessors["assistantAI"];
		let editor = cmdJson.editor;
		let position = [editor.camera.position.x, editor.camera.position.y, editor.camera.position.z];
		let target = [editor.orbitControl.target0.x, editor.orbitControl.target0.y, editor.orbitControl.target0.z];
		let zoomValue = editor.orbitControl.zoom0;

		// 先将物体坐标相对中心点平移
		let relativePoint = [position[0] - target[0], position[1] - target[1], position[2] - target[2]];

		// 计算旋转后的坐标
		let arcValue = Math.PI * angleValue / 180;
		let rotatedX = relativePoint[0] * Math.cos(arcValue) - relativePoint[2] * Math.sin(arcValue);
		let rotatedZ = relativePoint[0] * Math.sin(arcValue) + relativePoint[2] * Math.cos(arcValue);
		let rotatedY = relativePoint[1];

		// 再将旋转后的坐标平移回原中心
		let resultPos = [rotatedX + target[0], rotatedY + target[1], rotatedZ + target[2]];

		editor.setViewportByPoint(resultPos, target, zoomValue);
	},
	doWindowRotateV: function(angleValue){
		let cmdJson = js3CommandProcessors["assistantAI"];
		let editor = cmdJson.editor;
		let position = [editor.camera.position.x, editor.camera.position.y, editor.camera.position.z];
		let target = [editor.orbitControl.target0.x, editor.orbitControl.target0.y, editor.orbitControl.target0.z];
		let pointUp = [target[0], target[1] + 1, target[2]];
		let zoomValue = editor.orbitControl.zoom0;
		let normal = cmdJson.calcNormal(position, target, pointUp);
		let resultPos = cmdJson.rotateAroundNormal(position, target, normal, angleValue * Math.PI / 180);
		editor.setViewportByPoint(resultPos, target, zoomValue);
	},
	rotateAroundNormal: function(point, center, normal, angle) {
		let cmdJson = js3CommandProcessors["assistantAI"];
		// 确保法线向量已归一化
		let normalizedNormal = cmdJson.normalizeVector(normal);

		// 获取旋转轴，也就是穿过中心点且平行于法线的直线方向
		let rotationAxis = [...normalizedNormal];

		// 将物体坐标相对中心点平移
		let relativePoint = [
			point[0] - center[0],
			point[1] - center[1],
			point[2] - center[2]
		];

		// 构造旋转矩阵
		let rotationMatrix = cmdJson.getRotationMatrixAroundAxis(rotationAxis, angle);

		// 对物体坐标进行旋转
		let rotatedRelativePoint = cmdJson.applyRotationMatrix(rotationMatrix, relativePoint);

		// 将旋转后的坐标加上中心点坐标得到最终结果
		return [
			rotatedRelativePoint[0] + center[0],
			rotatedRelativePoint[1] + center[1],
			rotatedRelativePoint[2] + center[2]
		];
	},
	// 辅助函数：向量归一化
	normalizeVector: function(vec) {
		let magnitude = Math.sqrt(vec[0] ** 2 + vec[1] ** 2 + vec[2] ** 2);
		return [vec[0] / magnitude, vec[1] / magnitude, vec[2] / magnitude];
	},
	// 辅助函数：向量归一化
	getRotationMatrixAroundAxis: function(axis, angle) {
		let x = axis[0], y = axis[1], z = axis[2];
		let len = Math.sqrt(x * x + y * y + z * z);
		x /= len;
		y /= len;
		z /= len;
		let xx = x * x;
		let yy = y * y;
		let zz = z * z;
		let xy = x * y;
		let yz = y * z;
		let zx = z * x;
		let xs = x * Math.sin(angle);
		let ys = y * Math.sin(angle);
		let zs = z * Math.sin(angle);
		let oneMinusCos = 1 - Math.cos(angle);
		return [
			[xx + (1 - xx) * Math.cos(angle), xy * oneMinusCos - zs, zx * oneMinusCos + ys],
			[xy * oneMinusCos + zs, yy + (1 - yy) * Math.cos(angle), yz * oneMinusCos - xs],
			[zx * oneMinusCos - ys, yz * oneMinusCos + xs, zz + (1 - zz) * Math.cos(angle)]
		];
	},
	// 辅助函数：应用旋转矩阵到向量
	applyRotationMatrix: function(matrix, vector) {
		return [
			matrix[0][0] * vector[0] + matrix[0][1] * vector[1] + matrix[0][2] * vector[2],
			matrix[1][0] * vector[0] + matrix[1][1] * vector[1] + matrix[1][2] * vector[2],
			matrix[2][0] * vector[0] + matrix[2][1] * vector[1] + matrix[2][2] * vector[2]
		];
	},
	// 辅助函数：向量点乘
	dotProduct: function(vecA, vecB) {
		return vecA[0]*vecB[0] + vecA[1]*vecB[1] + vecA[2]*vecB[2];
	},
	calcNormal: function (A, B, C){
		// 计算向量AB和AC
		let AB = [
			B[0] - A[0],
			B[1] - A[1],
			B[2] - A[2]
		];
		let AC = [
			C[0] - A[0],
			C[1] - A[1],
			C[2] - A[2]
		];

		// 计算法线向量，即AB和AC的叉积
		let normal = [
			AB[1] * AC[2] - AB[2] * AC[1],
			AB[2] * AC[0] - AB[0] * AC[2],
			AB[0] * AC[1] - AB[1] * AC[0]
		];

		// 归一化法线向量
		let length = Math.sqrt(normal[0] ** 2 + normal[1] ** 2 + normal[2] ** 2);
		if (length > 0) {
			normal = [
				normal[0] / length,
				normal[1] / length,
				normal[2] / length
			];
		}

		return normal;
	},
	doRemoveUnit: function (msgJson){
		let cmdJson = js3CommandProcessors["assistantAI"];
		let object3D = cmdJson.getObject3DByFuzzyName(msgJson.content.target);
		if(object3D == null){
			cmdJson.updateMsgLogOnNoneObject(msgJson);
		}
		else {
			cmdJson.editor.removeUnitObject3D(object3D, true);
			cmdJson.updateMsgLog({
				owner: "AI助手",
				content: "已删除.",
				msgId: msgJson.thatId
			});
		}
	},
	doRotateUnit: function (msgJson){
		let cmdJson = js3CommandProcessors["assistantAI"];
		if(msgJson.content.target === "window"){
			cmdJson.doWindowRotate(msgJson);
		}
		else {
			let object3D = cmdJson.getObject3DByFuzzyName(msgJson.content.target);
			if (object3D == null) {
				cmdJson.updateMsgLogOnNoneObject(msgJson);
			} else {
				if (msgJson.content.properties.length > 0) {
					let rotX = object3D.rotation.x * 180 / Math.PI;
					let rotY = object3D.rotation.y * 180 / Math.PI;
					let rotZ = object3D.rotation.z * 180 / Math.PI;
					for (let i = 0; i < msgJson.content.properties.length; i++) {
						let propertyInfo = msgJson.content.properties[i];
						let propertyValue = cmnPcr.strToDecimal(propertyInfo.value);
						switch (propertyInfo.name) {
							case "X": {
								rotX += propertyValue;
								break;
							}
							case "Y": {
								rotY += propertyValue;
								break;
							}
							case "Z": {
								rotZ += propertyValue;
								break;
							}
							case "left": {
								rotX -= propertyValue;
								break;
							}
							case "right": {
								rotX += propertyValue;
								break;
							}
						}
					}
					let rotation = [rotX * Math.PI / 180, rotY * Math.PI / 180, rotZ * Math.PI / 180];
					cmdJson.editor.setUnitRotation(object3D, rotation);
					cmdJson.updateMsgLog({
						owner: "AI助手",
						content: "已旋转 \"" + object3D.unitData.name + "\":\n  X: " + rotX.toFixed(3) + "\n  Y: " + rotY.toFixed(3) + "\n  Z: " + rotZ.toFixed(3),
						msgId: msgJson.thatId
					});
				} else {
					cmdJson.updateMsgLog({
						owner: "AI助手",
						content: "请给出旋转轴和角度.",
						msgId: msgJson.thatId
					});
				}
			}
		}
	},
	doMoveUnit: function (msgJson){
		let cmdJson = js3CommandProcessors["assistantAI"];
		if(msgJson.content.target === "window"){
			cmdJson.doWindowRotate(msgJson);
		}
		else {
			let object3D = cmdJson.getObject3DByFuzzyName(msgJson.content.target);
			if (object3D == null) {
				cmdJson.updateMsgLogOnNoneObject(msgJson);
			} else {
				if (msgJson.content.properties.length > 0) {
					let posX = object3D.position.x;
					let posY = object3D.position.y;
					let posZ = object3D.position.z;
					for (let i = 0; i < msgJson.content.properties.length; i++) {
						let propertyInfo = msgJson.content.properties[i];
						let propertyValue = js3CommonFunction.mm2m(cmnPcr.strToDecimal(propertyInfo.value));
						let operateType = propertyInfo.operateType;
						switch (propertyInfo.name) {
							case "X": {
								if (operateType === "increase") {
									posX += propertyValue;
								} else if (operateType === "decrease") {
									posX -= propertyValue;
								} else {
									posX = propertyValue;
								}
								break;
							}
							case "Y": {
								if (operateType === "increase") {
									posY += propertyValue;
								} else if (operateType === "decrease") {
									posY -= propertyValue;
								} else {
									posY = propertyValue;
								}
								break;
							}
							case "Z": {
								if (operateType === "increase") {
									posZ += propertyValue;
								} else if (operateType === "decrease") {
									posZ -= propertyValue;
								} else {
									posZ = propertyValue;
								}
								break;
							}
						}
					}
					let position = [posX, posY, posZ];
					cmdJson.editor.setUnitPosition(object3D, position);
					cmdJson.updateMsgLog({
						owner: "AI助手",
						content: "已移动 \"" + object3D.unitData.name + "\":\n  X: " + js3CommonFunction.m2mm(posX).toFixed(1) + "\n  Y: " + js3CommonFunction.m2mm(posY).toFixed(1) + "\n  Z: " + js3CommonFunction.m2mm(posZ).toFixed(1),
						msgId: msgJson.thatId
					});
				} else {
					cmdJson.updateMsgLog({
						owner: "AI助手",
						content: "请给出坐标轴和位移量.",
						msgId: msgJson.thatId
					});
				}
			}
		}
	},
	doModifyUnit: function (msgJson){
		let cmdJson = js3CommandProcessors["assistantAI"];
		let object3D = cmdJson.getObject3DByFuzzyName(msgJson.content.target);
		if(object3D == null){
			cmdJson.updateMsgLogOnNoneObject(msgJson);
		}
		else {
			let unitData = object3D.unitData;
			let refComponentInfo = cmdJson.editor.getRefComponentInfo(unitData.code, unitData.versionNum);
			let properties = cmdJson.getProperties(refComponentInfo, msgJson.content, unitData);
			for(let name in properties){
				let property = properties[name];
				unitData.parameters[name].value = property.value;
			}
			cmdJson.editor.rebuildOneUnitObject3D(object3D, {
				isAIOperation: true
			});
			let propertiesHtml = cmdJson.getPropertiesHtml(properties);
			cmdJson.updateMsgLog({
				owner: "AI助手",
				content: "准备修改 \"" + unitData.name +"\" 的参数" + propertiesHtml,
				msgId: msgJson.thatId
			});

		}
	},
	doHello: function (msgJson){
		let cmdJson = js3CommandProcessors["assistantAI"];
		cmdJson.updateMsgLog({
			owner: "AI助手",
			content: msgJson.content.target,
			msgId: msgJson.thatId
		});
	},
	doSelectUnit: function (msgJson){
		let cmdJson = js3CommandProcessors["assistantAI"];
		let object3D = cmdJson.getObject3DByFuzzyName(msgJson.content.target);
		if(object3D == null){
			cmdJson.updateMsgLog({
				owner: "系统",
				content: "没有找到\"" + msgJson.content.target + "\"",
				msgId: msgJson.thatId
			});
		}
		else {
			cmdJson.editor.selectUnitObject(object3D);
			cmdJson.updateMsgLog({
				owner: "AI助手",
				content: "已选中.",
				msgId: msgJson.thatId
			});
		}
	},
	doCreateUnit: function (msgJson){
		let cmdJson = js3CommandProcessors["assistantAI"];
		cmdJson.loadRefComponentBeforeCreateNewUnit(msgJson);
	},
	//在执行操作区，先获取refComponent
	loadRefComponentBeforeCreateNewUnit: function(msgJson){
		let cmdJson = js3CommandProcessors["assistantAI"];
		const componentName= msgJson.content.target;
		let versionNum = "1.0";
		let refComponentInfo = cmdJson.editor.getRefComponentInfoByName(componentName, versionNum);
		if(refComponentInfo == null) {
			let requestParam = {
				componentName: componentName,
				versionNum: versionNum
			};
			serverAccess.request({
				serviceName: "mdlComponentNcpService",
				funcName: "getComponentFileByName",
				args: {requestParam: cmnPcr.jsonToStr(requestParam)},
				successFunc: function (obj) {
					let cmdJson = js3CommandProcessors["assistantAI"];
					if(obj.result.componentInfo != null) {
						cmdJson.editor.addRefComponentToEditor(obj.result.componentInfo);
						let componentKey = obj.result.componentInfo.code + "_" + obj.result.componentInfo.versionNum;
						let refComponentInfo = cmdJson.editor.componentInfo.refComponents[componentKey];
						cmdJson.createNewUnit(refComponentInfo, msgJson);
					}
					else{
						cmdJson.addMsgLog({
							owner: "系统",
							content: "不存名字为的\"" + componentName + "\"构件."
						});
					}
				},
				failFunc: function (obj) {
					cmdJson.addMsgLog({
						owner: "AI助手",
						content: obj.message
					});
				}
			});
		}
		else{
			cmdJson.createNewUnit(refComponentInfo, msgJson);
		}
	},
	createNewUnit: function (refComponentInfo, msgJson){
		let cmdJson = js3CommandProcessors["assistantAI"];
		let idAndName = cmdJson.editor.getNewUnitIdAndName(refComponentInfo.name + "_1", refComponentInfo.name);
		let properties = cmdJson.getProperties(refComponentInfo, msgJson.content);
		let unitSetting = {
			name: idAndName.name,
			id: idAndName.id,
			code: refComponentInfo.code,
			versionNum: refComponentInfo.versionNum,
			mixType: js3UnitMixType.none,
			viewLevel: js3ViewLevelType.always,
			useWorldPosition: false,
			position: [0, 0, 0],
			rotation: [0, 0, 0],
			count: 1,
			countExp: null,
			materials: null,
			parameters: properties,
			positionExps: {},
			rotationExps: {},
			uvs: null,
			otherInfo: {
				needSelect: true,
				isAIOperation: true,
				isNew: true
			}
		};

		let propertiesHtml = cmdJson.getPropertiesHtml(properties);
		cmdJson.updateMsgLog({
			owner: "AI助手",
			content: "准备新建 \"" + refComponentInfo.name +"\"" + propertiesHtml,
			msgId: msgJson.thatId
		});

		cmdJson.editor.addUnitObject3DToSceneByUser(refComponentInfo, unitSetting);
	},
	showError: function (p){
		let cmdJson = js3CommandProcessors["assistantAI"];
		cmdJson.addMsgLog({
			owner: "系统",
			content: p.errorInfo
		});
	},
	getProperties: function (refComponentInfo, operationInfo, unitData){
		let properties = {};
		for(let i = 0; i < operationInfo.properties.length; i++){
			let propertyInfo = operationInfo.properties[i];
			let propertyName = propertyInfo.name;
			let propertyValueStr = propertyInfo.value;
			let parameter = refComponentInfo.parameters[propertyName];
			if(parameter != null){
				let vType = getValueTypeByParameterType(parameter.paramType);
				let value = cmnPcr.strToObject(propertyValueStr, vType);
				if(vType === valueType.decimal && unitData != null){
					switch(propertyInfo.operateType){
						case "increase":{
							value = unitData.parameters[propertyName].value + value;
							break;
						}
						case "decrease":{
							value = unitData.parameters[propertyName].value - value;
							break;
						}
					}
				}
				properties[propertyName] = {
					value: value,
					valueType: vType
				};
			}
		}
		return properties;
	},
	getPropertiesHtml: function (properties){
		let html = "";
		let index = 1;
		for(let name in properties){
			let property = properties[name];
			let valueStr = cmnPcr.objectToStr(property.value, property.valueType);
			html += ("\n  " + index + ". " + name + ": " + valueStr);
			index++;
		}
		return html.length === 0  ? "" : ("\n参数:" + html);
	},
	getObject3DByFuzzyName: function (name) {
		let cmdJson = js3CommandProcessors["assistantAI"];
		if (name == null || name.length === 0) {
			return cmdJson.editor.selectedUnitObject3D;
		} else {
			switch (name) {
				case "selectedUnit": {
					return cmdJson.editor.selectedUnitObject3D;
				}
				default: {
					let checkString = /[\(\)\[\]\-_]/g;
					let fuzzyName = name.replace(checkString, "").trim();
					let mainScene = cmdJson.editor.getMainScene();
					for (let i = 0; i < mainScene.children.length; i++) {
						let childObj = mainScene.children[i];
						if (childObj.isUnitObject) {
							let unitFuzzyName = childObj.unitData.name.replace(checkString, "").trim();
							if (unitFuzzyName === fuzzyName) {
								return childObj;
							}
						}
					}
					return null;
				}
			}
		}
	}
};