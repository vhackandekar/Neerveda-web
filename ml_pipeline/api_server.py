from flask import Flask, request, jsonify
import pandas as pd
import joblib
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
import numpy as np

app = Flask(__name__)

# Load models
iso_forest = joblib.load('isolation_forest_model.pkl')
clf = joblib.load('random_forest_model.pkl')
lstm_model = tf.keras.models.load_model('lstm_do_model.h5')

# Preprocessing function (simplified)
def preprocess(df):
    # ...apply same cleaning and feature engineering as before...
    return df

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    df = pd.DataFrame(data)
    df = preprocess(df)
    features = [col for col in df.columns if col not in ['label', 'timestamp']]
    X = df[features]
    result = {}
    # Anomaly detection
    result['anomaly'] = iso_forest.predict(X).tolist()
    # Classification
    if 'label' in df.columns:
        result['class'] = clf.predict(X).tolist()
    # LSTM prediction (DO)
    if 'DO' in df.columns:
        scaler = MinMaxScaler()
        do_scaled = scaler.fit_transform(df['DO'].values.reshape(-1, 1))
        seq_length = 10
        def create_sequences(data, seq_length):
            X = []
            for i in range(len(data) - seq_length):
                X.append(data[i:i+seq_length])
            return np.array(X)
        X_seq = create_sequences(do_scaled, seq_length)
        if len(X_seq) > 0:
            do_pred = lstm_model.predict(X_seq)
            result['DO_pred'] = do_pred.flatten().tolist()
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
