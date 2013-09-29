function AjaxController( dataObject ) {

    var self = this;

    if (typeof dataObject == "object" || typeof dataObject == "array") {
        this.dataObject = dataObject
    } else {
        throw new Error('data must be Javasript object');
    }


    function GetObject () {

    }

    this.getDataObject = function () {
        return this.dataObject;
    };



    this.sendJson = function (url, method, callback) {
        
        var method = (typeof method == "string") ? method.toUpperCase() : "GET"; 

        $.ajax({
            url: url,
            type : method,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(dataObject),
        }).done(callback);

    };

    this.searchSongRequest  = function (url, method, callback) {
        $.ajax({
            url: url,
            type: type,
            data : dataObject
        }).done(callback);
    };


    this.sendMultipartForm = function () {
        
    }
};

function App() {

    this.chordForm = $('#chord_form');
    this.instrumentForm = $('#instruments_form');
    this.showChordFormButton = $('#showChordForm');
    this.showInstrumentFormButton = $('#showInstrumentForm');
    this.addChordButton = $('#addChordButton');
    this.addInstrumentButton = $('#addInstrumentButton');
    this.chords = $('#chord_array');
    this.instruments = $('#instruments_array');
    this.chordDataList = new Array();
    this.instrumentDataList = new Array();
    this.saveSongButton = $('#saveSongButton');
    this.saveEditSongButton = $('#saveEditSongButton');
    this.searchChordField  = $('#search_chord');
    this.searchAlbumField = $('#search_album');
    this.searchUserField = $('#search_user');
    this.tbody = $('tbody');
    this.time = $('#time');
    this.instrument = $('#instrument');
    this.name = $('#instruments_form').find('#instrument_name')
    this.chordList = $('#chord_list');
    this.instrumentList = $('#instrument_list');
    this.chordSelector = $('#song_searh_type');
    this.albumSelector = $('#album_search_type');
    this.userSelector = $('#user_search_type');
    this.deleteChord = $('.deleteChord')[0];
    this.imageUrlField = $('#imageUrlField');
    this.imageCoverField = $('#imageCover');
    this.sendForm = $('#sendForm');
    this.sendInstrument = $('#sendInstrument');
    this.albumForm = $('form#albumForm');
    this.InstrumentForm = $('form#InstrumentForm');
    this.coverImageFile = $('#cover_image');
    this.img = (document.getElementById('cover_image') == null) ? null : document.getElementById('cover_image');
    this.addWithUrlButton = $('#showAddWithUrl');
    this.sendEditForm = $('#sendEditForm');
    var self = this;

    this.showChordForm = function () {
        this.toEmpty(this.time, this.chordList);
        this.chordForm.fadeToggle(function () {
            self.time.css({
                'border': '1px solid #ddd'
            });
        });
    };

    this.showInstrumentForm = function () {
        this.toEmpty(this.time, this.instrumentList);
        this.instrumentForm.fadeToggle(function () {
            self.time.css({
                'border': '1px solid #ddd'
            });
        });
    };

    this.toEmpty = function() {
        for(var i=0; i<arguments.length; i++) { 
            arguments[i].val(null);
        }
    };

    this.addChord = function () {
        var timeValue = this.time.val();
        var chordListValue = this.chordList.val();
        var instValue = this.instrument.val();
        var instText = $("#instrument option:selected").text();
        if (isNaN(parseFloat(this.time.val()))) {
            this.time.css({
                'border': '1px solid red'
            });
        }
        else
        {
            var count = $('.chord_list_item').length;
            var tag = '<tr id="chord_l'+count+'" class="chord_list_item">'+
                         '<td></td>'+
                         '<td>'+timeValue+'</td>'+
                         '<td>'+chordListValue+'</td>'+
                         '<td>'+instText+'</td>'+
                         '<td><button class="deleteChord" onclick="App.delChord('+count+')">Delete chord</button></td>'+
                      '</tr>';
            this.chordDataList.push({
                time: parseFloat(timeValue),
                chord_list: chordListValue,
                instrument: instValue
            });
            this.chords.prepend(tag);
            this.toEmpty(this.time, this.chordList);
            var id = $('#song_id').val();
            console.log(id);
            if(id)
            {
                var data = new FormData();
                data.append("song_id", id);
                data.append("time", parseFloat(timeValue));
                data.append("chord_list", chordListValue);
                data.append("instrument", instValue);

                var xhr = new XMLHttpRequest();
                xhr.open("POST", "/chords_edit/add");
                xhr.send(data);
            }
        }
    };

    this.saveData = function (id) {

        var songName = $('#name').val();
        var itunesLink = $('#itunes_link').val();
        var duration = $('#duration').val();
        var instrument = $('#instrument').val();
        var album = $('#album').val();

        var aj = new AjaxController({
            name: songName,
            itunes_link: itunesLink,
            duration: duration,
            instrument: this.instrumentDataList,
            album: parseInt(album),
            chords: this.chordDataList

        });

        aj.sendJson('/add_song', 'post', function (msg) {
            window.location = msg;
        });
    };
    this.saveEditData = function () {
        var songName = $('#song_name').val();
        var song_id = $('#song_id').val();
        var duration = $('#duration').val();
        var performer = $('#performer').val();
        var itunes_link = $('#itunes_link').val();
        console.log(this.chordDataList)
        throw "stop execution";

        var aj = new AjaxController({
            name: songName,
            itunes_link: itunesLink,
            duration: duration,
            album: parseInt(album),
            chords: this.chordDataList

        });

        aj.sendJson('/update_song', 'post', function (msg) {
            window.location = msg;
        });
    };

    this.searchSong = function () {
      var key = self.searchChordField.val();
      var searchType = self.chordSelector.val() 
      self.tbody.load('/search_song?type='+searchType+'&key='+key+" tbody tr");
    };

    this.searchAlbum = function () {
        var key = self.searchAlbumField.val();
        var searchType = self.albumSelector.val()
        self.tbody.load('/search_album?type='+searchType+'&key='+key+" tbody tr");
    };

    this.searchUser = function  () {
        var key = self.searchUserField.val();
        var searchType = self.userSelector.val();
        self.tbody.load('/search_user?type='+searchType+'&key='+key+" tbody tr");
    };

    this.insertImage = function () {
        var url = self.imageUrlField.val();
        var imageTag = new Image();
        imageTag.src = url;
        self.imageCoverField.hide();
        try{
            imageTag.onload = function () {
                self.imageCoverField.hide().html(imageTag).slideDown();
            };

        } catch(err) {
            if(err) {
               self.imageCoverField.hide();
               this.style.border = '1px solid red'; 
            }
        }
    };

    this.sendAlbumForm = function (method, url) {
        var data = new FormData(self.albumForm[0]);
        data.append('cover_image', self.coverImageFile[0].files[0])

        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onreadystatechange = function (event) {
            window.location = event.target.responseText;
        }
        xhr.send(data);
    };
    this.sendInstrumentForm = function (method, url) {
        var data = new FormData(self.InstrumentForm[0]);
        console.log(self.InstrumentForm);

        //throw "stop execution";
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onreadystatechange = function (event) {
            window.location = event.target.responseText;
        }
        xhr.send(data);
    };

    this.readURL = function(input){
        if(input.files && input.files[0]){
            console.log(input.files.length);
            var reader = new FileReader();
            self.imageCoverField.hide();
            reader.onload = function (e) {
                var imageTag = new Image();
                imageTag.src = e.target.result;
                imageTag.style.display = 'none';
                $('#black').append(imageTag);
                $('#black img').slideDown();

                $('#black img').click(function () {
                   $('#black img').remove(); 
                });
            }

            reader.readAsDataURL(input.files[0]);
        }
    };
};

