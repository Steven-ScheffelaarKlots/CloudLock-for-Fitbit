from flask import Flask, render_template, url_for, send_file, redirect, request
import ConfigParser
import fitbit

app = Flask(__name__, template_folder="app")
parser = ConfigParser.SafeConfigParser()
parser.read('fitbit.ini')
consumer_key = parser.get('Login Parameters', 'C_KEY')
consumer_secret = parser.get('Login Parameters', 'C_SECRET')


@app.route('/')
def fitbit_map():
    return render_template('index.html')


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
    app.run(debug=True)
    url_for('static', filename='app.css')
    url_for('static', filename='app.js')

