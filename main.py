import os
import time
import requests
import RPi.GPIO as GPIO
from argparse import ArgumentParser
from flask import Flask, request, abort
from linebot import LineBotApi,WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import MessageEvent, TextMessage, PostbackEvent
from message_func import message_func
from postback_func import postback_func
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__) 
channel_secret = os.getenv("MY_CHANNEL_SECRET")
channel_access_token = os.getenv("MY_CHANNNEL_ACCESS_TOKEN")
line_bot_api = LineBotApi(channel_access_token)
handler = WebhookHandler(channel_secret)
gaswebhook = os.getenv("MY_GASWEBHOOK")
webhookinspector = os.getenv("MY_WEBHOOKINSPECTOR")
current = False


def switch (signal): 
    global current
    if (GPIO.input(signal) == GPIO.HIGH):
        if current == False:
            current = True
            print("ON")
        elif current == True:
            current = False
            print("OFF")
    time.sleep(0.1)

GPIO.setmode(GPIO.BCM)
GPIO.setup(18, GPIO.IN)
GPIO.add_event_detect(18, GPIO.RISING, callback=switch, bouncetime=300)
# LINE DevelopersのWebhookに指定したURLにリクエストを送信して、問題がなければhandleに定義されている関数を呼ぶ
@app.route("/callback", methods=['POST'])

def callback():    
    signature = request.headers['X-Line-Signature']     
    body = request.get_data(as_text=True)        
    app.logger.info("Request body: " + body)     
    try:         
        handler.handle(body, signature)     
    except InvalidSignatureError:         
        abort(400)
    headers = {
        'Content-Type': 'application/json',
        'X-Line-Signature': request.headers['X-Line-Signature']
    }
    requests.post(gaswebhook, headers=headers, data=request.get_data())
    requests.post(webhookinspector, headers=headers, data=request.get_data())
    return 'OK'

@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    message_func(event,current)

@handler.add(PostbackEvent)
def handle_postback(event):
    postback_func(event)
 
if __name__ == "__main__":
    arg_parser = ArgumentParser(
        usage='Usage: python ' + __file__ + ' [--port ] [--help]'
    )
    arg_parser.add_argument('-p', '--port', default=8080, help='port')#8000だとできなかった
    arg_parser.add_argument('-d', '--debug', default=False, help='debug')
    options = arg_parser.parse_args()
    app.run(debug=options.debug, port=options.port)
    GPIO.cleanup()