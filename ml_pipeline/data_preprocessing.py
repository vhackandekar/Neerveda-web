import pandas as pd
import numpy as np

def load_data(filepath):
    """Load sensor data from CSV file."""
    return pd.read_csv(filepath)

def clean_data(df):
    """Remove outliers and handle missing values."""
    df = df.replace([np.inf, -np.inf], np.nan)
    df = df.dropna()
    # Remove sensor spikes (example: values outside 3 std dev)
    for col in df.select_dtypes(include=[np.number]).columns:
        df = df[(np.abs(df[col] - df[col].mean()) <= (3 * df[col].std()))]
    return df

def feature_engineering(df):
    """Extract features: rate of change, moving averages, correlations."""
    # Rate of change
    for col in ['DO', 'turbidity', 'pH', 'TDS', 'ORP', 'ammonia']:
        if col in df.columns:
            df[f'{col}_rate'] = df[col].diff()
            df[f'{col}_ma5'] = df[col].rolling(window=5).mean()
    # Correlations
    if 'pH' in df.columns and 'ammonia' in df.columns:
        df['pH_ammonia_corr'] = df['pH'].rolling(window=5).corr(df['ammonia'])
    return df

if __name__ == "__main__":
    df = load_data('sensor_data.csv')
    df = clean_data(df)
    df = feature_engineering(df)
    df.to_csv('processed_data.csv', index=False)
    print("Preprocessing complete. Output: processed_data.csv")
