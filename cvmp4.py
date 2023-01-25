from subprocess import call 

#mp4形式に変換&h264形式のファイル削除
def cvmp4(file_name):
	
	cmdcvt = "MP4Box -add " + file_name + ".h264 " + file_name + ".mp4" 
	call([cmdcvt], shell = True) 
	cmdrm = "rm " + file_name + ".h264"
	call([cmdrm], shell = True) 