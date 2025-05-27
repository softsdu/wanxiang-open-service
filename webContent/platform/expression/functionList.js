var expFunctions = {
  "异步调用":{
    "asynInvoke":{
      name:"asynInvoke", description:"执行异步操作，用于轮询获取待执行操作，并执行之",runAt:"Server",
      settings:[
        {
          description:"执行定时流转单据",
          valueType:"void",
          valueTypeDes:"无类型",
          parameters:[
            {name:"processCount", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:"本次计划执行的异步操作个数"}
          ]
        }
      ]
    },
    "checkAsynInvokeStatus":{
      name:"checkAsynInvokeStatus", description:"检测异步调用状态",runAt:"Server",
      settings:[
        {
          description:"检测异步调用状态",
          valueType:"void",
          valueTypeDes:"无类型",
          parameters:[
            {name:"checkCount", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:"本次计划检测个数"}
          ]
        }
      ]
    }
  },
  "通用函数集":{
    "add":{
      name:"add", description:"加",runAt:"All",
      settings:[
        {
          description:"正数",
          valueType:"java.math.bigdecimal",
          valueTypeDes:"数值(BigDecimal)",
          parameters:[
            {name:"数值1", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:""}
          ]
        },
        {
          description:"加法",
          valueType:"java.math.bigdecimal",
          valueTypeDes:"数值(BigDecimal)",
          parameters:[
            {name:"数值1", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:""},
            {name:"数值2", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:""}
          ]
        },
        {
          description:"拼接字符串",
          valueType:"java.lang.string",
          valueTypeDes:"字符串",
          parameters:[
            {name:"字符串1", valueType:"java.lang.string", valueTypeDes:"字符串", description:""},
            {name:"字符串2", valueType:"java.lang.string", valueTypeDes:"字符串", description:""}
          ]
        }
      ]
    },
    "and":{
      name:"and", description:"而且，并且",runAt:"All",
      settings:[
        {
          description:"而且, 并",
          valueType:"java.lang.boolean",
          valueTypeDes:"布尔类型",
          parameters:[
            {name:"条件1", valueType:"java.lang.boolean", valueTypeDes:"布尔类型", description:""},
            {name:"条件2", valueType:"java.lang.boolean", valueTypeDes:"布尔类型", description:""}
          ]
        }
      ]
    },
    "divide":{
        name:"divide", description:"除",runAt:"All",
        settings:[
          {
            description:"除法",
            valueType:"java.math.bigdecimal",
            valueTypeDes:"数值(BigDecimal)",
            parameters:[
              {name:"数值1", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:""},
              {name:"数值2", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:""}
            ]
          }
        ]
      },
      "remaind":{
          name:"remaind", description:"取余",runAt:"All",
          settings:[
            {
              description:"取余",
              valueType:"java.math.bigdecimal",
              valueTypeDes:"数值(BigDecimal)",
              parameters:[
                {name:"数值1", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:""},
                {name:"数值2", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:""}
              ]
            }
          ]
        },
    "equal":{
      name:"equal", description:"相等",runAt:"All",
      settings:[
        {
          description:"",
          valueType:"java.lang.boolean",
          valueTypeDes:"布尔类型",
          parameters:[
            {name:"值1", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:""},
            {name:"值2", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:""}
          ]
        },
        {
          description:"",
          valueType:"java.lang.boolean",
          valueTypeDes:"布尔类型",
          parameters:[
            {name:"值1", valueType:"java.util.date", valueTypeDes:"日期时间", description:""},
            {name:"值2", valueType:"java.util.date", valueTypeDes:"日期时间", description:""}
          ]
        },
        {
          description:"",
          valueType:"java.lang.boolean",
          valueTypeDes:"布尔类型",
          parameters:[
            {name:"值1", valueType:"java.lang.string", valueTypeDes:"字符串", description:""},
            {name:"值2", valueType:"java.lang.string", valueTypeDes:"字符串", description:""}
          ]
        },
        {
          description:"",
          valueType:"java.lang.boolean",
          valueTypeDes:"布尔类型",
          parameters:[
            {name:"值1", valueType:"java.util.date", valueTypeDes:"日期时间", description:""},
            {name:"值2", valueType:"java.util.date", valueTypeDes:"日期时间", description:""}
          ]
        }
      ]
    },
    "iif":{
      name:"iif", description:"IIF判断",runAt:"All",
      settings:[
        {
          description:"",
          valueType:"net.sf.json.jsonobject",
          valueTypeDes:"Json对象",
          parameters:[
            {name:"check", valueType:"java.lang.boolean", valueTypeDes:"布尔类型", description:""},
            {name:"returnValue1", valueType:"net.sf.json.jsonobject", valueTypeDes:"Json对象", description:""},
            {name:"returnValue2", valueType:"net.sf.json.jsonobject", valueTypeDes:"Json对象", description:""}
          ]
        },
        {
          description:"",
          valueType:"java.util.date",
          valueTypeDes:"日期时间",
          parameters:[
            {name:"check", valueType:"java.lang.boolean", valueTypeDes:"布尔类型", description:""},
            {name:"returnValue1", valueType:"java.util.date", valueTypeDes:"日期时间", description:""},
            {name:"returnValue2", valueType:"java.util.date", valueTypeDes:"日期时间", description:""}
          ]
        },
        {
          description:"",
          valueType:"java.util.date",
          valueTypeDes:"日期时间",
          parameters:[
            {name:"check", valueType:"java.lang.boolean", valueTypeDes:"布尔类型", description:""},
            {name:"returnValue1", valueType:"java.util.date", valueTypeDes:"日期时间", description:""},
            {name:"returnValue2", valueType:"java.util.date", valueTypeDes:"日期时间", description:""}
          ]
        },
        {
          description:"",
          valueType:"java.lang.string",
          valueTypeDes:"字符串",
          parameters:[
            {name:"check", valueType:"java.lang.boolean", valueTypeDes:"布尔类型", description:""},
            {name:"returnValue1", valueType:"java.lang.string", valueTypeDes:"字符串", description:""},
            {name:"returnValue2", valueType:"java.lang.string", valueTypeDes:"字符串", description:""}
          ]
        },
        {
          description:"",
          valueType:"java.math.bigdecimal",
          valueTypeDes:"数值(BigDecimal)",
          parameters:[
            {name:"check", valueType:"java.lang.boolean", valueTypeDes:"布尔类型", description:""},
            {name:"returnValue1", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:""},
            {name:"returnValue2", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:""}
          ]
        }
      ]
    },
    "jsonToString":{
      name:"jsonToString", description:"Json转字符串",runAt:"All",
      settings:[
        {
          description:"Json转字符串",
          valueType:"java.lang.string",
          valueTypeDes:"字符串",
          parameters:[
            {name:"Json对象", valueType:"net.sf.json.jsonobject", valueTypeDes:"Json对象", description:""}
          ]
        }
      ]
    },
    "lessThan":{
      name:"lessThan", description:"小于",runAt:"All",
      settings:[
        {
          description:"",
          valueType:"java.lang.boolean",
          valueTypeDes:"布尔类型",
          parameters:[
            {name:"值1", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:""},
            {name:"值2", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:""}
          ]
        }
      ]
    },
    "lessThanOrEqual":{
      name:"lessThanOrEqual", description:"小于等于",runAt:"All",
      settings:[
        {
          description:"",
          valueType:"java.lang.boolean",
          valueTypeDes:"布尔类型",
          parameters:[
            {name:"值1", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:""},
            {name:"值2", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:""}
          ]
        }
      ]
    },
    "moreThan":{
      name:"moreThan", description:"大于",runAt:"All",
      settings:[
        {
          description:"",
          valueType:"java.lang.boolean",
          valueTypeDes:"布尔类型",
          parameters:[
            {name:"值1", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:""},
            {name:"值2", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:""}
          ]
        }
      ]
    },
    "moreThanOrEqual":{
      name:"moreThanOrEqual", description:"大于等于",runAt:"All",
      settings:[
        {
          description:"",
          valueType:"java.lang.boolean",
          valueTypeDes:"布尔类型",
          parameters:[
            {name:"值1", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:""},
            {name:"值2", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:""}
          ]
        }
      ]
    },
    "multiply":{
      name:"multiply", description:"乘",runAt:"All",
      settings:[
        {
          description:"乘法",
          valueType:"java.math.bigdecimal",
          valueTypeDes:"数值(BigDecimal)",
          parameters:[
            {name:"数值1", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:""},
            {name:"数值2", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:""}
          ]
        }
      ]
    },
    "or":{
      name:"or", description:"或者",runAt:"All",
      settings:[
        {
          description:"或者",
          valueType:"java.lang.boolean",
          valueTypeDes:"布尔类型",
          parameters:[
            {name:"条件1", valueType:"java.lang.boolean", valueTypeDes:"布尔类型", description:""},
            {name:"条件2", valueType:"java.lang.boolean", valueTypeDes:"布尔类型", description:""}
          ]
        }
      ]
    },
    "stringToJson":{
      name:"stringToJson", description:"字符串转Json",runAt:"All",
      settings:[
        {
          description:"Json转字符串",
          valueType:"net.sf.json.jsonobject",
          valueTypeDes:"Json对象",
          parameters:[
            {name:"字符串", valueType:"java.lang.string", valueTypeDes:"字符串", description:""}
          ]
        }
      ]
    },
    "subtract":{
      name:"subtract", description:"减",runAt:"All",
      settings:[
        {
          description:"",
          valueType:"java.math.bigdecimal",
          valueTypeDes:"数值(BigDecimal)",
          parameters:[
            {name:"数值1", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:"负数"}
          ]
        },
        {
          description:"减法",
          valueType:"java.math.bigdecimal",
          valueTypeDes:"数值(BigDecimal)",
          parameters:[
            {name:"数值1", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:""},
            {name:"数值2", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:""}
          ]
        }
      ]
    }
  },
  "自定义函数集":{
  },
  "值类型转换":{
    "dateToString":{
      name:"dateToString", description:"日期转换为字符串",runAt:"Server",
      settings:[
        {
          description:"日期转换为字符串",
          valueType:"java.lang.string",
          valueTypeDes:"字符串",
          parameters:[
            {name:"dateValue", valueType:"java.util.date", valueTypeDes:"日期时间", description:"日期类型值"},
            {name:"format", valueType:"java.lang.string", valueTypeDes:"字符串", description:"格式"}
          ]
        },
        {
          description:"日期转换为字符串",
          valueType:"java.lang.string",
          valueTypeDes:"字符串",
          parameters:[
            {name:"dateValue", valueType:"java.util.date", valueTypeDes:"日期时间", description:"日期类型值"}
          ]
        }
      ]
    },
    "decimalToString":{
      name:"decimalToString", description:"数值转换为字符串",runAt:"Server",
      settings:[
        {
          description:"数值转换为字符串",
          valueType:"java.lang.string",
          valueTypeDes:"字符串",
          parameters:[
            {name:"decimalValue", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:"数值类型值"},
            {name:"format", valueType:"java.lang.string", valueTypeDes:"字符串", description:"格式"}
          ]
        },
        {
          description:"数值转换为字符串",
          valueType:"java.lang.string",
          valueTypeDes:"字符串",
          parameters:[
            {name:"decimalValue", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:"数值类型值"}
          ]
        }
      ]
    },
    "stringToDate":{
      name:"stringToDate", description:"字符串转换为日期",runAt:"Server",
      settings:[
        {
          description:"字符串转换为日期",
          valueType:"java.util.date",
          valueTypeDes:"日期时间",
          parameters:[
            {name:"stringValue", valueType:"java.lang.string", valueTypeDes:"字符串", description:"字符串类型值"},
            {name:"format", valueType:"java.lang.string", valueTypeDes:"字符串", description:"格式"}
          ]
        },
        {
          description:"字符串转换为日期",
          valueType:"java.util.date",
          valueTypeDes:"日期时间",
          parameters:[
            {name:"stringValue", valueType:"java.lang.string", valueTypeDes:"字符串", description:"字符串类型值"}
          ]
        }
      ]
    },
    "stringToDecimal":{
      name:"stringToDecimal", description:"字符串转换为数值",runAt:"Server",
      settings:[
        {
          description:"字符串转换为数值",
          valueType:"java.math.bigdecimal",
          valueTypeDes:"数值(BigDecimal)",
          parameters:[
            {name:"stringValue", valueType:"java.lang.string", valueTypeDes:"字符串", description:"字符串类型值"},
            {name:"format", valueType:"java.lang.string", valueTypeDes:"字符串", description:"格式"}
          ]
        },
        {
          description:"字符串转换为数值",
          valueType:"java.math.bigdecimal",
          valueTypeDes:"数值(BigDecimal)",
          parameters:[
            {name:"stringValue", valueType:"java.lang.string", valueTypeDes:"字符串", description:"字符串类型值"}
          ]
        }
      ]
    },
    "stringToTime":{
      name:"stringToTime", description:"字符串转换为时间",runAt:"Server",
      settings:[
        {
          description:"字符串转换为时间",
          valueType:"java.util.date",
          valueTypeDes:"日期时间",
          parameters:[
            {name:"stringValue", valueType:"java.lang.string", valueTypeDes:"字符串", description:"字符串类型值"},
            {name:"format", valueType:"java.lang.string", valueTypeDes:"字符串", description:"格式"}
          ]
        },
        {
          description:"字符串转换为时间",
          valueType:"java.util.date",
          valueTypeDes:"日期时间",
          parameters:[
            {name:"stringValue", valueType:"java.lang.string", valueTypeDes:"字符串", description:"字符串类型值"}
          ]
        }
      ]
    },
    "timeToString":{
      name:"timeToString", description:"时间转换为字符串",runAt:"Server",
      settings:[
        {
          description:"时间转换为字符串",
          valueType:"java.lang.string",
          valueTypeDes:"字符串",
          parameters:[
            {name:"timeValue", valueType:"java.util.date", valueTypeDes:"日期时间", description:"时间类型值"},
            {name:"format", valueType:"java.lang.string", valueTypeDes:"字符串", description:"格式"}
          ]
        },
        {
          description:"时间转换为字符串",
          valueType:"java.lang.string",
          valueTypeDes:"字符串",
          parameters:[
            {name:"timeValue", valueType:"java.util.date", valueTypeDes:"日期时间", description:"时间类型值"}
          ]
        }
      ]
    }
  },
  "工作流":{
    "driveEndAsynDocument":{
      name:"driveEndAsynDocument", description:"执行流转单据，针对异步处理结束的单据",runAt:"Server",
      settings:[
        {
          description:"执行流转单据，针对异步处理结束的单据",
          valueType:"void",
          valueTypeDes:"无类型",
          parameters:[
            {name:"processCount", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:"本次计划处理单据个数"}
          ]
        }
      ]
    },
    "timingDriveDocument":{
      name:"timingDriveDocument", description:"执行定时流转单据",runAt:"Server",
      settings:[
        {
          description:"执行定时流转单据",
          valueType:"void",
          valueTypeDes:"无类型",
          parameters:[
            {name:"processCount", valueType:"java.math.bigdecimal", valueTypeDes:"数值(BigDecimal)", description:"本次计划处理单据个数"}
          ]
        }
      ]
    }
  },
  "未归类":{
  }
  }