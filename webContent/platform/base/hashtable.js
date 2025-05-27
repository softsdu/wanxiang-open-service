//哈希表
function Hashtable() {
    //存数据的实体
    this._hash = {};

    //新增键值
    this.add = function(key, value) {
        if (typeof (key) != "undefined") {
            if (this.contains(key) == false) {
                this._hash[key] = value;
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };

    //删除键值
    this.remove = function(key) { delete this._hash[key]; };

    //数量
    this.count = function() { var i = 0; for (var k in this._hash) { i++; } return i; };

    //获取值
    this.get = function(key) {
        var value = this._hash[key];
        return typeof (value) == "undefined" ? null : value
    };

    //赋值
    this.set = function(key, value) {
        return this._hash[key] = value;
    };

    //是否包含键
    this.contains = function(key) { return typeof (this._hash[key]) != "undefined"; };

    //清空哈希表
    this.clear = function() { for (var k in this._hash) { delete this._hash[k]; } };

    //获取所有键
    this.allKeys = function() { return this._hash; }
} 
