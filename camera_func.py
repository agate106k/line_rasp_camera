import picamera
import numpy as np
from PIL import Image
import time
import os 

def save_image(ndarray, file_name):
    im = Image.fromarray(ndarray)
    im.save(file_name)
def camera(x,y,pic_name):
    with picamera.PiCamera() as camera:
        camera.resolution = (x, y)  # 撮影する画像の縦横ピクセル 横x縦
        camera.framerate = 24  # フレームレート
        time.sleep(2)  # カメラのセットアップが終わるのを待つ
        image = np.zeros((y, x, 3), dtype=np.uint8)  # numpy.ndarrayという特殊な型(リストに近い)で3次元配列を定義 縦x横
        camera.capture(image, 'rgb')  # RGB画像で撮影
    save_image(image, pic_name)
    os.system('rclone copy ./%s gdrive:/LINE/picture' % (pic_name))