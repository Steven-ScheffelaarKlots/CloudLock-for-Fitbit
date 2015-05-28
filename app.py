from flask import Flask, redirect, request
import ConfigParser
import fitbit

app = Flask(__name__)
parser = ConfigParser.SafeConfigParser()
parser.read('fitbit.ini')
consumer_key = parser.get('Login Parameters', 'C_KEY')
consumer_secret = parser.get('Login Parameters', 'C_SECRET')


@app.route('/')
def fake_it():
    return 'Hello World'


@app.route('/authorize')
def authorize():
    client = fitbit.FitbitOauthClient(consumer_key, consumer_secret)
    token = client.fetch_request_token()

    return redirect(client.authorize_token_url(token=token))

@app.route('/thankyou')
def thank_you():
    customer_ver = request.args.get('oauth_verifier')

    client = fitbit.FitbitOauthClient(consumer_key, consumer_secret)
    token = client.fetch_access_token(customer_ver)

    # store these
    token.get(u'oauth_token')
    token.get(u'oauth_token_secret')

    return redirect('http://localhost:8000/app/#/')


@app.route('/distance')
def get_distance_data():

    all_users = [['a', 'b']]
    results = []
    # fetch all REAL customers
    for cust_key, cust_tok in all_users:
        authd_client = fitbit.Fitbit(consumer_key, consumer_secret,
                                     resource_owner_key=cust_key,
                                     resource_owner_secret=cust_tok)

        profile = authd_client.user_profile_get()
        name = profile.get(u'user').get(u'displayName')
        avatar = profile.get(u'user').get(u'avatar150')
        stats = authd_client.time_series(u'activities/distance', period=u'1d')
        distance = stats.get(u'activities-distance')[0].get(u'value')
        results.append('{},{},{}'.format(name, avatar, distance))
    return {'Series 1': results}

if __name__ == '__main__':
    app.run(debug=True, port=6544)

