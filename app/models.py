from app import db
from sqlalchemy.types import SchemaType, TypeDecorator, Enum
from datetime import datetime
import re

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80))
    name = db.Column(db.String(80))
    email = db.Column(db.String(120), unique=True)
    subscribed = db.Column(db.Boolean(), default=True)
    joined_date = db.Column(db.DateTime(), default=datetime.now)


    def __init__(self, name, username, email):
        self.name = name
        self.username = username
        self.email = email

    def __repr__(self):
        return "<User %r>" % self.username

class Posts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120))
    text = db.Column(db.String(120))
    image_url = db.Column(db.String(120))
    sent = db.Column(db.Boolean(), default=True)
    language = db.relationship('Language', backref=db.backref('posts', lazy='dynamic'))
    language_id = db.Column(db.Integer, db.ForeignKey('language.id'))

    def __init__(self, title, text, image_url):
        self.title = title
        self.text = text
        self.image_url = image_url

    def __repr__(self):
        return "<Post %r>" % self.title

class Categories(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String(120))

class EnumSymbol(object):
    """Define a fixed symbol tied to a parent class."""

    def __init__(self, cls_, name, value, description):
        self.cls_ = cls_
        self.name = name
        self.value = value
        self.description = description

    def __reduce__(self):
        """Allow unpickling to return the symbol
        linked to the DeclEnum class."""
        return getattr, (self.cls_, self.name)

    def __iter__(self):
        return iter([self.value, self.description])

    def __repr__(self):
        return "<%s>" % self.name

class EnumMeta(type):
    """Generate new DeclEnum classes."""

    def __init__(cls, classname, bases, dict_):
        cls._reg = reg = cls._reg.copy()
        for k, v in dict_.items():
            if isinstance(v, tuple):
                sym = reg[v[0]] = EnumSymbol(cls, k, *v)
                setattr(cls, k, sym)
        return type.__init__(cls, classname, bases, dict_)

    def __iter__(cls):
        return iter(cls._reg.values())

class DeclEnum(object):
    """Declarative enumeration."""

    __metaclass__ = EnumMeta
    _reg = {}

    @classmethod
    def from_string(cls, value):
        try:
            return cls._reg[value]
        except KeyError:
            raise ValueError(
                    "Invalid value for %r: %r" %
                    (cls.__name__, value)
                )

    @classmethod
    def db_type(cls):
        return DeclEnumType(cls)

    @classmethod
    def values(cls):
        return cls._reg.keys()
class DeclEnumType(SchemaType, TypeDecorator):
    def __init__(self, enum):
        self.enum = enum
        self.impl = Enum(
                        *enum.values(),
                        name="ck%s" % re.sub(
                                    '([A-Z])',
                                    lambda m:"_" + m.group(1).lower(),
                                    enum.__name__)
                    )

    def _set_table(self, table, column):
        self.impl._set_table(table, column)

    def copy(self):
        return DeclEnumType(self.enum)

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        return value.value

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        return self.enum.from_string(value.strip())

class LanguageType(DeclEnum):
    english = "EN", "English"
    russian = "RU", "Russian"
    ukrainian = "UA", "Ukrainian"

class Language(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    language_name = db.Column(LanguageType.db_type())

    def __init__(self, instrument_name, song):
        if isinstance(song, Song):
            self.songs = song
        else:
            self.songs = None
        self.instrument_name = instrument_name

    def __repr__(self):
        return "<Instrument %r>" % self.instrument_name