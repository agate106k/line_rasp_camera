import os
import requests
import datetime
from linebot import LineBotApi
from linebot.models import TextSendMessage
from camera_func import camera
from video_func import video
from dotenv import load_dotenv

load_dotenv()
channel_access_token = os.getenv("MY_CHANNNEL_ACCESS_TOKEN")
video_google_drive = os.getenv("MY_VIDEO_GOOGLE_DRIVE")
photo_google_drive = os.getenv("MY_PHOTO_GOOGLE_DRIVE")
line_bot_api = LineBotApi(channel_access_token)
notify_url = os.getenv("MY_NOTIFY_URL")#LINE NotifyのAPIのURL
token = os.getenv("MY_TOKEN") #LINE Notifyのtoken

def message_func(event,current):

    pic_name = "./LINE/picture/LINE_pic_raspic" + datetime.datetime.today().strftime('%Y%m%d_%H%M%S') + ".png"
    mov_name = "./LINE/movie/LINE_movie_raspic" + datetime.datetime.today().strftime('%Y%m%d_%H%M%S')
    if event.type == "message":
        messe = event.message.text
    #撮影してからLINE Notifyで画像を送信
    if messe == "撮影" and current == False:
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(f"こちらが撮影した画像です:{photo_google_drive}"))
        camera(320,240,pic_name)
        ms_data="こちらが撮影した画像です！"#メッセージ内容
        send_data = {'message': ms_data}#メッセージ
        headers = {'Authorization': 'Bearer ' + token}#トークン名
        files = {'imageFile': open(pic_name, 'rb')}#画像ファイルのオープン
        #送信
        res = requests.post(notify_url,
                            data=send_data,
                            headers=headers,
                            files=files)
        print(res)#メッセージがが送れたかどうかの結果を表示
    elif messe == "撮影" and current == True:
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(f"こちらが撮影した動画です:{video_google_drive}"))
        video(800,600,5,mov_name)
    elif messe in ("会員登録","写真を撮る","動画を撮る","トリセツ","マニュアルトリセツ"):
        pass
    else:
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage('メッセージありがとうございます。'))