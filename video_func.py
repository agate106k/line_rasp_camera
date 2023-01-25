import picamera
import time
import os
from cvmp4 import cvmp4

def video(x,y,times,video_name):
    camera = picamera.PiCamera()
    camera.resolution = (x,y)
    camera.start_preview()
    camera.start_recording(video_name+".h264")
    time.sleep(times)
    camera.stop_recording()
    camera.stop_preview()
    cvmp4(video_name)
    os.system('rclone copy ./%s gdrive:/LINE/movie' % (video_name+".mp4"))