import pandas as pd
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score
import joblib

# Load processed data
df = pd.read_csv('processed_data.csv')

# Example: Anomaly Detection (Isolation Forest)
features = [col for col in df.columns if col not in ['label', 'timestamp']]
X = df[features]

iso_forest = IsolationForest(contamination=0.05, random_state=42)
iso_forest.fit(X)
df['anomaly'] = iso_forest.predict(X)
joblib.dump(iso_forest, 'isolation_forest_model.pkl')

# Example: Classification (Random Forest)
if 'label' in df.columns:
    X_cls = df[features]
    y_cls = df['label']
    X_train, X_test, y_train, y_test = train_test_split(X_cls, y_cls, test_size=0.3, random_state=42)
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)
    print('Accuracy:', accuracy_score(y_test, y_pred))
    print('F1 Score:', f1_score(y_test, y_pred, average='weighted'))
    print('Precision:', precision_score(y_test, y_pred, average='weighted'))
    print('Recall:', recall_score(y_test, y_pred, average='weighted'))
    joblib.dump(clf, 'random_forest_model.pkl')

# For LSTM, use a separate script (deep learning, time-series)
print("Model training complete. Models saved as isolation_forest_model.pkl and random_forest_model.pkl.")
