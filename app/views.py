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

PER_PAGE = 5

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

@app.route('/add_user', methods=["POST", "GET"])
@app.route('/add_user/', methods=["POST", "GET"])
def add_user():
    if request.method == 'POST':
        try:
            if not re.match(r"[^@]+@[^@]+\.[^@]+", request.form['email']):
                response = {
                'ansCode': 77,
                'Error': 'Wrong email'
            }
            else:
                user = User(
                        request.form['name'],
                        request.form['username'],
                        request.form['email']
                    )
                db.session.add(user)
                db.session.commit()
        except:
            response = {
                'ansCode': 99,
                'Error': 'Wrong params'
            }
        users = User.query.paginate(1, per_page=PER_PAGE ,error_out=True)
        context = {
            'users':users
        }
        return render_template("admin/users.html",
                               context=context)
    else:
        abort(404)

@app.route('/delete_user', methods=["POST", "GET"])
def del_user():
    if request.method == "POST":
        user = User.query.filter_by(id=int(request.form['id'])).first()
        db.session.delete(user)
        db.session.commit()
        return redirect(url_for('get_users'))
    else:
        abort(404)

@app.route('/add_user_page')
@app.route('/add_user_page/')
def add_user_page():
    form = UserForm()
    context = {
        'form': form
    }
    return render_template('/admin/add_user.html', context=context)

@app.route('/users', defaults={'page':1})
@app.route('/users/page/<int:page>')
def get_users(page):
        users = User.query.paginate(page, per_page=PER_PAGE ,error_out=True)
        context = {
            'users':users
        }
        return render_template("admin/users.html",
                               context=context)
@app.route('/posts', defaults={'page':1})
@app.route('/posts/page/<int:page>')
def get_posts(page):
        posts = Posts.query.paginate(page, per_page=PER_PAGE, error_out=True)
        context = {
            'posts': posts
        }
        return render_template("admin/news.html",
                                context=context)

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
