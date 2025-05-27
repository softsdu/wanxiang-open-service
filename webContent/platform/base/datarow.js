function DataRow(){
	//行ID（并不是Id字段的值，是客户端用于唯一标识某行记录的标识）
    this.rowId;
    
    //字段和值的对应关系
    this._hash = {};

    //是否被编辑过
    this.isEdited = false;

    //标记是否被编辑过
    this.setIsEdited = function(isEdited){
    	this.isEdited = isEdited;
    	//alert(this.rowId+" "+isEdited);
    };
    
    //获取是否被编辑过
    this.getIsEdited = function(){
    	return this.isEdited; 
    };
    
    //判断是否为新记录
    this.isNewRow =function(idFieldName){
    	return this.getValue(idFieldName) == undefined;
    };

    //所有字段
    this.allCells = function() { return this._hash; };

    //设置字段值
    this.setValue = function(columnName, value) {
        this._hash[columnName.toLowerCase()] = value;
    };

    //获取字段值
    this.getValue = function(columnName) {
        var value = this._hash[columnName.toLowerCase()];
        return value == null ? undefined : value;
    };

    //获取字段值
    this.items = function(columnName) { return this._hash[columnName.toLowerCase()]; };

    //释放内存
    this.dispose = function() { for (var k in this._hash) { delete this._hash[k]; } };

    //复制行
    this.copy = function() {
        var copyRow = new DataRow();
        copyRow.rowId = this.rowId;
        for (var k in this._hash) {
            copyRow.setValue(k, this.items(k));
        }
        return copyRow;
    }
}