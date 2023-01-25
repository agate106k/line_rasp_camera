//固定値
var channel_token = "CHANNNEL_ACCESS_TOKEN"
var url = "https://api.line.me/v2/bot/message/reply"
var spreadsheet = SpreadsheetApp.openById("1M4QDzVNfF2r-exuiONPts9mOad7BBWf5ovS1i_5MJyI");
var sheet_userlist = spreadsheet.getSheetByName('surveylist');

//LINEからのイベントがdoPostにとんでくる
function doPost(e) {
  //とんできた情報を扱いやすいように変換している
  var json = e.postData.contents;
  var events = JSON.parse(json).events;
  var dat = sheet_userlist.getDataRange().getValues(); //受け取ったシートのデータを二次元配列に取得
  //とんできたイベントの種類を確認する
  events.forEach(function(event) {
    // ユーザーIDを取得
    var userId = event.source.userId;
    //スプレッドシートに書き込む
    for(var i=1;i<dat.length;i++){
      if(dat[i][0] == userId){
        break;
      }
    }
    if(i==dat.length) {
      sheet_userlist.appendRow([userId]);
    }
    //もしイベントの種類がトークによるテキストメッセージだったら
if(event.type == "postback") {
      var w_data = event.postback.data.split("&")[0].replace("data=","");//質問の内容を一時格納
      var w_item = event.postback.data.split("&")[1].replace("item=","");//回答を一時格納
      // 性別の回答がきたら
      if(w_data == "survey1") {
        sheet_userlist.getRange(i+1, 3).setValue(w_item);//スプレッドシートに性別の回答を入力
        survey_age(event);//入学年度の質問をリプライメッセージ送信
      }
      else if(w_data == "survey2") {
        sheet_userlist.getRange(i+1, 4).setValue(w_item);//スプレッドシートに性別の回答を入力
        survey_fac(event);//入学年度の質問をリプライメッセージ送信
      }
      else if(w_data == "survey3") {
        sheet_userlist.getRange(i+1, 5).setValue(w_item);//スプレッドシートに入学年度の回答を入力
        survey_end(event);//アンケートありがとうのリプライメッセージ送信
      }
      else if(w_data == "survey5") {
        survey_time(event);//動画時間を設定する
      }
    }
    else if(event.type == "follow" ) {
    var userId = event.source.userId;
    var data1 = SpreadsheetApp.openById("1M4QDzVNfF2r-exuiONPts9mOad7BBWf5ovS1i_5MJyI").getSheetByName('surveylist');
    var last_row = data1.getLastRow();
    for(var i = last_row; i >= 1; i--) {
      if(data1.getRange(i,1).getValue() != '') {
        var j = i + 1;
        data1.getRange(j,1).setValue(userId);

        break;
      }

    }
    push_survey_new(event)
  }
  else if(event.type == "message" ) {
    var userId = event.source.userId;
    if(event.message.text == "会員登録"){
    push_survey_new(event)
    }
    else if(event.message.text == "写真を撮る"){
    push_picture_survey(event)
    }
    else if(event.message.text == "動画を撮る"){
    push_video_survey(event)
    }
  }
  
 })
}


function push_survey_new(event){
var message = {
  "replyToken" : event.replyToken,
  'messages' : [
    {"type": "text","text" : "ユーザー登録のため、性別・学部・学年を教えてください！\n\nまずは性別を選択してください。",
      "quickReply": {
          "items": [
            {
                "type": "action",
                "action": {
                    "type": "postback",
                    "label": "男性",
                    "data":"data=survey1&item=男性",
                    "displayText": "男性"
                }
            },
            {
                "type": "action",
                "action": {
                    "type": "postback",
                    "label": "女性",
                    "data":"data=survey1&item=女性",
                    "displayText": "女性"
                }
            }
          ]
        }}
  ]
  };
//メッセージに添えなければならない情報
var options = {
  "method" : "post",
  "headers" : {
    "Content-Type" : "application/json",
    "Authorization" : "Bearer " + channel_token
  },
  "payload" : JSON.stringify(message)
};

//自動返信メッセージを送信する
UrlFetchApp.fetch(url, options);
}






function push_survey(userId){
  var url = "https://api.line.me/v2/bot/message/push";
  var headers = {
    "Content-Type" : "application/json; charset=UTF-8",
    'Authorization': 'Bearer ' + channel_token,
  };
  var postData = {
        "to" : userId,
  'messages' : [
    {"type": "text","text" : "ユーザー登録のため、性別・学部・学年を教えてください！\n\nまずは性別を選択してください。",
      "quickReply": {
          "items": [
            {
                "type": "action",
                "action": {
                    "type": "postback",
                    "label": "男性",
                    "data":"data=survey1&item=男性",
                    "displayText": "男性"
                }
            },
            {
                "type": "action",
                "action": {
                    "type": "postback",
                    "label": "女性",
                    "data":"data=survey1&item=女性",
                    "displayText": "女性"
                }
            }
          ]
        }}
  ]

  }
   var options = {
        "method" : "post",
        "headers" : headers,
        "payload" : JSON.stringify(postData)
      };

      return UrlFetchApp.fetch(url, options);
}

