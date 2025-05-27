function DataTable(){

    //第一行Id
    this.firstRowId;
    
    //最后一行Id
    this.lastRowId;

    //按顺序存储了RowId
    this.rowIdArray = [];
    
    //实际存储行实体的地方，为DataRow类
    this._hash = {};
    
    //添加行
    this.addRow = function(rowId, dataRow) {
        if (this.contains(rowId) == false) {
            this._hash[rowId] = typeof (dataRow) == "undefined" ? null : dataRow;
            dataRow.rowId = rowId;
            this.rowIdArray.push(rowId); 
            return true;
        }
        else {
            return false;
        }
    };
    
    //替换行
    this.replaceRow = function(rowId, replaceRow) {
        this._hash[rowId] = replaceRow;
    };

    //获取rowIndex
    this.getRowIndex = function(rowId) {
        var len = this.rowIdArray.length; 
        for (var i = 0; i < len; i++) { 
            if (this.rowIdArray[i] == rowId) {
               return i; 
            }  
        }
        return null;
    };

    //获取下一个RowId
    this.getNextRowId = function(rowId) {
        var len = this.rowIdArray.length;
        var found = false;
        for (var i = 0; i < len; i++) {
            if (!found) {
                if (this.rowIdArray[i] == rowId) {
                    found = true;
                }
            } else {
                if (this.contains(this.rowIdArray[i])) {
                    return this.rowIdArray[i];
                }
            }
        }
        return null;
    };

    //获取前一个RowId
    this.getPreviousRowId = function(rowId) {
        var len = this.rowIdArray.length;
        var found = false;
        for (var i = len-1; i >=0; i--) {
            if (!found) {
                if (this.rowIdArray[i] == rowId) {
                    found = true;
                }
            } else {
                if (this.contains(this.rowIdArray[i])) {
                    return this.rowIdArray[i];
                }
            }
        }
        return null;
    };

    //获取第一个RowId
    this.getFirstRowId = function() {
        var len = this.rowIdArray.length;
        for (i = 0; i < len; i++) {
            if (this.contains(this.rowIdArray[i])) {
                return this.rowIdArray[i];
            }
        }
        return null;
    };

    //获取最后一个RowId
    this.getLastRowId = function() {
        var len = this.rowIdArray.length;
        var found = false;
        for (var i = len-1; i >=0; i--) {
            if (this.contains(this.rowIdArray[i])) {
                return this.rowIdArray[i];
            }
        }
        return null;
    };
    
    //获取所有行
    this.allRows = function() { return this._hash; };
    
    //根据行id获取行
    this.rows = function(rowId) { return this._hash[rowId]; };
    
    //删除行
    this.remove = function(rowId) {
    	var row = this.rows(rowId);
    	if(row != undefined){
    		row.dispose();
	        delete this._hash[rowId];
	
	        if (this.count() == 0) {
	            this.currentRowId = "NullRow";
	        }
	        var rowIdArray = this.rowIdArray, ti = null;
	        for (var i = 0, j = rowIdArray.length; i < j; i++) {
	            if (rowId == rowIdArray[i]) {
	                ti = i;
	                break;
	            }
	        }
	        if (ti != null) rowIdArray.splice(ti, 1);
    	}
    };
   
    //总行数
    this.count = function() { var i = 0; for (var k in this._hash) { i++; } return i; };
    
    //是否包含此行
    this.contains = function(rowId) { return typeof (this._hash[rowId]) != "undefined"; };
    
    //清除原有的数据
    this.clear = function() { for (var k in this._hash) { this.rows(k).dispose(); delete this._hash[k]; } };
    
    //当前行id
    this.currentRowId = null;
    
    //获取当前行
    this.getCurrentRow = function() { return this.rows(this.currentRowId); };
    
    //第一条数据在数据库中的编号
    this.minIndex = 1;
    
    //最后一条数据在数据库里的编号
    this.maxIndex = 20;
    
    //记录总数
    this.totalNumber = 0; 

    //新行记录ID
    this.newRowId = null;

    //根据id字段值获取行号
    this.getRowIdByIdField = function(idFieldValue, idFieldName) {
        for (var k in this._hash) {
            if (this.getDataValue(k, idFieldName) == idFieldValue) {
                return k;
            }
        }
        return null;
    };
    //根据主键值和主键字段名，找到对应的RowId
    this.getRowIdByIdField = function(idFieldValue, idFieldName) {
        for (var k in this._hash) {
            if (this.getDataValue(k, idFieldName) == idFieldValue) {
                return k;
            }
        }
        return null;
    };

    //根据主键值和主键字段名，找到对应的Row对象
    this.getRowByIdField = function(idFieldValue, idFieldName) {
        for (var k in this._hash) {
            if (this.getDataValue(k, idFieldName) == idFieldValue) {
                return this.rows(k);
            }
        }
        return null;
    };

    //判断是否为新建的行，在服务器端数据库上不存在此行记录
    this.isNewRow = function(rowId, idFieldName) {
        return (this.getDataValue(rowId, idFieldName) == null);
    };

    //根据行序号 获取行对象
    this.getRowByIndex = function(rowIndex) {
        if (rowIndex >= this.count() || rowIndex < 0) {
            return null;
        }
        else {
           return this.rows(this.rowIdArray[rowIndex]);
        }
    };
 
    //获取数据值（根据RowId）
    this.getDataValue = function(rowId, columnName) {
        return this.rows(rowId).getValue(columnName);
    };

    //获取数据值（根据行记录）
    this.getDataValueInRow = function(row, columnName) {
        return row.getValue(columnName);
    };

    //设置数据值
    this.setDataValue = function(rowId, columnName, value) {
        this.rows(rowId).setValue(columnName, value);
    };

    //设置数据值
    this.setDataValueInRow = function(row, columnName, value) {
        row.setValue(columnName, value);
    };

    //获取显示域是否只读
    this.getReadonly = function(rowId, columnName) {
        return this.getDataValue(rowId, "Readonly$" + columnName); 
    };

    //获取显示域是否只读
    this.getReadonlyInRow = function(row, columnName) {
        return this.getDataValueInRow(row, "Readonly$" + columnName);
    };

    //设置显示域是否只读
    this.setReadonlyInRow = function(row, columnName, value) {
    	this.setDataValueInRow(row, "Readonly$" + columnName, value);
    };

    //设置显示域是否只读
    this.setReadonly = function(rowId, columnName, value) { 
        this.setDataValue(rowId, "Readonly$" + columnName, value);
    };

    //获取显示域是否可见
    this.getDispConditionInRow = function(row , columnName) {
    	return this.getDataValueInRow(row , "DispCondition$" + columnName);
    };

    //获取显示域是否可见
    this.getDispCondition = function(rowId, columnName) {
        return this.getDataValue(rowId, "DispCondition$" + columnName);
    };

    //设置显示域是否可见
    this.setDispConditionInRow = function(row, columnName, value) {
    this.setDataValueInRow(row, "DispCondition$" + columnName, value);
    };

    //设置显示域是否可见
    this.setDispCondition = function(rowId, columnName, value) {
        this.setDataValue(rowId, "DispCondition$" + columnName, value);
    };
    
    //获取显示域字段是否可为空
    this.getNullableInRow = function(row , columnName) {
    var result = this.getDataValueInRow(row , "NullAble$" + columnName);
    return result==null?true:result;
    };

    //获取显示域字段是否可为空
    this.getNullable = function(rowId, columnName) {
        return this.getDataValue(rowId, "NullAble$" + columnName);
    };

    //设置显示域字段是否可为空
    this.setNullableInRow = function(row, columnName, value) {
        this.setDataValueInRow(row, "NullAble$" + columnName, value);
    };

    //设置显示域字段是否可为空
    this.setNullable = function(rowId, columnName, value) {
        this.setDataValue(rowId, "NullAble$" + columnName, value);
    };
    
    this._backupRow;
    //备份当前行
    this.backupCurrentRow = function() {
        var curRow = this.getCurrentRow();
        this._backupRow = curRow ? curRow.Copy() : null;
    };

    //恢复当前行
    this.recoverCurrentRow = function() {
        if (this._backupRow && this._backupRow != "NullRow") {
            this.currentRowId = this._backupRow.RowId;
            this._hash[this.currentRowId] = this._backupRow;
        }
    };

    //拷贝数据表
    this.copyFromDatatable = function(sourceTable) {
        this.clear();
        this.currentRowId = "0";
        for (var rowId in sourceTable.allRows()) {
            var newRow = new DataRow(rowId.toString());
            var sourceRow = sourceTable.rows(rowId);
            for (var columnName in sourceRow.allCells()) {
                newRow.setValue(columnName, sourceRow.getValue(columnName));
            }
            this.addRow(rowId, newRow);
        }
    } 
}