import pandas as pd
import joblib
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
import numpy as np

# Load models
iso_forest = joblib.load('isolation_forest_model.pkl')
clf = joblib.load('random_forest_model.pkl')
lstm_model = tf.keras.models.load_model('lstm_do_model.h5')

# Load new sensor data
new_data = pd.read_csv('new_sensor_data.csv')

# Preprocess new data (same as training)
def preprocess(df):
    # ...apply same cleaning and feature engineering as before...
    return df

new_data = preprocess(new_data)
features = [col for col in new_data.columns if col not in ['label', 'timestamp']]
X = new_data[features]

# Anomaly detection
anomaly_pred = iso_forest.predict(X)
new_data['anomaly'] = anomaly_pred

# Classification
if 'label' in new_data.columns:
    class_pred = clf.predict(X)
    new_data['class'] = class_pred

# LSTM prediction (DO)
if 'DO' in new_data.columns:
    scaler = MinMaxScaler()
    do_scaled = scaler.fit_transform(new_data['DO'].values.reshape(-1, 1))
    seq_length = 10
    def create_sequences(data, seq_length):
        X = []
        for i in range(len(data) - seq_length):
            X.append(data[i:i+seq_length])
        return np.array(X)
    X_seq = create_sequences(do_scaled, seq_length)
    if len(X_seq) > 0:
        do_pred = lstm_model.predict(X_seq)
        new_data['DO_pred'] = pd.Series(do_pred.flatten())

new_data.to_csv('inference_results.csv', index=False)
print("Inference complete. Results saved to inference_results.csv.")
