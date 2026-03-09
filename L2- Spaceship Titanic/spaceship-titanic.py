# ==============================
# Spaceship Titanic 
# ==============================

import pandas as pd
import numpy as np

from sklearn.preprocessing import LabelEncoder
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier

# Load data
train = pd.read_csv("train.csv")
test = pd.read_csv("test.csv")

# Save PassengerId
test_ids = test["PassengerId"]

# ------------------------------
# Feature Engineering
# ------------------------------

for df in [train, test]:

    # Split Cabin
    df[['Deck','Num','Side']] = df['Cabin'].str.split('/', expand=True)

    # Extract Group from PassengerId
    df['Group'] = df['PassengerId'].str.split('_').str[0]

    # Drop columns not needed
    df.drop(['Cabin','Name','PassengerId'], axis=1, inplace=True)

# ------------------------------
# Encode categorical variables
# ------------------------------

for col in train.select_dtypes(include='object'):
    
    le = LabelEncoder()
    
    combined = pd.concat([train[col], test[col]], axis=0).astype(str)
    le.fit(combined)
    
    train[col] = le.transform(train[col].astype(str))
    test[col] = le.transform(test[col].astype(str))

# ------------------------------
# Handle missing values
# ------------------------------

imp = SimpleImputer(strategy="median")

X = train.drop("Transported", axis=1)
y = train["Transported"]

X = imp.fit_transform(X)
test = imp.transform(test)

# ------------------------------
# Train validation split
# ------------------------------

X_train, X_val, y_train, y_val = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ------------------------------
# Models to compare
# ------------------------------

models = {
    "KNN": KNeighborsClassifier(n_neighbors=7),
    "RandomForest": RandomForestClassifier(n_estimators=300, random_state=42)
}

best_model = None
best_acc = 0

for name, model in models.items():

    model.fit(X_train, y_train)
    preds = model.predict(X_val)

    acc = accuracy_score(y_val, preds)

    print(name, "Accuracy:", acc)

    if acc > best_acc:
        best_acc = acc
        best_model = model

print("Best Model Accuracy:", best_acc)



best_model.fit(X, y)

# Predict test
preds = best_model.predict(test)




submission = pd.DataFrame({
    "PassengerId": test_ids,
    "Transported": preds
})

submission.to_csv("spaceship_submission.csv", index=False)

print("Submission file saved as spaceship_submission.csv")