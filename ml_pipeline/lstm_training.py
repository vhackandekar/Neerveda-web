import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler

# Load processed data
df = pd.read_csv('processed_data.csv')

# Example: Predict DO levels (time-series)
if 'DO' in df.columns:
    data = df['DO'].values.reshape(-1, 1)
    scaler = MinMaxScaler()
    data_scaled = scaler.fit_transform(data)
    # Prepare sequences
    def create_sequences(data, seq_length):
        X, y = [], []
        for i in range(len(data) - seq_length):
            X.append(data[i:i+seq_length])
            y.append(data[i+seq_length])
        return np.array(X), np.array(y)
    seq_length = 10
    X, y = create_sequences(data_scaled, seq_length)
    # Train/test split
    split = int(0.7 * len(X))
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]
    # Build LSTM model
    model = Sequential([
        LSTM(32, input_shape=(seq_length, 1)),
        Dense(1)
    ])
    model.compile(optimizer='adam', loss='mse')
    model.fit(X_train, y_train, epochs=20, batch_size=16, validation_data=(X_test, y_test))
    model.save('lstm_do_model.h5')
    print("LSTM model trained and saved as lstm_do_model.h5.")
else:
    print("DO column not found in data.")