function survey_age(event){
var message = {
  "replyToken" : event.replyToken,
  'messages' : [
    {"type": "text","text" : "入学年度を選択してください。",
    "quickReply": {
    "items": [
        {
            "type": "action",
            "action": {
                "type": "postback",
                "label": "2022年度",
                "data":"data=survey2&item=2022年度",
                "displayText": "2022年度"
            }
        },
        {
            "type": "action",
            "action": {
                "type": "postback",
                "label": "2021年度",
                "data":"data=survey2&item=2021年度",
                "displayText": "2021年度"
              }
        },
        {
            "type": "action",
            "action": {
                "type": "postback",
                "label": "2020年度",
                "data":"data=survey2&item=2020年度",
                "displayText": "2020年度"
              }
        },
        {
            "type": "action",
            "action": {
                "type": "postback",
                "label": "2019年度",
                "data":"data=survey2&item=2019年度",
                "displayText": "2019年度"
              }
        },
        {
            "type": "action",
            "action": {
                "type": "postback",
                "label": "2018年度",
                "data":"data=survey2&item=2018年度",
                "displayText": "2018年度"
              }
        },
        {
            "type": "action",
            "action": {
                "type": "postback",
                "label": "2017年度",
                "data":"data=survey2&item=2017年度",
                "displayText": "2017年度"
              }
        }
        ]
      }}
    ]
  };
//メッセージに添えなければならない情報
var options = {
  "method" : "post",
  "headers" : {
    "Content-Type" : "application/json",
    "Authorization" : "Bearer " + channel_token
  },
  "payload" : JSON.stringify(message)
};

//自動返信メッセージを送信する
UrlFetchApp.fetch(url, options);
}
function survey_fac(event){
var message = {
  "replyToken" : event.replyToken,
  'messages' : [
    {"type": "text","text" : "所属学部を選択してください。",
    "quickReply": {
    "items": [
        {
            "type": "action",
            "action": {
                "type": "postback",
                "label": "文学部",
                "data":"data=survey3&item=文学部",
                "displayText": "文学部"
            }
        },
        {
            "type": "action",
            "action": {
                "type": "postback",
                "label": "経済学部",
                "data":"data=survey3&item=経済学部",
                "displayText": "経済学部"
              }
        },
        {
            "type": "action",
            "action": {
                "type": "postback",
                "label": "法学部政治学科",
                "data":"data=survey3&item=法学部政治学科",
                "displayText": "法学部政治学科"
              }
        },
        {
            "type": "action",
            "action": {
                "type": "postback",
                "label": "法学部法律学科",
                "data":"data=survey3&item=法学部法律学科",
                "displayText": "法学部法律学科"
              }
        },
        {
            "type": "action",
            "action": {
                "type": "postback",
                "label": "商学部",
                "data":"data=survey3&item=商学部",
                "displayText": "商学部"
              }
        },
        {
            "type": "action",
            "action": {
                "type": "postback",
                "label": "理工学部",
                "data":"data=survey3&item=理工学部",
                "displayText": "理工学部"
              }
        },
        {
            "type": "action",
            "action": {
                "type": "postback",
                "label": "医学部",
                "data":"data=survey3&item=医学部",
                "displayText": "医学部"
              }
        },
        {
            "type": "action",
            "action": {
                "type": "postback",
                "label": "総合政策学部",
                "data":"data=survey3&item=総合政策学部",
                "displayText": "総合政策学部"
              }
        },
        {
            "type": "action",
            "action": {
                "type": "postback",
                "label": "環境情報学部",
                "data":"data=survey3&item=環境情報学部",
                "displayText": "環境情報学部"
              }
        },
        {
            "type": "action",
            "action": {
                "type": "postback",
                "label": "薬学部",
                "data":"data=survey3&item=薬学部",
                "displayText": "薬学部"
              }
        },
        {
            "type": "action",
            "action": {
                "type": "postback",
                "label": "看護医療学部",
                "data":"data=survey3&item=看護医療学部",
                "displayText": "看護医療学部"
              }
        },
        {
            "type": "action",
            "action": {
                "type": "postback",
                "label": "その他",
                "data":"data=survey3&item=その他",
                "displayText": "その他"
              }
        }
        ]
      }}
    ]
};
//メッセージに添えなければならない情報
var options = {
  "method" : "post",
  "headers" : {
    "Content-Type" : "application/json",
    "Authorization" : "Bearer " + channel_token
  },
  "payload" : JSON.stringify(message)
};

//自動返信メッセージを送信する
UrlFetchApp.fetch(url, options);
}





