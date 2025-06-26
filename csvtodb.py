import pandas as pd
import numpy as np
from sqlalchemy import create_engine
from datetime import datetime, timedelta

# 数据库连接信息
username = 'your_username'
password = 'your_password'
host = 'localhost'
database = 'health_management_system'

# 创建数据库连接
engine = create_engine('mysql+pymysql://root:123456@localhost/health_management_system')

# 读取 CSV 文件
csv_file = 'Hypertension-risk-model-main.csv'
data = pd.read_csv(csv_file)

# 处理缺失值
data['cigsPerDay'].fillna(data['cigsPerDay'].mean(), inplace=True)
data['BPMeds'].fillna(data['BPMeds'].mode()[0], inplace=True)
data['totChol'].fillna(data['totChol'].mean(), inplace=True)
data['BMI'].fillna(data['BMI'].mean(), inplace=True)
data['heartRate'].fillna(data['heartRate'].mean(), inplace=True)
data['glucose'].fillna(data['glucose'].mean(), inplace=True)
# 生成随机时间戳
# 假设时间戳在过去一年内随机分布
start_date = datetime.now() - timedelta(days=365)
end_date = datetime.now()
time_stamps = [start_date + timedelta(seconds=np.random.randint(0, int((end_date - start_date).total_seconds()))) for _ in range(len(data))]
data['created_at'] = time_stamps

# 选择需要的列
columns_to_keep = ['male', 'age', 'currentSmoker', 'cigsPerDay', 'BPMeds', 'diabetes', 'totChol', 'sysBP', 'diaBP', 'BMI', 'heartRate', 'glucose', 'Risk']
health_data_anonymized = data[columns_to_keep]

# 将匿名化数据导入到数据库
health_data_anonymized.to_sql('Health_Data_Anonymized', con=engine, if_exists='append', index=False)

print("匿名化数据导入完成")