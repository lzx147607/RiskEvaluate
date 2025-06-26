import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib

# 加载数据集
data = pd.read_csv('Hypertension-risk-model-main.csv')
print(data.head())
print(data.size)
# 处理缺失值
data['cigsPerDay'].fillna(data['cigsPerDay'].mean(), inplace=True)
data['BPMeds'].fillna(data['BPMeds'].mode()[0], inplace=True)
data['totChol'].fillna(data['totChol'].mean(), inplace=True)
data['BMI'].fillna(data['BMI'].mean(), inplace=True)
data['heartRate'].fillna(data['heartRate'].mean(), inplace=True)
data['glucose'].fillna(data['glucose'].mean(), inplace=True)

# 编码分类变量
label_encoder = LabelEncoder()
data['male'] = label_encoder.fit_transform(data['male'])
data['currentSmoker'] = label_encoder.fit_transform(data['currentSmoker'])
data['BPMeds'] = label_encoder.fit_transform(data['BPMeds'])
data['diabetes'] = label_encoder.fit_transform(data['diabetes'])
data['Risk'] = label_encoder.fit_transform(data['Risk'])

# 选择特征和目标变量
X = data.drop('Risk', axis=1)
y = data['Risk']

# 特征缩放
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 划分训练集和测试集
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

print("X_train:",len(X_train))
# 创建逻辑回归模型
model = LogisticRegression(max_iter=1000)

# 训练模型
model.fit(X_scaled, y)

# 预测测试集
y_pred = model.predict(X_test)

# 计算准确率
accuracy = accuracy_score(y_test, y_pred)
print(f'Accuracy: {accuracy:.2f}')

# 打印分类报告
print(classification_report(y_test, y_pred))

# 打印混淆矩阵
print(confusion_matrix(y_test, y_pred))

# 保存模型
joblib.dump(model, 'logistic_regression_model.pkl')

# 保存特征缩放器
joblib.dump(scaler, 'scaler.pkl')

# 加载模型
model = joblib.load('logistic_regression_model.pkl')

# 加载特征缩放器
scaler = joblib.load('scaler.pkl')

# 假设有一个新的数据点
new_data = np.array([[1, 39, 0, 0, 0, 0, 195, 106, 70, 26.97, 80, 77]])
new_data_scaled = scaler.transform(new_data)

# 使用模型进行预测
new_prediction = model.predict(new_data_scaled)
print(f'Prediction: {new_prediction[0]}')