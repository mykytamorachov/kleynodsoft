from flask.ext.wtf import Form 
from wtforms import TextField, \
 FileField, TextAreaField, SelectField

class NewsForm(Form):
    title = TextField('Title', validators=[])
    text = TextAreaField('Text', validators=[])
    image_url = FileField('Image', validators=[])
    language = SelectField("Language",choices=[('EN', 'English'), ('RU', "Russian"), ('UA', "Ukrainian")])

class UserForm(Form):
    name = TextField('Name', validators=[])
    username = TextField('Username', validators=[])
    email = TextField('Email', validators=[])
