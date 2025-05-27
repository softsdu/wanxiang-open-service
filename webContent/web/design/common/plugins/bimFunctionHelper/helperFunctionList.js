var helperFunctionList = {
	"选中": {
		"nameSel": {
			name: "nameSel",
			exp: "nameSel(\"构件名称\", true)"
		},
		"catSel": {
			name: "catSel",
			exp: "catSel(\"构件类型名称\", true)"
		},
		
		/*根据组名选中构件 added by ls 20221206*/
		"groupSel": {
			name: "groupSel",
			exp: "groupSel(\"分组名称\", true)"
		}
	},
	"筛选":{
		"nameGet": {
			name: "nameGet",
			exp: "nameGet(\"构件名称\")"
		},
		"catGet": {
			name: "catGet",
			exp: "catGet(\"构件类型名称\")"
		},
		
		/*根据组名获取构件 added by ls 20221206*/
		"groupGet":  {
			name: "groupGet",
			exp: "groupGet(\"分组名称\")"
		},
		
		"getSel":  {
			name: "getSel",
			exp: "getSel()"
		}
	},
	"属性值": {
		//修改函数名 modified by ls 20230217
		"changeVal": {
			name: "changeVal",
			exp: "changeVal(\"构件名称\", \"属性名\", \"属性值\")"
		}
	},

	/*构件位置 added by ls 20221206*/
	"位置":{
		"clearPosExp": {
			name: "clearPosExp",
			exp: "clearPosExp(\"构件名称\")"
		},
		"moveX": {
			name: "moveX",
			exp: "moveX(\"构件名称\", 1000)"
		},
		"moveY": {
			name: "moveY",
			exp: "moveY(\"构件名称\", 1000)"
		},
		"moveZ": {
			name: "moveZ",
			exp: "moveZ(\"构件名称\", 1000)"
		},
		"alignLeft": {
			name: "alignLeft",
			exp: "alignLeft(\"构件名称\")"
		},
		"alignRight": {
			name: "alignRight",
			exp: "alignRight(\"构件名称\")"
		},
		"alignTop": {
			name: "alignTop",
			exp: "alignTop(\"构件名称\")"
		},
		"alignBottom": {
			name: "alignBottom",
			exp: "alignBottom(\"构件名称\")"
		},
		"alignFront": {
			name: "alignFront",
			exp: "alignFront(\"构件名称\")"
		},
		"alignBack": {
			name: "alignBack",
			exp: "alignBack(\"构件名称\")"
		},
		"equipartitionX": {
			name: "equipartitionX",
			exp: "equipartitionX(\"构件名称\")"
		},
		"equipartitionY": {
			name: "equipartitionY",
			exp: "equipartitionY(\"构件名称\")"
		},
		"equipartitionZ": {
			name: "equipartitionZ",
			exp: "equipartitionZ(\"构件名称\")"
		}
	}
}