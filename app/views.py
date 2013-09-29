from app import app
from app import db
from flask import request, Response, abort, \
    render_template, redirect, url_for, session
from json import dumps, loads
from werkzeug import secure_filename
import os
import re
from app.models import *
from app.forms import *

@app.route('/')
@app.route('/index')
def index():
    return render_template('/ua/index.html')

@app.route('/admin/add_news/')
@app.route('/admin/add_news')
def add_news():
    form = NewsForm()
    context = {
        'form': form
    }
    return render_template('/admin/add_news.html', context=context)

@app.route('/registration', methods=["POST", "GET"])
def registration():
    if request.method == 'POST':
        request_data = loads(request.data)
        try:
            if not re.match(r"[^@]+@[^@]+\.[^@]+", request_data['email']):
                response = {
                'ansCode': 77,
                'Error': 'Wrong email'
            }
            else:
                user = User(
                        request_data['name'],
                        request_data['username'],
                        request_data['email']
                    )
                db.session.add(user)
                db.session.commit()
                response = {
                    'ansCode':1,
                    'UID':user.id
                }
        except:
            response = {
                'ansCode': 99,
                'Error': 'Wrong params'
            }
        return Response(
            response=dumps(response),
            status=200,
            headers={
                'Content-Type':'application/json'
            })
    else:
        abort(404)

@app.route('/news/add/', methods=['GET', 'POST'])
def add_post():
        if request.method == 'POST':
            app.logger.debug(request.form['language'])
            img_path = None
            type = LanguageType.from_string(request.form['language'])
            lang = Language.query.filter_by(language_name=type).first()
            if request.form['cover_url']:
                img_path = request.form['cover_url']
                app.logger.debug(img_path)
            else:
                img_path = None
                """
            else:
                app.logger.debug(img_path)
                if request.files['cover_image']:
                    file = request.files['cover_image']
                    app.logger.debug(img_path)
                    filename = secure_filename(file.filename)
                    new_filename = "%s%s" %(filename, datetime.now)
                    img_path = '/static/img/%s' % new_filename
                    file_system_path = os.path.join(app.config['UPLOAD_FOLDER'], new_filename)
                    file.save(os.path.join(app.config['UPLOAD_FOLDER'], new_filename))"""
            app.logger.debug(img_path)
            if lang is None:
                language = Language(language_name=type)
                db.session.add(language)
                db.session.commit()
                post = Posts(request.form['title'].decode('utf-8'),
                                request.form['text'].decode('utf-8'),
                                img_path,language)
            else:
                post = Posts(request.form['title'].decode('utf-8'),
                                request.form['text'].decode('utf-8'),
                                img_path,lang)
            db.session.add(post)
            db.session.commit()
        form = NewsForm()
        context = {'form': form}
        return render_template('admin/add_news.html', context=context)
