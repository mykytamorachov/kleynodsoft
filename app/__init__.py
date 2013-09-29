from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.mail import Mail

app = Flask(__name__)
ALLOWED_EXTENSIONS = set(['jpg', 'png', 'gif', 'jpeg'])
UPLOAD_FOLDER = '/home/mykyta/PycharmProjects/kleynodsoft/app/static/img/posts'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/kleynodsoft'
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:Vakoms4ever!@localhost/thatriff'
app.secret_key = "\xa7\xab\x87\xd7\xff\xdc\xae \x0cY\x87\xf9t\xea\x19\t\x0eN\xe9\xea\xe8\xb6\xd6>"
db = SQLAlchemy(app)

app.config.update(
	DEBUG=True,
	MAIL_SERVER='smtp.gmail.com',
	MAIL_PORT=465,
	MAIL_USE_SSL=True,
	MAIL_USERNAME = 'lavriv92@gmail.com',
	MAIL_PASSWORD = 'nightwish1992',
	STATIC_URL = "http:/127.0.0.1:5000/static/"
	)

#app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

mail = Mail(app)
from app import views