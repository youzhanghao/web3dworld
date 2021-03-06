# coding: UTF-8
from application import app, db, fs, mongo
import docs
import os, sys


def listDirRec(dirPath):
	files = []
	for name in os.listdir(dirPath):
		path = os.path.join(dirPath, name)
		if os.path.isfile(path):
			files.append(path)
		elif os.path.isdir(path):
			map(files.append, listDirRec(path))
		else:
			raise Exception('unknown type of file: %s' % path)
	return files


def init_db():
	try:
		#if app.debug: # 但开发告一段落时将这里改成 if app.debug: db.drop_all()以使只在开发模式下清空表，
		db.drop_all()  # 但之前这样做以使得无论本地开发还是部署到appfog等云上都可以正常运行（开发时）
		db.create_all()
	except:
		pass


import models

root_dir = os.path.dirname(__file__)
resources_dir = os.path.join(root_dir, 'static', 'resources')
filepaths = listDirRec(resources_dir)
files = []


def getFileInfo(path):
	relativePath = path.replace(resources_dir + os.path.sep, '').replace('\\', '/')
	tmp = filter(lambda x: x != '', relativePath.split('/'))
	pathname = '.'.join(tmp)
	filename = tmp[-1]
	return {
	"path": path,
	"relativePath": relativePath,
	"pathname": pathname,
	"filename": filename
	}


def endsWithOneInArray(str, ends):
	for end in ends:
		l = len(end)
		if str[-l:] == end:
			return True
	return False


def saveFileInfoToDb(fileInfo):
	is_binary = False
	if endsWithOneInArray(fileInfo['filename'].lower(), ['jpg', 'png', 'ico', 'jpeg', 'bmp']):
		file_type = 'image'
		is_binary = True
	if is_binary:
		f = open(fileInfo['path'], 'rb')
	else:
		f = open(fileInfo['path'], 'r')
	data = f.read()
	f.close()
	blob_key = docs.Blob(data).save()
	file_type = 'file'
	if endsWithOneInArray(fileInfo['filename'].lower(), ['jpg', 'png', 'ico', 'jpeg', 'bmp']):
		file_type = 'image'
	resource = models.Resource(name=fileInfo['pathname'], type=file_type, blob_key=blob_key,
	                           tags="file resource my-3d-format")
	db.session.add(resource)
	db.session.commit()
	return True


# init_db()
# map(lambda x: files.append(getFileInfo(x)), filepaths)
# map(saveFileInfoToDb, files)