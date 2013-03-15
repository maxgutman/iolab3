import os
import json
from flask import (
    Flask,
    Response,
    session,
    redirect,
    abort,
    url_for,
    escape,
    request,
    render_template,
)

from helpers import get_hashtags_from_search

app = Flask(__name__)
app.secret_key = 'Zgb1krq^_@s&*)qz03^jcfl4w+tle660s$z1#mtemu5b(m=$fudn##@'


@app.route('/')
def election():
    return render_template('election.html')

@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.debug = True
    port = int(os.environ.get('PORT', 5000))
    # HEROKU LIVE
    app.run(host='0.0.0.0', port=port)
    # UNCOMMENT FOR RUNNING LOCALLY
    #app.run()
