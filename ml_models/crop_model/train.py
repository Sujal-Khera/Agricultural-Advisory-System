import os
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score

def main():
    # 1. Define dataset path
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    dataset_path = os.path.join(base_dir, 'dataset', 'Crop_recommendation.csv')
    
    if not os.path.exists(dataset_path):
        print(f"Error: Dataset not found at {dataset_path}")
        return

    print("Loading dataset...")
    df = pd.read_csv(dataset_path)
    
    # 2. Prepare Features & Target
    X = df.drop('label', axis=1)
    y = df['label']
    
    # 3. Label Encoding
    print("Encoding labels...")
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    
    # Print label mapping for reference
    label_mapping = dict(zip(le.classes_, le.transform(le.classes_)))
    print(f"Label Mapping: {len(label_mapping)} classes found.")

    # 4. Train-Test Split
    print("Splitting data (80/20)...")
    X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)
    
    # 5. Define Pipeline Structure
    pipe_rf = Pipeline([
        ('scaler', StandardScaler()),
        ('rf', RandomForestClassifier(random_state=42))
    ])
    
    # 6. Define Hyperparameters Grid
    param_grid = { 
        'rf__n_estimators': [100, 200],
        'rf__max_depth': [10, 15, None],
        'rf__min_samples_split': [2, 4],
        'rf__min_samples_leaf': [1, 2] 
    }
    # Note: Reduced grid slightly from notebook to speed up immediate execution, 
    # but keeping the key parameters.

    # 7. Setup Grid Search
    print("Starting Grid Search CV...")
    grid_rf = GridSearchCV(
        estimator=pipe_rf, 
        param_grid=param_grid,
        cv=5, 
        scoring='accuracy',
        n_jobs=-1, 
        verbose=1
    )
    
    # 8. Train the Model
    grid_rf.fit(X_train, y_train)
    
    print("\nBest Parameters Found:")
    print(grid_rf.best_params_)
    
    # 9. Evaluate Best Model
    print("\nEvaluating on Test Set...")
    best_model = grid_rf.best_estimator_
    y_pred = best_model.predict(X_test)
    
    acc = accuracy_score(y_test, y_pred)
    print(f"Test Accuracy: {acc:.4f}\n")
    print("Classification Report:")
    print(classification_report(y_test, y_pred, target_names=le.classes_))
    
    # 10. Export Artifacts
    model_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(model_dir, 'crop_model.pkl')
    encoder_path = os.path.join(model_dir, 'label_encoder.pkl')
    
    print(f"Saving model to {model_path}...")
    with open(model_path, 'wb') as f:
        pickle.dump(best_model, f)
        
    print(f"Saving label encoder to {encoder_path}...")
    with open(encoder_path, 'wb') as f:
        pickle.dump(le, f)
        
    print("Training complete! Artifacts are ready for production inference.")

if __name__ == "__main__":
    main()