function survey_end(event){
  var message = {
      "replyToken" : event.replyToken,
      'messages' : [
        {"type": "text","text" : "アンケートのご協力ありがとうございました。"}
        ]
    };
  //メッセージに添えなければならない情報
  var options = {
    "method" : "post",
    "headers" : {
      "Content-Type" : "application/json",
      "Authorization" : "Bearer " + channel_token
    },
    "payload" : JSON.stringify(message)
  };

  //自動返信メッセージを送信する
  UrlFetchApp.fetch(url, options);
}

function push_picture_survey(event){
var message = {
  "replyToken" : event.replyToken,
  'messages' : [
    {"type": "text","text" : "画質(px)を選んでください",
      "quickReply": {
          "items": [
            {
                "type": "action",
                "action": {
                    "type": "postback",
                    "label": "320×240",
                    "data":"data=survey4&item=320×240",
                    "displayText": "320×240"
                }
            },
            {
                "type": "action",
                "action": {
                    "type": "postback",
                    "label": "640×480",
                    "data":"data=survey4&item=640×480",
                    "displayText": "640×480"
                }
            },
            {
                "type": "action",
                "action": {
                    "type": "postback",
                    "label": "800×600",
                    "data":"data=survey4&item=800×600",
                    "displayText": "800×600"
                }
            },
            {
                "type": "action",
                "action": {
                    "type": "postback",
                    "label": "1280×720",
                    "data":"data=survey4&item=1280×720",
                    "displayText": "1280×720"
                }
            }
          ]
        }}
  ]
    //★★★messages配信内容 end★★★
  };
//メッセージに添えなければならない情報
var options = {
  "method" : "post",
  "headers" : {
    "Content-Type" : "application/json",
    "Authorization" : "Bearer " + channel_token
  },
  "payload" : JSON.stringify(message)
};

//自動返信メッセージを送信する
UrlFetchApp.fetch(url, options);
}

function push_video_survey(event){
var message = {
  "replyToken" : event.replyToken,
  'messages' : [
    {"type": "text","text" : "まずは画質(px)を選んでください",
      "quickReply": {
          "items": [
            {
                "type": "action",
                "action": {
                    "type": "postback",
                    "label": "320×240",
                    "data":"data=survey5&item=320×240",
                    "displayText": "320×240"
                }
            },
            {
                "type": "action",
                "action": {
                    "type": "postback",
                    "label": "640×480",
                    "data":"data=survey5&item=640×480",
                    "displayText": "640×480"
                }
            },
            {
                "type": "action",
                "action": {
                    "type": "postback",
                    "label": "800×600",
                    "data":"data=survey5&item=800×600",
                    "displayText": "800×600"
                }
            },
            {
                "type": "action",
                "action": {
                    "type": "postback",
                    "label": "1280×720",
                    "data":"data=survey5&item=1280×720",
                    "displayText": "1280×720"
                }
            }
          ]
        }}
  ]
    //★★★messages配信内容 end★★★
  };
//メッセージに添えなければならない情報
var options = {
  "method" : "post",
  "headers" : {
    "Content-Type" : "application/json",
    "Authorization" : "Bearer " + channel_token
  },
  "payload" : JSON.stringify(message)
};

//自動返信メッセージを送信する
UrlFetchApp.fetch(url, options);
}

function survey_time(event){
var message = {
  "replyToken" : event.replyToken,
  'messages' : [
    {"type": "text","text" : "撮影する動画時間を選んでください",
      "quickReply": {
          "items": [
            {
                "type": "action",
                "action": {
                    "type": "postback",
                    "label": "3秒",
                    "data":"data=survey6&item=3",
                    "displayText": "3秒"
                }
            },
            {
                "type": "action",
                "action": {
                    "type": "postback",
                    "label": "5秒",
                    "data":"data=survey6&item=5",
                    "displayText": "5秒"
                }
            },
            {
                "type": "action",
                "action": {
                    "type": "postback",
                    "label": "10秒",
                    "data":"data=survey6&item=10",
                    "displayText": "10秒"
                }
            },
            {
                "type": "action",
                "action": {
                    "type": "postback",
                    "label": "30秒",
                    "data":"data=survey6&item=30",
                    "displayText": "30秒"
                }
            }
          ]
        }}
  ]
    //★★★messages配信内容 end★★★
  };
//メッセージに添えなければならない情報
var options = {
  "method" : "post",
  "headers" : {
    "Content-Type" : "application/json",
    "Authorization" : "Bearer " + channel_token
  },
  "payload" : JSON.stringify(message)
};

//自動返信メッセージを送信する
UrlFetchApp.fetch(url, options);
}

