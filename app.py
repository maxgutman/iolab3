import os
import json
import tweepy
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

TWITTER_CONSUMER_TOKEN = os.environ.get('TWITTER_CONSUMER_TOKEN')
TWITTER_CONSUMER_SECRET = os.environ.get('TWITTER_CONSUMER_SECRET')
TWITTER_CALLBACK_URL = 'verify'
TWITTER_NUM_RESULTS = 100
TWITTER_PAGES_TO_POLL = 3


@app.route('/')
def main():
    auth = session.get('auth')
    if not auth:
        return request_token()

    api = tweepy.API(auth)
    return render_template('index.html',
        user=api.me(),
        tweets=api.user_timeline(count=10),
    )

@app.route('/tweets')
def tweets():
    auth = session.get('auth')
    api = tweepy.API(auth)

    return render_template('tweets.html',
        tweets=api.user_timeline(),
    )

@app.route("/token")
def request_token():
    auth = tweepy.OAuthHandler(
        TWITTER_CONSUMER_TOKEN,
        TWITTER_CONSUMER_SECRET,
        os.path.join(request.url_root, TWITTER_CALLBACK_URL)
    )

    try:
        redirect_url = auth.get_authorization_url()
        session['request_token'] = (
            auth.request_token.key,
            auth.request_token.secret,
        )
    except tweepy.TweepError, e:
        return abort(401)

    return redirect(redirect_url)

@app.route("/verify")
def request_access():
    verifier = request.args.get('oauth_verifier')

    auth = tweepy.OAuthHandler(
        TWITTER_CONSUMER_TOKEN,
        TWITTER_CONSUMER_SECRET,
    )

    request_key, request_secret = session.pop('request_token')
    auth.set_request_token(request_key, request_secret)
    try:
        auth.get_access_token(verifier)
    except tweepy.TweepError:
        return abort(401)

    session['auth'] = auth
    return redirect(url_for('main'))


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
