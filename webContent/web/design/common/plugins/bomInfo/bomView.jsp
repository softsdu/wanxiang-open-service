<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<!-- 引用基础类库 added by ls 202030920 -->
<%@ include file="../../../../base.jsp" %>
<html>

<head>
  <meta charset="utf-8" />
  <title>物料查询页面</title>
  <link rel="stylesheet" href="./css/bom-view.css" media="screen" />
  <!--  <script src="http://cpbim.oss-cn-beijing.aliyuncs.com/index/lib/jquery.min.js"></script>-->
  <script src="./js/jquery.min.js"></script>
  <style>
    .loading {
      width: 80px;
      height: 40px;
      margin: 0 auto;
      margin-top: 100px;
    }

    .loading span {
      display: inline-block;
      width: 8px;
      height: 100%;
      border-radius: 4px;
      background: lightgreen;
      -webkit-animation: load 1s ease infinite;
    }

    @-webkit-keyframes load {

      0%,
      100% {
        height: 40px;
        background: lightgreen;
      }

      50% {
        height: 70px;
        margin: -15px 0;
        background: lightblue;
      }
    }

    .loading span:nth-child(2) {
      -webkit-animation-delay: 0.2s;
    }

    .loading span:nth-child(3) {
      -webkit-animation-delay: 0.4s;
    }

    .loading span:nth-child(4) {
      -webkit-animation-delay: 0.6s;
    }

    .loading span:nth-child(5) {
      -webkit-animation-delay: 0.8s;
    }
  </style>
</head>

<body>
  <div id="main">
    <table id="example-advanced" cellspacing="0" cellpadding="0">
      <thead>
        <tr id="treeTheadTr">
          <th>名称</th>
          <th>编码</th>
          <th>规格</th>
          <th>数量</th>
          <th>单位</th>
          <th>来源</th>
          <th>物料类型</th>
        </tr>
      </thead>
      <tbody id="treeTbody"></tbody>
    </table>
    <div class="loading">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <script src="./js/jquery.treetable.js"></script>
    <script type="text/javascript">
      var allBox = []
      var currHost = '', _lv2Str = ''
   	  //currHost = window.location.protocol + '//' + window.location.host
      var urlQuery = window.location.href, str = '', ajaxParams = { apiKey: "9Dg22AAZWuoYCjJ/GuNe2Q==" }
      if (urlQuery.indexOf('?') != -1) {
        let allParam = location.href.split('?')[1]
        str = decodeURI(allParam)
      }
      var urlQueryArr = str.split('&')
      for (let j = 0; j < urlQueryArr.length; j++) {
        let item = urlQueryArr[j]
        let item1 = item.split('=')
        ajaxParams[item1[0]] = item1[1]
      }
      $.ajax({
        type: "get",
        	
        //修改获取地址的方式 added by ls 20230920
        url: basePath + "/geometry3DNcpService/getInstanceParameters.action",
        //url: currHost + "/geometry3DNcpService/getInstanceParameters.action",
        
        data: {
          requestParam: JSON.stringify(ajaxParams)
        },
        dataType: "json",
        success: function (data) {
          $('.loading').css('display', 'none')
          if (data[0] && data[0].code == '000') {
            let _lv1Data = data[0].result.parameters || {}
            let _opt1 = getOtherOpt(_lv1Data.parameters || [])
            let _Lv1Str =
              `<tr data-tt-id="1">
                <td><span class="folderx">${_lv1Data.name || ''}</span></td>
                <td>${_lv1Data.gbcode || ''}</td>
                <td>${_opt1.spec || ''}</td>
                <td>${_lv1Data.count || ''}</td>
                <td>${_opt1.unit || ''}</td>
                <td>${_opt1.origin || ''}</td>
                <td>${_opt1.materType || ''}</td>
              </tr>`
            let _lv2Data = _lv1Data.children || []
            for (let i = 0; i < _lv2Data.length; i++) {
              let eachLv2 = _lv2Data[i]
              let _icon = 'filex'
              if (eachLv2.children && eachLv2.children.length > 0) {
                _icon = 'folderx'
              }
              let _opt2 = getOtherOpt(eachLv2.parameters || [])
              _lv2Str +=
                `<tr data-tt-id="1-${i}" data-tt-parent-id="1">
                  <td><span class="${_icon}">${eachLv2.name || ''}</span></td>
                  <td></td><td></td><td>${eachLv2.count || ''}</td><td>${_opt2.origin || ''}</td><td></td><td></td>
                </tr>`
              if (eachLv2.children && eachLv2.children.length > 0) {
                traverseTree(eachLv2.children, eachLv2, '1-' + i)
              }
            }
            $("#treeTbody").append(_Lv1Str + _lv2Str)
            initTreeTable()
          } else {
            alert(data[0].message)
          }
        },
        error: function (data, status, e) {
          $('.loading').css('display', 'none')
          alert("数据访问错误，请重试")
        }
      })
      function getOtherOpt (parameters) {
        let _result = {}
        parameters.forEach((item, index, array) => {
          if (item.name === "国标码") {
            _result.code = item.value
          } else if (item.name === "规格") {
            _result.spec = item.value
          } else if (item.name === "单位") {
            _result.unit = item.value
          } else if (item.name === "来源") {
            _result.origin = item.value
          } else if (item.name === "物料类型") {
            _result.materType = item.value
          }
        })
        return _result
      }
      function traverseTree (child, currLv, lvNo) {
        for (let j = 0; j < child.length; j++) {
          let eachTr = child[j]
          let _icon = 'filex'
          if (eachTr.children && eachTr.children.length > 0) {
            _icon = 'folderx'
          }
          let _opt3 = getOtherOpt(eachTr.parameters || [])
          _lv2Str += `<tr data-tt-id="${lvNo}-${j}" data-tt-parent-id="${lvNo}">
              <td><span class="${_icon}">${eachTr.name || ''}</span></td>
              <td>${_opt3.code || ''}</td>
              <td>${_opt3.spec || ''}</td>
              <td>${eachTr.count || ''}</td>
              <td>${_opt3.unit || ''}</td>
              <td>${_opt3.origin || ''}</td>
              <td>${_opt3.materType || ''}</td>
            </tr>`
          if (eachTr.children && eachTr.children.length > 0) {
            traverseTree(eachTr.children, eachTr, lvNo + '-' + j)
          }
        }
      }
      function initTreeTable () {
        $('#example-advanced').treetable({ expandable: true })
        $('#example-advanced tbody').on('mousedown', 'tr', function () {
          $('.selected').not(this).removeClass('selected')
          $(this).toggleClass('selected')
        })
      }
    </script>
</body>

</html>