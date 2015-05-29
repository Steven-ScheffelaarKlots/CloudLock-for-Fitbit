from flask import Flask, redirect, request
from flask.ext.cors import CORS
import ConfigParser
import fitbit
import json
from datetime import datetime, timedelta
from pymongo import MongoClient

app = Flask(__name__)
CORS(app, resources=r'/distance', allow_headers='Content-Type')

parser = ConfigParser.SafeConfigParser()
parser.read('fitbit.ini')
consumer_key = parser.get('Login Parameters', 'C_KEY')
consumer_secret = parser.get('Login Parameters', 'C_SECRET')

username = parser.get('Mongodb Parameters', 'USERNAME')
password = parser.get('Mongodb Parameters', 'PASSWORD')
uri = parser.get('Mongodb Parameters', 'DB_URI')
db_name = parser.get('Mongodb Parameters', 'DB_NAME')

mongoClient = MongoClient('mongodb://{username}:{password}@{uri}/{db_name}'.format(
    username=username,
    password=password,
    uri=uri,
    db_name=db_name
))
db = mongoClient[db_name]


@app.route('/')
def fake_it():
    return 'Hello World'


@app.route('/authorize')
def authorize():
    client = fitbit.FitbitOauthClient(consumer_key, consumer_secret)
    token = client.fetch_request_token()

    resp = redirect(client.authorize_token_url(token=token))
    resp.set_cookie('token', value=json.dumps(token))
    return resp


@app.route('/thankyou')
def thank_you():
    customer_ver = request.args.get('oauth_verifier')
    token = json.loads(request.cookies.get('token'))

    client = fitbit.FitbitOauthClient(consumer_key, consumer_secret)
    token = client.fetch_access_token(customer_ver, token)

    # store these
    db.keys.insert({
        u'client_key': token.get(u'oauth_token'),
        u'client_secret': token.get(u'oauth_token_secret'),
    })

    return redirect('http://localhost:8000/app/#/')


@app.route('/distance')
def get_distance_data():

    results = []
    # fetch all REAL customers
    for row in db.keys.find({}):
        cust_key = row.get(u'client_key')
        cust_tok = row.get(u'client_secret')
        authd_client = fitbit.Fitbit(consumer_key, consumer_secret,
                                     resource_owner_key=cust_key,
                                     resource_owner_secret=cust_tok)

        user = db.profile.find_one({u'user': cust_key})
        if not user or user.get(u'updated_on') - datetime.utcnow() > timedelta(days=1):
            profile = authd_client.user_profile_get()
            name = profile.get(u'user').get(u'displayName')
            avatar = profile.get(u'user').get(u'avatar150')
            db.profile.update_one(
                {u'user': cust_key},
                {'$set': {
                    u'user': cust_key,
                    u'name': name,
                    u'avatar': avatar,
                    u'updated_on': datetime.utcnow()
                }},
                upsert=True)
        else:
            name = user.get(u'name')
            avatar = user.get(u'avatar')

        stats = authd_client.time_series(u'activities/distance', period=u'1d')
        distance = stats.get(u'activities-distance')[0].get(u'value')
        results.append({'name': name,
                        'avatar': avatar,
                        'distance': float(distance)})
    return json.dumps(results)

if __name__ == '__main__':
    app.run(debug=True, port=6544)

