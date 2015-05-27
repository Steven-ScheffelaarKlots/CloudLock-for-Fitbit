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
    customer_tok = request.args.get('oauth_token')
    customer_ver = request.args.get('oauth_verifier')

    return '{}:{}'.format(customer_tok, customer_ver)

if __name__ == '__main__':
    app.run(debug=True, port=6544)