App.delChord = function (id) {
    var selector = '#chord_l'+id;
    var delItem = $(selector);
    delItem.remove();
};

App.delInstrument = function (id) {
    var selector = '#instrument_l'+id;
    var delItem = $(selector);
    delItem.remove();
};

App.deleteOneChord = function (chord_id) {
    var aj = new AjaxController({
        chord_id: chord_id
    });

    aj.sendJson('/delete_one_chord', 'post', function (msg) {
        window.location = msg;
    });
};

App.deleteOneInstrument = function (instrument_id) {
    var aj = new AjaxController({
        instrument_id: instrument_id
    });

    aj.sendJson('/delete_one_instrument', 'post', function (msg) {
        window.location = msg;
    });
};

window.onload = function () {

    $('input[type="file"]').wrap('<div id="black">Select image</div>');

    

    if($('div#black')[0] != undefined) {
        $('div#black')[0].ondragover = function () {
            $(this).css({
                'background':'#ccc'
            });
            return false;
        };

        $('div#black')[0].ondragleave = function () {
         $('div#black').css({
                'background': '#fff'
             });
             return false;
        };
    }

    function validate_number (element) {
        element.keyup(function  () {
            if(isNaN(element.val())) {
                element.css({
                    'border': '1px solid red'
                });
            } else {
                element.css({
                    'border': '1px solid #ddd'
                });
            }
        });
    }

    function validate_field (element) {
            if(!(element.val())) {
                element.css({
                    'border': '1px solid red'
                });
                alert("Please fill in album name and performer!")
                throw "stop execution";
            } else {
                element.css({
                    'border': '1px solid #ddd'
                });
            }
    }

    validate_number($('#duration'));
    validate_number($('#year'));


    var searchKeys  = [];

    $.getJSON('/ajax/autocomplete.json', function (data) {
        $.each(data, function (key, val) {
            searchKeys.push({
                'label': val.name,
                'value': val.id
            })
        });
    });

    var performers = [];
    var instruments = [];

    $.getJSON('/ajax/autocomplete_performer.json', function (data) {
        $.each(data, function  (key, val) {
            performers.push(val);
        });
    })
    var app = new App();

    app.showChordFormButton.click(function () {
        app.showChordForm();
    });

    app.showInstrumentFormButton.click(function () {
        app.showInstrumentForm();
    });

    app.addChordButton.click(function () {
        app.addChord();
    });

    app.addInstrumentButton.click(function () {
        app.addInstrument();
    });

    app.saveSongButton.click(function () {
        app.saveData();
    });

    app.saveEditSongButton.click(function () {
        app.saveEditData();
    });

    app.searchChordField.keyup(function  () {
        app.searchSong();
    });

    app.searchAlbumField.keyup(function  () {
        app.searchAlbum();
    });

    app.searchUserField.keyup(function () {
        app.searchUser();
    });
    
    app.imageUrlField.change(function () {
        app.insertImage();
    });

    app.sendForm.click(function () {
        console.log($('#title').val())
        console.log($('#text').val())
        throw "stop execution";
        /*if((!($('#title').val()))&&(!($('#text').val()))) {
                $('#title').css({
                    'border': '1px solid red'
                });
                $('#text').css({
                    'border': '1px solid red'
                });
                alert("Please fill in title and text!")
                throw "stop execution";
            }
        else {
                $('#title').css({
                    'border': '1px solid #ddd'
                });
                $('#text').css({
                    'border': '1px solid #ddd'
                });
            }
       app.sendAlbumForm('post', '/news/add/');*/
    });

    app.sendInstrument.click(function () {
        if(!($('#instrument_name').val())) {
                $('#instrument_name').css({
                    'border': '1px solid red'
                });
                alert("Please fill in instrument name!")
                throw "stop execution";
            }
        else {
                $('#instrument_name').css({
                    'border': '1px solid #ddd'
                });
            }
       app.sendInstrumentForm('post', '/instruments/add');
    });

    app.coverImageFile.change(function () {
        app.readURL(this);
    });

    app.addWithUrlButton.click(function () {
        $('#black').fadeToggle(0);
        app.imageUrlField.fadeToggle();
    });

    app.sendEditForm.click(function(argument) {
        if((!($('#album_name').val()))&&(!($('#performer').val()))) {
                $('#album_name').css({
                    'border': '1px solid red'
                });
                $('#performer').css({
                    'border': '1px solid red'
                });
                alert("Please fill in album name or performer!")
                throw "stop execution";
            }
        else {
                $('#album_name').css({
                    'border': '1px solid #ddd'
                });
                $('#performer').css({
                    'border': '1px solid #ddd'
                });
            }
        app.sendAlbumForm('post', '/edit_album');
    })
};