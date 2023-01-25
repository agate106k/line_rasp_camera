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
notify_url = os.getenv("MY_NOTIFY_URL") #LINE NotifyのAPIのURL
token = os.getenv("MY_TOKEN") #LINE Notifyのtoken


def postback_func(event):
    x_manual = 320
    y_manual = 240
    length_manual = 5 
    pic_name = "./LINE/picture/LINE_pic_raspic" + datetime.datetime.today().strftime('%Y%m%d_%H%M%S') + ".png"
    mov_name = "./LINE/movie/LINE_movie_raspic" + datetime.datetime.today().strftime('%Y%m%d_%H%M%S')
    if event.type == "postback":
        rowdata = event.postback.data
        w_data = ""
        w_item = ""
        if rowdata.startswith("data=survey"):
            w_data = rowdata.split("&")[0].replace("data=","")
            w_item = rowdata.split("&")[1].replace("item=","")
        if w_data == "survey4" or w_data == "survey5":
            w_item_1 = w_item.split("×")[0]
            w_item_2 = w_item.split("×")[1]
            x_manual = int(w_item_1)
            y_manual = int(w_item_2)
            if w_data == "survey4":
                line_bot_api.reply_message(
                    event.reply_token,
                    TextSendMessage(f"こちらが撮影した画像です:{photo_google_drive}"))
                camera(x_manual,y_manual,pic_name)

                ms_data="撮影した画像はこちらです！" #メッセージ内容
                send_data = {'message': ms_data} #メッセージ
                headers = {'Authorization': 'Bearer ' + token} #トークン名
                files = {'imageFile': open(pic_name, 'rb')} #画像ファイルのオープン
                #送信
                res = requests.post(notify_url,
                                    data=send_data,
                                    headers=headers,
                                    files=files)
                print(res)
        elif w_data == "survey6":
            length_manual = int(w_item)
            line_bot_api.reply_message(
                event.reply_token,
                TextSendMessage(f"こちらが撮影した動画です:{video_google_drive}"))
            video(x_manual,y_manual,length_manual,mov_name)